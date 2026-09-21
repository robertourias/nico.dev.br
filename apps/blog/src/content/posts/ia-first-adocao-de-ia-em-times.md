---
title: "IA First não é ferramenta: é como um time adota IA"
slug: "ia-first-adocao-de-ia-em-times"
date: "2026-09-20"
categories: ["ia", "business"]
status: "published"
featured: false
description: "Comprar licença de IA pro time inteiro não faz o time ser IA First. O que muda é processo, padrão compartilhado e o que se mede — não a ferramenta."
tags: ["ia-first", "adocao-de-ia", "times-de-engenharia", "processo", "lideranca-tecnica"]
coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
---

Liberar licença de IA pro time inteiro e esperar que ele vire "IA First" é como instalar Jira e esperar que o time vire ágil. A ferramenta chega no dia um. A mudança de como o time trabalha, se chegar, leva meses.

Escrevi antes sobre [como o dev individual trabalha IA First](/posts/dev-ia-first-7-pilares). Aqui o problema é outro: o que acontece quando dez pessoas fazem isso ao mesmo tempo, cada uma do seu jeito.

## O que "IA First" não é

Não é ter IA em todo lugar. Não é toda tarefa passar por um agente antes de passar por uma pessoa. E não é medir quantas pessoas do time usam a ferramenta.

IA First é uma decisão de ordem: **diante de um problema, a primeira pergunta é "o que a IA pode fazer aqui, e o que precisa continuar sendo julgamento humano?"** Não é a única pergunta. É a primeira. O resto do processo (revisão, testes, decisão de arquitetura) continua existindo. Só muda o ponto de partida.

Definido assim, fica claro por que licença não resolve. Ferramenta dá capacidade. Ordem de pensamento é hábito, e hábito de time se constrói com processo.

## O problema dos dez estilos

Imagine um time de dez devs, todos com o mesmo agente liberado. Sem nenhum combinado, você tem dez formas diferentes de usar.

Um escreve prompt de três linhas e aceita o que vier. Outro mantém um arquivo de contexto caprichado no projeto dele. Um terceiro usa só pra gerar teste. O quarto tentou uma vez, teve uma resposta errada e nunca mais abriu.

Nenhuma dessas pessoas está errada isoladamente. O problema aparece na soma:

- o código chega em revisão com padrões diferentes conforme quem gerou;
- quem tem bom contexto no projeto produz mais e ninguém aprende com essa pessoa;
- quem desistiu fica pra trás e passa a ver a IA como "coisa dos outros";
- a qualidade do resultado depende de quem pegou a tarefa, não do processo.

Isso é dívida de processo. A adoção parece estar acontecendo porque o uso é alto. Mas o time não ganhou uma prática compartilhada — ganhou dez práticas individuais.

## Padrão compartilhado antes de escala

A primeira coisa que muda o jogo é tirar o contexto da cabeça de cada pessoa e colocar no repositório.

Contexto do projeto (convenções, decisões de arquitetura, o que nunca fazer) versionado e lido pelo agente faz duas coisas ao mesmo tempo. O agente erra menos, porque parte do mesmo material pra todo mundo. E o time passa a ter um lugar onde discutir "como a gente trabalha com IA", com diff e revisão como qualquer outro código.

Depois vem o que se repete: revisão automatizada, checagens que bloqueiam merge, modelos de spec pra tarefas comuns. Cada um desses itens é uma decisão do time, escrita, que vale igual pra quem chegou hoje e pra quem está há três anos.

> **Teste simples:** se uma pessoa nova entrar amanhã, ela descobre como o time usa IA lendo o repositório ou perguntando pra alguém? Se for a segunda opção, o padrão ainda mora na cabeça de gente, não no processo.

## Onde a adoção costuma travar

Sem dado meu pra citar, o que sigo aqui é raciocínio, não pesquisa. Mas os pontos de atrito mais previsíveis são estes.

**Medo de parecer que não sabe.** Quem é sênior pode evitar perguntar como usar por receio de expor lacuna. Se o líder não mostrar as próprias dúvidas e erros com a ferramenta, ninguém mais vai mostrar.

**Expectativa de ganho imediato.** A curva de aprendizado existe. Se a cobrança for "por que a sprint não ficou 30% mais rápida?" logo no primeiro mês, o time aprende a esconder o uso, não a melhorar nele.

**Revisão sobrecarregada.** Se a geração acelera e a revisão continua igual, o gargalo só muda de lugar. Quem revisa vira o ponto de estrangulamento, e o time começa a aprovar por cansaço.

**Ninguém dono do assunto.** Se adoção é "responsabilidade de todos", na prática é de ninguém. Alguém precisa ser dono dos padrões compartilhados, mesmo que seja um papel rotativo.

## O que medir (e o que não medir)

Medir quantas pessoas usam a ferramenta mede acesso, não resultado. Medir linhas geradas por IA é pior: incentiva volume, e volume de código nunca foi sinônimo de valor.

O que faz mais sentido observar são sinais do processo que o time já tem:

- o tempo entre abrir e mergear uma mudança mudou?
- a taxa de retrabalho depois do merge subiu ou desceu?
- as revisões estão mais focadas em decisão e menos em detalhe mecânico?
- o pessoal novo chega ao primeiro PR mais rápido?

Nenhum desses números prova causalidade sozinho. Mas juntos contam se a prática está ajudando ou só aumentando o ruído.

## Começar pequeno, mas com dono

Um caminho razoável, sem virar programa corporativo:

1. Escolha um fluxo do time que se repete (revisão de PR, escrita de testes, documentação) e transforme em prática compartilhada.
2. Escreva o contexto desse fluxo no repositório.
3. Defina uma pessoa responsável por mantê-lo.
4. Rode por algumas semanas e ajuste com o que o time reportar, inclusive os erros.
5. Só então expanda pro próximo fluxo.

É menos empolgante que "transformação de IA em toda a empresa". Mas é o que deixa a prática viva depois que a novidade passa.

## O que fica

IA First em time é mais sobre engenharia de processo do que sobre IA. A ferramenta é a parte fácil de comprar. O difícil é decidir em conjunto como ela entra no trabalho, escrever essa decisão onde todo mundo lê e cuidar dela como cuida de qualquer outro padrão do time.

Se cada pessoa continua usando do próprio jeito, o time tem IA. Se o time inteiro parte da mesma pergunta e do mesmo contexto, aí sim ele é IA First.

## Referências

- [O Dev IA-First: 7 Pilares para Trabalhar com Agentes Sem Virar Refém Deles](/posts/dev-ia-first-7-pilares) — o lado individual do mesmo tema, neste blog.
