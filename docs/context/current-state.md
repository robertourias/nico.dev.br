# Status do Projeto

> Memória de trabalho persistente. Atualizado pelo `/checkpoint`, lido pelo `/retomar`.
> Não edite manualmente durante uma sessão ativa — use `/checkpoint` antes de fechar.

**Última atualização:** 2026-09-30
**Resumo de progresso global:** Skills Catalog (skills.nico.dev.br, `apps/skills`) com Fases 1 e 2 completas: scaffold, registry Zod, home, busca/filtros, `/s/[slug]`, bloco skills.sh e deploy manual na VPS (TASK09 `done`, site no ar). Próximas fases no backlog: packs, tópicos, SEO, CI/CD (TASK13).
**Resumo da última sessão:** Corrigido build da Vercel (categoria `testing` adicionada a `CATEGORIES`), TASK09 fechada via `/recheck`, specs concluídas arquivadas.

---

## Feature em andamento

**Spec ativo:** docs/apps/tools/specs/2026-10-01-clt-pj-forms.md

---

## Tasks (Foco no Presente)

### 🔄 Em progresso
- apps/skills - remover pin de `SKILLS_REF` (Dockerfile:24-27, docker-compose.yml:23) — 0% — próximo passo: `/back apps/skills remover pin de SKILLS_REF (default main)`

### ⏭ Próximos passos imediatos
1. Capturar as 3 telas reais do skills.sh pro bloco "Encontre no skills.sh" (`src/components/skills-sh-block.tsx`) — agora possível: site no ar, precisa de skill indexada no skills.sh
2. Verificar tema **claro** do highlight.js (`/s/[slug]`) e do bloco skills.sh ao vivo (dev estava em `prefers-color-scheme: dark`)
3. Planejar TASK13 (CI/CD: GitHub Actions → GHCR → deploy via SSH), desbloqueada pela TASK09

---

## Decisões desta sessão

- `CATEGORIES` ganhou `testing` (em vez de manter pin de `SKILLS_REF`): upstream já usa a categoria; o pin ficaria obsoleto e travaria o catálogo em 5 skills
- Pin de `SKILLS_REF` a ser removido (decisão do usuário) — Spec TASK09 fechada com o pin ainda descrito em FR-001

> Decisões estruturais de sessões anteriores já promovidas para `docs/context/decisions.md` e `docs/context/ui-guidelines.md`.

---

## Bloqueadores / Perguntas abertas

- Pin de `SKILLS_REF` ainda no código (ver Em progresso); confirmar se o deploy testado já rodou sem ele
- `.pen` do Pencil desatualizado em relação aos tokens `--color-badge-warning-fg` e `--color-badge-destructive-fg`
