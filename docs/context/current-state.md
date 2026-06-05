# Status do Projeto

> Memória de trabalho persistente. Atualizado pelo `/checkpoint`, lido pelo `/retomar`.
> Não edite manualmente durante uma sessão ativa — use `/checkpoint` antes de fechar.

**Última atualização:** 2026-06-05
**Resumo da última sessão:** Nova ferramenta Mercado Financeiro (`/mercado`) com cotações de ações B3, FIIs, índices e cripto via Yahoo Finance + CoinGecko; ajustes visuais na listagem de ferramentas (altura dos cards, links em nova guia, remoção de itens obsoletos).

---

## Feature em andamento

**Spec ativo:** `apps/tools/docs/specs/2026-06-05-mercado-financeiro.md` (Status: approved — implementação concluída)
**Plano ativo:** `apps/tools/docs/plans/2026-06-05-mercado-financeiro.md`

---

## Tasks

### ✅ Concluídas

**apps/tools — listagem (home):**
- Removidos cards "Buscador Semântico" e "Classificador de Conteúdo" da listagem
- `ItemCard` com `min-h-[3.75rem]` na descrição — altura padronizada para 3 linhas
- Links ativos abrem em nova guia (`target="_blank" rel="noopener noreferrer"`)

**apps/tools — Mercado Financeiro (`/mercado`):**
- Spec + plano gerados e aprovados
- `src/lib/mercado/types.ts` — tipos compartilhados (`AssetQuote`, `HistoricalPoint`, etc.)
- `src/lib/mercado/curated-assets.ts` — 13 ativos (B3 `.SA`, índices `^`, cripto)
- `src/lib/mercado/yahoo-finance.ts` — cotações e histórico via Yahoo Finance com crumb auth
- `src/lib/mercado/coingecko.ts` — cotações e histórico via CoinGecko (sem chave)
- `src/app/mercado/page.tsx` — Server Component, `revalidate: 300`
- `src/app/mercado/_actions/fetch-history.ts` — Server Action para histórico on-demand
- `src/app/mercado/_components/asset-card.tsx` — card com preço BRL + variação colorida
- `src/app/mercado/_components/asset-chart.tsx` — modal com gráfico recharts 30 dias
- `src/app/mercado/_components/asset-grid.tsx` — busca client-side + grade agrupada por categoria
- Card "Mercado Financeiro" na home ativado com `href: "/mercado"`

### 🔄 Em progresso
- (nenhum — todas as tasks concluídas)

### ⏭ Próximos passos
1. Testar autenticação Yahoo Finance (crumb) em produção — verificar se `fc.yahoo.com` responde corretamente no Vercel
2. Gerar nova GEMINI_API_KEY válida e atualizar `apps/tools/.env.local` (chave atual sem quota free tier)
3. Deploy do blog no Vercel (`blog.nico.dev.br`) e testar visual em produção
4. Implementar compartilhamento social (botões Share na página do post do blog)
5. Lighthouse audit no post imersivo do blog (meta: ≥ 90 Performance)

---

## Decisões desta sessão

- Yahoo Finance requer crumb auth server-side: fluxo `fc.yahoo.com` → `/v1/test/getcrumb` → requests com cookie+crumb
- brapi.dev descartado: codificação `%5E` do `^BVSP` causava 400, e free tier problemático
- Fonte escolhida: Yahoo Finance (B3 com `.SA` suffix) + CoinGecko (cripto) — ambos gratuitos sem cadastro
- `recharts` já disponível em `apps/tools` — reutilizado para gráfico histórico
- Modal de histórico implementado via overlay CSS puro (sem Radix Dialog, não disponível em `@nico.dev/ui`)
- `brapi.ts` mantido como arquivo morto no repo — pode ser deletado manualmente

---

## Bloqueadores / Perguntas abertas

- Crumb Yahoo Finance precisa de validação em ambiente de produção (IP de servidor pode ser bloqueado)
- Chave GEMINI_API_KEY atual (`AQ.Ab8...`) tem `limit: 0` em todos os modelos free tier — precisa nova chave do AI Studio
- Deploy do blog não configurado no Vercel ainda
- `brapi.ts` em `apps/tools/src/lib/mercado/` — arquivo morto, remover
