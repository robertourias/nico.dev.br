---
title: "MVC na prática: o padrão e um exemplo com NestJS"
slug: "mvc-padrao-exemplo-nestjs"
date: "2026-10-09"
categories: ["dev", "architecture"]
status: "published"
featured: false
description: "Entenda o que é o padrão MVC, o que cabe em Model, View e Controller, e monte uma lista de tarefas com NestJS e Handlebars em que cada camada tem papel claro."
tags: ["mvc", "nestjs", "arquitetura", "handlebars", "padroes-de-projeto"]
---

Num arquivo de 300 linhas, o mesmo método lê o formulário, valida o título, mexe no banco e monta o HTML da resposta. Funciona até a primeira vez que alguém precisa mudar o texto de um erro sem quebrar a regra de validação. O **MVC** (Model-View-Controller) existe para impedir esse arquivo: separa *o que a aplicação sabe*, *como ela aparece* e *quem coordena os dois*.

Este post explica o padrão, mostra como ele aparece no NestJS e monta um exemplo completo: uma lista de tarefas renderizada no servidor, com formulário, validação e redirect.

## O que é MVC

MVC é um padrão de organização de código formulado por Trygve Reenskaug nos anos 1970, no contexto de interfaces gráficas em Smalltalk. Hoje ele é a base de frameworks web como Rails, Laravel, Spring MVC e ASP.NET MVC. A ideia é dividir a aplicação em três papéis:

- **Model**: os dados e as regras de negócio. Sabe o que é uma tarefa válida, mas não sabe que existe um navegador.
- **View**: a apresentação. Recebe dados prontos e produz a saída que o usuário vê, no caso web, HTML.
- **Controller**: o intermediário. Recebe a requisição, chama o model e escolhe qual view devolver.

![Cards lado a lado de Model, Controller e View, cada um com o que faz e o que não faz: o model guarda regras e dados, o controller traduz a rota em chamadas, a view transforma dados em HTML](/images/mvc-padrao-exemplo-nestjs-camadas.svg)

O valor do padrão está na coluna "não faz". Se a view não conhece regra de negócio e o model não conhece HTML, você troca um sem tocar no outro. Dá para testar a validação sem subir servidor, e dá para redesenhar a tela sem medo de quebrar a regra.

## Como uma requisição percorre o MVC

Pegue o caso de criar uma tarefa pelo formulário:

![Fluxo em cinco passos: o navegador envia POST para o controller, o controller chama o model, o model devolve tarefa ou erro, o controller pede a renderização da view e o HTML volta ao navegador](/images/mvc-padrao-exemplo-nestjs-fluxo.svg)

O navegador envia `POST /tasks`. O controller extrai o título e pede ao model que crie a tarefa. O model valida e devolve a tarefa, ou um erro. O controller então decide a resposta: em caso de sucesso, um redirect para a listagem; em caso de erro, renderiza a view de novo com a mensagem. A view só recebe dados e devolve HTML.

Note que quem decide *o que acontece depois* é sempre o controller. O model nunca chama a view, e a view nunca chama o model.

## MVC no NestJS

O NestJS não nasceu como um framework MVC puro. Sua organização principal é em módulos, controllers e providers, inspirada no Angular. Mas ele suporta MVC de verdade: sobre o Express, você registra um motor de templates e usa o decorator `@Render` para entregar uma view, como descreve a [documentação do NestJS sobre MVC](https://docs.nestjs.com/techniques/mvc).

O mapeamento fica assim:

| Papel no MVC | Peça no NestJS | Neste exemplo |
| --- | --- | --- |
| Model | Provider (`@Injectable`) com as regras e os dados | `TasksService` |
| View | Template do motor de views | `views/tasks/index.hbs` |
| Controller | Classe com `@Controller` | `TasksController` |

Uma observação importante: numa API JSON, que é o caso de quase todo backend NestJS hoje, a "view" deixa de ser um template e vira a serialização da resposta (o JSON em si). A separação de responsabilidades continua valendo. O que muda é só a forma de saída.

## Exemplo: lista de tarefas com NestJS e Handlebars

Um aviso de contexto. O `apps/api` deste monorepo é uma API JSON, sem views, então este exemplo **não está no repositório**. Montei e testei num projeto separado, com NestJS 10 sobre Express. As tarefas ficam em memória para o foco continuar no padrão; trocar por um banco só mexe no model.

### Passo 1: instalar o motor de templates

Com um projeto NestJS criado (`nest new`), adicione o `hbs`, o adaptador do Handlebars para o Express:

```bash
pnpm add hbs
```

### Passo 2: configurar as views no main.ts

```ts
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

O tipo `NestExpressApplication` é o que libera `setBaseViewsDir` e `setViewEngine`. O Nest já interpreta formulários `application/x-www-form-urlencoded` por padrão, então não é preciso configurar nada para ler o `<form>`.

### Passo 3: o model

```ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

export interface Task {
  id: string;
  title: string;
  done: boolean;
}

export class InvalidTaskError extends Error {}

@Injectable()
export class TasksService {
  private readonly tasks: Task[] = [];

  findAll(): Task[] {
    return this.tasks;
  }

  countPending(): number {
    return this.tasks.filter((task) => !task.done).length;
  }

  create(rawTitle: string): Task {
    const title = (rawTitle ?? '').trim();
    if (title.length === 0 || title.length > 80) {
      throw new InvalidTaskError('O título precisa ter entre 1 e 80 caracteres.');
    }
    const task: Task = { id: randomUUID(), title, done: false };
    this.tasks.push(task);
    return task;
  }

  toggle(id: string): Task {
    const task = this.tasks.find((item) => item.id === id);
    if (!task) throw new NotFoundException('Tarefa não encontrada');
    task.done = !task.done;
    return task;
  }
}
```

A regra do título (1 a 80 caracteres) mora aqui, não no controller nem no template. O `maxlength` no HTML ajuda o usuário, mas quem garante a regra é o model. O erro `InvalidTaskError` é uma classe própria, sem nada de HTTP: o model não sabe o que é um status 422.

### Passo 4: o controller

```ts
import { Body, Controller, Get, Param, Post, Render, Res } from '@nestjs/common';
import type { Response } from 'express';
import { InvalidTaskError, TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Get()
  @Render('tasks/index')
  list() {
    return this.page();
  }

  @Post()
  create(@Body('title') title: string, @Res() res: Response) {
    try {
      this.tasks.create(title);
      return res.redirect('/tasks');
    } catch (error) {
      if (error instanceof InvalidTaskError) {
        return res.status(422).render('tasks/index', { ...this.page(), error: error.message, title });
      }
      throw error;
    }
  }

  @Post(':id/toggle')
  toggle(@Param('id') id: string, @Res() res: Response) {
    this.tasks.toggle(id);
    return res.redirect('/tasks');
  }

  private page() {
    return { tasks: this.tasks.findAll(), pending: this.tasks.countPending() };
  }
}
```

Dois estilos de resposta convivem aqui. No `list`, o `@Render('tasks/index')` diz qual view usar e o objeto retornado vira o contexto do template. No `create`, a escolha depende do resultado (redirect ou re-renderização), então o controller injeta a resposta com `@Res()` e chama `res.redirect` ou `res.render` ele mesmo. É o caso previsto na documentação para decidir o template em tempo de execução.

O redirect após um POST bem-sucedido tem um motivo: se a resposta fosse a própria página, atualizar o navegador reenviaria o formulário e duplicaria a tarefa. Com o redirect, o refresh refaz só o `GET /tasks`. Esse padrão se chama *Post/Redirect/Get*.

O controller fica fino de propósito. Ele traduz HTTP para chamadas ao model e escolhe a resposta, sem nenhuma regra de negócio. O 422 (*Unprocessable Entity*) sinaliza que a requisição foi entendida, mas os dados são inválidos.

### Passo 5: a view

Crie `views/tasks/index.hbs`:

```hbs
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Tarefas</title>
  </head>
  <body>
    <h1>Tarefas ({{pending}} pendentes)</h1>

    {{#if error}}<p role="alert">{{error}}</p>{{/if}}

    <form method="post" action="/tasks">
      <label for="title">Nova tarefa</label>
      <input id="title" name="title" value="{{title}}" maxlength="200" />
      <button type="submit">Adicionar</button>
    </form>

    <ul>
      {{#each tasks}}
        <li>
          <span>{{title}}{{#if done}} (concluída){{/if}}</span>
          <form method="post" action="/tasks/{{id}}/toggle">
            <button type="submit">{{#if done}}Reabrir{{else}}Concluir{{/if}}</button>
          </form>
        </li>
      {{/each}}
    </ul>
  </body>
</html>
```

A view só exibe: `{{pending}}`, `{{error}}`, `{{#each tasks}}`. Não há regra, só condicionais de apresentação. O Handlebars **escapa HTML por padrão** em `{{ }}`, então um título como `<b>x</b>` aparece como texto, e não como tag. Isso protege contra XSS, desde que você não use a forma de chaves triplas (`{{{ }}}`), que desliga o escape.

Por fim, registre o `TasksController` e o `TasksService` em um `TasksModule` e importe-o no `AppModule`, como em qualquer módulo Nest.

### Passo 6: testar

Suba a aplicação e rode, num segundo terminal:

```bash
curl -i -X POST http://localhost:3000/tasks --data-urlencode "title=Escrever post sobre MVC"
```

A resposta deve ser `302 Found` com `Location: /tasks`. Depois, um título vazio:

```bash
curl -i -X POST http://localhost:3000/tasks -d "title=%20%20"
```

Deve voltar `422` com a página contendo `<p role="alert">O título precisa ter entre 1 e 80 caracteres.</p>`. Para ver a lista e conferir o escape:

```bash
curl -s -X POST http://localhost:3000/tasks --data-urlencode "title=<b>x</b>"
curl -s http://localhost:3000/tasks | grep "<span>"
```

O segundo item deve aparecer como `&lt;b&gt;x&lt;/b&gt;`. Rodei esse roteiro e foi esse o comportamento, incluindo o 404 ao marcar uma tarefa inexistente. Abrir `http://localhost:3000/tasks` no navegador mostra o fluxo completo.

## Limites do MVC (e do exemplo)

**"Controller gordo" é o defeito clássico.** Quando o controller começa a validar, calcular e consultar banco, a separação se perde. O teste prático: se você precisa de uma requisição HTTP para testar uma regra, ela está na camada errada.

**O model vira "service" e pode virar saco de gato.** Em projetos maiores, um `TasksService` com tudo dentro cresce sem forma. Aí entram repositórios, entidades de domínio e casos de uso, tema do [post sobre padrões defensivos](/posts/padroes-defensivos-engenharia-de-software) e do [guia de arquitetura SaaS](/posts/arquitetura-saas-nextjs-nestjs-guia-completo).

**O estado em memória some a cada restart.** O exemplo serve para ensinar o padrão. Em produção, o model fala com um banco, e a interface do `TasksService` pode continuar igual.

**Renderizar no servidor é uma escolha.** Se o front é uma SPA ou um app Next.js, o Nest costuma servir só JSON, e a view mora no cliente. A comparação das estratégias de renderização está em [SSR, SSG, CSR e ISR](/posts/ssr-ssg-csr-isr-estrategias-de-renderizacao). Autenticação e permissões, nesse cenário, entram como guards: veja [JWT com NestJS](/posts/jwt-o-que-e-como-funciona-nestjs) e [RBAC](/posts/rbac-controle-de-acesso-nestjs-nextjs).

## O que fica

MVC não é uma estrutura de pastas, é uma regra sobre quem pode conhecer quem. O controller conhece model e view, a view recebe dados prontos, e o model não conhece ninguém. Enquanto essa direção se mantém, trocar o banco, o template ou até o formato de saída é uma mudança local.

A pergunta que resume o padrão é "onde esta linha deveria morar?". Validação de título é regra, então model. Mensagem de erro formatada em parágrafo é apresentação, então view. Decidir entre redirect e re-renderizar é coordenação, então controller. Quando a resposta é clara, o código quase sempre já está no lugar certo.

## Referências

- [NestJS: MVC (técnica de renderização de views)](https://docs.nestjs.com/techniques/mvc)
- [Express: `res.render` e `res.redirect`](https://expressjs.com/en/api.html#res.render)
- [Handlebars: guia de expressões e escape de HTML](https://handlebarsjs.com/guide/expressions.html)
- [hbs: adaptador do Handlebars para Express](https://github.com/pillarjs/hbs)
- Trygve Reenskaug, trabalhos originais sobre Model-View-Controller (Xerox PARC, década de 1970)
