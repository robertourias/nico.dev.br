---
title: "Arquitetura frontend em escala: micro frontends e BFF"
slug: "arquitetura-frontend-escala-micro-frontends-bff"
date: "2026-07-20"
categories: ["architecture"]
status: "published"
featured: false
description: "Como estruturar frontend para múltiplos times e produtos: micro frontends, BFF como camada de integração, padrões de código, performance, acessibilidade e design system."
tags: ["micro-frontends", "bff", "arquitetura-frontend", "design-system", "performance"]
coverImage: "https://images.unsplash.com/photo-1522252234503-e356532cafd5?w=1200&q=80"
---

Frontend parou de ser "só a camada visual" faz tempo. Quando o produto cresce, vira mais de um time, mais de um repositório e mais de um deploy, a arquitetura do frontend deixa de ser detalhe de implementação e passa a decidir se cada squad consegue entregar de forma independente — ou se todo mundo trava esperando o mesmo pipeline.

Esse post cobre as peças que mais aparecem quando esse crescimento acontece de verdade: micro frontends, BFF como camada de integração, e o trabalho — menos técnico, mais organizacional — de manter padrão de código, performance, acessibilidade e design system consistentes entre produtos diferentes.

## Micro frontends: autonomia tem custo

A promessa do micro frontend é simples: cada time dono de um pedaço da tela, com deploy independente, sem precisar coordenar release com os outros times. Na prática, só vale a pena quando esse problema já existe — times reais, esperando uns pelos outros, travados no mesmo monólito de frontend.

Adotar micro frontend num produto com um time só é resolver um problema que ainda não apareceu, pagando o custo dele desde já: duplicação de dependência, complexidade de build, e uma camada de orquestração que precisa existir em algum lugar.

Module Federation (Webpack ou Rspack) é a abordagem mais comum hoje pra compor os pedaços em runtime:

```js
// webpack.config.js do app "checkout"
new ModuleFederationPlugin({
  name: "checkout",
  filename: "remoteEntry.js",
  exposes: {
    "./Checkout": "./src/Checkout",
  },
  shared: { react: { singleton: true }, "react-dom": { singleton: true } },
});
```

```js
// webpack.config.js do app "shell" (host)
new ModuleFederationPlugin({
  name: "shell",
  remotes: {
    checkout: "checkout@https://checkout.exemplo.com/remoteEntry.js",
  },
});
```

O `shared` com `singleton: true` é o ponto que mais gera dor de cabeça: sem ele, cada micro frontend carrega sua própria cópia do React, e o bundle final duplica biblioteca que já estava disponível.

A divisão que funciona na prática não é por camada técnica (um time pra header, outro pra footer) — é por domínio de negócio (checkout, catálogo, conta do usuário), o mesmo critério de organização por `features/` que já vale dentro de um único app. Cada micro frontend deveria ser dono de uma jornada completa, não de um fragmento visual.

## BFF: a camada que evita telefone sem fio

Sem BFF, cada micro frontend fala direto com os microsserviços de backend — e cada um decide, por conta própria, como agregar dado de três serviços diferentes numa tela só. Isso duplica lógica de agregação em cada frontend e acopla a tela ao formato interno de cada serviço.

O BFF (Backend for Frontend) resolve isso invertendo a responsabilidade: existe uma API por frontend (ou por domínio de frontend), que já entrega o dado no formato que aquela tela precisa, escondendo a topologia dos serviços internos.

```ts
// bff/checkout/routes.ts
app.get("/checkout/resumo/:pedidoId", async (req, res) => {
  const [pedido, pagamento, frete] = await Promise.all([
    servicoPedidos.buscar(req.params.pedidoId),
    servicoPagamento.buscarStatus(req.params.pedidoId),
    servicoFrete.calcular(req.params.pedidoId),
  ]);

  res.json({
    pedidoId: pedido.id,
    itens: pedido.itens,
    valorTotal: pedido.valorTotal,
    statusPagamento: pagamento.status,
    prazoEntrega: frete.prazoEmDias,
  });
});
```

A tela de checkout faz uma chamada, recebe exatamente o que precisa, e não sabe (nem precisa saber) que esse dado veio de três serviços diferentes. Quando um desses serviços mudar de contrato, o ajuste fica isolado no BFF — o frontend nem percebe.

Um BFF por domínio de frontend, não um BFF genérico compartilhado por todos, é o que evita reproduzir o mesmo monólito que motivou a separação em micro frontends, só que um nível abaixo.

## Desenhando o system design antes do código

A escolha entre micro frontends, BFF único ou múltiplos só faz sentido depois de um exercício anterior: mapear o sistema a partir do domínio de negócio, não a partir do componente técnico que parece mais moderno.

O ponto de partida é listar os fluxos reais do produto — checkout, cadastro, busca — e, pra cada um, perguntar três coisas: quem é dono desse fluxo, quais dados ele precisa, e com que frequência esse dado muda. Fluxo que muda pouco e é lido por todo mundo (catálogo de produto, por exemplo) pede um tipo de comunicação; fluxo que muda a cada clique (carrinho, checkout) pede outro.

O modelo C4 (Contexto, Container, Componente, Código) evita pular direto pro diagrama de caixinha-e-seta sem entender o nível certo de abstração primeiro. O diagrama de Contexto responde "quem fala com quem" sem entrar em tecnologia; só depois disso faz sentido descer pro diagrama de Container, que já mostra se a comunicação é REST, evento ou GraphQL entre as partes.

```
[Frontend: Checkout] --REST síncrono--> [BFF: Checkout] --REST--> [Serviço: Pedidos]
                                                          --REST--> [Serviço: Pagamento]
                                                          --REST--> [Serviço: Frete]

[Frontend: Catálogo] --evento (invalidação de cache)--> [BFF: Catálogo] --REST cacheado--> [Serviço: Produto]
```

Cada seta nesse diagrama é uma dependência de deploy e uma decisão de acoplamento — não só uma linha bonita. Comunicação síncrona (REST, GraphQL) acopla disponibilidade: se o serviço de pagamento cai, o BFF de checkout sente na hora. Comunicação assíncrona (evento, fila) desacopla disponibilidade, mas troca isso por consistência eventual — a tela pode mostrar dado desatualizado por alguns segundos. Nenhuma das duas é "a certa" — é uma troca que precisa ser explícita, não uma consequência acidental de como o código foi escrito.

Contrato entre as partes precisa existir antes do código, não depois. Schema compartilhado (OpenAPI pro REST, ou tipo TypeScript publicado como pacote interno) evita que BFF e frontend divirjam sobre o formato do dado, e permite que os dois times trabalhem em paralelo contra um contrato já combinado, sem esperar um o outro terminar de implementar.

Prototipar a comunicação entre duas partes antes de comprometer a arquitetura inteira é o que evita descobrir, meses depois, que a latência real entre dois serviços inviabiliza o fluxo síncrono desenhado no papel. Um spike de uma tarde — chamando o serviço real, medindo latência real — vale mais do que qualquer estimativa feita em reunião.

## Decisão de arquitetura é trabalho de convencimento, não só de escolha técnica

Escolher entre Module Federation, iframes ou Web Components pra compor micro frontends é a parte fácil. A parte difícil é fazer três ou quatro times, cada um com prioridade e prazo próprio, concordarem em seguir o mesmo padrão — e manterem esse padrão seis meses depois, sob pressão de deadline.

O que funciona aqui é o mesmo mecanismo de um ADR (Architecture Decision Record): documentar contexto, alternativas consideradas e a decisão, de forma curta e acessível, em vez de depender de uma reunião que só quem participou vai lembrar depois. Isso transforma "por que decidimos isso" numa referência, não numa disputa de memória.

Padrão de código entre times diferentes só se sustenta quando é automatizado — ESLint compartilhado, Prettier, checagem de tipo no CI — porque revisão manual de PR não escala pra convenção repetitiva, e cada time acaba divergindo silenciosamente sem isso.

## Performance e acessibilidade como responsabilidade da arquitetura

Performance de um produto composto por micro frontends não é a soma da performance de cada pedaço isolado — é o resultado de como eles se compõem na página. Dois times otimizando o próprio bundle, sem visibilidade do todo, ainda podem entregar uma página lenta, porque ninguém está olhando pro carregamento agregado.

Orçamento de performance por página (não por app) é o que resolve isso — um limite de tamanho de bundle e de Web Vitals (LCP, INP, CLS) que vale pro conjunto, medido em CI antes do merge, não descoberto depois em produção.

Acessibilidade tem o mesmo problema de composição: um componente acessível isolado não garante uma jornada acessível quando três micro frontends diferentes se juntam numa mesma tela, cada um gerenciando foco e leitura de tela do seu jeito. Definir quem é dono da ordem de foco na composição — geralmente o shell, não cada remoto — evita que o teclado pule de forma imprevisível entre pedaços de times diferentes.

Teste de navegação por teclado e leitor de tela deveria rodar na composição final, não só em cada micro frontend isolado. É ali que problema de foco e ordem de leitura aparece — testar cada pedaço isolado não pega esse tipo de bug.

## Design system: o contrato visual entre produtos

Design system só funciona como contrato quando ele é consumido de verdade, não só publicado. A diferença entre os dois é medida em adesão: quantos produtos usam o componente do design system versus quantos recriaram a própria versão porque "era mais rápido".

Token de design (cor, espaçamento, tipografia) versionado e compartilhado — via pacote npm interno, por exemplo — é o que garante que uma mudança de marca se propague pra todos os produtos ao mesmo tempo, em vez de cada time ajustar isso manualmente no próprio ritmo.

```ts
// @empresa/design-tokens
export const cores = {
  primaria: "var(--cor-primaria)",
  texto: "var(--cor-texto)",
  erro: "var(--cor-erro)",
};
```

O ponto de atrito mais comum não é técnico — é de governança: quem aprova um componente novo, quem decide quando um caso de uso específico justifica sair do padrão, e como uma mudança que quebra compatibilidade é comunicada com antecedência pros times consumidores. Sem isso definido, o design system vira sugestão, não padrão.

Arquitetura de frontend em escala não é sobre escolher a ferramenta certa — Module Federation, BFF, o design system mais bonito. É sobre desenhar os limites entre os pedaços de forma que cada time consiga trabalhar sem pisar no trabalho do outro, e sem que o usuário final perceba que existe mais de um time por trás daquela tela.
