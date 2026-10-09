---
title: "Spec Kit vs OpenSpec: SDD na prática"
slug: "spec-kit-vs-openspec-sdd"
date: "2026-10-08"
categories: ["dev", "ia"]
status: "published"
featured: false
description: "O que é Spec-Driven Development, como Spec Kit e OpenSpec colocam a ideia em prática com agentes de IA e um comparativo lado a lado dos dois fluxos de trabalho."
tags: ["spec-driven-development", "spec-kit", "openspec", "agentes-de-ia", "claude-code"]
---

Você descreve uma feature em duas linhas para um agente de código e ele devolve algo que funciona, mas que não é exatamente o que você tinha na cabeça. Não por falta de capacidade: a conversa inteira cabia numa frase, e o resto o agente adivinhou.

Spec-Driven Development (SDD) é a resposta para esse buraco. Em vez de conversar até o código "ficar certo", você escreve primeiro um documento que diz o que deve acontecer, revisa esse documento, e só então deixa o agente implementar. A spec vira a fonte da verdade; o código é consequência.

Já escrevi sobre [a prática do SDD com um exemplo completo](/posts/spec-driven-development-exemplo-pratico), de uma spec de cupom de desconto até os testes. Este post olha para o outro lado: duas ferramentas que automatizam o fluxo, **Spec Kit** e **OpenSpec**, e o que muda no dia a dia de quem usa cada uma.

## SDD em um parágrafo

A ideia é separar três perguntas que normalmente se misturam no prompt: **o que** construir (a spec), **como** construir (o plano técnico) e **em que ordem** (as tarefas). Cada resposta vira um arquivo versionado no repositório, e você revisa cada um antes de avançar.

O ganho aparece em dois lugares. O primeiro é a revisão: ler uma spec de uma página é muito mais barato do que descobrir uma suposição errada num diff de 800 linhas. O segundo é a memória: o agente de amanhã, ou o colega novo, lê os mesmos arquivos e parte do mesmo entendimento.

Spec Kit e OpenSpec concordam nisso. Divergem em uma pergunta de fundo: a spec descreve **uma feature a ser construída** ou **o comportamento atual do sistema**?

## Spec Kit

O Spec Kit é o toolkit de SDD mantido pelo GitHub. Você instala uma CLI (`specify`) que prepara o projeto, e o trabalho acontece por *slash commands* dentro do seu agente (Claude Code, Copilot, Gemini e outros).

```bash
# instala a CLI (requer uv)
uv tool install specify-cli

# prepara o projeto atual para o agente escolhido
specify init . --integration claude
```

### Como funciona

O fluxo tem uma etapa de fundação e quatro etapas por feature, cada uma com um comando próprio:

1. `/speckit.constitution` define os princípios do projeto: regras de qualidade, restrições, o que nunca pode quebrar. Ela governa as etapas seguintes, então vale escrever só o que já é verdade para o time.
2. `/speckit.specify` recebe a descrição da feature e gera a spec, focada no **o quê** e no **porquê**, sem escolher tecnologia.
3. `/speckit.plan` recebe a stack e as restrições técnicas e gera o plano de implementação, junto com artefatos de apoio.
4. `/speckit.tasks` quebra o plano em uma lista de tarefas ordenadas.
5. `/speckit.implement` executa as tarefas.

Existem também comandos opcionais de refinamento, como `/speckit.clarify` (o agente levanta as ambiguidades da spec antes do plano) e `/speckit.analyze` (confere a consistência entre spec, plano e tarefas). Vale rodá-los quando a feature não é trivial.

Cada feature ganha a própria pasta, numerada:

```text
specs/003-cupom-desconto/
├── spec.md          # o que e por quê
├── plan.md          # como
├── research.md      # decisões técnicas pesquisadas
├── data-model.md    # entidades
├── quickstart.md    # como validar
├── contracts/       # contratos de API
└── tasks.md         # passos de implementação
```

### Exemplo de uso

Imagine a feature de cupom de desconto no carrinho. A sessão fica assim:

```text
/speckit.constitution Todo cálculo monetário usa centavos inteiros.
Nenhum total pode ficar negativo. Testes acompanham cada mudança.

/speckit.specify Cupom de desconto no carrinho. O cliente informa um código
e o total é recalculado. Cupom pode ser percentual ou valor fixo. Um cupom
fixo maior que o subtotal não pode gerar total negativo.

/speckit.clarify

/speckit.plan Next.js no front, NestJS no back, Postgres.

/speckit.tasks

/speckit.implement
```

Entre um comando e outro você abre o arquivo gerado e lê. Se o `spec.md` supôs que o cupom acumula com promoção, é ali que você corrige, antes de existir plano ou código. O comando `/speckit.clarify` existe justamente para trazer essas suposições à tona em forma de perguntas.

Repare que o exemplo incorpora o bug clássico do cupom fixo em carrinho pequeno direto na constituição e na spec. É o tipo de regra que o SDD quer ver escrita antes do código.

## OpenSpec

O OpenSpec parte de outra premissa: a maioria do trabalho real não é feature nova num projeto vazio, é **mudança em um sistema que já existe**. Por isso ele mantém dois lugares separados, o que o sistema faz hoje e o que está sendo proposto.

```bash
# requer Node.js 20.19.0 ou superior
npm install -g @fission-ai/openspec@latest

# dentro do projeto
openspec init
```

O `init` pergunta quais ferramentas de IA você usa e instala os comandos correspondentes.

### Como funciona

A estrutura de pastas mostra a ideia:

```text
openspec/
├── specs/                  # fonte da verdade: comportamento atual
│   └── <dominio>/spec.md
└── changes/                # mudanças propostas, uma pasta cada
    └── <nome-da-mudanca>/
        ├── proposal.md     # por quê e o quê
        ├── design.md       # como
        ├── tasks.md        # checklist
        └── specs/          # deltas: o que muda na spec principal
```

O ciclo usa comandos `/opsx:*`:

- `/opsx:explore` é opcional: você conversa com o agente para entender o problema antes de se comprometer com uma mudança.
- `/opsx:propose <nome>` cria a pasta da mudança com proposta, design, tarefas e specs delta.
- `/opsx:apply` implementa as tarefas.
- `/opsx:archive` finaliza: a pasta da mudança vai para `changes/archive/` com prefixo de data, e os deltas são **mesclados** na spec principal.

O detalhe central é o **delta**. Em vez de reescrever a spec inteira, a mudança declara só o que entra, o que muda e o que sai:

```markdown
## ADDED Requirements

### Requirement: Cupom de desconto
O sistema SHALL aplicar o cupom informado ao subtotal do carrinho.

#### Scenario: Cupom fixo maior que o subtotal
- **WHEN** o cliente aplica um cupom fixo maior que o subtotal
- **THEN** o total do carrinho é zero, nunca negativo

## MODIFIED Requirements
...
```

Cada requisito vem com cenários em formato `WHEN`/`THEN`, que já são quase um roteiro de teste.

### Exemplo de uso

Com o carrinho já em produção, a mudança "adicionar cupom" seria:

```text
/opsx:explore
/opsx:propose add-cupom-desconto
/opsx:apply
/opsx:archive
```

Depois do `archive`, `openspec/specs/carrinho/spec.md` passa a descrever o carrinho **com** cupom. Quem abrir o repositório em seis meses lê a spec do comportamento atual, sem precisar reconstruí-lo a partir de dez pastas de features antigas.

## Os dois fluxos lado a lado

![Dois fluxos de SDD em linhas paralelas: Spec Kit vai de constitution a implement dentro de uma pasta por feature, e OpenSpec vai de propose a archive, terminando com a spec principal atualizada](/images/spec-kit-vs-openspec-sdd-fluxos.svg)

A diferença de forma é simples: o Spec Kit é uma linha reta que produz uma pasta por feature. O OpenSpec é um ciclo que termina devolvendo o resultado para uma spec única e viva.

## Comparativo

| Aspecto | Spec Kit | OpenSpec |
|---------|----------|----------|
| Mantenedor | GitHub | Fission AI |
| Popularidade (estrelas no GitHub, 08/10/2026) | ≈ 140 mil | ≈ 71 mil |
| Instalação | CLI `specify` (Python, via `uv`) | CLI `openspec` (Node.js 20.19+, via `npm`) |
| Premissa | Construir uma feature a partir da intenção | Mudar um sistema que já tem comportamento definido |
| Comandos | `/speckit.constitution`, `specify`, `plan`, `tasks`, `implement` | `/opsx:explore`, `propose`, `apply`, `archive` |
| Regras do projeto | Etapa própria (`constitution`) | Sem etapa dedicada; há um `config.yaml` opcional de projeto |
| Onde ficam os arquivos | `specs/NNN-feature/`, uma pasta por feature | `openspec/specs/` (estado atual) e `openspec/changes/` (propostas) |
| O que a spec descreve | A feature a ser construída | O comportamento atual do sistema |
| Plano técnico | `plan.md` com pesquisa, modelo de dados e contratos | `design.md` dentro da mudança |
| Como a mudança entra na spec | Não há mescla: cada feature tem sua pasta | Deltas (`ADDED`/`MODIFIED`/`REMOVED`) mesclados no `archive` |
| Cenários de teste | User stories com cenários de aceite | Requisitos com cenários `WHEN`/`THEN` |
| Peso do processo | Mais etapas e mais artefatos por feature | Menos etapas e arquivos mais enxutos |
| Melhor encaixe | Projeto novo ou feature grande, do zero | Projeto existente, mudanças incrementais |

## Qual é mais popular hoje

O Spec Kit. Em 08/10/2026, o repositório `github/spec-kit` tinha cerca de 140 mil estrelas e 12,5 mil forks, contra cerca de 71 mil estrelas e 4,9 mil forks do `Fission-AI/OpenSpec` (números da API do GitHub, consultados no dia). Os dois nasceram com poucas semanas de diferença, em agosto de 2025, então o Spec Kit abriu vantagem de adoção e não de idade.

Estrela mede atenção, não qualidade nem encaixe. O Spec Kit tem a vantagem de vir do GitHub, o que ajuda a divulgação e a integração com o Copilot. O OpenSpec, por sua vez, lista mais de 40 ferramentas de IA suportadas no `init`, então a menor popularidade não significa menos compatibilidade. Escolha pelo fluxo, não pelo placar.

## Qual usar

Se o projeto está nascendo ou a feature é grande e cheia de decisões técnicas, o Spec Kit dá o roteiro mais completo: constituição, spec, plano com pesquisa e contratos, tarefas. É mais cerimônia, e a cerimônia se paga quando há muito a decidir.

Se o projeto já existe e as mudanças são incrementais, o OpenSpec costuma encaixar melhor. O ciclo é curto e, principalmente, a spec principal não apodrece: ela é atualizada a cada `archive`, em vez de acumular pastas de features que ninguém relê.

As duas ferramentas não são excludentes na cabeça de quem usa. Os dois fluxos compartilham o mesmo princípio e o mesmo risco: uma spec que ninguém revisa é só mais um arquivo que o agente interpreta do jeito que quiser.

## Mão na massa: quatro cenários

Os comandos abaixo são os das ferramentas. Os prompts em texto são sugestões minhas: nenhuma das duas gera sozinha um "resumo de tudo", então essa parte é pedida ao agente.

### 1. Entender um projeto que já existe

Primeiro instale a ferramenta no repositório. Faça um commit antes, porque o `--force` pode sobrescrever arquivos nos caminhos que o Spec Kit gerencia.

```bash
# Spec Kit
specify init --here --force --integration claude

# OpenSpec
openspec init
```

Nenhuma das duas lê o código e escreve specs por conta própria. O próprio guia do Spec Kit avisa que o `init` não infere specs do comportamento existente. O que ajuda é registrar o contexto e então pedir a análise ao agente.

No Spec Kit, comece pela constituição, usando só o que já é verdade no repositório:

```text
/speckit.constitution Leia o README, os ADRs, o guia de contribuição e a
configuração de CI. Registre apenas os princípios que o projeto já segue
hoje (padrão de testes, fronteiras entre módulos, regras de migração).
Não invente padrões novos.
```

No OpenSpec, o contexto fica em `openspec/config.yaml`, injetado em todo pedido de planejamento. Mantenha curto, só stack, restrições e convenções:

```yaml
schema: spec-driven

context: |
  Stack: Next.js, NestJS, Postgres
  Commits no padrão conventional commits
  Domínio: e-commerce
```

Para conhecer o projeto na prática, o OpenSpec tem o `/opsx:onboard`: ele varre o código, sugere melhorias reais e conduz um ciclo completo (proposta, implementação, arquivamento) numa mudança pequena. Pode exigir habilitar os fluxos expandidos antes:

```bash
openspec config profile   # selecione os fluxos expandidos
openspec update
```

### 2. Gerar um resumo de toda a documentação

Aqui o comando é um prompt comum, e funciona igual nas duas ferramentas. O truque é pedir **onde** guardar o resultado, para ele virar insumo das próximas specs:

```text
Leia a documentação do repositório (README, docs/, ADRs, specs existentes)
e o código dos módulos principais. Gere um resumo em Markdown com: visão
geral do produto, módulos e responsabilidades, fluxos principais, regras
de negócio explícitas, pontos sem documentação e inconsistências entre
docs e código. Cite o arquivo de origem de cada afirmação. Salve em
docs/visao-geral.md.
```

Se o OpenSpec já estiver em uso, vale também ler o estado atual pela CLI:

```bash
openspec list --specs   # specs existentes
openspec view           # dashboard interativo das mudanças
```

Revise o resumo antes de confiar nele. Um resumo gerado por agente é uma hipótese: o item "inconsistências entre docs e código" é justamente a parte que você precisa conferir à mão.

### 3. Implementar uma nova feature

Spec Kit, com a feature de cupom de desconto:

```text
/speckit.specify Cupom de desconto no carrinho: código informado pelo
cliente, tipo percentual ou valor fixo, total nunca negativo.
/speckit.clarify
/speckit.plan Reaproveitar o módulo de carrinho existente; sem nova
dependência.
/speckit.tasks
/speckit.analyze
/speckit.implement
```

OpenSpec, para a mesma feature:

```text
/opsx:explore
/opsx:propose add-cupom-desconto
/opsx:apply
/opsx:archive
```

Em ambos, pare depois da spec e depois do plano (ou da proposta e do design) para ler. A feature é pequena, mas o ponto do SDD é justamente essa leitura.

### 4. Iniciar um projeto novo

Com Spec Kit, o `init` cria o diretório do projeto:

```bash
specify init meu-projeto --integration claude
cd meu-projeto
```

```text
/speckit.constitution Qualidade: cobertura de testes mínima de 80%.
Arquitetura: dependências apontam para o domínio. Sem segredos no código.
/speckit.specify <descrição do produto ou da primeira feature>
/speckit.plan <stack escolhida e restrições>
/speckit.tasks
/speckit.implement
```

Com OpenSpec, crie a pasta, inicialize e proponha a primeira mudança:

```bash
mkdir meu-projeto && cd meu-projeto
git init
openspec init
```

```text
/opsx:explore Quero um app de lista de tarefas com login.
/opsx:propose bootstrap-app
/opsx:apply
/opsx:archive
```

Num projeto vazio, o OpenSpec começa com `specs/` vazio e vai ganhando conteúdo a cada `archive`. O Spec Kit, em contrapartida, já pede a constituição e a stack logo de início, o que ajuda quando você sabe o que quer.

## O que fica

A ferramenta importa menos do que o hábito que ela força: parar entre "descrevi" e "implementei" para ler algo curto e corrigir a suposição errada enquanto ela ainda é barata.

A pergunta prática para escolher é onde a spec vai morar. Se ela é um **registro de como a feature nasceu**, Spec Kit. Se ela é uma **descrição viva do que o sistema faz hoje**, OpenSpec. Comece por uma feature pequena, leia cada artefato gerado antes do próximo comando, e só depois decida quanto da cerimônia o seu time realmente precisa.

## Referências

- Spec Kit, repositório e documentação oficial: [github.com/github/spec-kit](https://github.com/github/spec-kit)
- OpenSpec, repositório e documentação oficial: [github.com/Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec)
- [Spec-Driven Development na prática, com exemplo](/posts/spec-driven-development-exemplo-pratico)
