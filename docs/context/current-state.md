# Status do Projeto

> Memória de trabalho persistente. Atualizado pelo `/checkpoint`, lido pelo `/retomar`.
> Não edite manualmente durante uma sessão ativa — use `/checkpoint` antes de fechar.

**Última atualização:** 2026-09-28
**Resumo de progresso global:** Skills Catalog (skills.nico.dev.br, `apps/skills`) com Fase 1 (MVP) completa e Fase 2 quase inteira: scaffold, registry validado com Zod, conteúdo migrado para o repo `robertourias/skills` (aguardando merge do PR), `<InstallCommand>`/`<CopyButton>` em `packages/ui`, home completa (hero, contadores, lista, busca/filtros, bloco "Encontre no skills.sh"), e página de detalhe `/s/[slug]` (Markdown sanitizado com highlight, árvore de arquivos, badges, links). Falta só o deploy manual na VPS (TASK09) pra fechar a Fase 2.
**Resumo da última sessão:** TASK07 (página `/s/[slug]`) e TASK08 (bloco "Encontre no skills.sh") especificadas, implementadas via `/hands-on` e verificadas no navegador (axe-core no tema real, teclado, 360px via iframe — `resize_window` não reduz o viewport real do Chrome nesta máquina); ambas commitadas.

---

## Feature em andamento

**Spec ativo:** `docs/specs/2026-09-29-skills-deploy-vps.md` (TASK09, Status: review — aguardando `/approve`)

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

- Markdown de `/s/[slug]` (TASK07): pipeline `unified` direto pra HTML sanitizado, não `<ReactMarkdown>` — detalhe completo em `docs/context/decisions.md` (Skills Catalog)
- Tema de syntax highlight isolado por `@media (prefers-color-scheme)` — exceção à regra "nunca hex direto", documentada em `decisions.md`
- `skillsShConfig.repoUrl` (TASK08) adicionado a `catalog.config.ts`

> Decisões estruturais de sessões anteriores (stack, testes, tokens de contraste) já promovidas para `docs/context/decisions.md` e `docs/context/ui-guidelines.md` — não repetidas aqui.

---

## Bloqueadores / Perguntas abertas

- PR #1 (`robertourias/skills`, branch `feat/migrate-mermaid-pencil`) aberto, aguardando merge do usuário
- Skill `playwright-review` na `main` do repo de skills tem `category` inválida para `catalog.config.ts` — bloqueia build sem `SKILLS_REF` fixo
- `.pen` do Pencil desatualizado em relação aos 2 tokens de contraste novos
