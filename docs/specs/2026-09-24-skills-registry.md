# Spec & Plan: Registry `build-registry.ts` (TASK02)

**Status:** approved **Data:** 2026-09-24
**Autor:** PLANNER (Claude)
**Backlog:** TASK02 em `docs/context/product-backlog.md`
**Depende de:** TASK01 (`docs/specs/2026-09-24-skills-scaffold.md`, concluída)

---

## 1. Problema e Visão Geral

O site é gerado a partir do frontmatter de cada `SKILL.md`, então precisa de um passo de build que leia as skills, valide o schema e produza um `registry.json` único. Sem isso, home, `/s/[slug]`, busca e comandos de instalação (TASK04+) não têm dados, e um `SKILL.md` inválido só seria descoberto em produção.

Esta tarefa entrega o script `apps/skills/scripts/build-registry.ts` (gray-matter + Zod), a task Turbo que o executa antes do `next build`, e os testes. Não entrega conteúdo real (TASK03) nem qualquer UI.

---

## 2. Cenários de Usuário

- **P1 (crítico):** Como autor de skills, quero que um `SKILL.md` sem `description` ou com `category` inválida derrube o build indicando arquivo e campo, para nunca publicar dado quebrado.
- **P1 (crítico):** Como dev do site, quero `registry.json` gerado de forma determinística e tipada, para as páginas lerem uma fonte única.
- **P1 (crítico):** Como autor, quero que `visibility: hidden` deixe a skill fora do `registry.json`, para poder versionar rascunhos sem expô-los.
- **P2 (importante):** Como autor, quero que um pack citando skill inexistente (ou oculta) falhe o build, para não ter link quebrado.
- **P2 (importante):** Como dev, quero apontar a raiz de conteúdo por `--root`/`SKILLS_ROOT`, para a TASK03 decidir a origem sem alterar o script.
- **P3 (nice-to-have):** Como dev, quero ver todos os erros de uma vez, e não só o primeiro.

---

## 3. Requisitos Funcionais

- **FR-001:** Dependências novas em `apps/skills`: `gray-matter`, `zod`, `yaml` (packs). `tsx` já existe.
- **FR-002:** `scripts/build-registry.ts` expõe a função pura `buildRegistry(root: string): Promise<BuildResult>` e um entrypoint CLI. `BuildResult` é `{ ok: true, registry } | { ok: false, errors: RegistryError[] }`. A função não escreve em disco nem chama `process.exit`; só o CLI faz isso.
- **FR-003:** Raiz de conteúdo: flag `--root <dir>`, senão env `SKILLS_ROOT`, senão `apps/skills/content/`. Dentro dela: `<root>/skills/*/SKILL.md` (nome do diretório via `repoConfig.skillsDir`) e `<root>/packs/*.yaml` (`repoConfig.packsDir`). Raiz inexistente é erro com mensagem clara, não registry vazio silencioso.
- **FR-004:** Parse com `gray-matter`. O YAML converte datas sem aspas (`updated: 2026-09-20`) em objeto `Date`; o script normaliza `Date` para `YYYY-MM-DD` (UTC) antes de validar.
- **FR-005:** Schema Zod do frontmatter, usando `CATEGORIES`, `AGENTS` e `STATUSES` de `catalog.config.ts` (sem duplicar valores):

  | Campo | Regra |
  |---|---|
  | `name` | string kebab-case; igual ao nome da pasta |
  | `description` | string, 20 a 1024 caracteres |
  | `metadata.title` | opcional; padrão: `name` em title case (`mermaid-diagrams` → `Mermaid Diagrams`) |
  | `metadata.category` | obrigatório, `z.enum(CATEGORIES)` |
  | `metadata.tags` | opcional, padrão `[]`, máx. 8, cada uma kebab-case |
  | `metadata.agents` | opcional, padrão `['claude-code']`, `z.enum(AGENTS)[]` |
  | `metadata.version` | obrigatório, semver (`MAJOR.MINOR.PATCH`) |
  | `metadata.status` | obrigatório, `z.enum(STATUSES)` |
  | `metadata.visibility` | opcional, `public` (padrão) ou `hidden` |
  | `metadata.updated` | obrigatório, data ISO `YYYY-MM-DD` válida (rejeita `2026-13-40`) |
  | `metadata.language` | opcional, padrão `pt-BR` (aparece no exemplo da spec de produto, não na tabela; premissa) |

  Chaves desconhecidas no frontmatter são aceitas e ignoradas (compatibilidade com outros agentes), tanto no nível raiz quanto em `metadata`.
- **FR-006:** Schema do pack (`packs/*.yaml`): `id` (kebab-case, igual ao nome do arquivo sem extensão), `title`, `description` (não vazios), `skills` (array não vazio, sem duplicatas). Cada slug em `skills` precisa existir entre as skills **públicas**; citar slug inexistente ou `hidden` é erro apontando o pack e o slug.
- **FR-007:** Formato de erro: `RegistryError = { file: string; field: string; message: string }`, `file` relativo à raiz (ex.: `skills/foo/SKILL.md`), `field` no formato Zod-path (`metadata.category`). O CLI imprime uma linha por erro: `skills/foo/SKILL.md › metadata.category: Invalid enum value…` e sai com código 1. Todos os erros são coletados antes de falhar (P3).
- **FR-008:** Erros estruturais também viram `RegistryError`: pasta de skill sem `SKILL.md`; `SKILL.md` sem frontmatter; YAML malformado; `name` diferente da pasta (`field: name`); dois packs com o mesmo `id`.
- **FR-009:** Skills com `visibility: hidden` são validadas, mas omitidas do `registry.json`, dos contadores e dos `files[]` de qualquer pack.
- **FR-010:** Entrada de skill no `registry.json`: `slug`, `title`, `description`, `category`, `tags`, `agents`, `version`, `status`, `language`, `visibility` (sempre `public`), `updated`, `files` (caminhos relativos à pasta da skill, POSIX, ordenados, incluindo `SKILL.md`), `content` (corpo markdown, sem frontmatter), `installCommands` (`{ repository, skill, manual }` vindos de `installCommandTemplates`) e `githubUrl` (`<repoConfig.githubUrl>/tree/main/<skillsDir>/<slug>`; premissa: branch `main`).
- **FR-011:** Entrada de pack: `id`, `title`, `description`, `skills` (slugs, na ordem do YAML), `installCommands: { repository }`. O comando de instalar todas as skills do pack fica para a TASK10 (depende de o CLI aceitar múltiplos `--skill`, decisão em aberto).
- **FR-012:** Raiz do `registry.json`: `{ schemaVersion: 1, counts: { skills, packs }, lastUpdated, skills, packs }`. `lastUpdated` é o maior `updated` entre skills públicas (`null` se não houver). Ordenação padrão: `updated` desc, depois `slug` asc. **Sem timestamp de geração** — a saída é determinística (mesma entrada → bytes idênticos), o que mantém o cache do Turbo válido.
- **FR-013:** O CLI grava `apps/skills/public/registry.json` (JSON indentado com 2 espaços, `\n` final), servido em `/registry.json` pelo export estático. Se o arquivo passar de 500 KB, o build falha com o tamanho medido (requisito não funcional da spec de produto). `public/registry.json` entra no `.gitignore` do app (artefato gerado).
- **FR-014:** Turbo: task `registry` (`inputs`: `content/**`, `scripts/**`, `catalog.config.ts`; `outputs`: `public/registry.json`); `build` do app depende de `registry`. Script `registry` em `package.json` (`tsx scripts/build-registry.ts`); `test` passa a incluir os novos arquivos de teste.
- **FR-015:** Tipos exportados (`Registry`, `RegistrySkill`, `RegistryPack`) em `scripts/registry/types.ts`, derivados do schema, para o site consumir sem redeclarar. O código do script não importa `next` nem `react`.

---

## 4. Fora do Escopo & Riscos

- **Fora do Escopo:** conteúdo real em `content/` e sua origem (TASK03); leitura do `registry.json` pelas páginas (TASK05+); comando de instalar pack inteiro (TASK10); changelog por `git log` (TASK14); job de CI (TASK13); `catalog.config.ts` só é lido, não alterado (exceto se a TASK03 ajustar categorias).
- **Premissa:** `apps/skills/content/` é o padrão provisório; sem `content/`, `pnpm build` falha com erro claro até a TASK03 (ou o dev passa `SKILLS_ROOT`). Mitigação: na T4 criar `content/skills/.gitkeep` e `content/packs/.gitkeep`, e tratar diretório vazio como registry válido com 0 skills.
- **Premissa:** branch padrão do repo de skills é `main` (`githubUrl`).
- **Risco:** datas YAML viram `Date` e podem deslocar um dia por fuso → Mitigação: FR-004 normaliza em UTC e há teste com `updated` sem aspas.
- **Risco:** `content` completo das skills estoura 500 KB conforme o catálogo cresce → Mitigação: FR-013 falha o build com tamanho medido; a saída de emergência (dividir em `registry.json` + `skills/<slug>.json`) fica registrada como decisão futura, não implementada agora.
- **Risco:** `zod` v3 vs v4 têm APIs de erro/enum diferentes → Mitigação: consultar a doc da versão instalada (Context7) antes de codar T1 e fixar a versão no `package.json`.
- **Risco:** a TASK03 pode mudar categorias em `catalog.config.ts` → Mitigação: schema lê as tuplas da config, nenhuma edição no script.

---

## 5. Contratos de API (Se aplicável)

Não há HTTP. Contrato de dados publicado em `/registry.json`:

```jsonc
{
  "schemaVersion": 1,
  "counts": { "skills": 4, "packs": 1 },
  "lastUpdated": "2026-09-20",
  "skills": [
    {
      "slug": "mermaid-diagrams",
      "title": "Mermaid Diagrams",
      "description": "…",
      "category": "documentation",
      "tags": ["mermaid", "c4"],
      "agents": ["claude-code"],
      "version": "1.2.0",
      "status": "stable",
      "language": "pt-BR",
      "visibility": "public",
      "updated": "2026-09-20",
      "files": ["SKILL.md", "references/c4.md"],
      "content": "# Mermaid …",
      "installCommands": {
        "repository": "npx skills add robertourias/skills",
        "skill": "npx skills add robertourias/skills --skill mermaid-diagrams",
        "manual": "git clone https://github.com/robertourias/skills && cp -r skills/skills/mermaid-diagrams ~/.claude/skills/"
      },
      "githubUrl": "https://github.com/robertourias/skills/tree/main/skills/mermaid-diagrams"
    }
  ],
  "packs": [
    {
      "id": "nico-stack",
      "title": "Nico Stack",
      "description": "…",
      "skills": ["mermaid-diagrams"],
      "installCommands": { "repository": "npx skills add robertourias/skills" }
    }
  ]
}
```

Saída de erro do CLI (stderr, exit 1):

```
skills/foo/SKILL.md › metadata.category: valor inválido "docs"; esperado um de documentation, design, writing, product, engineering
packs/nico-stack.yaml › skills[2]: skill "bar" não existe entre as skills públicas
```

---

## 6. Plano de Implementação (Tarefas)

### Ordem de Execução & Dependências

| Onda | Tarefas (paralelas) | Pré-requisito |
|------|---------------------|---------------|
| 1    | T1, T2              | —             |
| 2    | T3                  | T1, T2        |
| 3    | T4                  | T3            |

> Regra: `/hands-on` percorre as ondas em ordem e dispara as tarefas de uma onda em paralelo. Não inicie uma tarefa antes de todas as suas dependências estarem com os critérios `[x]`. Testes são escritos junto com cada tarefa.

### Tarefa 1: Dependências, tipos e schemas Zod
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** — (nenhuma)
- **Paralelizável com:** T2
- **Descrição:** Adicionar `gray-matter`, `zod` e `yaml` (versões fixadas; consultar a doc via Context7 para a API da versão instalada). Criar `scripts/registry/schema.ts` (frontmatter FR-005 e pack FR-006, com helpers de normalização de data e title case) e `scripts/registry/types.ts` (FR-015, `RegistryError`, `BuildResult`). Só depende de `catalog.config.ts`. Testes em `scripts/registry/schema.test.ts`.
- **Critérios de Aceite:**
  - [x] Frontmatter válido completo e mínimo (só obrigatórios) parseia; defaults aplicados (`title`, `tags`, `agents`, `visibility`, `language`).
  - [x] Falham, cada um com o `field` correto: sem `description`; `description` < 20 e > 1024; `category` fora da tupla; `version` não semver; `status` inválido; `tags` com 9 itens ou não kebab-case; `updated` inexistente (`2026-13-40`) ou em formato errado; `name` não kebab-case.
  - [x] `updated` como `Date` (YAML sem aspas) vira `YYYY-MM-DD` exato, sem deslocar o dia.
  - [x] Chaves desconhecidas no frontmatter não causam erro.
  - [x] Nenhum valor de enum duplicado em relação a `catalog.config.ts`.

### Tarefa 2: Fixtures de teste
- **Tipo:** chore
- **Agente:** frontend
- **Depende de:** — (nenhuma)
- **Paralelizável com:** T1
- **Descrição:** Criar `scripts/__fixtures__/` com raízes mínimas: `valid/` (2 skills públicas, 1 `hidden`, 1 pack, uma skill com `references/` aninhada e `updated` sem aspas), e uma raiz por caso de falha: `missing-description/`, `bad-category/`, `name-mismatch/`, `no-skill-md/`, `no-frontmatter/`, `malformed-yaml/`, `pack-unknown-skill/`, `pack-hidden-skill/`, `duplicate-pack-id/`, `multi-error/` (2+ erros em arquivos distintos), `empty/` (`skills/` e `packs/` vazios). Conteúdo curto; fixtures são dados de teste, não skills reais.
- **Critérios de Aceite:**
  - [x] Cada fixture isola exatamente uma causa de falha (exceto `multi-error`).
  - [x] Nenhuma fixture depende de arquivos fora de `scripts/__fixtures__/`.
  - [x] `valid/` cobre: skill com subpastas, skill `hidden`, data sem aspas, `metadata` mínimo.

### Tarefa 3: `buildRegistry` (núcleo)
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** T1, T2
- **Paralelizável com:** nenhuma
- **Descrição:** Implementar `buildRegistry(root)` em `scripts/build-registry.ts` (ou `scripts/registry/build.ts` reexportado) conforme FR-002 a FR-012: descoberta de skills e packs, parse, validação, coleta de todos os erros, `files[]` recursivo em POSIX ordenado, exclusão de `hidden`, montagem de `installCommands`/`githubUrl` a partir de `catalog.config.ts`, ordenação e contadores. Função pura sem escrita em disco. Testes em `scripts/build-registry.test.ts` sobre as fixtures.
- **Critérios de Aceite:**
  - [x] `valid/` gera `ok: true`; skill `hidden` ausente em `skills`, em `counts` e em `files`; `lastUpdated` correto; ordem `updated` desc, `slug` asc.
  - [x] `content` sem frontmatter; `files` inclui `SKILL.md` e subpastas, ordenados, com `/`.
  - [x] `installCommands` e `githubUrl` idênticos aos templates da config (comparação por string exata).
  - [x] Cada fixture de falha retorna `ok: false` com `file` e `field` esperados; `multi-error` retorna todos os erros; `pack-hidden-skill` e `pack-unknown-skill` apontam pack e slug.
  - [x] Duas execuções seguidas sobre `valid/` produzem JSON byte a byte igual.
  - [x] Raiz inexistente retorna erro claro; `empty/` retorna registry válido com `counts` 0 e `lastUpdated: null`.

### Tarefa 4: CLI, Turbo e integração de build
- **Tipo:** chore
- **Agente:** frontend
- **Depende de:** T3
- **Paralelizável com:** nenhuma
- **Descrição:** Entrypoint CLI (parse de `--root`, `SKILLS_ROOT`, padrão `content/`; impressão de erros FR-007; `process.exit(1)`; escrita de `public/registry.json`; checagem de 500 KB). Scripts `registry` e `test` em `package.json`; task `registry` e dependência do `build` no `turbo.json` (FR-014); `public/registry.json` no `.gitignore` do app; criar `content/skills/.gitkeep` e `content/packs/.gitkeep`. Sem alterar `.github/workflows`.
- **Critérios de Aceite:**
  - [x] `pnpm --filter @nico.dev/skills registry` com `content/` vazio gera `public/registry.json` com `counts` 0 e sai com código 0.
  - [x] `SKILLS_ROOT=scripts/__fixtures__/valid pnpm --filter @nico.dev/skills registry` gera o registry esperado; com `bad-category` sai com código 1 imprimindo `arquivo › campo: mensagem`.
  - [x] `pnpm turbo build --filter=@nico.dev/skills` executa `registry` antes do `next build`, e `out/registry.json` existe no export.
  - [x] Registry com mais de 500 KB falha o build com o tamanho medido (teste com arquivo gerado em diretório temporário, sem commitar fixture grande).
  - [x] `pnpm --filter @nico.dev/skills lint typecheck test` passam; `git status` não mostra `public/registry.json`.

---

<!--
GATE DE APROVAÇÃO
Revise as regras de negócio e as tarefas técnicas.
Se tudo estiver correto, altere o Status acima de "review" para "approved" para liberar os agentes de frontend/backend para iniciar a implementação.
-->
