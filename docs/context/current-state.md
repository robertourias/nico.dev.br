# Status do Projeto

> Memória de trabalho persistente. Atualizado pelo `/checkpoint`, lido pelo `/retomar`.
> Não edite manualmente durante uma sessão ativa — use `/checkpoint` antes de fechar.

**Última atualização:** 2026-09-28
**Resumo de progresso global:** Skills Catalog (skills.nico.dev.br, `apps/skills`) com Fase 1 (MVP) completa e Fase 2 quase inteira: scaffold, registry validado com Zod, conteúdo migrado para o repo `robertourias/skills` (aguardando merge do PR), `<InstallCommand>`/`<CopyButton>` em `packages/ui`, home completa (hero, contadores, lista, busca/filtros, bloco "Encontre no skills.sh"), e página de detalhe `/s/[slug]` (Markdown sanitizado com highlight, árvore de arquivos, badges, links). Falta só o deploy manual na VPS (TASK09) pra fechar a Fase 2.
**Resumo da última sessão:** TASK07 (página `/s/[slug]`) e TASK08 (bloco "Encontre no skills.sh") especificadas, implementadas via `/hands-on` e verificadas no navegador (axe-core no tema real, teclado, 360px via iframe — `resize_window` não reduz o viewport real do Chrome nesta máquina); ambas commitadas.

---

## Feature em andamento

**Spec ativo:** (nenhum — TASK08 fechada; próxima spec ainda não gerada)

---

## Tasks (Foco no Presente)

### 🔄 Em progresso
- (nenhuma — entre tarefas do backlog)

### ⏭ Próximos passos imediatos
1. `/spec TASK09` — deploy manual na VPS (Dockerfile nginx, compose com labels Traefik, primeiro deploy); já desbloqueada (TASK05 e TASK07 concluídas)
2. Capturar as 3 telas reais do skills.sh pro bloco "Encontre no skills.sh" (TASK08, `src/components/skills-sh-block.tsx`) — só possível depois que uma skill deste catálogo estiver indexada lá (precisa de instalação real pós-deploy); comentários no código apontam o enquadramento exato de cada captura
3. Verificar tema **claro** do highlight.js (`/s/[slug]`, TASK07) e do bloco skills.sh (TASK08) ao vivo — máquina de dev está em `prefers-color-scheme: dark`, sem forma de emular nas ferramentas de navegador desta sessão
4. Mergear o PR #1 em `robertourias/skills` (migração de mermaid-diagrams e pencil-design-system) — sem isso o build sem `SKILLS_REF` fixo só enxerga 3 skills
5. Triar a skill `playwright-review` na `main` de `robertourias/skills`: `metadata.category` fora da tupla `CATEGORIES` de `apps/skills/catalog.config.ts` — quebra o build sem `SKILLS_REF`
6. Atualizar o `.pen` do Pencil (fonte de verdade do design system) com os tokens `--color-badge-warning-fg` e `--color-badge-destructive-fg` adicionados na TASK05 — só o CSS/TS foi atualizado, o `.pen` não

---

## Decisões desta sessão

- Markdown de `/s/[slug]` (TASK07): pipeline `unified` direto pra HTML sanitizado (`src/lib/markdown.ts`), não `<ReactMarkdown>` — Server Component 100% estático, testável com `node --test`, zero parser no bundle do cliente; já em `docs/context/decisions.md`
- Tema de syntax highlight (`highlight.js` `github.css`/`github-dark.css`, TASK07) isolado por `@media (prefers-color-scheme)`, exceção documentada à regra "nunca hex direto"
- `skillsShConfig.repoUrl` (TASK08) adicionado a `catalog.config.ts` como fonte única da URL do repositório no skills.sh
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
