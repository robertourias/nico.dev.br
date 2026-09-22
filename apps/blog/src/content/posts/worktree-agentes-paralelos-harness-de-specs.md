---
title: "Worktrees e agentes paralelos: harness guiado pela spec"
slug: "worktree-agentes-paralelos-harness-de-specs"
date: "2026-09-21"
categories: ["ia", "dev"]
status: "published"
featured: false
description: "Como usar git worktree pra isolar agentes rodando em paralelo e montar um harness que lê as ondas da spec e cria um agente por tarefa."
tags: ["git-worktree", "agentes", "claude-code", "spec-driven-development", "harness"]
---

Dois agentes editando o mesmo arquivo ao mesmo tempo não é paralelismo. É uma corrida. Quem grava por último ganha, e o outro só descobre quando o teste quebra num código que ele nunca escreveu.

Meu `/hands-on` já dispara agentes em paralelo. Ele lê a spec, monta o grafo de ondas e manda uma tarefa independente pra cada subagente. O que ele não faz é isolar esses agentes: todos trabalham na mesma pasta. Este post é sobre fechar esse buraco com `git worktree` e transformar o resultado num harness que já nasce da spec.

## O problema: paralelismo sem isolamento

Imagine a onda 2 de uma spec: a T2 cria o endpoint de busca no backend e a T3 monta o campo de autocomplete no frontend. Na spec, as duas são independentes. Na prática, as duas rodam na mesma árvore de trabalho.

![Comparação entre dois agentes escrevendo na mesma pasta, com risco de colisão em arquivos compartilhados, e dois agentes cada um em seu worktree, com um único .git compartilhado](/images/worktree-agentes-paralelos-harness-de-specs-isolamento.svg)

Três coisas quebram nesse cenário:

- **O `git status` vira uma sopa.** Mudanças da T2 e da T3 aparecem juntas. Quando um agente vai commitar, ele precisa adivinhar o que é dele.
- **Teste e lint rodam sobre código pela metade.** O agente da T3 executa a suíte enquanto o da T2 ainda está no meio de um refactor. A falha não tem nada a ver com a T3, mas ela é quem tenta consertar.
- **Só existe uma branch.** Não dá pra ter um commit por tarefa em branches separadas se todo mundo compartilha o mesmo `HEAD`.

O paralelismo em si funciona. O que falta é cada agente ter o seu próprio chão.

## O que é um worktree

Um repositório Git tem um diretório `.git` (objetos, branches, histórico) e uma árvore de trabalho (os arquivos que você edita). Normalmente é um pra um. O `git worktree` quebra essa relação: você cria árvores de trabalho adicionais, cada uma numa pasta própria e numa branch própria, todas apontando pro **mesmo** `.git`.

```bash
# nova pasta, nova branch, partindo da branch da feature
git worktree add ../wt-t2 -b feat/onboarding-t2 feat/onboarding

git worktree list      # mostra todas as árvores ligadas a este repo
git worktree remove ../wt-t2
git worktree prune     # limpa registros de pastas que sumiram
```

Comparado a clonar o repositório de novo, você não duplica o histórico: os objetos são compartilhados, então criar um worktree é rápido. E um commit feito em qualquer um deles já fica visível pros outros, porque o banco é o mesmo.

Três regras que importam pro que vem a seguir:

1. **Uma branch só pode estar em checkout em um worktree por vez.** O Git recusa o segundo. Isso ajuda: dois agentes não conseguem, por acidente, trabalhar na mesma branch.
2. **Só arquivos versionados vêm junto.** `node_modules`, `.env` e qualquer coisa no `.gitignore` não são copiados. Cada worktree novo precisa do seu setup.
3. **Cada worktree tem o próprio índice e o próprio `HEAD`.** É isso que resolve o `git status` misturado.

## Onde o `/hands-on` está hoje

O comando `docs/commands/hands-on.md` segue este contrato:

1. Lê a spec e exige `Status: approved`.
2. Extrai a tabela **Ordem de Execução & Dependências** e os campos `Depende de:` e `Paralelizável com:` de cada tarefa.
3. Resolve as ondas: cada onda reúne as tarefas cujas dependências já terminaram.
4. Executa onda a onda. Com 2+ tarefas independentes na mesma onda, dispara um subagente por tarefa.
5. Só avança quando todos os critérios de aceite da onda estão `[x]`. Se uma tarefa falha, para tudo.

O grafo já existe, e é o que o `/spec` produz: o template obriga a subseção de ondas e os campos de dependência justamente porque o `/hands-on` consome isso. Falta o passo 4 dizer **onde** cada subagente trabalha. Hoje a resposta é "na pasta atual".

## O harness com worktrees

A ideia é acrescentar uma responsabilidade ao orquestrador: além de resolver as ondas, ele prepara o chão de cada tarefa e integra o resultado antes de abrir a onda seguinte.

![Fluxo do harness: a spec aprovada entra no orquestrador, que resolve três ondas; cada tarefa roda em um worktree próprio e, ao fim de cada onda, os resultados são integrados na branch da feature com testes](/images/worktree-agentes-paralelos-harness-de-specs-ondas.svg)

O ciclo de uma onda fica assim:

1. **Base.** A onda parte do estado atual da branch da feature, já com o que as ondas anteriores integraram.
2. **Um worktree por tarefa.** Pra cada tarefa da onda, o orquestrador cria `wt-<tarefa>` numa branch `feat/<spec>-<tarefa>`.
3. **Setup.** Instala dependências e copia o que não é versionado e é necessário (variáveis de ambiente de desenvolvimento, por exemplo).
4. **Um agente por tarefa.** Cada subagente recebe a tarefa, o escopo e o caminho do seu worktree. Ele carrega só o contexto do seu papel (`/back` ou `/front`), como já acontece hoje.
5. **Espera.** A onda só termina quando todos os agentes retornam com os critérios marcados.
6. **Integração.** O orquestrador faz o merge de cada branch na branch da feature e roda os testes no resultado combinado.
7. **Limpeza.** Remove os worktrees e as branches de tarefa e abre a próxima onda a partir da branch integrada.

O passo 6 é o que justifica o desenho. Cada agente testa a própria tarefa isolada, mas é o merge que mostra se as duas juntas funcionam. O conflito, se existir, aparece num ponto controlado, e não no meio do trabalho de alguém.

A regra que já existe continua valendo: falhou uma tarefa, a onda para. A onda seguinte não roda sobre estado quebrado.

## Duas formas de implementar

**Pela ferramenta.** O Claude Code aceita `isolation: "worktree"` na chamada do subagente: ele cria um worktree temporário pro agente e limpa sozinho se nada foi alterado. Pro `/hands-on`, a mudança é uma linha no passo de paralelismo:

```md
2. **Paralelismo isolado:** quando a onda tiver 2+ tarefas independentes,
   dispare um subagente por tarefa com `isolation: "worktree"`.
   Ao fim da onda, integre as branches na branch da feature e rode os
   testes antes de iniciar a próxima.
```

O repositório já ignora `.claude/worktrees/*` no `.gitignore`, então esses worktrees não sujam o `git status` da pasta principal.

**Pelo script.** Quando você quer controlar o nome das branches, o setup de cada árvore ou o momento do merge, o orquestrador chama o Git direto:

```bash
SPEC=onboarding
BASE=feat/$SPEC

# onda 2: T2 e T3 em paralelo
for T in t2 t3; do
  git worktree add ../wt-$SPEC-$T -b $BASE-$T $BASE
  (cd ../wt-$SPEC-$T && pnpm install --frozen-lockfile)
done

# ... agentes rodam, cada um dentro do seu worktree ...

# integração
git switch $BASE
git merge --no-ff $BASE-t2
git merge --no-ff $BASE-t3
pnpm install && pnpm test

# limpeza
for T in t2 t3; do
  git worktree remove ../wt-$SPEC-$T
  git branch -d $BASE-$T
done
```

Prefiro começar pelo caminho da ferramenta e só descer pro script se precisar de algo que ela não dá.

## O que o worktree não resolve

Isolamento tira o atrito do meio da tarefa. Não transforma tarefas dependentes em independentes.

**"Independente" precisa ser verdade.** A spec declara `Depende de:` e `Paralelizável com:`, mas quem escreve isso é o planner, e ele pode errar. Duas tarefas de uma mesma onda que editam `packages/types` vão conflitar no merge do mesmo jeito. Um passo a mais no template ajudaria: cada tarefa listar os **arquivos ou pastas que pretende tocar**, e o orquestrador checar interseção antes de montar a onda. Interseção não vazia, tarefas em ondas separadas. Isso é proposta minha; o template atual não tem esse campo.

**Lockfile é conflito garantido.** Se duas tarefas adicionam dependências, o `pnpm-lock.yaml` vai divergir. Não vale a pena o agente resolver isso na mão. Resolva o conflito no `package.json`, apague o lockfile da resolução e deixe o orquestrador rodar `pnpm install` depois do merge.

**Setup por worktree tem custo.** Como `node_modules` não vem no worktree, cada um precisa de instalação. Com pnpm o custo é baixo porque os pacotes vêm de um store global por hard link, mas ainda é tempo somado em cada tarefa, e em projeto com build pesado isso pesa.

**Paralelo compra tempo, não tokens.** N agentes são N contextos rodando. O gasto total é parecido ou maior, e o que muda é o relógio. Numa onda de uma tarefa só, o ganho é zero.

**O ganho depende do formato do grafo.** Uma spec toda em cadeia (T1 → T2 → T3 → T4) roda sequencial, com ou sem worktree. Não existe número universal de aceleração: ele sai da largura das suas ondas, e essa largura é decisão de quem escreveu a spec.

## O que fica

O harness não muda o que o agente faz. Muda onde ele faz e quando o trabalho dele se encontra com o dos outros. A spec continua sendo o contrato, o grafo de ondas continua mandando na ordem, e o worktree entra como a camada que faz o "em paralelo" da spec ser seguro na prática.

O gargalo se desloca. Com o isolamento resolvido, a qualidade do grafo passa a definir quanto você ganha: dependências bem declaradas, tarefas que não disputam os mesmos arquivos, ondas largas o bastante. Vale mais gastar o tempo revisando a Ordem de Execução da spec antes do gate de aprovação do que otimizando o script de worktree.

Pra quem já usa o scaffold, o caminho é curto: o grafo existe, o comando de execução existe, e a mudança é um passo de isolamento e um passo de integração. Sobre o scaffold em si, veja [Scaffold IA-Projetos: orquestrando specs com agentes](/posts/scaffold-ia-projetos-orquestrando-specs-com-agentes).

## Referências

- Git. [`git-worktree`](https://git-scm.com/docs/git-worktree) — documentação oficial (criação, remoção, restrição de uma branch por worktree).
- pnpm. [Motivation](https://pnpm.io/motivation) — content-addressable store e hard links.
- Repositório do projeto: `docs/commands/hands-on.md` (execução por ondas) e `docs/specs/spec-template.md` (Ordem de Execução & Dependências, `Depende de:`, `Paralelizável com:`).
