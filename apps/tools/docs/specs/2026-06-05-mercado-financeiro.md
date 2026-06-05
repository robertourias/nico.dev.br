# Spec: Mercado Financeiro

**Status:** approved
**Data:** 2026-06-05
**Autor:** planner-agent

---

## Problema

A ferramenta "Mercado Financeiro" está listada na home de tools.nico.dev como "em breve", mas não existe implementação. Investidores e devs que usam o site não têm acesso rápido a cotações e variações de ativos brasileiros e cripto em um único lugar sem precisar abrir múltiplas fontes.

---

## Cenários de Usuário

- **P1 (crítico):** Como visitante, quero ver uma lista curada de ativos (ações B3, FIIs, cripto, índices) com preço atual e variação % do dia, para monitorar o mercado rapidamente.
- **P2 (importante):** Como visitante, quero buscar um ativo específico por código (ticker/símbolo), para encontrá-lo sem rolar a lista inteira.
- **P3 (nice-to-have):** Como visitante, quero ver um gráfico histórico do ativo ao clicar nele, para entender a tendência recente.

---

## Requisitos Funcionais

- **FR-001:** A página `/mercado` exibe uma lista curada de ativos agrupados por categoria: Índices, Ações B3, FIIs, Criptomoedas.
- **FR-002:** Cada card de ativo exibe: nome/ticker, preço atual (em BRL), variação % diária com cor verde (positivo) / vermelho (negativo).
- **FR-003:** Um campo de busca filtra os ativos da lista por ticker ou nome em tempo real (client-side, sem nova requisição à API).
- **FR-004:** Ao clicar em um ativo, um painel/modal exibe o gráfico histórico de preços (período padrão: 1 mês).
- **FR-005:** Os dados são obtidos via APIs gratuitas: brapi.dev para ações B3, FIIs e índices; CoinGecko API para criptomoedas.
- **FR-006:** Os dados são buscados no servidor (Server Component / Server Action) com revalidação a cada 5 minutos via `next/cache`.
- **FR-007:** A ferramenta é acessível via link na home (`/mercado`), com o card saindo do estado "em breve".

---

## Critérios de Sucesso

- [ ] Página `/mercado` carrega com lista curada de ativos em todas as categorias.
- [ ] Preço e variação % exibidos corretamente para cada ativo.
- [ ] Variação positiva = verde, negativa = vermelho.
- [ ] Busca filtra ativos sem reload de página.
- [ ] Gráfico histórico abre ao clicar em ativo.
- [ ] Dados revalidados a cada 5 minutos (sem requisição a cada visita).
- [ ] Card na home aponta para `/mercado` (status active).

---

## Fora do Escopo

- Watchlist personalizada por usuário (sem autenticação nesta iteração).
- Dados em tempo real / WebSocket (revalidação por cache é suficiente).
- Cotações em USD — apenas BRL nesta versão.
- Dados fundamentalistas (P/L, DY, ROE, etc.).
- Alertas de preço.

---

## Riscos e Premissas

- **Premissa:** brapi.dev e CoinGecko possuem tier gratuito com limites suficientes para o volume do site (sem autenticação de usuários).
- **Risco:** Rate limit das APIs gratuitas em picos de tráfego → Mitigação: cache de 5 min no servidor reduz drasticamente requisições; brapi.dev exige token gratuito (cadastro simples).
- **Risco:** Lista curada fica desatualizada (tickers mudam, ativos são delistados) → Mitigação: lista hardcoded pequena e fácil de manter; revisão manual periódica.
- **Premissa:** O gráfico histórico pode ser obtido das mesmas APIs (brapi.dev retorna série histórica; CoinGecko tem endpoint `/market_chart`).

---

<!-- 
GATE DE APROVAÇÃO
Para desbloquear a criação do plano técnico, altere o Status acima de "draft" para "approved".
O agente planner NÃO deve criar tasks de implementação enquanto Status for "draft".
-->
