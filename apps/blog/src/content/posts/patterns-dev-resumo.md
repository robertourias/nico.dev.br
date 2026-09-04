---
title: "Patterns.dev (Lydia Hallie & Addy Osmani)"
slug: "patterns-dev-resumo"
date: "2026-09-04"
categories: ["livros", "tech"]
status: "published"
featured: false
description: "Resumo organizado por temas de Patterns.dev (Learning Patterns), de Lydia Hallie e Addy Osmani — design patterns em JavaScript, padrões de renderização (SSR, SSG, ISR, islands, RSC) e padrões de performance, com aprofundamento nos pontos que mais aparecem no dia a dia."
tags: ["patterns-dev", "lydia-hallie", "addy-osmani", "design-patterns", "resenha"]
coverImage: "https://images.unsplash.com/photo-1550439062-609e1531270e?w=1200&q=80"
---

Lydia Hallie e Addy Osmani publicaram **Patterns.dev** — também distribuído como *Learning Patterns* — primeiro como site gratuito, depois como livro de mais de 400 páginas, igualmente gratuito. Hallie é conhecida pelas visualizações de motor JavaScript do projeto *JavaScript Visualized*; Osmani lidera trabalho de performance web no time do Chrome, no Google, e já tinha escrito antes *Learning JavaScript Design Patterns*. A junção dos dois currículos explica o recorte do livro: metade design patterns clássico adaptado para JS moderno, metade padrões de renderização e de carregamento que só fazem sentido quando se entende como o navegador realmente baixa, processa e desenha uma página.

O conteúdo é dividido em três blocos — padrões de design, padrões de renderização e padrões de performance —, com exemplos em JavaScript puro e em React. Reorganizei por tema, como forma de revisão de estudo, e aprofundei além do resumo oficial nos pontos que mais aparecem no trabalho real: renderização, onde a distância entre teoria e escolha de framework é maior, e os padrões de carregamento que compõem performance de verdade.

## Por que padrões de design ainda importam num mundo de framework

O livro abre reconhecendo uma tensão: os padrões de design clássicos (o catálogo do *Gang of Four*, de 1994) nasceram para linguagens estaticamente tipadas e orientadas a classe, como C++. JavaScript é dinamicamente tipado, tem funções como cidadãs de primeira classe e herança prototípica em vez de herança clássica — então vários desses padrões chegam em JS já resolvidos pela própria linguagem, ou precisam de adaptação para fazer sentido.

A proposta de Hallie e Osmani não é aplicar padrão por aplicar. É reconhecer a forma de um problema recorrente e ter um nome compartilhado para discuti-lo com o time, em vez de reinventar a explicação do zero toda vez que ele aparece. Um padrão bem escolhido documenta uma decisão; um padrão forçado só adiciona indireção onde uma função simples resolveria.

## Padrões clássicos de criação e estrutura

Quatro padrões cobrem a parte mais próxima do catálogo tradicional: como criar e organizar objetos.

| Padrão | O que resolve |
|---|---|
| Singleton | Garante uma única instância compartilhada em toda a aplicação |
| Prototype | Compartilha propriedades e métodos entre instâncias via herança prototípica |
| Proxy | Intercepta leitura, escrita e outras operações sobre um objeto |
| Factory | Cria objetos sem expor a lógica de qual "tipo" instanciar |

**Singleton** garante que uma classe tenha só uma instância, acessada globalmente. O livro é honesto sobre o lado ruim: estado global mutável dificulta teste (é preciso resetar o singleton entre casos de teste) e cria acoplamento invisível entre partes do código que, na teoria, nem deveriam se conhecer. Em JS, boa parte do problema já é resolvida pelo próprio sistema de módulos — um módulo ES importado em lugares diferentes sempre aponta para a mesma instância, então um singleton explícito em classe costuma ser redundante.

**Prototype** não é bem uma escolha, é o mecanismo nativo de herança do JS: em vez de copiar métodos para cada instância, objetos compartilham um protótipo comum, e a sintaxe `class` é açúcar sintático por cima disso. A vantagem prática é memória — cem instâncias de uma classe reaproveitam os mesmos métodos guardados uma única vez no protótipo, em vez de duplicá-los por objeto.

**Proxy** usa o objeto nativo `Proxy` do JS para interceptar operações como leitura (`get`) e escrita (`set`) de propriedade, antes que elas cheguem ao objeto real. Os casos de uso do livro são bem concretos: validar um valor antes de aceitar a escrita, logar todo acesso a uma propriedade sensível, ou formatar automaticamente um valor lido (transformar índice negativo de array em acesso a partir do fim, por exemplo). É o padrão menos conhecido do grupo e o que mais surpreende por já vir pronto na linguagem.

**Factory** centraliza a lógica de criação numa função, sem expor a classe concreta para quem chama. Vale a pena quando a criação do objeto envolve decisão — por ambiente, por tipo de usuário, por configuração — e não quando o objeto é só um `{ ...campos }` fixo; nesse caso a fábrica só adiciona uma chamada de função sem ganho real.

## Padrões de comportamento e organização de código

Observer, Module, Mixin e Mediator/Middleware tratam de como partes do código se comunicam sem ficar fortemente acopladas.

**Observer** define um objeto "sujeito" que mantém uma lista de observadores e notifica todos quando seu estado muda — a base do padrão publish/subscribe. `addEventListener` do próprio navegador já é uma implementação disso; RxJS, com seus Observables, é a versão "industrial" da mesma ideia, com operadores para compor, filtrar e combinar fluxos de evento.

**Module** encapsula estado privado e expõe só uma API pública. Antes do ES2015, isso exigia truques — IIFE (função invocada imediatamente) combinada com o *revealing module pattern* para simular privacidade via closure. Hoje `import`/`export` faz isso nativamente: cada módulo já é privado por padrão, sem precisar de nenhum truque de escopo. O padrão, nesse caso, virou a própria linguagem.

**Mixin** adiciona comportamento a um objeto ou classe sem herança formal — via `Object.assign` misturando métodos direto no protótipo. O livro é claro sobre o risco: colisão de nome entre mixins diferentes, e dificuldade de rastrear qual mixin adicionou qual método quando o objeto final já tem uma dúzia deles. Não é coincidência que o próprio React tenha abandonado mixins (usados no antigo `createClass`) em favor primeiro de HOCs, depois de hooks — o mesmo problema de rastreabilidade apareceu em produção.

**Mediator** (e sua variação prática, **Middleware**) centraliza a comunicação entre objetos que não precisam se conhecer diretamente. O exemplo mais reconhecível é uma cadeia de middleware — Express ou Redux —, onde cada função recebe a requisição (ou a ação), decide o que fazer, e chama explicitamente `next()` para passar o controle adiante. É o padrão *chain of responsibility* aplicado com nome de mediador.

## Padrões de componentes em React — e como os hooks engoliram os outros

Esta é a parte do livro que mais se beneficia de ler em ordem cronológica de adoção, porque os cinco padrões resolvem, na prática, o mesmo problema de formas sucessivas — e a maioria foi superada pela seguinte.

**Container/Presentational** separa busca e gestão de estado (container) da parte puramente visual (presentational, um componente "burro" que só recebe props). O modelo é simples de explicar, mas dobra a quantidade de componentes e não compõe bem quando a mesma lógica de estado precisa alimentar vários componentes visuais diferentes.

**HOC** (*higher-order component*) é uma função que recebe um componente e devolve outro componente, injetando props extras. `connect()` do react-redux e `withRouter` são os exemplos clássicos de produção. O problema que o livro documenta é bem conhecido de quem já debugou um desses: *wrapper hell* — uma árvore de componentes profundamente aninhada só de wrappers no DevTools — e colisão de nome quando dois HOCs injetam a mesma prop, silenciosamente sobrescrevendo um ao outro.

**Render Props** resolve a colisão de nome do HOC passando os dados como argumento de uma função (renderizada como filho, ou como prop), em vez de injetar props direto no componente. O ganho vem com um custo simétrico: compor duas ou três *render props* empilhadas produz uma JSX profundamente aninhada, o mesmo tipo de pirâmide que callback aninhado produzia antes de `async`/`await`.

**Hooks**, desde o React 16.8, resolvem o problema original de HOC e Render Props de outra forma: extrair e reaproveitar lógica de estado sem nenhum wrapping e sem nenhum aninhamento — `useState`, `useEffect` e hooks customizados vivem dentro do próprio componente que os usa. É por isso que, na prática, quase ninguém escreve um HOC ou uma render prop do zero hoje; vale reconhecer os dois ao ler uma biblioteca mais antiga, mas o padrão dominante consolidou em um só.

**Compound Pattern** resolve um problema diferente dos outros quatro — não é reaproveitar lógica, é ergonomia de composição visual. Vários componentes compartilham estado implícito via Context, sem *prop drilling*: `<Select><Option /><Option /></Select>`, onde `Select` guarda o estado de qual opção está selecionada e cada `Option` só se registra nele. Esse padrão não foi substituído por hooks — pelo contrário, segue vivo e é a espinha dorsal de bibliotecas headless como Radix UI e Headless UI.

## Padrões de renderização: o núcleo mais atual do livro

Esta é a seção que mais evoluiu desde que o livro foi escrito, e onde vale mais aprofundar. Antes de comparar as opções, um conceito precisa estar claro: **hidratação** é o processo de o React pegar um HTML já renderizado (pelo servidor ou estaticamente) e "religar" os event listeners e o estado interno sobre esse DOM existente, em vez de reconstruir tudo do zero. Toda a comparação abaixo gira em torno de quando e como essa hidratação acontece.

| Padrão | Quando o HTML fica pronto | Trade-off principal |
|---|---|---|
| CSR | No navegador, depois do JS baixar e rodar | Tela em branco inicial, mas máxima interatividade depois |
| SSR | No servidor, a cada requisição | TTFB melhor, mas custo de servidor por requisição |
| Static (SSG) | No build, uma vez só | Mais rápido possível, mas conteúdo só tão fresco quanto o último build |
| ISR | No build, com regeneração incremental depois | Velocidade do estático com frescor quase dinâmico |

**CSR** manda um HTML mínimo e um bundle JS relativamente grande; o navegador baixa, processa e só então renderiza tudo. É a escolha certa para aplicação altamente interativa atrás de login, onde SEO não importa — e a errada para página de conteúdo público, onde o usuário olha uma tela em branco (ou um spinner) até o JS terminar de carregar.

**SSR** renderiza o HTML completo no servidor, a cada requisição, e entrega já populado. Isso melhora First Contentful Paint e SEO, mas tem um efeito colateral que o livro chama de "vale da estranheza": a página parece pronta visualmente, mas não responde a clique nenhum até a hidratação terminar — e o custo de hidratar escala com o tamanho da página.

**Static Rendering (SSG)** gera o HTML uma vez, no build, e serve direto de CDN — a opção mais rápida que existe, porque não há nenhum cálculo de servidor por requisição. O preço é frescor: qualquer mudança de conteúdo exige um novo build (completo ou parcial) antes de aparecer para o usuário.

**Incremental Static Regeneration (ISR)**, popularizado pelo Next.js, resolve exatamente essa limitação: a página continua estática por padrão, mas é regenerada em segundo plano depois de um intervalo definido, ou sob demanda via webhook quando o conteúdo muda — sem precisar rebuildar o site inteiro. Uma requisição pode servir a versão "velha" enquanto a nova é gerada, e só a próxima requisição já recebe a atualizada.

**Progressive Hydration** hidrata a página em partes, por ordem de prioridade, em vez de num único passo bloqueante — geralmente combinando `React.lazy` com limites de `Suspense`, para adiar a hidratação de seções abaixo da dobra ou menos críticas até depois que o essencial já responde a interação.

**Streaming SSR** leva a mesma lógica para o lado do servidor: em vez de esperar a árvore inteira terminar de renderizar para só então mandar qualquer coisa, o servidor manda o HTML em pedaços conforme cada parte fica pronta. Seções lentas, que dependem de dado externo, ficam dentro de um `Suspense` e chegam depois, sem travar as partes rápidas — é o que `renderToPipeableStream` do React viabilizou.

**Islands Architecture** inverte o padrão default: a página é HTML estático (ou renderizado no servidor) por padrão, e só componentes isolados e pequenos — as "ilhas" — carregam seu próprio JS e hidratam de forma independente. Tudo o resto permanece HTML inerte, com custo de JS zero. O Astro — framework que roda este blog — é hoje a implementação mais didática do padrão: cada diretiva `client:visible` ou `client:idle` num componente é uma decisão explícita de virar ilha ou continuar HTML puro.

**React Server Components** vão além de SSR: são componentes que rodam só no servidor (ou no build), nunca chegam a existir no bundle enviado ao cliente, e podem ler diretamente de banco de dados ou sistema de arquivos. A diferença central para SSR é que SSR ainda envia o JS do componente inteiro para o cliente hidratar depois — RSC nunca envia esse JS, porque o componente nunca roda no cliente. O resultado não é HTML puro, e sim um formato serializado próprio que o runtime do cliente reconcilia com os Client Components (marcados com `"use client"`) que cuidam da parte interativa. É o modelo por trás do App Router do Next.js.

Nenhum desses padrões é escolhido uma vez só para a aplicação inteira. Frameworks atuais deixam misturar por rota, e até por componente — a maior parte estática, algumas Server Components lendo dados direto, algumas ilhas interativas isoladas. Escolher entre eles é uma negociação caso a caso entre TTFB, frescor de conteúdo e custo de interatividade, não uma resposta única e definitiva.

## Padrões de performance e carregamento

O terceiro bloco lida com uma pergunta mais concreta: dado que o código já existe, como fazer o navegador baixar, processar e exibir a menor quantidade dele no menor tempo possível.

O primitivo por trás de quase toda estratégia de *code splitting* é o `import()` dinâmico — carregar um módulo em tempo de execução, sob demanda, em vez de estático no topo do arquivo (`import x from 'y'`, resolvido inteiro no bundle inicial). A partir dele, o livro descreve variações:

- **Route-based splitting** gera um chunk por rota — o padrão mais comum, já embutido no roteador da maioria dos frameworks, porque o usuário só precisa do código da página em que está.
- **Bundle splitting** separa código de biblioteca (React, lodash — muda raramente) do código da própria aplicação (muda a cada deploy), em chunks diferentes. Isso mantém o cache do navegador para as dependências intacto entre deploys, em vez de forçar o re-download de tudo só porque o hash do bundle da aplicação mudou.
- **Import on visibility** usa `IntersectionObserver` para adiar o carregamento do código de um componente até ele se aproximar da viewport — bom para widgets pesados abaixo da dobra, como um gráfico ou uma seção de comentários.
- **Import on interaction** adia o carregamento até uma ação do usuário disparar a necessidade — o código que abre um modal é minúsculo; o código do modal em si só é pago quando o usuário efetivamente clica para abrir.

**Tree shaking** depende de o bundler conseguir provar, por análise estática do grafo de `import`/`export`, que um trecho de código nunca é usado, para então removê-lo do bundle final. Isso só funciona com sintaxe ESM real — é exatamente por isso que `require` do CommonJS trava tree shaking: chamadas de `require` podem ser condicionais e dinâmicas, então o bundler não consegue provar, sem rodar o código, que nada ali é necessário.

**PRPL** — *Push, Render, Pre-cache, Lazy-load* — sequencia o carregamento em quatro passos: enviar (ou pré-carregar) os recursos críticos da rota inicial, renderizar essa rota inicial o mais rápido possível, pré-cachear as demais rotas via service worker em momento ocioso, e carregar sob demanda tudo o resto. Nasceu pensando em conexão móvel instável, mas a lógica de sequenciamento — priorizar o que está na tela agora, adiar o que não está — generaliza bem além do conjunto específico de APIs do navegador que o padrão usa.

**Preload** e **Prefetch** resolvem problemas opostos, apesar do nome parecido. Preload diz "preciso disso muito em breve, para a navegação atual" — alta prioridade, buscado imediatamente (uma fonte crítica, uma imagem de hero). Prefetch diz "posso precisar disso depois, numa navegação futura" — baixa prioridade, buscado só em tempo ocioso do navegador (o JS de uma página que o usuário provavelmente vai clicar a seguir). Trocar os dois — dar prioridade alta a algo que só talvez seja usado depois — piora performance porque compete por banda com recursos que realmente são críticos agora.

**List Virtualization** renderiza só os nós de DOM dos itens visíveis na viewport de rolagem (mais um pequeno buffer), reaproveitando esses nós conforme o usuário rola, em vez de manter milhares de itens montados o tempo todo. É a diferença entre uma lista de milhares de itens que trava a rolagem e uma que continua fluida independente do tamanho — react-window, react-virtualized e TanStack Virtual implementam essa ideia.

**Compressão de JavaScript** mistura dois mecanismos que resolvem metades diferentes do mesmo problema. Minificação — remover espaço em branco, encurtar nome de variável, eliminar código morto — acontece em build time e reduz o tamanho bruto do arquivo. Compressão gzip ou Brotli acontece em tempo de transferência, por cima do arquivo já minificado, e consegue reduzir ainda mais porque JS é texto altamente repetitivo. Um resolve custo de parse, o outro resolve custo de rede — vale aplicar os dois, não um no lugar do outro.

## O que fica

O fio condutor do livro é que padrão não é regra, é vocabulário — um nome compartilhado para um trade-off que o time já enfrenta na prática, com ou sem o nome. Os padrões de criação e comportamento herdados do catálogo clássico (Singleton, Factory, Observer, Mediator) ainda aparecem, mas boa parte já foi absorvida pela própria linguagem — módulo ES já é module pattern, protótipo já é prototype pattern.

A camada de padrões de componente React é a que melhor mostra um padrão "vencendo" os outros: HOC e Render Props não coexistem com Hooks como opções igualmente válidas hoje — foram, na prática, substituídos, e valem mais como contexto histórico para ler código antigo do que como escolha para código novo. Compound Pattern é a exceção, porque resolve um problema diferente (composição, não reaproveitamento de lógica) e continua vivo em qualquer biblioteca headless moderna.

A parte que mais compensa revisar de novo é a de renderização, porque é a que menos parou de evoluir — Server Components e streaming mudaram o vocabulário de trade-off nos últimos anos, e islands architecture segue ganhando espaço fora do nicho de conteúdo estático onde nasceu. Revisar por tema, e não por capítulo, deixa mais claro que design patterns, rendering patterns e performance patterns não são três livros diferentes: são a mesma pergunta — que trade-off eu aceito, e onde — respondida em três camadas distintas do stack.
