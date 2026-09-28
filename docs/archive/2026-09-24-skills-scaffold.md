# Spec & Plan: Scaffold `apps/skills` + `catalog.config.ts` (TASK01)

**Status:** approved **Data:** 2026-09-24
**Autor:** PLANNER (Claude)
**Backlog:** TASK01 em `docs/context/product-backlog.md`

---

## 1. Problema e Visão Geral

O catálogo skills.nico.dev.br (ver `docs/context/product.md`, seção Skills Catalog) ainda não tem app. Todas as tarefas seguintes (registry, `<InstallCommand>`, home, `/s/[slug]`) dependem de um app Next.js estático no monorepo e de um módulo único de configuração do catálogo.

Esta tarefa entrega só a fundação: app `apps/skills` que builda e exporta HTML estático, herdando tokens e estilos de `@nico.dev/ui`, mais `catalog.config.ts` como fonte única de categorias, agentes, URLs base e templates de comando. Nenhuma página real, nenhum registry.

---

## 2. Cenários de Usuário

- **P1 (crítico):** Como dev do monorepo, quero rodar `pnpm --filter @nico.dev/skills dev` e ver uma página placeholder, para começar as próximas tasks sobre uma base que funciona.
- **P1 (crítico):** Como dev, quero `pnpm turbo build --filter=@nico.dev/skills` gerando `apps/skills/out/`, para que o deploy nginx (TASK09) tenha o que servir.
- **P2 (importante):** Como dev, quero importar categorias, agentes e URLs de `catalog.config.ts`, para que Zod (TASK02) e UI (TASK05+) nunca dupliquem esses valores.
- **P3 (nice-to-have):** Como dev, quero um `.env-examplo` documentado, seguindo o padrão dos outros apps.

---

## 3. Requisitos Funcionais

- **FR-001:** `apps/skills` é um pacote pnpm `@nico.dev/skills` (workspace já cobre `apps/*`), com Next.js, React, Tailwind v4 e `@nico.dev/ui` nas mesmas versões de `apps/metronome`.
- **FR-002:** `next.config.ts` define `output: 'export'`, `trailingSlash: true` e `images.unoptimized: true`. `next build` gera `apps/skills/out/index.html`.
- **FR-003:** Scripts `dev` (`next dev --port 3006`), `build`, `lint` e `typecheck`, iguais ao padrão do metronome. `turbo.json` já herda `dependsOn: ["^build"]`; adicionar `out/**` aos `outputs` da task `build`.
- **FR-004:** `tsconfig.json`, `eslint.config.mjs` e `postcss.config.mjs` estendem `@nico.dev/config` como os demais apps; ESLint ignora `out/**`.
- **FR-005:** `src/app/globals.css` importa `@nico.dev/ui/globals.css`. Tema claro/escuro vem dos tokens existentes de `packages/ui` (decisão: sem Nocturne nesta task).
- **FR-006:** `src/app/layout.tsx` com `lang="pt-BR"`, metadata base (`title`, `description`, `metadataBase` a partir de `catalog.config.ts`) e `src/app/page.tsx` placeholder com o nome "Nico Skills" e a tagline do produto, usando componentes de `@nico.dev/ui`.
- **FR-007:** `apps/skills/catalog.config.ts` exporta, tipado e com `as const`:
  - `siteConfig`: `name`, `tagline`, `url` (`https://skills.nico.dev.br`, sobrescrevível por `NEXT_PUBLIC_SKILLS_URL`).
  - `repoConfig`: `owner` (`robertourias`), `repo` (`skills`), `slug` derivado (`robertourias/skills`), `githubUrl`, `skillsDir` (`skills`), `packsDir` (`packs`).
  - `skillsShConfig`: `baseUrl` (`https://www.skills.sh`), função `skillUrl(slug)` → `https://www.skills.sh/robertourias/skills/<slug>`.
  - `CATEGORIES`, `AGENTS`, `STATUSES` (`stable | beta | draft`) como tuplas `as const`, com tipos derivados (`Category`, `Agent`, `Status`) para uso direto em `z.enum` na TASK02.
  - `installCommandTemplates`: `repository`, `skill(slug)`, `manual(slug)` com os textos exatos da spec de produto.
- **FR-008:** `catalog.config.ts` não importa nada de `next`, `react` ou de `apps/skills/src`; só TypeScript puro, para poder ser lido por `scripts/build-registry.ts` (TASK02) fora do Next.
- **FR-009:** `pnpm turbo lint` e `typecheck` passam para `@nico.dev/skills`. Teste unitário cobre `catalog.config.ts` (FR-010).
- **FR-010:** Teste unitário de `catalog.config.ts`: `skillUrl('x')` e cada template produzem a string exata; `CATEGORIES`, `AGENTS` e `STATUSES` não têm duplicatas e são kebab-case.

---

## 4. Fora do Escopo & Riscos

- **Fora do Escopo:** `scripts/build-registry.ts` e `registry.json` (TASK02); conteúdo `skills/` e `packs/` (TASK03); `<InstallCommand>` (TASK04); qualquer página além do placeholder; Dockerfile/compose/Traefik (TASK09); job no `.github/workflows/ci.yml` (TASK13); tokens Nocturne.
- **Premissa:** `packages/ui` exporta `globals.css` e componentes utilizáveis em export estático (sem dependência de servidor). Se algum componente usar APIs só de servidor, o placeholder usa apenas HTML + tokens.
- **Premissa:** a lista inicial de categorias abaixo é provisória; só `documentation` vem da spec de produto. Ajuste é uma edição em um arquivo, mas a TASK03 valida contra ela.
- **Risco:** o job de CI atual só cobre apps listados no `paths-filter`, e `apps/skills` fica fora dele → Mitigação: aceito nesta task; TASK13 cria o job. Até lá o dev roda lint/build local.
- **Risco:** `output: 'export'` proíbe Server Actions, route handlers dinâmicos e `next/image` otimizado → Mitigação: já alinhado com decisões do app (sem mutações); `images.unoptimized` no config.
- **Risco:** `apps/skills` no monorepo coexiste com o repo `robertourias/skills`; a origem de `skills/` fica em aberto → Mitigação: `repoConfig.skillsDir` isola a decisão; resolvida na TASK03.

Categorias iniciais propostas: `documentation`, `design`, `writing`, `product`, `engineering`. Agentes: `claude-code`, `cursor`, `codex`.

---

## 5. Contratos de API (Se aplicável)

Não aplicável (sem backend). Contrato de módulo, consumido pela TASK02:

```ts
export const CATEGORIES = ['documentation', 'design', 'writing', 'product', 'engineering'] as const;
export const AGENTS = ['claude-code', 'cursor', 'codex'] as const;
export const STATUSES = ['stable', 'beta', 'draft'] as const;
export type Category = (typeof CATEGORIES)[number];
export type Agent = (typeof AGENTS)[number];
export type Status = (typeof STATUSES)[number];

export const installCommandTemplates = {
  repository: `npx skills add ${repoConfig.slug}`,
  skill: (slug: string) => `npx skills add ${repoConfig.slug} --skill ${slug}`,
  manual: (slug: string) =>
    `git clone ${repoConfig.githubUrl} && cp -r skills/skills/${slug} ~/.claude/skills/`,
} as const;
```

---

## 6. Plano de Implementação (Tarefas)

### Ordem de Execução & Dependências

| Onda | Tarefas (paralelas) | Pré-requisito |
|------|---------------------|---------------|
| 1    | T1, T2              | —             |
| 2    | T3                  | T1, T2        |
| 3    | T4                  | T3            |

> Regra: `/hands-on` percorre as ondas em ordem e dispara as tarefas de uma onda em paralelo. Não inicie uma tarefa antes de todas as suas dependências estarem com os critérios `[x]`.

### Tarefa 1: Esqueleto do pacote `@nico.dev/skills`
- **Tipo:** chore
- **Agente:** frontend
- **Depende de:** — (nenhuma)
- **Paralelizável com:** T2
- **Descrição:** Criar `apps/skills/` espelhando `apps/metronome/`: `package.json` (`@nico.dev/skills`, porta 3006, mesmas versões), `tsconfig.json`, `eslint.config.mjs` (ignora `out/**`), `postcss.config.mjs`, `next.config.ts` (`output: 'export'`, `trailingSlash`, `images.unoptimized`), `.gitignore` (`out/`, `.next/`), `.env-examplo` (`NEXT_PUBLIC_SKILLS_URL`). Adicionar `out/**` a `outputs` do `build` em `turbo.json` e `NEXT_PUBLIC_SKILLS_URL` em `globalEnv`. Rodar `pnpm install`.
- **Critérios de Aceite:**
  - [x] `pnpm --filter @nico.dev/skills typecheck` resolve o pacote e as paths `@/*` e `@ui`.
  - [x] Arquivos de config seguem o padrão do metronome, sem regras ESLint desabilitadas.
  - [x] `turbo.json` cacheia `out/**` no build.

### Tarefa 2: `catalog.config.ts` + teste
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** — (nenhuma)
- **Paralelizável com:** T1
- **Descrição:** Implementar o módulo descrito em FR-007/FR-008 e o contrato da seção 5, TypeScript puro. Escrever o teste do FR-010 junto (`catalog.config.test.ts`), seguindo o runner definido em `docs/context/decisions.md` (Jest); se `apps/skills` ainda não tiver runner configurado, usar o mesmo padrão de outro app do monorepo.
- **Critérios de Aceite:**
  - [x] `skillUrl('mermaid-diagrams')` retorna `https://www.skills.sh/robertourias/skills/mermaid-diagrams`.
  - [x] Templates produzem exatamente os três comandos da spec de produto.
  - [x] Nenhum import de `next`/`react`; arquivo carrega em Node puro (`tsx`).
  - [x] Testes passam; sem duplicatas nas tuplas.

### Tarefa 3: Layout e página placeholder
- **Tipo:** feature
- **Agente:** frontend
- **Depende de:** T1, T2
- **Paralelizável com:** nenhuma
- **Descrição:** `src/app/globals.css` (`@import "@nico.dev/ui/globals.css"`), `layout.tsx` (`lang="pt-BR"`, metadata com `siteConfig`, `metadataBase`) e `page.tsx` com "Nico Skills", tagline e o comando `repository` em texto simples (o `<InstallCommand>` chega na TASK04). Server Components por padrão, sem `'use client'`.
- **Critérios de Aceite:**
  - [x] `pnpm --filter @nico.dev/skills dev` serve a página em `localhost:3006`, legível em claro e escuro.
  - [x] Nenhum hex direto; só classes de token semântico.
  - [x] Título, tagline e comando vêm de `catalog.config.ts`, não de literais na página.

### Tarefa 4: Verificação de build estático
- **Tipo:** chore
- **Agente:** frontend
- **Depende de:** T3
- **Paralelizável com:** nenhuma
- **Descrição:** Rodar `pnpm turbo lint typecheck build --filter=@nico.dev/skills`, conferir `apps/skills/out/index.html` e servir `out/` localmente para validar o HTML estático em 360 px. Registrar em `docs/architecture/overview.md` a porta 3006 se o overview listar portas; atualizar o status de TASK01 no backlog só após tudo verde.
- **Critérios de Aceite:**
  - [x] Lint, typecheck e testes passam.
  - [x] `out/index.html` existe e contém "Nico Skills".
  - [x] Página renderiza sem overflow horizontal em 360 px.
  - [x] Nenhuma dependência de runtime Node (sem rotas dinâmicas no build).

---

<!--
GATE DE APROVAÇÃO
Revise as regras de negócio e as tarefas técnicas.
Se tudo estiver correto, altere o Status acima de "review" para "approved" para liberar os agentes de frontend/backend para iniciar a implementação.
-->
