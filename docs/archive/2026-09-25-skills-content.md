# Spec & Plan: Conteúdo das skills e sync com o repo `robertourias/skills` (TASK03)

**Status:** approved **Data:** 2026-09-25
**Autor:** PLANNER (Claude)
**Backlog:** TASK03 em `docs/context/product-backlog.md`
**Depende de:** TASK02 (`docs/specs/2026-09-24-skills-registry.md`, concluída)

---

## 1. Problema e Visão Geral

O registry (TASK02) lê `<root>/skills/*/SKILL.md` e `<root>/packs/*.yaml`, mas `apps/skills/content/` está vazio e a origem do conteúdo estava em aberto. O levantamento de 2026-09-25 mudou o quadro:

- O repo público `robertourias/skills` **já existe** e é o que o CLI instala (`npx skills add robertourias/skills`). Ele já contém `article-writer` (com `references/`), `product-ideation` e `excalidraw-design-system`, todos no schema novo, além de `packs/nico-stack.yaml`.
- Faltam `mermaid-diagrams` e `pencil-design-system`, cujas fontes estão em `~/.claude/skills/synced/<id>/` com frontmatter antigo (só `name` e `description`, este em PT no mermaid).
- `packs/nico-stack.yaml` cita apenas `excalidraw-design-system`, `product-ideation` e `article-writer`; falharia a validação se listasse skill inexistente e não cobre as skills novas.
- O repo também carrega um scaffold de site próprio (`apps/web`, `catalog.config.ts`, `scripts/build-registry.ts`, `deploy/`, `ci.yml` vazio) que duplica `apps/skills`.

**Decisão (2026-09-25):** o repo `robertourias/skills` é a fonte de verdade do **conteúdo** (skills e packs); o **site** vive em `apps/skills` neste monorepo e busca esse conteúdo no build. Catálogo final: 5 skills (`article-writer`, `excalidraw-design-system`, `mermaid-diagrams`, `pencil-design-system`, `product-ideation`).

Esta tarefa entrega: (a) o mecanismo de sync do conteúdo para `apps/skills/content/`; (b) a migração de `mermaid-diagrams` e `pencil-design-system` para o repo no schema novo; (c) o pack atualizado; (d) a validação de ponta a ponta com o registry.

---

## 2. Cenários de Usuário

- **P1 (crítico):** Como dev do site, quero `pnpm --filter @nico.dev/skills content:sync` trazendo `skills/` e `packs/` do repo para `content/`, para o build rodar sobre o conteúdo real.
- **P1 (crítico):** Como usuário do CLI, quero `npx skills add robertourias/skills` instalando as 5 skills, para o catálogo refletir o que é instalável.
- **P1 (crítico):** Como autor, quero que o registry valide as 5 skills e o pack sem erro, para publicar sem dado quebrado.
- **P2 (importante):** Como dev, quero apontar o sync para uma branch (`SKILLS_REF`) ou usar um checkout local (`SKILLS_ROOT`), para testar mudanças antes de mergear no repo.
- **P3 (nice-to-have):** Como dev, quero que o sync avise qual commit do repo foi usado, para rastrear o que entrou no build.

---

## 3. Requisitos Funcionais

- **FR-001:** `apps/skills/scripts/sync-content.ts` faz clone raso (`git clone --depth 1`) de `https://github.com/robertourias/skills` (URL vinda de `repoConfig.githubUrl`) em diretório temporário e copia **somente** `skills/` e `packs/` para `apps/skills/content/`, substituindo o conteúdo anterior dessas duas pastas. Não copia `apps/`, `deploy/`, `.github/`, `catalog.config.ts` nem `scripts/` do repo.
- **FR-002:** Ref do clone: env `SKILLS_REF` (branch, tag ou SHA), padrão `main`. Se `SKILLS_ROOT` estiver definida, o sync não faz nada e sai com código 0 avisando que a raiz é local (o registry já lê `SKILLS_ROOT`).
- **FR-003:** Ao final, imprime `content sincronizado de <repo>@<sha curto> (<N> skills, <M> packs)`. Falha (código 1) se `git` não estiver disponível, o clone falhar, ou o repo não tiver `skills/`.
- **FR-004:** `content/skills/*` e `content/packs/*` entram no `.gitignore` do app, mantendo `.gitkeep` versionados (criados na TASK02). O conteúdo sincronizado nunca é commitado no monorepo.
- **FR-005:** Script `content:sync` em `package.json`. Task Turbo `sync-content` (`cache: false`, `outputs: []`); a task `registry` passa a depender dela, de modo que `pnpm turbo build --filter=@nico.dev/skills` sempre sincroniza antes de gerar o registry. `catalog.config.ts` e o script `registry` não mudam de assinatura.
- **FR-006:** Teste do sync com `git` local: cria um repo git temporário com `skills/`, `packs/` e um diretório extra (`apps/`), aponta o sync para ele por `SKILLS_REPO_URL` (env de override usada só em teste) e verifica que só `skills/` e `packs/` foram copiados e que uma segunda execução substitui, sem acumular, o conteúdo antigo.
- **FR-007:** Migração de `mermaid-diagrams` e `pencil-design-system` para o repo: copiar a pasta inteira da fonte em `~/.claude/skills/synced/<id>/` (incluindo `references/`), preservando o corpo do `SKILL.md` **sem alterações**; reescrever apenas o frontmatter no schema novo:

  | Campo | `mermaid-diagrams` | `pencil-design-system` |
  |---|---|---|
  | `name` | `mermaid-diagrams` | `pencil-design-system` |
  | `description` | inglês; mantém os termos de gatilho em PT entre aspas | já em inglês; mantém como está |
  | `metadata.title` | `Mermaid Diagrams` | `Pencil Design System` |
  | `metadata.category` | `documentation` | `design` |
  | `metadata.tags` | `[mermaid, c4, erd, architecture, retroactive]` | `[pencil, design-system, ui, components]` |
  | `metadata.agents` | `[claude-code]` | `[claude-code]` |
  | `metadata.version` | `1.0.0` | `1.0.0` |
  | `metadata.status` | `beta` | `beta` |
  | `metadata.language` | `en` | `en` |
  | `metadata.visibility` | `public` | `public` |
  | `metadata.updated` | `2026-09-25` | `2026-09-25` |

  `description` respeita 20 a 1024 caracteres (as fontes têm 769 e 689). Idioma da `description`: **inglês**, seguindo `article-writer` já no repo (os agentes decidem o acionamento por esse campo).
- **FR-008:** `packs/nico-stack.yaml` passa a listar as 5 skills, na ordem `[mermaid-diagrams, pencil-design-system, excalidraw-design-system, product-ideation, article-writer]`, mantendo `id`, `title` e `description`.
- **FR-009:** Validação: com um checkout local do repo (com a migração aplicada), `SKILLS_ROOT=<checkout> pnpm --filter @nico.dev/skills registry` sai com código 0 e `public/registry.json` tem `counts.skills = 5`, `counts.packs = 1` e `files[]` de `mermaid-diagrams`, `pencil-design-system` e `article-writer` incluindo suas `references/`. Qualquer erro de schema nas skills que já estavam no repo (`article-writer`, `product-ideation`, `excalidraw-design-system`) é corrigido só no frontmatter, no mesmo PR.
- **FR-010:** As mudanças no repo `robertourias/skills` entram por **branch + Pull Request**, sem push direto na `main`. Depois do PR aberto, valida-se o fluxo do site com `SKILLS_REF=<branch> pnpm --filter @nico.dev/skills content:sync && pnpm --filter @nico.dev/skills registry`.
- **FR-011:** Registrar a decisão em `docs/context/decisions.md` (seção Skills Catalog) e em `docs/architecture/overview.md` (constraint sobre a origem de `skills/`), e atualizar o glossário se necessário. Substitui a constraint "pasta local vs. repo sincronizado".

---

## 4. Fora do Escopo & Riscos

- **Fora do Escopo:** remover o scaffold legado do repo `robertourias/skills` (`apps/web`, `deploy/`, `ci.yml`, `catalog.config.ts`, `scripts/build-registry.ts`, `package.json` de build) — proposta de nova tarefa, com confirmação explícita antes de mexer num repo público; CI/CD e `repository_dispatch` para rebuild quando o repo mudar (TASK13); reescrever o corpo das skills; tradução do conteúdo; alterar categorias em `catalog.config.ts`; publicar/mergear o PR (é revisão humana).
- **Premissa:** `git` está no PATH do ambiente de build (local e GitHub Actions).
- **Premissa:** o repo `robertourias/skills` continua público (o clone raso não usa credencial).
- **Premissa:** `product-ideation` e `excalidraw-design-system` no repo têm frontmatter válido; a FR-009 descobre por execução, não por leitura.
- **Risco:** o `main` do repo muda e quebra o build do site sem alteração no monorepo → Mitigação: `SKILLS_REF` permite fixar SHA/tag; o build falha alto com `arquivo › campo`, e a TASK13 pode fixar a ref no deploy.
- **Risco:** sync em todo `turbo build` depende de rede → Mitigação: `SKILLS_ROOT` permite build offline com checkout local; documentar no README do app.
- **Risco:** conteúdo das skills fontes pode citar caminhos ou nomes do ambiente local → Mitigação: revisão humana no PR (o corpo não é alterado nesta tarefa por decisão).
- **Risco:** o scaffold legado do repo continua com `apps/web` e `deploy/` apontando para o mesmo domínio → Mitigação: tarefa de limpeza separada, sugerida no relatório; nenhum deploy dele é acionado agora (`ci.yml` tem `jobs: {}`).

---

## 5. Contratos de API (Se aplicável)

Não há HTTP. Contratos operacionais:

```
pnpm --filter @nico.dev/skills content:sync
  env: SKILLS_REF (padrão "main"), SKILLS_ROOT (se definida: no-op), SKILLS_REPO_URL (override, teste)
  stdout: content sincronizado de robertourias/skills@<sha> (5 skills, 1 packs)
  exit 1: git ausente | clone falhou | repo sem skills/
```

Layout esperado do repo, lido pelo registry (TASK02):

```
robertourias/skills
├── skills/<slug>/SKILL.md (+ references/, examples/)
└── packs/<id>.yaml
```

---

## 6. Plano de Implementação (Tarefas)

### Ordem de Execução & Dependências

| Onda | Tarefas (paralelas) | Pré-requisito |
|------|---------------------|---------------|
| 1    | T1, T2              | —             |
| 2    | T3                  | T2            |
| 3    | T4                  | T1, T3        |

> Regra: `/hands-on` percorre as ondas em ordem e dispara as tarefas de uma onda em paralelo. Não inicie uma tarefa antes de todas as suas dependências estarem com os critérios `[x]`. T2, T3 e T4 alteram o repo público `robertourias/skills`: trabalhar num clone **fora do monorepo**, em branch própria, e pedir confirmação ao usuário antes de qualquer `git push` e antes de abrir o PR.

### Tarefa 1: Script `sync-content` e integração Turbo
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** — (nenhuma)
- **Paralelizável com:** T2
- **Descrição:** Implementar FR-001 a FR-006 em `apps/skills/scripts/sync-content.ts` (TypeScript, `node:child_process` + `node:fs`, sem dependência nova), script `content:sync`, task `sync-content` no `turbo.json` com `registry` dependendo dela, `.gitignore` do app e teste `sync-content.test.ts` com repo git temporário (FR-006). Incluir o novo teste no script `test`. Documentar `SKILLS_REF`, `SKILLS_ROOT` e `content:sync` num `apps/skills/README.md` curto.
- **Critérios de Aceite:**
  - [x] Sync copia só `skills/` e `packs/`; segunda execução substitui o conteúdo anterior sem resíduo.
  - [x] Com `SKILLS_ROOT` definida, o sync não toca em `content/` e sai com 0.
  - [x] Falhas (`git` ausente, clone inválido, repo sem `skills/`) saem com 1 e mensagem clara.
  - [x] `git status` não mostra arquivos sob `content/skills/` nem `content/packs/` após o sync; `.gitkeep` continuam versionados.
  - [x] `pnpm turbo build --filter=@nico.dev/skills` executa `sync-content` antes de `registry`.
  - [x] `lint`, `typecheck` e `test` passam.

### Tarefa 2: Migrar `mermaid-diagrams` e `pencil-design-system` para o repo
- **Tipo:** chore
- **Agente:** frontend
- **Depende de:** — (nenhuma)
- **Paralelizável com:** T1
- **Descrição:** Clonar `robertourias/skills` fora do monorepo (ex.: pasta irmã `skills-repo`), criar a branch `feat/migrate-mermaid-pencil`, copiar `mermaid-diagrams/` e `pencil-design-system/` de `~/.claude/skills/synced/<id>/` para `skills/` e reescrever o frontmatter conforme a tabela do FR-007, sem tocar no corpo. Traduzir a `description` do mermaid para inglês (mantendo os gatilhos em PT). Commitar na branch local; **não** dar push nesta tarefa.
- **Critérios de Aceite:**
  - [x] Cada pasta migrada contém `SKILL.md` e todos os arquivos da fonte (`references/` incluída), byte a byte, exceto o frontmatter.
  - [x] `git diff` do corpo dos dois `SKILL.md` contra a fonte é vazio.
  - [x] `description` de cada skill tem entre 20 e 1024 caracteres.
  - [x] Nenhuma alteração fora de `skills/mermaid-diagrams/` e `skills/pencil-design-system/`.

### Tarefa 3: Atualizar o pack e validar com o registry
- **Tipo:** chore
- **Agente:** frontend
- **Depende de:** T2
- **Paralelizável com:** nenhuma
- **Descrição:** No clone da T2, atualizar `packs/nico-stack.yaml` (FR-008). Rodar `SKILLS_ROOT=<clone> pnpm --filter @nico.dev/skills registry` (FR-009). Corrigir erros de frontmatter das skills já existentes no repo, se houver, e commitar tudo na mesma branch local.
- **Critérios de Aceite:**
  - [x] Registry sai com código 0, `counts.skills = 5` e `counts.packs = 1`.
  - [x] `files[]` de `mermaid-diagrams`, `pencil-design-system` e `article-writer` incluem as `references/`.
  - [x] Pack lista exatamente as 5 skills na ordem do FR-008.
  - [x] Nenhuma correção alterou corpo de skill, só frontmatter (listar o que foi corrigido no relatório).

### Tarefa 4: PR, validação do sync e documentação
- **Tipo:** chore
- **Agente:** frontend
- **Depende de:** T1, T3
- **Paralelizável com:** nenhuma
- **Descrição:** Mostrar ao usuário o diff da branch e **pedir confirmação** para dar push e abrir o PR em `robertourias/skills` (`gh pr create`, sem merge). Com a branch publicada, validar o fluxo do site: `SKILLS_REF=feat/migrate-mermaid-pencil pnpm --filter @nico.dev/skills content:sync && pnpm --filter @nico.dev/skills registry`. Atualizar `decisions.md` e `overview.md` (FR-011), marcar TASK03 conforme o resultado.
- **Critérios de Aceite:**
  - [x] Usuário confirmou o push; PR aberto contra `main`, sem merge, com descrição do que mudou.
  - [x] Sync a partir da branch traz 5 skills e 1 pack; registry sai com código 0 e `counts.skills = 5`.
  - [x] `pnpm turbo build --filter=@nico.dev/skills` (com `SKILLS_REF` da branch) conclui e `out/registry.json` lista as 5 skills.
  - [x] `decisions.md` e `overview.md` refletem a decisão; nenhuma referência restante a "pasta local vs. repo sincronizado".
  - [x] Relatório lista o link do PR e sugere a tarefa de limpeza do scaffold legado.

---

<!--
GATE DE APROVAÇÃO
Revise as regras de negócio e as tarefas técnicas.
Se tudo estiver correto, altere o Status acima de "review" para "approved" para liberar os agentes de frontend/backend para iniciar a implementação.
-->
