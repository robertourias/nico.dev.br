---
title: "Skills.sh: 5 skills de front-end e como instalar"
slug: "skills-sh-5-skills-frontend-como-instalar"
date: "2026-09-25"
categories: ["ia", "dev"]
status: "published"
featured: false
description: "Como achar e instalar skills pelo skills.sh, o que revisar antes de instalar e cinco skills pra front-end com React: pra que servem, exemplo de uso e comando de instalação."
tags: ["skills", "skills-sh", "claude-code", "react", "shadcn-ui"]
---

Escrever uma skill do zero, como mostrei em [Como criar uma skill](/posts/como-criar-skill-claude-code-pr-review), faz sentido pro que é específico do seu time. Pro que é geral (boas práticas de React, acessibilidade, uso correto de uma biblioteca), alguém provavelmente já escreveu, e melhor do que você faria num fim de semana.

O [skills.sh](https://www.skills.sh/) é onde essas skills ficam reunidas. Este post mostra como usar o diretório e a CLI, o que olhar antes de instalar, e cinco skills pra front-end: `web-design-guidelines`, `frontend-design`, `vercel-composition-patterns`, `vercel-react-best-practices` e `shadcn`. Cada uma com pra que serve, exemplo de uso e comando de instalação.

## O que é o skills.sh

O skills.sh se apresenta como um ecossistema aberto de skills pra agentes de IA: um diretório com ranking (por instalações e atividade recente, com filtros por tópico como React, Next.js e Design & UI) e uma CLI pra instalar. Ele suporta mais de 20 agentes, entre eles Claude Code, Cursor, Codex, GitHub Copilot e Gemini.

Toda skill tem um identificador no formato `owner/repo/skill`. O `owner/repo` é o repositório no GitHub que a hospeda, e o último trecho é o nome da skill dentro dele. Um repositório pode ter várias skills, e é por isso que a instalação aceita escolher qual delas.

## Instalando com a CLI

O comando base é `npx skills add <fonte>`, onde a fonte pode ser `owner/repo`, uma URL do GitHub ou outros formatos de git. Sem mais argumentos, a CLI abre um fluxo interativo. Pra instalar direto:

```bash
npx skills add vercel-labs/agent-skills --skill frontend-design -a claude-code -y
```

| Flag | O que faz |
|---|---|
| `--skill <nome>` | Instala só a skill indicada do repositório |
| `-a, --agent <agente>` | Escolhe o agente de destino, ex.: `claude-code` |
| `-g, --global` | Instala no diretório do usuário, valendo pra todos os projetos |
| `--list` | Lista as skills do repositório sem instalar |
| `-y, --yes` | Pula as confirmações |
| `--copy` | Copia os arquivos em vez de criar symlink |

Sem `-g`, a instalação é **por projeto**. Pro Claude Code, o destino é `.claude/skills/`; com `-g`, é `~/.claude/skills/`. Também existem `npx skills list`, `find`, `update` e `remove` pra gerenciar o que está instalado.

O que aconteceu neste repositório mostra o resultado na prática:

![Fluxo de uma skill do skills.sh até a sessão do agente: diretório skills.sh, CLI npx skills add, cópia canônica em .agents/skills, symlink em .claude/skills, arquivo skills-lock.json com fonte e hash, e carregamento na sessão do agente](/images/skills-sh-5-skills-frontend-como-instalar-instalacao.svg)

- `.claude/skills/<skill>` são **symlinks** apontando pra `.agents/skills/<skill>`, que guarda os arquivos de verdade. A ideia é uma cópia só, servida a cada agente que você usar.
- O `skills-lock.json` registra, por skill, a fonte (`owner/repo`), o caminho dentro do repositório e um hash do conteúdo.
- Tudo isso pode ir pro Git. Quem clonar o projeto recebe as mesmas skills, sem instalar nada. Isso liga direto com onboarding: a skill é parte do contexto versionado do time.

A CLI coleta telemetria anônima de uso. A documentação indica a variável `DISABLE_TELEMETRY=1` pra desativar.

## Antes de instalar: leia

Uma skill é um conjunto de instruções que o agente vai seguir, e pode trazer arquivos de apoio e permissões de ferramentas. Instalar sem ler é dar ordens ao seu agente escritas por outra pessoa. Um checklist curto:

- **A fonte é confiável?** Olhe o `owner/repo`. Repositórios oficiais (`anthropics`, `vercel-labs`, `shadcn`) são um ponto de partida melhor do que um repositório desconhecido com muitas instalações.
- **O que tem no `SKILL.md`?** Leia o frontmatter (`allowed-tools` mostra o que a skill pode executar sem pedir) e o corpo. Por exemplo, o `SKILL.md` da skill `shadcn` roda `npx shadcn@latest info --json` ao ser carregado, pra injetar o contexto do projeto. É inofensivo, mas é o tipo de coisa que você quer saber.
- **Existe outra skill com o mesmo nome?** Isso aconteceu aqui. O `skills-lock.json` deste projeto registra o `web-design-guidelines` vindo de `asyrafhussin/agent-skills`, enquanto o do skills.sh sob o repositório da Vercel (`vercel-labs/agent-skills`) é outro, com funcionamento diferente. Nome igual não garante conteúdo igual: confirme o `owner/repo` antes de instalar.

## Como as skills são acionadas

Instaladas, elas não exigem comando. Só `name` e `description` ficam no contexto, e o corpo carrega quando o seu pedido bate com a descrição. Você também pode citar a skill no prompt pra forçar o uso, ou chamar `/nome` quando ela permitir invocação direta (a `shadcn` declara `user-invocable: false`, então só entra de forma automática). O mecanismo completo está no post anterior sobre [como criar uma skill](/posts/como-criar-skill-claude-code-pr-review).

## As cinco skills

Os exemplos de prompt abaixo são ilustrativos: mostram como acionar cada skill, não resultados que eu tenha medido.

### 1. web-design-guidelines

**Pra que serve.** Audita código de interface contra as Web Interface Guidelines da Vercel: design, acessibilidade e UX. É uma skill de **revisão**: você aponta arquivos, ela devolve os problemas encontrados.

**Como funciona.** Segundo a página no skills.sh, antes de cada revisão a skill busca as diretrizes atualizadas numa URL remota (`raw.githubusercontent.com/vercel-labs/web-interface-guidelines`), valida os arquivos contra elas e reporta no formato terso `arquivo:linha`. Duas consequências: você sempre audita contra a versão atual, e a skill precisa de acesso à rede. Como o conteúdo vem de fora a cada uso, vale o mesmo cuidado de confiança da seção anterior.

**Exemplo de uso.**

```
audita a acessibilidade e o UX do src/components/LoginForm.tsx
```

Ou, com o arquivo como argumento:

```
/web-design-guidelines src/components/LoginForm.tsx
```

**Instalar.**

```bash
npx skills add vercel-labs/agent-skills --skill web-design-guidelines
```

### 2. frontend-design

**Pra que serve.** Guia o agente a fazer escolhas visuais deliberadas em vez de cair no visual genérico de "interface gerada por IA": direção estética, tipografia, paleta, movimento e composição. É uma skill de **criação**.

**De onde vem.** Do repositório `anthropics/skills`. Você citou "anthropics ou vercel": no skills.sh não existe uma versão da Vercel com esse nome, então a fonte é a da Anthropic.

**Exemplo de uso.** O `SKILL.md` pede que o agente identifique o assunto, o público e o objetivo da interface antes de desenhar, e que confirme com você se o pedido não trouxer isso. Então vale dar um briefing de verdade:

```
crie a landing page do blog: público de devs brasileiros, tom editorial,
foco em leitura longa. Proponha uma direção visual e justifique as escolhas
de tipografia e paleta antes de implementar.
```

**Instalar.**

```bash
npx skills add anthropics/skills --skill frontend-design
```

### 3. vercel-composition-patterns

**Pra que serve.** Padrões de composição em React pra evitar componentes que viram um emaranhado de props booleanas: compound components, estado levantado pra um provider, variantes explícitas, `children` em vez de render props e as mudanças de API do React 19. O `SKILL.md` afirma que esses padrões deixam a base mais fácil de trabalhar tanto pra humanos quanto pra agentes.

**Nome.** Você escreveu `vercel-composition-pattern`; o nome no skills.sh é `vercel-composition-patterns`, no plural. As regras principais são `architecture-avoid-boolean-props` e `architecture-compound-components`.

**Exemplo de uso.**

```
refatore o componente <Modal>: ele tem isLarge, hasFooter, showClose e
isDismissable. Aplique composição em vez de props booleanas.
```

A direção esperada é sair de algo assim:

```tsx
<Modal isLarge hasFooter showClose title="Excluir post" />
```

para algo assim:

```tsx
<Modal.Root size="lg">
  <Modal.Header>Excluir post</Modal.Header>
  <Modal.Body>Essa ação não pode ser desfeita.</Modal.Body>
  <Modal.Footer>
    <Modal.Close />
  </Modal.Footer>
</Modal.Root>
```

**Instalar.**

```bash
npx skills add vercel-labs/agent-skills --skill vercel-composition-patterns
```

### 4. vercel-react-best-practices

**Pra que serve.** Um guia de performance pra React e Next.js mantido pela engenharia da Vercel, com 70 regras em 8 categorias ordenadas por impacto. As duas de prioridade crítica são **eliminar waterfalls** (`async-`) e **reduzir o tamanho do bundle** (`bundle-`), seguidas de performance no servidor, busca de dados no cliente e re-renderização.

**Exemplo de uso.**

```
revise a página de listagem de posts procurando waterfalls de dados
e imports que inflam o bundle
```

Um caso típico coberto pela regra `async-parallel` (buscas independentes não devem esperar uma pela outra):

```ts
// antes: a segunda busca só começa depois da primeira
const posts = await getPosts();
const categories = await getCategories();

// depois: as duas rodam em paralelo
const [posts, categories] = await Promise.all([getPosts(), getCategories()]);
```

**Instalar.**

```bash
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices
```

### 5. shadcn

**Pra que serve.** Dá ao agente contexto do seu projeto shadcn/ui: ele lê o `components.json` pra saber framework, aliases, componentes instalados e biblioteca base (Radix ou Base UI), e usa o CLI do shadcn do jeito certo. O `SKILL.md` traz regras que evitam erros comuns, como formulários com `FieldGroup` + `Field`, `Dialog` sempre com título, `gap-*` no lugar de `space-y-*` e cores semânticas em vez de `bg-blue-500`.

**Nome e origem.** No skills.sh o nome é `shadcn`, e o repositório é `shadcn/ui`. A instalação oficial, segundo a documentação do shadcn, não usa `--skill`.

**Exemplo de uso.**

```
adicione um dialog de confirmação com um campo de e-mail
```

A skill orienta o agente a consultar o projeto (`npx shadcn@latest info`), procurar componentes existentes antes de escrever markup próprio e adicionar o que faltar pelo CLI. Ela roda automaticamente: `user-invocable: false` significa que não existe `/shadcn`, e a `allowed-tools` restringe as chamadas de Bash aos comandos do próprio `shadcn`.

**Instalar.**

```bash
npx skills add shadcn/ui
```

## Usando as cinco juntas

As cinco não competem entre si porque atuam em etapas diferentes de uma feature de interface.

![As cinco skills em sequência numa feature: frontend-design para direção visual, shadcn para componentes, vercel-composition-patterns para composição, vercel-react-best-practices para performance e web-design-guidelines para auditoria](/images/skills-sh-5-skills-frontend-como-instalar-combinando.svg)

Um roteiro plausível: `frontend-design` define a direção; `shadcn` monta a tela com componentes que já existem; `vercel-composition-patterns` cuida da API dos componentes novos; `vercel-react-best-practices` revisa performance; `web-design-guidelines` fecha com uma auditoria de acessibilidade e UX.

## Cuidados

**Skill é referência, não dono do projeto.** Skills carregam opiniões, e elas podem discordar. A `frontend-design` incentiva risco estético; o design system do seu projeto pode pedir o contrário. Nesses casos, as regras do projeto (`CLAUDE.md`, `docs/context/ui-guidelines.md`) precisam vencer. Deixe isso escrito onde o agente lê.

**Mais skills não é melhor.** Só o nome e a descrição de cada uma ficam sempre no contexto, mas descrições demais somam, e descrições que se sobrepõem fazem o agente acionar a errada. Instale o que você usa.

**Versione e atualize com critério.** O `skills-lock.json` existe pra você saber exatamente o que está instalado. Use `npx skills update` conscientemente e revise o que mudou, do mesmo jeito que faria com uma dependência.

## O que fica

O skills.sh reduz o custo de começar: em vez de escrever do zero um guia de performance de React ou de uso do shadcn, você instala o de quem mantém a tecnologia. O que continua sendo seu é a curadoria: ler antes de instalar, escolher poucas, versionar no repositório e deixar claro que as regras do projeto vêm primeiro.

Pra este blog, o caminho é o que já está no repositório: skills instaladas por projeto, commitadas, e citadas nos prompts quando a descrição não bastar.

## Referências

- [skills.sh](https://www.skills.sh/) — diretório, ranking e documentação da CLI.
- [vercel-labs/skills](https://github.com/vercel-labs/skills) — repositório da CLI `npx skills` (flags, escopos, symlink vs cópia).
- [vercel-labs/agent-skills](https://www.skills.sh/vercel-labs/agent-skills) — `web-design-guidelines`, `vercel-composition-patterns` e `vercel-react-best-practices`.
- [anthropics/skills](https://www.skills.sh/anthropics/skills/frontend-design) — `frontend-design`.
- shadcn/ui. [Skills](https://ui.shadcn.com/docs/skills) — instalação e o que a skill fornece.
- No blog: [Como criar uma skill: exemplo de code review de PR](/posts/como-criar-skill-claude-code-pr-review) e [TLC Skills: skills validadas pro seu agente de IA](/posts/tlc-skills-registro-skills-ia).
