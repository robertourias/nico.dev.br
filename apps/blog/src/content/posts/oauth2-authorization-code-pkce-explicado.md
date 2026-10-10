---
title: "OAuth 2.0 explicado: fluxo, tokens e PKCE na prática"
slug: "oauth2-authorization-code-pkce-explicado"
date: "2026-10-09"
categories: ["dev", "architecture"]
status: "published"
featured: false
description: "OAuth 2.0 explicado: papéis, Authorization Code com PKCE, tokens e scopes, outros grants, diferença para OIDC e como se encaixa com RBAC."
tags: ["oauth2", "pkce", "oidc", "autenticacao", "seguranca"]
---

"Entrar com Google" parece um botão de login, mas por baixo roda o **OAuth 2.0** (mais uma camada de identidade por cima). OAuth 2.0 é um protocolo de **autorização delegada**: ele permite que um aplicativo acesse dados seus em outro serviço sem nunca receber a sua senha.

O exemplo clássico: um app de calendário quer ler seus e-mails. Em vez de você entregar a senha do e-mail, o provedor entrega ao app um **token** com alcance limitado ("só leitura de e-mail"), com prazo de validade e revogável. Este post explica o protocolo do zero: quem participa, como o fluxo funciona, o que são tokens e scopes, onde entram o OIDC e o RBAC. O código é ilustrativo; adapte ao seu provedor.

## O problema que o OAuth 2.0 resolve

Antes do OAuth, para um app acessar seus dados em outro serviço, havia duas opções ruins: pedir a sua senha (e passar a guardar uma credencial que dá acesso a **tudo**) ou não integrar. Dar a senha a um terceiro significa que você não consegue limitar o que ele faz, não consegue revogar só ele e depende de ele guardá-la bem.

O OAuth 2.0 troca a senha por um **access token**: uma credencial emitida por quem é dono dos dados, com escopo restrito e prazo curto. Se o app for comprometido ou você mudar de ideia, revoga-se o token e a senha continua intacta. A especificação é a RFC 6749.

## Os quatro papéis

O protocolo define quatro papéis. Os nomes vêm da especificação e aparecem em toda documentação, então vale decorá-los:

| Papel | Quem é | No exemplo do calendário |
|-------|--------|--------------------------|
| **Resource Owner** | o dono dos dados | você |
| **Client** | o app que quer acesso | o app de calendário |
| **Authorization Server** | quem autentica o dono e emite tokens | Google, Keycloak, Auth0 |
| **Resource Server** | a API que guarda os dados e valida o token | a API de e-mail |

Em muitos produtos, o Authorization Server e o Resource Server pertencem à mesma empresa, mas são papéis distintos. Num sistema próprio, é comum ter um Keycloak ou similar como Authorization Server e as suas APIs como Resource Servers. O post sobre [Keycloak com React e microsserviços](/posts/keycloak-react-microsservicos-module-federation) mostra esse arranjo.

Há ainda uma distinção sobre o Client: ele é **confidencial** se consegue guardar um segredo (um back-end) ou **público** se não consegue (uma SPA ou um app mobile, cujo código o usuário pode inspecionar). Essa diferença define quais fluxos e proteções se aplicam.

## O fluxo Authorization Code com PKCE

Existem vários fluxos, chamados de *grants*. O que você usará em quase todo caso com um usuário humano é o **Authorization Code**, hoje sempre acompanhado de **PKCE** (Proof Key for Code Exchange, lê-se "pixi", RFC 7636).

A ideia central: o app nunca recebe o token diretamente pelo navegador. Ele recebe um **código** temporário e o troca pelo token numa chamada direta ao Authorization Server.

![Sequência do Authorization Code com PKCE: o cliente gera o code_challenge e redireciona o navegador ao servidor de autorização, o usuário faz login e consente, o servidor devolve um code, o cliente troca code mais code_verifier por access_token e chama a API com Bearer](/images/oauth2-authorization-code-pkce-explicado-fluxo.svg)

Passo a passo, com o que cada parte faz:

1. O usuário clica em "Entrar" no Client.
2. O Client gera um segredo aleatório de uso único, o `code_verifier`, calcula a partir dele o `code_challenge` (seu hash SHA-256) e redireciona o navegador para o endpoint `/authorize` com o challenge, os `scope`s pedidos, o `redirect_uri` e um `state`.
3. O Authorization Server autentica o usuário e pede o **consentimento** ("este app quer ler seus e-mails. Permitir?").
4. Ele redireciona o navegador de volta ao `redirect_uri` do Client com um `code` curto e o mesmo `state`.
5. O Client chama o endpoint `/token` diretamente, enviando o `code` **e o `code_verifier` original**.
6. O servidor confere que o hash do verifier bate com o challenge recebido no início e devolve o `access_token` (e, se aplicável, um `refresh_token`).
7. O Client chama a API com o cabeçalho `Authorization: Bearer <access_token>`.

### Por que o PKCE existe

O `code` viaja pelo navegador, pela barra de endereço, e pode ser interceptado, por exemplo por outro app no celular que registrou o mesmo esquema de URL. Sem PKCE, quem roubasse o código poderia trocá-lo por um token.

Com PKCE, o código sozinho não serve: quem o rouba não tem o `code_verifier`, que nunca saiu do Client. O servidor só entrega o token a quem prova ser o mesmo que iniciou o fluxo. Por isso o PKCE é obrigatório para clients públicos, e as recomendações atuais de segurança (RFC 9700) o indicam também para clients confidenciais.

O `state`, por sua vez, protege contra outro ataque: o Client gera um valor aleatório, guarda e confere se o mesmo volta no callback. Sem isso, um atacante poderia injetar um código dele na sessão da vítima (CSRF).

### O código, em TypeScript

Gerar o par verifier/challenge e montar a URL de autorização:

```ts
import { createHash, randomBytes } from 'node:crypto';

const codeVerifier = randomBytes(32).toString('base64url');
const codeChallenge = createHash('sha256').update(codeVerifier).digest('base64url');
const state = randomBytes(16).toString('base64url');

// guarde codeVerifier e state na sessão do usuário antes de redirecionar

const url = new URL('https://auth.exemplo.com/authorize');
url.search = new URLSearchParams({
  response_type: 'code',
  client_id: 'app-calendario',
  redirect_uri: 'https://app.exemplo.com/callback',
  scope: 'openid email.read',
  state,
  code_challenge: codeChallenge,
  code_challenge_method: 'S256',
}).toString();
```

No callback, depois de conferir o `state`, troque o código pelo token:

```ts
const res = await fetch('https://auth.exemplo.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code,                                  // veio na query do callback
    redirect_uri: 'https://app.exemplo.com/callback',
    client_id: 'app-calendario',
    code_verifier: codeVerifier,           // o segredo original
  }),
});

const { access_token, refresh_token, expires_in } = await res.json();
```

Os endpoints (`/authorize`, `/token`) e os nomes exatos variam por provedor. A maioria publica um documento de descoberta em `/.well-known/openid-configuration` com todas as URLs; use-o em vez de fixar caminhos no código.

## Tokens e scopes

**Access token.** A credencial que a API recebe. Deve ter vida curta, da ordem de minutos, justamente porque, vazado, vale até expirar. Pode ser *opaco* (uma string sem significado, que a API valida consultando o servidor) ou um **JWT** (JSON Web Token, que carrega dados assinados e pode ser validado localmente). O cabeçalho `Bearer` vem da RFC 6750 e significa "quem porta este token tem acesso", o que é motivo para nunca logá-lo.

**Refresh token.** Uma credencial de vida longa, usada só junto ao Authorization Server para obter novos access tokens sem pedir login de novo. Como vale muito mais, deve ser guardado com cuidado e, idealmente, **rotacionado**: cada uso emite um refresh token novo e invalida o anterior.

**Scope.** Uma lista de permissões que o **app** pede em nome do usuário, como `email.read` ou `calendar.write`. É o que aparece na tela de consentimento, e o token emitido fica limitado a esses scopes.

### Como a API valida o token

O Resource Server não confia no token por ele existir. Quando é um JWT, ele verifica a assinatura com as chaves públicas do emissor (publicadas num endpoint JWKS) e confere o emissor (`iss`), o público-alvo (`aud`), a expiração (`exp`) e os scopes. Com a biblioteca `jose`:

```ts
import { createRemoteJWKSet, jwtVerify } from 'jose';

const jwks = createRemoteJWKSet(new URL('https://auth.exemplo.com/.well-known/jwks.json'));

export async function validarToken(token: string) {
  const { payload } = await jwtVerify(token, jwks, {
    issuer: 'https://auth.exemplo.com',
    audience: 'api-pedidos',
  });

  const scopes = String(payload.scope ?? '').split(' ');
  return { sub: payload.sub, scopes };
}
```

O `audience` merece atenção: ele garante que o token foi emitido **para esta API**. Sem conferi-lo, um token válido emitido para outro serviço seria aceito aqui.

## Outros grants: quando usar cada um

O Authorization Code não é o único fluxo; cada grant resolve uma situação:

| Grant | Quando usar |
|-------|-------------|
| **Authorization Code + PKCE** | apps com usuário: web, SPA, mobile |
| **Client Credentials** | máquina com máquina, sem usuário (um serviço chamando outro) |
| **Device Code** (RFC 8628) | dispositivos sem teclado ou navegador: TV, CLI |
| **Refresh Token** | renovar um access token expirado |
| **Implicit e Password** | evitar: as recomendações de segurança atuais os desaconselham |

O **Client Credentials** é o mais simples: o serviço se autentica com seu próprio `client_id` e segredo e recebe um token em nome de si mesmo. É o que um job noturno ou um microsserviço usa para chamar outra API.

O Implicit entregava o token direto na URL do navegador, e o Password fazia o app receber a senha do usuário, o que anula o propósito do protocolo. Existe um esforço de consolidação chamado OAuth 2.1, que reúne as práticas recomendadas e remove esses dois fluxos; ele estava em rascunho no IETF quando escrevi, então confira o status antes de citá-lo como padrão.

## OAuth 2.0 não é login: onde entra o OIDC

Esta é a confusão mais comum. OAuth 2.0 responde "o que este app pode fazer", não "quem é o usuário". O access token é feito para a **API** ler; o app não deve interpretá-lo como prova de identidade.

Para identidade existe o **OpenID Connect (OIDC)**, uma camada construída sobre o OAuth 2.0. Ao incluir o scope `openid` no pedido, o servidor devolve também um **`id_token`**: um JWT com a identidade do usuário (`sub`, `email`, `name`, quando ele autenticou). Esse sim é para o Client consumir e estabelecer a sessão de login.

![Três camadas: OIDC responde quem é o usuário com o id_token, OAuth 2.0 responde o que o app pode fazer com access_token e scopes, RBAC na API responde o que o usuário pode fazer com papéis e permissões](/images/oauth2-authorization-code-pkce-explicado-camadas.svg)

Resumindo: "Entrar com Google" é OIDC; "permitir que o app leia seu calendário" é OAuth 2.0. O fluxo de rede é o mesmo, e o `id_token` e o `access_token` chegam juntos na mesma resposta de `/token`.

## E o RBAC? Scope não é permissão do usuário

O [RBAC](/posts/rbac-controle-de-acesso-nestjs-nextjs) decide o que o **usuário** pode fazer: papéis agrupam permissões. O scope decide o que o **app** pode fazer em nome dele. São coisas diferentes, e as duas valem ao mesmo tempo.

Um exemplo: Cris tem o papel `leitor`, sem `post:delete`. Mesmo que um app peça e receba o scope `posts.write`, a API ainda deve negar a exclusão, porque **Cris** não pode. E o contrário: Ana é `admin`, mas se o app só recebeu `posts.read`, ele não consegue apagar nada, porque o **app** não foi autorizado.

O acesso efetivo é a interseção: o token precisa carregar o scope **e** o usuário precisa ter a permissão. Na prática, a API valida o token como acima, lê o `sub` e consulta (ou recebe como claim no token, dependendo do provedor) os papéis e permissões do usuário, aplicando o mesmo guard de permissões do post de RBAC.

## Armadilhas comuns

**Validar `redirect_uri` de forma frouxa.** O Authorization Server deve aceitar apenas URIs cadastradas, com comparação exata. Aceitar padrões ou subdomínios abre caminho para redirecionar o código a um atacante.

**Guardar tokens onde o JavaScript alcança.** Um `localStorage` numa SPA expõe o token a qualquer XSS. Um padrão mais seguro é o **BFF** (Backend for Frontend): o servidor faz o fluxo OAuth, guarda os tokens e entrega ao navegador apenas um cookie `httpOnly` de sessão.

**Access token longo demais.** Quanto maior a validade, maior a janela de uso de um token vazado. Prefira tokens curtos com refresh rotacionado.

**Não conferir `aud` e `iss`.** Aceitar qualquer JWT bem assinado, de qualquer emissor ou para qualquer API, é um dos erros mais frequentes em resource servers.

**Usar o access token como identidade.** Para saber quem é o usuário, use o `id_token` do OIDC (ou o endpoint `userinfo`), não o conteúdo do access token.

**Pedir mais scopes do que precisa.** Peça o mínimo necessário. Scopes amplos aumentam o dano de um vazamento e reduzem a confiança do usuário na tela de consentimento.

## Conclusão

OAuth 2.0 se resume a uma troca: em vez de entregar a senha, o usuário autoriza um app a agir com **limites claros**, e o app recebe um token que a API consegue verificar. Todo o resto, PKCE, state, refresh e scopes, existe para que essa troca seja segura mesmo com navegadores, redirecionamentos e apps públicos no meio.

A mudança prática de raciocínio é separar três perguntas que costumam se misturar: **quem é o usuário** (OIDC), **o que o app pode fazer em nome dele** (OAuth 2.0) e **o que o usuário pode fazer** (RBAC). Ao projetar um sistema, decida qual camada responde a cada pergunta e valide as três na API, sem deixar uma fingir que faz o trabalho da outra.

## Referências

- Hardt, D. (ed.). *The OAuth 2.0 Authorization Framework*. RFC 6749, IETF, 2012: https://www.rfc-editor.org/rfc/rfc6749
- Jones, M.; Hardt, D. *The OAuth 2.0 Authorization Framework: Bearer Token Usage*. RFC 6750: https://www.rfc-editor.org/rfc/rfc6750
- Sakimura, N.; Bradley, J.; Agarwal, N. *Proof Key for Code Exchange by OAuth Public Clients*. RFC 7636: https://www.rfc-editor.org/rfc/rfc7636
- Denniss, W.; Jones, M.; Campbell, B. *OAuth 2.0 Device Authorization Grant*. RFC 8628: https://www.rfc-editor.org/rfc/rfc8628
- *Best Current Practice for OAuth 2.0 Security*. RFC 9700, IETF: https://www.rfc-editor.org/rfc/rfc9700
- OpenID Foundation. *OpenID Connect Core 1.0*: https://openid.net/specs/openid-connect-core-1_0.html
- Documentação da biblioteca `jose`: https://github.com/panva/jose
- Posts relacionados: [RBAC na prática](/posts/rbac-controle-de-acesso-nestjs-nextjs) e [Keycloak com React e microsserviços](/posts/keycloak-react-microsservicos-module-federation).
