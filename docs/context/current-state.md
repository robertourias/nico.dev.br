# Status do Projeto

> Memória de trabalho persistente. Atualizado pelo `/checkpoint`, lido pelo `/retomar`.
> Não edite manualmente durante uma sessão ativa — use `/checkpoint` antes de fechar.

**Última atualização:** 2026-10-03
**Resumo de progresso global:** `apps/skills` removido do monorepo. `apps/tools` `/clt-pj` com os 3 modos de comparação e renda efetiva Mensal x Completa. CI (Node 22, só lint + build) e lint verdes nos 6 apps cobertos; deploy de produção é da Vercel.
**Resumo da última sessão:** Removido `apps/skills`, entregue "Renda Efetiva Mensal/Completa" (PR #17), corrigido o CI (Node 22, deploy duplicado) e zerada a dívida de lint (PR #18); Pages desligado e projetos Vercel de skills apagados. Tudo mergeado em `main`.

---

## Feature em andamento

**Spec ativo:** —

---

## Tasks (Foco no Presente)

### 🔄 Em progresso
- (nenhuma)

### ⏭ Próximos passos imediatos
1. Decidir o destino do projeto Vercel `skills-web` (ainda serve `skills.nico.dev.br`, mas o código saiu do repo) e do DNS/VPS de skills
2. Dar um destino às Specs legadas em `docs/specs/` (11 com critérios `[ ]` em aberto, `Status: approved`): fechar, arquivar ou reabrir
3. Limpar os 21 warnings de lint restantes do `apps/tools` (`exhaustive-deps`, `no-unused-vars`) e, se quiser, adicionar script de lint/typecheck ao `blog` e ao `api`

---

## Decisões desta sessão

- `apps/skills` removido; infra fora do repo é manual (ver decisions.md → Skills Catalog)
- Node ≥ 22.13; Actions só verifica, Vercel faz o deploy (ver decisions.md → CI/CD e lint)
- Todo app com script `lint` precisa de `eslint.config`; `set-state-in-effect` com disable só para localStorage/Web Worker
- `turbo` pinado em 2.11.4 (era `latest`)

---

## Bloqueadores / Perguntas abertas

- `skills-web` (Vercel) segue no ar apontando para código removido — destino a definir
- `apps/api` e `apps/criativo` não têm job no CI; `blog` não tem script de lint
