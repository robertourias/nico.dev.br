---
title: "Micro Frontends in Action"
slug: "micro-frontends-in-action-resumo"
date: "2026-09-04"
categories: ["livros", "architecture"]
status: "published"
featured: false
description: "Resumo organizado por temas de Micro Frontends in Action, de Michael Geers — composição client-side x server-side, roteamento, comunicação sem estado compartilhado e os casos reais de IKEA, Zalando e Spotify."
tags: ["micro-frontends-in-action", "michael-geers", "micro-frontends", "arquitetura-frontend", "resenha"]
coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80"
---

Michael Geers publicou **Micro Frontends in Action** pela Manning em 2020, depois de anos trabalhando na reformulação do frontend da IKEA em times independentes. O livro não vende micro frontends como bala de prata — ele parte de um incômodo real: microsserviços resolveram escala de time no backend, mas a maioria das empresas continuou empilhando todo mundo no mesmo frontend monolítico, disputando o mesmo repositório e o mesmo deploy.

Reorganizei o conteúdo por tema em vez de seguir a ordem dos capítulos, porque o livro intercala teoria com implementação de exemplo o tempo todo, e junto por assunto ajuda mais como material de consulta.

## O problema que motiva o livro

Backend escalou em times autônomos com microsserviços: cada time dono de um domínio, do banco ao deploy, sem precisar coordenar release com ninguém. O frontend, na maioria das empresas, não acompanhou — continuou sendo uma SPA única, um design system único, um pipeline de build único, mesmo quando o backend por trás já estava fatiado em vinte serviços.

Geers chama isso de "fronteira invisível": o time é dono do serviço de checkout de ponta a ponta, exceto pela última milha — a tela que o usuário realmente vê, que pertence a um time de frontend compartilhado e genérico. Toda mudança visual vira fila de PR num repositório que ninguém realmente é dono, revisado por gente sem contexto do domínio.

Micro frontends é a proposta de estender a fronteira do time até a interface: cada time entrega sua fatia vertical completa — API, lógica de negócio e a parte da tela que representa esse domínio — de forma independente, sem esperar deploy de ninguém.

## Os princípios que sustentam a arquitetura

O livro define a abordagem por um conjunto de princípios, não por uma stack específica — é o que diferencia micro frontends de "usar iframe" ou "usar Web Components":

**Seja agnóstico de tecnologia.** Cada time escolhe (ou troca) seu próprio framework sem negociar com os outros times. Isso é o que remove o gargalo de migração conjunta — Angular pode conviver com React na mesma página.

**Isole o código de cada time.** Nada de importar utilitário interno de outro time por atalho. Se todo mundo depende do módulo interno de todo mundo, a independência de deploy é ilusão.

**Estabeleça namespace por time.** Prefixo em classe CSS, em custom element, em variável de estado global — convenção simples que evita colisão quando várias equipes publicam no mesmo domínio.

**Prefira recursos nativos do browser a APIs próprias.** Custom Events em vez de um pub/sub proprietário, links `<a>` em vez de um router customizado entre micro frontends — reduz o acoplamento a uma biblioteca de integração que todo mundo precisaria adotar.

**Construa um site resiliente.** Se o micro frontend de recomendações cair, a página de produto continua funcionando sem recomendação — não deve derrubar o checkout inteiro. Isso empurra a arquitetura para renderização progressiva, não para uma SPA totalmente dependente de JS para existir.

## Composição no servidor

A primeira metade técnica do livro trata de como montar a página final a partir dos pedaços — e a opção que Geers defende com mais convicção é composição no servidor, via **Edge Side Includes (ESI)** ou uma camada de composição dedicada (o livro usa o **Tailor**, projeto open source da Zalando, como implementação de referência).

A mecânica: cada micro frontend expõe um endpoint HTTP que devolve o fragmento de HTML já renderizado — sem JS necessário para o conteúdo existir. Uma camada de composição (um proxy reverso com suporte a ESI, ou um servidor Node como o Tailor) busca os fragmentos de cada time em paralelo e monta a página completa antes de mandar pro browser.

A vantagem que o livro mais enfatiza é performance percebida: o usuário recebe HTML pronto no primeiro request, sem cascata de "baixa o shell vazio → baixa JS → hidrata → busca dados → renderiza". É também o que sustenta o princípio de resiliência: se um fragmento falha, a composição server-side simplesmente omite aquele pedaço ou mostra um fallback, sem quebrar o resto da página.

O custo é operacional: cada time precisa manter um servidor capaz de renderizar HTML (SSR de verdade, não só servir um bundle estático), e a camada de composição vira peça de infraestrutura compartilhada que alguém precisa ser dono.

## Composição no cliente

A segunda técnica é montar a página no browser: um shell carrega e a cada micro frontend é responsável por se "plugar" nesse shell via JavaScript — seja escrevendo direto no DOM, seja através de Web Components customizados que encapsulam o fragmento.

O livro trata Web Components como a opção client-side mais alinhada aos princípios da arquitetura: Shadow DOM isola estilo automaticamente (resolve o problema de CSS vazando entre times sem precisar de convenção manual), e Custom Elements dão uma interface de integração nativa do browser, sem depender de um framework de orquestração próprio.

A alternativa mais simples — e mais frágil — é cada time expor um bundle JS que o shell carrega dinamicamente via `<script>` e monta num container `<div>`. Funciona, mas sem Shadow DOM o isolamento de CSS e de estado vira responsabilidade de convenção e disciplina de time, não de garantia técnica.

O trade-off central de composição client-side: mais controle sobre interatividade rica e transições sem reload de página, ao custo de depender de JavaScript pra existir e carregar um "custo de plataforma" — o runtime de orquestração que todo micro frontend paga, mesmo os mais simples.

## Comparando as técnicas: server-side x client-side

O livro resiste à tentação de eleger um vencedor único e propõe critério de decisão por contexto, não por preferência:

Se o produto é majoritariamente conteúdo — e-commerce, blog, marketplace — onde SEO e tempo até o primeiro conteúdo visível importam mais que interatividade densa, composição server-side tende a vencer. Se o produto é uma ferramenta interna ou um dashboard onde o usuário já está logado, JS já é pré-requisito, e a interação é o produto, composição client-side compensa o custo de runtime.

Também é possível — e o livro mostra isso explicitamente — misturar as duas: composição server-side pra montar o esqueleto da página com SEO e performance, e alguns micro frontends específicos (o carrinho, o widget de chat) hidratando via Web Components por cima, só onde interatividade rica realmente compensa o custo.

## Roteamento entre micro frontends

Com múltiplos times donos de pedaços diferentes da navegação, o livro defende roteamento simples baseado em URL e no próprio mecanismo de navegação do browser, não um router client-side compartilhado entre todos os times.

Na composição server-side isso é quase de graça: cada rota mapeia pra um serviço dono daquele caminho, e navegar entre seções diferentes é um link `<a>` normal — recarrega a página, mas cada time é autônomo sobre o que acontece dentro da sua rota. Na composição client-side, o desafio é maior: times acabam precisando de um roteador compartilhado no shell só pra decidir qual micro frontend montar em qual URL, o que reintroduz uma dependência comum que o resto da arquitetura tenta evitar — o livro recomenda manter esse roteador o mais burro possível, sem lógica de negócio nenhuma.

## Comunicação sem estado compartilhado

Esse é o ponto onde o livro é mais categórico: micro frontends não devem compartilhar estado em runtime da forma como componentes React compartilham Redux. Cada micro frontend é dono do seu próprio estado; comunicação entre eles acontece por eventos, não por acesso direto a dado de outro time.

O mecanismo recomendado é **Custom Events** nativos do browser — um time dispara `carrinho:item-adicionado` no `window`, e qualquer outro micro frontend interessado escuta, sem que o time do carrinho precise saber quem está ouvindo nem o que o listener faz com a informação. Isso preserva a independência de deploy: o time do carrinho pode mudar sua implementação interna livremente, contanto que continue emitindo o mesmo evento com o mesmo shape de dado — o contrato é o evento, não o código.

Pra dado que precisa persistir entre navegações (usuário logado, itens no carrinho), o livro empurra a responsabilidade pro backend — cada micro frontend busca o que precisa da própria API ou de uma BFF, em vez de ler de um estado global client-side que amarraria todo mundo à mesma árvore de estado.

## BFF como parceiro da arquitetura

O padrão **Backend for Frontend** aparece no livro como companheiro natural de micro frontends: cada time de frontend tem sua própria camada de agregação de API, moldada exatamente pras necessidades daquela tela, em vez de todo mundo compartilhar uma API genérica de propósito geral que ninguém consegue evoluir sem quebrar alguém.

Isso fecha o círculo da fatia vertical: o time não é dono só do fragmento de HTML ou do componente React, é dono da cadeia inteira até o dado — BFF incluso. É essa verticalização de ponta a ponta que faz a analogia com microsserviços realmente valer, e não só "várias SPAs na mesma página".

## Organização de times: Conway's Law na prática

O livro é explícito que micro frontends é, antes de tudo, uma resposta a um problema organizacional, e cita a Lei de Conway sem rodeio: a arquitetura de software tende a espelhar a estrutura de comunicação da organização que a constrói. Se os times são cortados por domínio de negócio de ponta a ponta, a arquitetura tende naturalmente a fragmentar dessa forma — micro frontends é o nome técnico pra deixar isso acontecer no frontend também, em vez de forçar todo mundo de volta pro mesmo repositório por causa da UI.

O contraponto que o próprio Geers levanta: isso não serve pra qualquer organização. Time pequeno, produto único, sem fronteira de domínio clara — o custo de coordenação entre múltiplos micro frontends supera o ganho de autonomia. O livro é direto sobre isso: se cabe num time só, não fatie.

## Os casos reais que o livro cita

Boa parte da credibilidade do livro vem de casos de produção reais, não só teoria. IKEA (onde o próprio Geers trabalhou) é o caso mais detalhado — composição server-side via Tailor pra montar o site de e-commerce a partir de fragmentos de times diferentes. Zalando aparece tanto como caso quanto como origem técnica (o Tailor nasceu lá). Spotify é citado pelo modelo de "squads" donos de features verticais no client desktop, um dos exemplos mais antigos de pensamento parecido fora do contexto web. HelloFresh e DAZN aparecem como exemplos de composição client-side com Web Components em produtos mais orientados a interação.

O padrão comum entre os casos: nenhuma empresa adotou micro frontends por modismo arquitetural — todas chegaram lá depois de sentir na pele o gargalo de um frontend monolítico compartilhado por múltiplos times de produto crescendo em paralelo.

## O que envelheceu e o que ainda vale

O livro foi escrito antes do Module Federation do Webpack 5 se popularizar, então a composição client-side que ele descreve — Web Components e bundles carregados via script tag — é mais artesanal do que o que dá pra montar hoje com Module Federation nativo. Quem está decidindo essa parte da arquitetura em 2026 vai encontrar ferramentas mais maduras do que as que o livro apresenta como estado da arte.

O que não envelheceu é a camada de decisão que vem antes da ferramenta: os princípios de isolamento e agnosticismo de tecnologia, o critério de quando composição server-side compensa sobre client-side, a recusa a compartilhar estado em runtime entre times, e principalmente o diagnóstico de que isso é primeiro um problema organizacional e só depois um problema técnico. Ferramenta de composição troca a cada dois anos; a pergunta "esse corte de responsabilidade reflete como os times realmente trabalham" continua sendo a que decide se a arquitetura vai sobreviver ao primeiro ano de produção.
