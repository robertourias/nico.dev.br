# Status do Projeto

> Memória de trabalho persistente. Atualizado pelo `/checkpoint`, lido pelo `/retomar`.
> Não edite manualmente durante uma sessão ativa — use `/checkpoint` antes de fechar.

**Última atualização:** 2026-09-30
**Resumo de progresso global:** `apps/skills` (Skills Catalog) removido do monorepo em 2026-10-02 — não será mais utilizado.
**Resumo da última sessão:** Corrigido build da Vercel (categoria `testing` adicionada a `CATEGORIES`), TASK09 fechada via `/recheck`, specs concluídas arquivadas.

---

## Feature em andamento

**Spec ativo:** —

---

## Tasks (Foco no Presente)

### 🔄 Em progresso
- (nenhuma)

### ⏭ Próximos passos imediatos
1. (nenhum)

---

## Decisões desta sessão

- `CATEGORIES` ganhou `testing` (em vez de manter pin de `SKILLS_REF`): upstream já usa a categoria; o pin ficaria obsoleto e travaria o catálogo em 5 skills
- Pin de `SKILLS_REF` a ser removido (decisão do usuário) — Spec TASK09 fechada com o pin ainda descrito em FR-001

> Decisões estruturais de sessões anteriores já promovidas para `docs/context/decisions.md` e `docs/context/ui-guidelines.md`.

---

## Bloqueadores / Perguntas abertas

- Pin de `SKILLS_REF` ainda no código (ver Em progresso); confirmar se o deploy testado já rodou sem ele
- `.pen` do Pencil desatualizado em relação aos tokens `--color-badge-warning-fg` e `--color-badge-destructive-fg`
