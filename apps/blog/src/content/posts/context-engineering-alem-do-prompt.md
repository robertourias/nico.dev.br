---
title: "Context Engineering: o que entra na janela do modelo"
slug: "context-engineering-alem-do-prompt"
date: "2026-09-20"
categories: ["ia", "dev"]
status: "published"
featured: false
description: "Prompt bom não salva contexto ruim. O que é context engineering, por que ele virou o gargalo de agentes de IA e quatro técnicas práticas pra decidir o que o modelo vê."
tags: ["context-engineering", "agentes", "llm", "claude-code", "harness"]
coverImage: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&q=80"
---

Você reescreve o prompt pela quinta vez. Troca "você é um especialista" por "aja como um sênior". Adiciona "pense passo a passo". A resposta continua errada.

Talvez o problema nunca tenha sido a frase. O modelo pode simplesmente não ter visto a informação que precisava, ou ter visto tanta coisa que a informação certa se perdeu no meio.

É esse o território do context engineering: decidir, com critério, **tudo o que o modelo enxerga** antes de responder. Não só a pergunta.

## Prompt engineering é um caso particular

Prompt engineering foca em *como pedir*: a redação da instrução, o formato da saída, os exemplos. Funciona bem quando a tarefa cabe numa única chamada, com tudo o que o modelo precisa dentro do texto que você escreveu.

Agentes quebram essa premissa. Um agente roda em loop: lê arquivos, chama ferramentas, recebe resultados, decide o próximo passo. A cada volta, o que está na janela muda. O prompt inicial vira uma fração pequena do total.

Context engineering é o nome pra disciplina de gerenciar esse todo. O prompt continua importando, mas passa a ser uma peça entre várias.

## O que compõe o contexto

Quatro fontes alimentam a janela do modelo:

- **Instruções** — regras, papel, formato de saída, restrições. É o system prompt e os arquivos de regras do projeto.
- **Conhecimento** — documentação, trechos de código, resultados de busca (o que o RAG entrega, por exemplo).
- **Ferramentas** — as definições do que o agente pode chamar e os resultados dessas chamadas.
- **Memória** — o histórico da conversa, o estado da tarefa, notas persistidas entre sessões.

![Quatro fontes de contexto passam por uma curadoria antes de entrar na janela do modelo](/images/context-engineering-alem-do-prompt-janela.svg)

O ponto do diagrama é o meio: entre as fontes e a janela existe uma decisão. Nada disso precisa entrar por inteiro, nem entrar agora.

## Por que mais contexto não é melhor

A intuição inicial é jogar tudo na janela e deixar o modelo se virar. Não funciona bem por dois motivos.

O primeiro é o limite físico: a janela é finita. O segundo é mais sutil: a atenção do modelo também é. Quanto mais texto competindo, mais difícil fica achar o que importa. Informação irrelevante não é neutra — ela dilui a relevante e pode puxar a resposta pro lado errado.

Vale pensar em contexto como orçamento, não como depósito. Cada token que entra precisa justificar o espaço que ocupa.

## Quatro técnicas que funcionam

### 1. Escrever contexto que o modelo não consegue deduzir

Instrução útil é a que carrega informação nova. "Escreva código limpo" não muda nada. "Erros de domínio estendem `DomainError` e nunca são capturados na camada de controller" muda.

Um bom teste: se você removesse essa linha, o modelo erraria? Se a resposta é não, a linha é ruído.

### 2. Carregar sob demanda, não por padrão

Em vez de despejar toda a documentação no início, deixe o agente buscar quando precisar. É o que o harness deste blog faz: o `CLAUDE.md` do projeto lista quais arquivos cada papel deve ler — quem escreve post lê as instruções do blog, quem mexe em backend lê as convenções de backend — e o resto só entra se a tarefa pedir.

O contexto de entrada fica pequeno e aponta pra onde está o resto. O modelo puxa o que falta.

### 3. Comprimir o que ficou velho

Numa sessão longa, o histórico cresce: saídas de comando, tentativas descartadas, arquivos lidos duas vezes. Boa parte não serve mais.

Resumir o que já foi decidido e descartar o resto devolve espaço e atenção. Ferramentas de agente costumam fazer isso automaticamente quando a janela enche, mas você também pode fazer de propósito — por exemplo, encerrar uma tarefa, salvar o estado em um arquivo e começar a próxima sessão limpa.

### 4. Isolar o trabalho pesado em subagentes

Uma busca ampla no código pode gerar dezenas de arquivos lidos. Se isso acontece na conversa principal, tudo fica lá. Delegando a busca a um subagente com janela própria, só a conclusão volta pro agente principal.

O ganho não é velocidade, é higiene: a janela principal recebe o resultado, não o processo.

## Um exemplo concreto

Imagine um agente que responde dúvidas sobre o processo de deploy do time (o cenário é ilustrativo).

Versão ingênua: cola os 40 documentos de engenharia no system prompt. Custa caro, o modelo se perde, e uma regra antiga contradiz uma nova.

Versão com curadoria: o system prompt tem só o papel e o formato da resposta. Uma ferramenta de busca traz os dois ou três trechos relevantes pra pergunta. Um arquivo curto de "decisões vigentes" resolve conflito entre documentos velhos e novos. O agente cita a fonte que usou.

A segunda versão não usa um modelo melhor. Usa um contexto melhor.

## Como saber se o contexto é o problema

Antes de reescrever o prompt de novo, pergunte:

1. O modelo teve acesso à informação necessária pra responder?
2. Essa informação estava fácil de achar, ou enterrada no meio de muita coisa?
3. Há informação contraditória na janela?
4. O que está lá dentro ainda é relevante pra etapa atual?

Se a resposta pra 1 é "não", nenhum prompt resolve. Se a 2, 3 ou 4 falham, o problema é curadoria.

## O que fica

Context engineering muda a pergunta. Em vez de "como escrevo o prompt perfeito?", passa a ser "o que o modelo precisa ver agora, e o que posso deixar de fora?".

Na prática, isso significa tratar contexto como um artefato de engenharia: versionado, revisado, medido pelo que muda na resposta. Regras do projeto num arquivo, conhecimento carregado sob demanda, histórico comprimido, trabalho pesado isolado.

Quem trabalha com agentes já faz parte disso sem chamar pelo nome. Dar nome ajuda a fazer de propósito.

## Referências

- Anthropic Engineering — *Effective context engineering for AI agents* (artigo do blog de engenharia da Anthropic sobre o tema).
- Documentação do Claude Code — arquivos `CLAUDE.md`, subagentes e gerenciamento de contexto.
- Neste blog: [RAG na prática: assistente de docs internas do time](/posts/rag-na-pratica-assistente-de-docs-do-time) e [Dev IA-First: os 7 pilares](/posts/dev-ia-first-7-pilares).
