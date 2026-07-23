# Status do Projeto

> Memória de trabalho persistente. Atualizado pelo `/checkpoint`, lido pelo `/retomar`.
> Não edite manualmente durante uma sessão ativa — use `/checkpoint` antes de fechar.

**Última atualização:** 2026-07-22 (refresh retroativo — ver nota abaixo)
**Resumo de progresso global:** Monorepo com 7 apps Next.js (`web-nico.dev.br`, `tools`, `challenges`, `metronome`, `criativo`, `storybook`) + Astro (`blog`) + primeiro backend NestJS (`api`, feature de claps). `packages/ui` maduro (22 componentes, design tokens, Storybook próprio).
**Resumo da última sessão:** Nenhuma sessão de implementação registrou checkpoint entre 2026-06-08 e hoje — este arquivo estava **59 commits desatualizado**. Esta entrada é um refresh retroativo feito pelo PLANNER a partir de `git log`, não um checkpoint de sessão real. Precisão limitada ao que dá para inferir de mensagens de commit — ver nota de bloqueadores.

---

## Feature em andamento

**Spec ativo:** (nenhum spec com `Status: approved` parece ter task pendente — todas as specs em `docs/specs/` têm 0 critérios de aceite marcados `[x]`, mas várias claramente já têm código shippado; ver Bloqueadores)
**Plano ativo:** (nenhum)

---

## Tasks (Foco no Presente)

### 🔄 Em progresso
- (não identificável a partir do git log sozinho — próxima sessão real deve rodar `/checkpoint` a partir do trabalho em andamento, não deste refresh)

### ⏭ Próximos passos imediatos
1. Rodar um `/checkpoint` de verdade na próxima sessão de trabalho (este arquivo hoje só reflete git log, não decisões/contexto de sessão)
2. Resolver o drift entre `docs/architecture/overview.md` (lista `apps/web/`) e o código real (`apps/web-nico.dev.br/`, mais `apps/criativo/` não listado) — ver Bloqueadores
3. Documentar `apps/criativo` (não tem `docs/context/` nem `docs/specs/` próprios, diferente dos outros apps do monorepo)
4. Decidir o que fazer com as 13 specs em `docs/specs/` sem nenhum critério de aceite marcado `[x]` apesar de features aparentemente já em produção (currency-converter, pomodoro-timer, wake-lock, ui-header-compound, etc. têm plano correspondente em `docs/plans/`)

---

## Decisões desta sessão

- Nenhuma decisão de produto/arquitetura tomada nesta sessão — trabalho foi 100% documentação (gap-fill de `docs/architecture/frontend.md`, `docs/architecture/backend.md`, `docs/comparativo-scaffold-vs-superpowers.md`, e este refresh)

---

## Bloqueadores / Perguntas abertas

- **Drift em `docs/architecture/overview.md`**: estrutura documentada lista `apps/web/` — diretório real é `apps/web-nico.dev.br/`. `apps/criativo/` existe no código (5+ landing pages: NEXUS Summit, energia solar, imobiliária premium, simulador economia doméstica, teste de perfil profissional) mas não aparece na lista de apps do overview. Não corrigido neste refresh — `overview.md` já está preenchido e o escopo desta sessão foi gap-fill, não edição de arquivo existente. Sinalizar para o PLANNER confirmar e atualizar.
- **`docs/archive/` vazio apesar de specs aparentemente concluídas**: todas as 13 specs ativas têm 0/N critérios de aceite marcados `[x]`, incluindo specs de 05-15 (turborepo-setup) e 06-25 (api-claps-backend) que claramente têm código funcionando. Regra de arquivamento (`docs/workflows/feature-delivery.md` Fase 6) exige todos os critérios marcados antes de mover para `archive/` — não marcado retroativamente aqui porque isso exigiria verificar critério por critério contra o código (fora do escopo de um gap-fill de documentação, risco de inventar confirmação).
- **`docs/context/domains/` vazio**: avaliado nesta sessão — `product.md` (134 linhas) ainda cobre o produto inteiro sem ficar monolítico; não há domínio de negócio grande o suficiente para justificar fragmentação hoje. Não é uma lacuna, é avaliação feita e decidida por "não fragmentar por enquanto".
- **Resumo de trabalho 06-08→07-22 (59 commits, só por mensagem de commit, não verificado no código)**: novo backend `apps/api` + integração de claps no blog; várias landing pages novas em `apps/criativo`; `apps/web-nico.dev.br` ganhou filtro de projetos, novos projetos de portfólio, i18n em footer; `apps/blog` ganhou controle de tamanho de fonte, novas categorias, botão de compartilhamento, vários posts novos; logos/favicons atualizados em múltiplos apps.
