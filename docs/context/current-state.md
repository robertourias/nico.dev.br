# Status do Projeto

> Memória de trabalho persistente. Atualizado pelo `/checkpoint`, lido pelo `/retomar`.
> Não edite manualmente durante uma sessão ativa — use `/checkpoint` antes de fechar.

**Última atualização:** 2026-09-27 21:33
**Resumo de progresso global:** Skills Catalog (skills.nico.dev.br, `apps/skills`) com Fase 1 (MVP) e a primeira metade da Fase 2 prontas: scaffold, registry validado com Zod, conteúdo migrado para o repo `robertourias/skills` (aguardando merge do PR), `<InstallCommand>`/`<CopyButton>` em `packages/ui`, e a home completa com hero, contadores, lista e busca/filtros. Faltam da Fase 2: página `/s/[slug]` (TASK07), bloco "Encontre no skills.sh" (TASK08) e deploy manual (TASK09).
**Resumo da última sessão:** TASK05 (home) e TASK06 (busca e filtros) especificadas, implementadas via `/hands-on` e verificadas no navegador (axe-core, teclado, 360px); ambas commitadas. `/checkpoint` executado ao final: 6 specs concluídas arquivadas.

---

## Feature em andamento

**Spec ativo:** (nenhum — TASK06 fechada; próxima spec ainda não gerada)

---

## Tasks (Foco no Presente)

### 🔄 Em progresso
- (nenhuma — entre tarefas do backlog)

### ⏭ Próximos passos imediatos
1. `/spec TASK07` — página `/s/[slug]` (badges, SKILL.md renderizado com sanitize+highlight, árvore de arquivos, links GitHub/skills.sh)
2. `/spec TASK08` — bloco "Encontre no skills.sh" na home + rota `/skills-sh`
3. Mergear o PR #1 em `robertourias/skills` (migração de mermaid-diagrams e pencil-design-system) — sem isso o build sem `SKILLS_REF` fixo só enxerga 3 skills
4. Triar a skill `playwright-review` na `main` de `robertourias/skills`: `metadata.category` fora da tupla `CATEGORIES` de `apps/skills/catalog.config.ts` — quebra o build sem `SKILLS_REF`
5. Atualizar o `.pen` do Pencil (fonte de verdade do design system) com os tokens `--color-badge-warning-fg` e `--color-badge-destructive-fg` adicionados na TASK05 — só o CSS/TS foi atualizado, o `.pen` não

---

## Decisões desta sessão

- Skills Catalog vive em `apps/skills` neste monorepo (não repo isolado), reaproveitando `@nico.dev/ui`; conteúdo (`skills/`, `packs/`) mora no repo público `robertourias/skills` e é sincronizado no build (`content:sync`, `SKILLS_REF`/`SKILLS_ROOT`) — já em `docs/architecture/overview.md` e `docs/context/decisions.md`
- Idioma da `description` das skills: inglês — já em `docs/context/product.md`
- Runner de testes de componentes: Vitest + Testing Library em `packages/ui` (Jest nunca foi configurado) — já em `docs/context/ui-guidelines.md` e `docs/context/decisions.md`
- `apps/skills` usa `node --import tsx --test` para lógica pura (sem harness de componente); verificação de UI é manual no navegador (axe-core + teclado), documentada em cada spec arquivada
- Achado (não corrigido): `ToggleFilterGroup mode="multiple"` em `packages/ui` é código morto, sem consumidor — registrado em `docs/archive/2026-09-27-skills-search-filters.md`, sugerida tarefa própria de correção/remoção
- Tokens de contraste novos em `packages/ui` (`badge-warning-fg`, `badge-destructive-fg`) para badges `warning`/`destructive` passarem AA no tema claro — já em `tokens.css`/`colors.ts`; `.pen` do Pencil pendente de atualização manual (ver Próximos passos)

---

## Bloqueadores / Perguntas abertas

- PR #1 (`robertourias/skills`, branch `feat/migrate-mermaid-pencil`) aberto, aguardando merge do usuário
- Skill `playwright-review` na `main` do repo de skills tem `category` inválida para `catalog.config.ts` — bloqueia build sem `SKILLS_REF` fixo
- `.pen` do Pencil desatualizado em relação aos 2 tokens de contraste novos
