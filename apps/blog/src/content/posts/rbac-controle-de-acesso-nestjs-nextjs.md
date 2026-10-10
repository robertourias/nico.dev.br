---
title: "RBAC na prática: controle de acesso em NestJS e Next.js"
slug: "rbac-controle-de-acesso-nestjs-nextjs"
date: "2026-10-09"
categories: ["dev", "architecture"]
status: "published"
featured: false
description: "RBAC explicado do zero e implementado de ponta a ponta: modelo de dados, guard no NestJS, checagem no Next.js e as armadilhas de um projeto real."
tags: ["rbac", "autorizacao", "nestjs", "nextjs", "seguranca"]
---

RBAC (Role-Based Access Control, ou controle de acesso baseado em papéis) é um modelo de autorização em que a permissão não é concedida ao usuário, e sim a um **papel**. O usuário recebe um ou mais papéis e herda tudo o que eles permitem. É o modelo que a maioria dos sistemas acaba precisando assim que existe mais de um tipo de usuário.

Este post mostra como sair do `if (user.isAdmin)` espalhado pelo código para um RBAC de verdade, com banco, API e front. A stack é NestJS e Next.js, a mesma dos outros posts do blog, mas o desenho vale para qualquer uma. O código é ilustrativo: adapte ao seu modelo de usuário e à sua estratégia de sessão.

## O problema que o RBAC resolve

Todo projeto começa com um booleano. `isAdmin: true` resolve a primeira semana. Na segunda, alguém pede um "editor" que publica mas não apaga. Na terceira, um "financeiro" que vê relatórios mas não edita usuários.

Sem modelo, cada pedido vira um `if` novo, em um arquivo diferente. Responder "quem pode apagar um post?" passa a exigir uma busca no código inteiro, e mudar a resposta vira um deploy.

O RBAC separa três coisas que estavam coladas: **quem é a pessoa**, **que função ela exerce** e **o que essa função pode fazer**. Mudar o que um "editor" pode fazer é editar um registro, não o código.

## Os três conceitos

- **Permissão**: uma ação sobre um recurso, escrita como `recurso:ação`, por exemplo `post:delete`.
- **Papel (role)**: um conjunto nomeado de permissões, como `admin`, `editor` ou `leitor`.
- **Usuário**: quem acessa. Recebe zero, um ou vários papéis.

A relação é muitos-para-muitos nos dois lados: um usuário pode ter vários papéis, e uma permissão pode estar em vários papéis.

![Modelo de dados do RBAC: usuário liga a papel por user_roles, papel liga a permissão por role_permissions; exemplo com Ana admin podendo post:delete e Cris leitor podendo apenas post:read](/images/rbac-controle-de-acesso-nestjs-nextjs-modelo.svg)

O diagrama mostra o ponto central: a única ligação direta entre pessoa e capacidade passa por um papel. Ana pode apagar posts porque é `admin`, não porque alguém marcou algo no cadastro dela.

## Modelo de dados

Em SQL, são cinco tabelas. As duas de ligação carregam o relacionamento:

```sql
CREATE TABLE roles (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE permissions (
  id  SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE          -- 'post:delete'
);

CREATE TABLE role_permissions (
  role_id       INT REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INT REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  role_id INT REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);
```

A tabela `users` já existe no seu projeto; ela só ganha a ligação `user_roles`. Os papéis e as permissões iniciais entram por seed ou migration, versionados no repositório.

## A regra que mais importa: cheque permissão, não papel

Esta é a decisão que separa um RBAC que envelhece bem de um que vira o `isAdmin` com outro nome. O código **pergunta por permissão**:

```ts
// ruim: acopla a rota ao nome do papel
if (user.roles.includes('admin')) { /* ... */ }

// bom: a rota declara o que exige
if (can(user, 'post:delete')) { /* ... */ }
```

Se amanhã o papel `moderador` também puder apagar posts, você adiciona `post:delete` a ele no banco. Nenhuma rota muda. Quem checa papel precisa revisitar todas as rotas.

Papéis são só um jeito de agrupar permissões para gente administrar. O código nunca precisa saber que eles existem.

## Implementando no NestJS

O NestJS tem o encaixe natural para isso: um **decorator** declara a permissão exigida pela rota, e um **guard** decide se a requisição passa. O guard é a camada que roda antes do handler, depois da autenticação.

![Caminho de uma requisição: AuthGuard valida o token e responde 401 se falhar, PermissionsGuard compara permissões e responde 403 se faltar, e só então o handler executa](/images/rbac-controle-de-acesso-nestjs-nextjs-fluxo.svg)

Primeiro o decorator, que apenas grava metadado na rota:

```ts
// permissions.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
```

Depois o guard, que lê esse metadado com o `Reflector` e compara com as permissões do usuário:

```ts
// permissions.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!required?.length) return true;

    const { user } = context.switchToHttp().getRequest();
    const granted = new Set<string>(user?.permissions ?? []);
    return required.every((p) => granted.has(p));
  }
}
```

O `getAllAndOverride` procura o metadado primeiro no método e depois na classe, então um controller pode definir um padrão e uma rota específica sobrescrevê-lo. Quando o guard retorna `false`, o Nest responde `403 Forbidden` sozinho.

Na rota, o uso fica declarativo:

```ts
@Controller('posts')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PostsController {
  @Delete(':id')
  @RequirePermissions('post:delete')
  remove(@Param('id') id: string) {
    return this.posts.remove(id);
  }
}
```

A ordem em `@UseGuards` importa: o `JwtAuthGuard` roda primeiro e popula `request.user`; só então o `PermissionsGuard` tem o que comparar. Se você registrar os dois como guards globais, mantenha essa ordem.

Repare no `if (!required?.length) return true`. Uma rota sem decorator passa no guard de permissões, o que é intencional (ela ainda passa pelo de autenticação). Mas é também uma armadilha: esquecer o decorator numa rota sensível deixa a rota aberta a qualquer usuário logado. Veja a seção de armadilhas.

## De onde vêm as permissões do usuário

O guard assume que `user.permissions` existe. Há duas formas de preenchê-lo, com trade-offs opostos:

**No token (JWT).** No login, o servidor resolve as permissões do usuário e as coloca no payload. Cada requisição é barata, sem ida ao banco. O custo: uma permissão revogada continua valendo até o token expirar.

**No banco, a cada requisição.** O guard (ou a estratégia de autenticação) consulta as permissões atuais, em geral com cache curto. Revogação é imediata, ao custo de uma consulta.

Para a maioria dos sistemas, um meio-termo funciona: token curto (minutos) mais refresh token, de modo que a janela de permissão desatualizada é pequena e limitada. Se o seu domínio exige revogação instantânea, como acesso a dados financeiros, consulte a cada requisição.

Não existe resposta universal aqui; existe a pergunta certa: **quanto tempo é aceitável um acesso revogado continuar funcionando?**

## No Next.js: o front só reflete, nunca protege

O front-end conhece as permissões do usuário para uma finalidade só: **não mostrar o que ele não pode usar**. Isso é experiência de uso, não segurança. Qualquer pessoa pode chamar a API sem passar pela interface.

Um helper simples basta:

```ts
// lib/can.ts
export function can(permissions: string[], required: string) {
  return permissions.includes(required);
}
```

Num Server Component, a decisão acontece no servidor, e o HTML que sai já vem sem o botão:

```tsx
// app/posts/[id]/page.tsx
import { getSession } from '@/lib/session';
import { can } from '@/lib/can';

export default async function PostPage() {
  const session = await getSession();

  return (
    <article>
      {/* conteúdo do post */}
      {can(session.permissions, 'post:delete') && <DeletePostButton />}
    </article>
  );
}
```

Para bloquear **páginas inteiras**, como `/admin`, use o proxy (antes `middleware`) do Next.js ou uma checagem no layout, redirecionando quem não tem a permissão. Mas trate isso como a primeira camada: a API continua checando tudo de novo. Se a interface esconde e a API não valida, o sistema tem um buraco com boa aparência.

Se você usa MFA, o mesmo princípio de "a sessão só existe depois do segundo fator" se aplica aqui; o post sobre [MFA com TOTP em Next.js e NestJS](/posts/mfa-totp-nextjs-nestjs-turborepo) mostra esse desenho.

## Armadilhas de um projeto real

**Negar por padrão.** O guard acima libera rotas sem decorator. Em sistemas sensíveis, inverta: registre o guard como global e exija que toda rota declare explicitamente uma permissão ou um `@Public()`. Esquecer vira erro visível, não vulnerabilidade silenciosa.

**Explosão de papéis.** Quando cada exceção vira um papel novo ("editor-mas-sem-deletar-às-sextas"), você ganhou a complexidade que o RBAC queria evitar. Sinal de alerta: mais papéis do que tipos reais de função na empresa.

**Regras de "dono do recurso".** "Edite apenas os *seus* posts" não cabe em RBAC puro, porque depende da relação entre o usuário e aquele registro específico. A abordagem comum é combinar: o RBAC diz que o usuário pode `post:update`, e o serviço confere se `post.authorId === user.id` (ou se ele tem a permissão `post:update:any`). Quando as regras dependem de muitos atributos (horário, região, status do registro), o modelo mais indicado é ABAC (Attribute-Based Access Control).

**Multi-tenant.** Em um SaaS, o papel costuma valer **dentro de uma organização**. Ana é `admin` na empresa A e `leitor` na B. A tabela de ligação ganha um `tenant_id` (`user_roles(user_id, role_id, tenant_id)`), e o guard resolve as permissões do tenant da requisição, não as globais.

**Auditoria e testes.** Guarde quem concedeu ou revogou um papel e quando. E teste o contrato: para cada rota sensível, um teste que confirma que um usuário *sem* a permissão recebe `403`. É o teste que impede a regressão mais cara do RBAC.

**Bootstrap.** Alguém precisa ser o primeiro admin. Crie-o por seed ou comando de CLI, nunca por uma rota pública "promover a admin".

## Conclusão

RBAC não é uma biblioteca nem uma tabela; é uma disciplina de **onde mora a decisão**. A mudança prática é parar de perguntar "esse usuário é admin?" e passar a perguntar "esse usuário tem `post:delete`?", com a resposta vindo de dados, não de código.

O resto decorre disso: a API declara o que cada rota exige, o guard confere, o front apenas espelha, e mudar quem pode o quê vira uma alteração de dados, auditável e sem deploy. Comece com poucas permissões bem nomeadas, negue por padrão e só migre para ABAC quando as regras deixarem de caber em papéis.

## Referências

- Ferraiolo, D. F.; Kuhn, D. R. *Role-Based Access Controls*. 15th National Computer Security Conference, NIST, 1992. Artigo que formalizou o modelo.
- ANSI/INCITS 359-2004. *Role Based Access Control*. Padrão do modelo RBAC.
- [Documentação do NestJS sobre autorização](https://docs.nestjs.com/security/authorization) e sobre [guards](https://docs.nestjs.com/guards).
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).
- Post relacionado: [IAM na AWS: usuários, roles e policies](/posts/aws-iam-usuarios-roles-policies).
