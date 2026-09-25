# Product Backlog

> Gerado por `/backlog` em 2026-09-24. Fonte: `docs/context/product.md` (seção Skills Catalog).
> Escopo: skills.nico.dev.br (`apps/skills`). Use `/spec TASKXX` para gerar a especificação de cada tarefa.

## Legenda de Status

| Status | Significado |
|--------|-------------|
| backlog | Aguardando especificação |
| spec-review | Spec + Tarefas geradas, aguardando aprovação |
| spec-approved | Spec aprovado, pronto para implementação |
| in-progress | Em implementação |
| done | Concluído |

---

## Fase 1 — Fundação

| ID | Título | Descrição | Status | Dependências | Spec |
|----|--------|-----------|--------|--------------|------|
| TASK01 | Scaffold `apps/skills` + `catalog.config.ts` | App Next.js (export estático) no Turborepo com pnpm, Tailwind v4 e `@nico.dev/ui`; categorias, agentes e URLs base em `catalog.config.ts` | done | — | `docs/specs/2026-09-24-skills-scaffold.md` |
| TASK02 | Registry: `build-registry.ts` | Parse com gray-matter, schema Zod, `visibility: hidden`, `installCommands`, `githubUrl`, `files[]`; erro indica arquivo e campo; task do Turbo | done | TASK01 | `docs/specs/2026-09-24-skills-registry.md` |
| TASK03 | Conteúdo: 4 skills no novo schema | Conteúdo vive no repo `robertourias/skills`; sync para `content/` no build; migrar mermaid-diagrams e pencil-design-system (article-writer, product-ideation e excalidraw já estão no repo); atualizar o pack | done | TASK02 | `docs/specs/2026-09-25-skills-content.md` |

## Fase 2 — Core (MVP)

| ID | Título | Descrição | Status | Dependências | Spec |
|----|--------|-----------|--------|--------------|------|
| TASK04 | `<InstallCommand>` em `packages/ui` | Caixa com `$`, copiar, "Copiado!", aria-live, abas, `localStorage`, nota `DISABLE_TELEMETRY`; Storybook | backlog | TASK01 | — |
| TASK05 | Home | Hero ASCII "NICO SKILLS", contadores, lista (posição, tags, status, data), ordenação | backlog | TASK02, TASK04 | — |
| TASK06 | Busca e filtros | Fuse.js, atalho `/`, filtros por categoria/tag/status | backlog | TASK05 | — |
| TASK07 | Página `/s/[slug]` | Badges, SKILL.md com sanitize + highlight, árvore de arquivos, links GitHub e skills.sh | backlog | TASK02, TASK04 | — |
| TASK08 | Bloco "Encontre no skills.sh" | Três caminhos, aviso de demora, card com 3 capturas na home | backlog | TASK05 | — |
| TASK09 | Deploy manual na VPS | Dockerfile nginx, compose com labels Traefik, primeiro deploy | backlog | TASK05, TASK07 | — |

## Fase 3 — Complementar

| ID | Título | Descrição | Status | Dependências | Spec |
|----|--------|-----------|--------|--------------|------|
| TASK10 | Packs | `packs/*.yaml`, validação de skills citadas, `/packs`, `/p/[id]` | backlog | TASK02, TASK04 | — |
| TASK11 | Tópicos e `/skills-sh` | `/topic/[tag]` e guia completo do skills.sh | backlog | TASK07, TASK08 | — |
| TASK12 | SEO | `sitemap.xml`, `robots.txt`, metadados | backlog | TASK07 | — |
| TASK13 | CI/CD | GitHub Actions: validar/build em PR; imagem GHCR e deploy via SSH na `main` | backlog | TASK09 | — |

## Fase 4 — Polimento

| ID | Título | Descrição | Status | Dependências | Spec |
|----|--------|-----------|--------|--------------|------|
| TASK14 | Changelog por versão | A partir do `git log` de cada pasta de skill | backlog | TASK07 | — |
| TASK15 | OG images por skill | Geradas no build | backlog | TASK07 | — |
| TASK16 | Filtro por agente | Filtro por `metadata.agents` na home | backlog | TASK06 | — |
| TASK17 | Monitoramento e qualidade | Uptime Kuma em `/registry.json`; auditoria Lighthouse ≥ 95 e WCAG AA | backlog | TASK13 | — |
