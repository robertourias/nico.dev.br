---
title: "Cultura AI First: roadmap e onboarding em times de dev"
slug: "cultura-ai-first-roadmap-onboarding-times-dev"
date: "2026-09-25"
categories: ["ia", "business"]
status: "published"
featured: false
description: "Um roadmap em quatro fases pra implantar cultura AI First numa empresa, os guardrails que evitam o custo escondido e uma trilha de onboarding pra novo membro entrar no fluxo do time."
tags: ["ia-first", "cultura-de-engenharia", "onboarding", "adocao-de-ia", "times-de-engenharia"]
---

A pergunta que mais aparece quando uma empresa decide "ser AI First" é "qual ferramenta a gente compra?". É a pergunta mais fácil e a que menos decide. O que decide é o que existe em volta da ferramenta: testes, revisão, documentação, um jeito combinado de trabalhar.

Este post é um ponto de vista organizado em três partes: por que a base importa antes da ferramenta, um roadmap em fases pra implantar, e uma trilha pra um novo membro entrar no time já sabendo como as coisas funcionam. Duas ressalvas de honestidade. O roadmap e a trilha de onboarding são a minha proposta, não um método validado por pesquisa. E os dados que cito vêm de fontes que estão nas referências, sem número inventado.

Complementa dois posts anteriores: [O Dev IA-First: 7 Pilares](/posts/dev-ia-first-7-pilares), sobre a prática individual, e [IA First não é ferramenta](/posts/ia-first-adocao-de-ia-em-times), sobre por que licença não muda o time. Aqui o foco é o passo a passo e a entrada de gente nova.

## A base vem antes da ferramenta

O relatório DORA de 2025 sobre desenvolvimento assistido por IA descreve a IA como um **amplificador**: ela magnifica o que a organização já é. Times com boa base de engenharia ganham mais; times com processo frágil ganham mais volume do mesmo problema. O mesmo material aponta que maior adoção de IA aparece associada tanto a mais vazão de entregas quanto a mais instabilidade.

A leitura prática é desconfortável e útil. Antes de perguntar "como usar mais IA", vale perguntar "o que a IA vai amplificar aqui?". Uma checagem rápida de prontidão:

- Existem testes que pegam regressão, ou a confiança está na memória de quem escreveu?
- O CI roda sozinho e bloqueia merge quando falha?
- A revisão de código é um processo, ou depende de quem estiver livre?
- As decisões de arquitetura e as convenções estão escritas em algum lugar que não seja a cabeça de alguém?

Onde a resposta for "não", esse é o primeiro trabalho de AI First, mesmo que pareça não ter nada a ver com IA. Sem isso, o agente gera código mais rápido do que o time consegue verificar.

## O roadmap em quatro fases

Proponho quatro fases, cada uma terminando por um critério de saída e não por uma data. Prazo fixo empurra o time a declarar vitória antes da hora.

![Roadmap de cultura AI First em quatro fases: fundação, piloto, padronizar e escalar e medir, cada uma com o que fazer e o critério de saída](/images/cultura-ai-first-roadmap-onboarding-times-dev-roadmap.svg)

### Fase 1 — Fundação

Diagnosticar a base (a checagem acima) e escrever a **política de uso**: quais ferramentas são aprovadas, que tipo de dado nunca vai pra elas (segredos, dados de cliente), quem responde pelo quê. É o passo menos empolgante e o que evita o problema mais caro.

Uma opção de arquitetura vale considerar já aqui: centralizar o acesso aos modelos num ponto só. O Shopify, segundo a entrevista publicada pela Bessemer, padronizou a camada de baixo em vez de padronizar uma ferramenta: um proxy central por onde passam as requisições de IA, o que permite usar várias ferramentas ao mesmo tempo e dá controle de custo e de uso. Você não precisa copiar a solução, mas a ideia de controlar acesso e custo num ponto único vale a pena avaliar.

**Saída:** política escrita, diagnóstico da base e um ponto de partida de métricas (tempo de entrega, retrabalho, falhas em produção) pra comparar depois.

### Fase 2 — Piloto

Uma equipe, um fluxo que se repete (revisão de PR, escrita de testes, documentação), com duas ou três pessoas dispostas a puxar e uma pessoa **dona** do assunto. O objetivo do piloto não é ganho de velocidade, é aprender: o que funciona, o que quebra, onde o agente erra sistematicamente.

Aqui entra a cultura. A entrevista do Shopify descreve adoção por "empurrão cultural", não por mandato: a liderança mostra em público como usa, inclusive de forma leve (o VP de engenharia posta exemplos dizendo "olha como eu sou preguiçoso"), e o time vê o que é possível sem receber ordem. Na minha leitura, o ponto central é que **o líder mostra as próprias dúvidas e erros**. Se só aparecem os sucessos, quem tem dificuldade esconde.

**Saída:** o fluxo funciona com dono definido, e os aprendizados (inclusive os erros) estão escritos.

### Fase 3 — Padronizar

Tirar o que funcionou da cabeça das pessoas e colocar no repositório:

- **Contexto versionado.** Convenções, decisões de arquitetura, o que nunca fazer, num arquivo que o agente lê no início da sessão. No Claude Code, é o `CLAUDE.md` na raiz, e o `/init` gera um ponto de partida. Como qualquer arquivo do repo, passa por revisão.
- **Comandos e skills compartilhados.** O que o piloto repetiu vira comando reutilizável (por exemplo, `/review`, `/spec`), versionado junto com o código.
- **Quality gates.** Lint, testes e revisão automatizada que bloqueiam merge, iguais pra código escrito por gente e por agente.
- **Regra de revisão humana.** O Shopify diz, na mesma entrevista, que ainda não deixa a IA fazer merge de código sozinha: engenheiros seniores revisam os PRs. Adote uma regra explícita sobre isso, seja qual for.

**Saída:** uma pessoa nova consegue seguir o fluxo lendo o repositório, sem precisar que alguém explique de viva voz. É o mesmo teste do post anterior sobre times, e é o que liga esta fase ao onboarding.

### Fase 4 — Escalar e medir

Só agora expandir, fluxo a fluxo, repetindo o ciclo do piloto no próximo. E medir sem cair nas métricas de vaidade.

Volume de código gerado por IA e número de pessoas usando a ferramenta medem acesso, não resultado. O Shopify, segundo a mesma fonte, prefere **demos semanais**: o time mostra o que entregou, e a conversa sobre progresso parte de entrega real. Do lado quantitativo, faz sentido acompanhar vazão e instabilidade **juntos**, justamente porque o DORA aponta que os dois se movem com a adoção. Vazão sozinha pode esconder que a qualidade caiu.

**Saída:** a prática é revisada e podada com frequência. Contexto desatualizado e comando que ninguém usa mais viram ruído, e ruído piora o resultado do agente.

## Guardrails: onde o ganho vaza

O DORA descreve três tensões que valem virar regra do time, porque explicam por que a adoção às vezes não rende o que parecia.

**Imposto de verificação.** O tempo economizado escrevendo código vai parar em auditoria. Quem revisa fica com mais volume, e revisar código alheio é mais difícil do que escrever. A resposta prática é limitar o tamanho das mudanças (lotes pequenos) e mover parte do feedback pra antes da revisão, com checagens automáticas rodando enquanto o código é escrito.

**Paradoxo da expertise.** Aprender rápido com IA pode virar aprendizado superficial. O relatório fala em risco de degradação de habilidade a longo prazo quando se pula o esforço que constrói entendimento. O Shopify usa o termo "dívida de compreensão" (comprehension debt) pra isso e defende que a pessoa entenda o sistema "duas ou três camadas abaixo" de onde trabalha. Regra que sai daí: quem submete um PR precisa saber explicar o que está nele, seja quem for que escreveu.

**Lacuna entre protótipo e produção.** O agente acelera a primeira versão. O trabalho restante (casos de borda, integração com sistemas internos) continua existindo. Planeje prazo pra essa parte em vez de projetar a velocidade do protótipo pro projeto inteiro.

## Onboarding: como um novo membro entra no fluxo

O onboarding é o teste mais honesto de todo o resto. Se uma pessoa nova precisa perguntar tudo, o padrão do time ainda mora na cabeça de gente. Proponho uma trilha em quatro etapas.

![Trilha de onboarding em quatro etapas: antes do dia 1, primeiros dias, primeiro PR e devolver melhorias ao time](/images/cultura-ai-first-roadmap-onboarding-times-dev-onboarding.svg)

**1. Antes do dia 1.** Acessos e ferramentas de IA aprovadas prontos, a política de uso enviada pra leitura e um **buddy** definido: alguém do time, com tempo reservado, pra tirar dúvidas. Perder o primeiro dia esperando acesso é o jeito mais barato de estragar a primeira impressão.

**2. Primeiros dias: ler o contexto e explorar com o agente.** A pessoa começa pelo material versionado no repositório e usa o agente pra explorar a base de código: "onde fica a autenticação?", "como esse módulo é testado?". A regra é **conferir no código** o que o agente responde. O agente ajuda a se orientar, mas pode errar, e um novo membro ainda não sabe distinguir. Dúvida que sobrou vai pro buddy.

**3. Primeiro PR.** Uma tarefa pequena, com uma spec curta, feita usando o fluxo do time. Na revisão, a pessoa explica o que foi gerado, linha por linha, e a revisão é em par na primeira vez. É aqui que a "dívida de compreensão" é evitada desde o começo.

**4. Devolver.** O olhar novo é o melhor detector de documentação furada. O que confundiu ou faltou vira PR nas docs, e sugestões de melhoria de fluxo ou de prompt entram pra discussão. Onboarding que só consome o material nunca melhora o material.

### Um exemplo concreto: este repositório

Este projeto usa um `docs/` como memória persistente pra agentes, e o `CLAUDE.md` da raiz funciona como mapa: diz quais arquivos cada papel (planner, frontend, backend, revisor) deve ler antes de agir. Alguém novo, num repositório assim, poderia percorrer nesta ordem:

| Pra entender... | Onde olhar |
|---|---|
| Como o projeto está organizado e o que ler por papel | `CLAUDE.md` da raiz |
| Regras de negócio e produto | `docs/context/product.md` |
| Decisões técnicas e convenções | `docs/context/decisions.md`, `docs/context/conventions.md` |
| Em que ponto o trabalho está agora | `/retomar` (reconstrói o contexto da sessão anterior) |
| Como uma feature é planejada | `/spec` e os arquivos em `docs/specs/` |
| Como o código é revisado | `/review` e `docs/skills/quality.md` |

Não é uma lista pra decorar. É a demonstração de que, quando o contexto está no repositório, o onboarding vira "leia isto, depois pergunte o que sobrar", e o que sobrar é justamente o que falta documentar.

## Erros comuns

- **Começar pela ferramenta.** Licença sem base de engenharia amplifica o que já estava frágil.
- **Mandato sem exemplo.** Ordem de "usem IA" sem a liderança mostrar o próprio uso, com dúvidas e erros, gera uso escondido.
- **Medir volume.** Linhas geradas e número de usuários incentivam quantidade.
- **Escalar antes de padronizar.** Expandir uma prática que ainda vive na cabeça de três pessoas só multiplica o improviso.
- **Deixar a documentação envelhecer.** Contexto desatualizado piora o agente e confunde quem chegou.
- **Onboarding só de consumo.** Se ninguém devolve o que estranhou, o próximo novo membro tropeça no mesmo lugar.

## O que fica

Cultura AI First é, na prática, engenharia de processo com a IA dentro: uma base que aguenta amplificação, um caminho em fases com critério de saída, guardrails contra o custo escondido de verificar e entender, e um onboarding que trata documentação como produto.

O teste que resume tudo é o mesmo dos posts anteriores, só mais concreto: chega alguém novo na segunda-feira. Na sexta, essa pessoa abriu um PR que ela sabe explicar, seguindo o fluxo do time, e deixou a documentação um pouco melhor do que encontrou? Se sim, a cultura existe. Se não, o que falta está escrito na lista de dúvidas que ela levou pro buddy.

## Referências

- DORA. [State of AI-assisted Software Development 2025](https://dora.dev/dora-report-2025/) — relatório completo, com a visão da IA como amplificador.
- DORA. [Balancing AI tensions: moving from AI adoption to effective SDLC use](https://dora.dev/insights/balancing-ai-tensions/) — imposto de verificação, paradoxo da expertise e lacuna entre protótipo e produção.
- Bessemer Venture Partners. [Inside Shopify's AI-first engineering playbook](https://www.bvp.com/atlas/inside-shopifys-ai-first-engineering-playbook) — proxy central de LLM, demos semanais, adoção por exemplo e revisão humana obrigatória.
- Anthropic. [Documentação do Claude Code](https://code.claude.com/docs/en/overview) — `CLAUDE.md`, `/init` e memória do projeto.
- No blog: [O Dev IA-First: 7 Pilares](/posts/dev-ia-first-7-pilares) e [IA First não é ferramenta: é como um time adota IA](/posts/ia-first-adocao-de-ia-em-times).
