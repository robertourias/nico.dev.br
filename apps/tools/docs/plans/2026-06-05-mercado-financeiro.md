# Plano Técnico: Mercado Financeiro

**Spec:** `apps/tools/docs/specs/2026-06-05-mercado-financeiro.md`
**Scope:** `apps/tools`
**Data:** 2026-06-05

---

## Visão Geral da Arquitetura

- Rota: `/mercado` (Server Component)
- Dados B3 / FIIs / Índices: **brapi.dev** (token gratuito via env var)
- Dados Cripto: **CoinGecko API v3** (free tier, sem API key)
- Cache: `next/cache` com `revalidate: 300` (5 min)
- Busca: client-side (filtro em memória, sem nova requisição)
- Gráfico histórico: modal client-side, dados buscados on-demand via Server Action
- Padrão de estrutura seguindo o projeto:
  - Página: `src/app/mercado/page.tsx`
  - Componentes locais: `src/app/mercado/_components/`
  - Lógica/serviços: `src/lib/mercado/`

---

## Contratos de API Externos

### brapi.dev — Cotações

```
GET https://brapi.dev/api/quote/{tickers}
  ?token={BRAPI_TOKEN}

Response:
{
  results: [{
    symbol: string,
    shortName: string,
    regularMarketPrice: number,
    regularMarketChangePercent: number,
  }]
}
```

### brapi.dev — Histórico

```
GET https://brapi.dev/api/quote/{ticker}
  ?range=1mo&interval=1d&token={BRAPI_TOKEN}

Response:
{
  results: [{
    historicalDataPrice: [{ date: number, close: number }]
  }]
}
```

### CoinGecko — Cotações

```
GET https://api.coingecko.com/api/v3/coins/markets
  ?vs_currency=brl
  &ids={bitcoin,ethereum,solana}
  &price_change_percentage=24h

Response: [{
  id: string,
  symbol: string,
  name: string,
  current_price: number,
  price_change_percentage_24h: number,
}]
```

### CoinGecko — Histórico

```
GET https://api.coingecko.com/api/v3/coins/{id}/market_chart
  ?vs_currency=brl&days=30

Response:
{ prices: [[timestamp, price], ...] }
```

---

## Lista Curada de Ativos

| Categoria | Tickers / IDs |
|-----------|--------------|
| Índices | `IBOV`, `IFIX` |
| Ações B3 | `PETR4`, `VALE3`, `ITUB4`, `BBDC4`, `WEGE3` |
| FIIs | `MXRF11`, `HGLG11`, `KNRI11` |
| Cripto | `bitcoin`, `ethereum`, `solana` |

---

## Tarefas Técnicas

---

### Tarefa 1: Tipos e lista curada
Tipo: feature
Agente: frontend

Criar `src/lib/mercado/types.ts` com os tipos compartilhados e `src/lib/mercado/curated-assets.ts` com a lista curada de ativos.

```ts
// types.ts
export type AssetCategory = "indices" | "acoes" | "fiis" | "cripto"

export interface Asset {
  id: string         // ticker B3 ou CoinGecko id
  name: string
  category: AssetCategory
  source: "brapi" | "coingecko"
}

export interface AssetQuote extends Asset {
  price: number      // em BRL
  changePercent: number  // variação % diária
}

export interface HistoricalPoint {
  date: string       // ISO date string
  price: number
}
```

```ts
// curated-assets.ts — lista hardcoded
export const CURATED_ASSETS: Asset[] = [
  { id: "IBOV",     name: "Ibovespa",  category: "indices", source: "brapi" },
  { id: "IFIX",     name: "IFIX",      category: "indices", source: "brapi" },
  { id: "PETR4",    name: "Petrobras", category: "acoes",   source: "brapi" },
  { id: "VALE3",    name: "Vale",      category: "acoes",   source: "brapi" },
  { id: "ITUB4",    name: "Itaú",      category: "acoes",   source: "brapi" },
  { id: "BBDC4",    name: "Bradesco",  category: "acoes",   source: "brapi" },
  { id: "WEGE3",    name: "WEG",       category: "acoes",   source: "brapi" },
  { id: "MXRF11",   name: "MXRF11",   category: "fiis",    source: "brapi" },
  { id: "HGLG11",   name: "HGLG11",   category: "fiis",    source: "brapi" },
  { id: "KNRI11",   name: "KNRI11",   category: "fiis",    source: "brapi" },
  { id: "bitcoin",  name: "Bitcoin",   category: "cripto",  source: "coingecko" },
  { id: "ethereum", name: "Ethereum",  category: "cripto",  source: "coingecko" },
  { id: "solana",   name: "Solana",    category: "cripto",  source: "coingecko" },
]
```

Critérios de Aceite:
- [ ] Tipos exportados sem imports de framework
- [ ] Lista curada cobre as 4 categorias

---

### Tarefa 2: Serviços de fetch (brapi + CoinGecko)
Tipo: feature
Agente: frontend

Criar `src/lib/mercado/brapi.ts` e `src/lib/mercado/coingecko.ts` com funções de fetch server-side com `next/cache`.

```ts
// brapi.ts
export async function fetchBrapiQuotes(tickers: string[]): Promise<AssetQuote[]>
export async function fetchBrapiHistory(ticker: string): Promise<HistoricalPoint[]>

// coingecko.ts
export async function fetchCryptoQuotes(ids: string[]): Promise<AssetQuote[]>
export async function fetchCryptoHistory(id: string): Promise<HistoricalPoint[]>
```

- Usar `fetch(..., { next: { revalidate: 300 } })` em todas as chamadas de cotação
- Histórico: sem cache longo (busca on-demand via Server Action)
- Variável de ambiente: `BRAPI_TOKEN` (obrigatória; throw em build se ausente)
- Em caso de erro da API: retornar array vazio + `console.error` (não quebrar a página)

Critérios de Aceite:
- [ ] `BRAPI_TOKEN` lida de `process.env.BRAPI_TOKEN`
- [ ] Fetch com `revalidate: 300` confirmado nas cotações
- [ ] Erros de API não propagam exceção para a página

---

### Tarefa 3: Server Action para histórico
Tipo: feature
Agente: frontend

Criar `src/app/mercado/_actions/fetch-history.ts` — Server Action que recebe `{ id, source }` e retorna `HistoricalPoint[]`.

```ts
"use server"
export async function fetchAssetHistory(
  id: string,
  source: "brapi" | "coingecko"
): Promise<HistoricalPoint[]>
```

- Chama `fetchBrapiHistory` ou `fetchCryptoHistory` conforme `source`
- Sem cache (dados buscados on-demand ao abrir modal)

Critérios de Aceite:
- [ ] Action retorna array vazio em erro (não lança)
- [ ] Roteamento correto por `source`

---

### Tarefa 4: Componente `AssetCard`
Tipo: feature
Agente: frontend

Criar `src/app/mercado/_components/asset-card.tsx` — card visual de um ativo.

Props:
```ts
interface AssetCardProps {
  quote: AssetQuote
  onClick: (quote: AssetQuote) => void
}
```

Layout:
- Nome do ativo + ticker/símbolo
- Preço atual formatado em BRL (`Intl.NumberFormat`)
- Variação % com badge: verde (`text-green-600`) se positivo, vermelho (`text-red-600`) se negativo
- Clicável inteiro (cursor-pointer)
- Usar `ItemCard` de `@nico.dev/ui` como base

Critérios de Aceite:
- [ ] Variação positiva = verde, negativa = vermelho
- [ ] Preço formatado em BRL (ex: "R$ 34,50")
- [ ] Click dispara `onClick` com o ativo

---

### Tarefa 5: Componente `AssetChart` (modal com gráfico histórico)
Tipo: feature
Agente: frontend

Criar `src/app/mercado/_components/asset-chart.tsx` — modal com gráfico de linha do histórico.

```ts
interface AssetChartProps {
  asset: AssetQuote | null   // null = fechado
  onClose: () => void
}
```

- Abrir via `Dialog` de `@nico.dev/ui` (Radix Dialog)
- Ao abrir: chamar `fetchAssetHistory` Server Action → renderizar gráfico
- Gráfico: usar `recharts` (já disponível ou adicionar) ou solução leve de SVG
- Período fixo: 30 dias
- Estado de loading com skeleton durante fetch

Critérios de Aceite:
- [ ] Modal abre/fecha corretamente
- [ ] Gráfico renderiza linha de preços dos últimos 30 dias
- [ ] Estado de loading visível enquanto busca dados
- [ ] Fechar reseta estado do gráfico

Notas: Verificar se `recharts` está no workspace antes de instalar. Se não estiver, usar SVG simples ou `@nico.dev/ui` chart primitivo.

---

### Tarefa 6: Componente `AssetGrid` (client — busca + grade)
Tipo: feature
Agente: frontend

Criar `src/app/mercado/_components/asset-grid.tsx` — componente client que recebe todos os quotes, gerencia busca e estado do modal.

```ts
"use client"
interface AssetGridProps {
  quotes: AssetQuote[]
}
```

- Campo de busca (input text) filtra `quotes` por `name` ou `id` (case-insensitive)
- Grade CSS Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Agrupamento por categoria com `<h2>` de seção (Índices, Ações B3, FIIs, Criptomoedas)
- Estado `selectedAsset: AssetQuote | null` controla abertura do `AssetChart`

Critérios de Aceite:
- [ ] Busca filtra em tempo real sem requisição à API
- [ ] Grupos de categoria com heading visível
- [ ] Clicar em card abre modal com gráfico

---

### Tarefa 7: Página `/mercado` (Server Component)
Tipo: feature
Agente: frontend

Criar `src/app/mercado/page.tsx` — Server Component que busca todos os quotes e passa para `AssetGrid`.

```ts
// sem "use client"
export default async function MercadoPage()
```

- Separar ativos da lista curada por `source`
- Chamar `fetchBrapiQuotes` e `fetchCryptoQuotes` em paralelo (`Promise.all`)
- Mesclar resultados em `AssetQuote[]` preservando a ordem da lista curada
- Renderizar `<ToolPageHeader>` + `<AssetGrid quotes={quotes} />`
- `export const revalidate = 300`

Critérios de Aceite:
- [ ] Dados buscados em paralelo (não sequencial)
- [ ] Página renderiza mesmo se uma das APIs falhar (array vazio parcial)
- [ ] `revalidate = 300` exportado

---

### Tarefa 8: Ativar card na home + configurar env var
Tipo: chore
Agente: frontend

**8a — Home (`src/app/page.tsx`):**
Alterar o item `market` de `status: "coming-soon"` para `status: "active"` com `href: "/mercado"`.

**8b — Variável de ambiente:**
Adicionar `BRAPI_TOKEN` ao `.env.example` (ou equivalente do projeto) com instrução de obter token gratuito em brapi.dev.

Critérios de Aceite:
- [ ] Card "Mercado Financeiro" na home aponta para `/mercado` e não mostra badge "Em breve"
- [ ] `BRAPI_TOKEN` documentada no env example

---

## Ordem de Execução

```
Tarefa 1 → Tarefa 2 → Tarefa 3
                              ↓
              Tarefa 4 → Tarefa 5 → Tarefa 6 → Tarefa 7 → Tarefa 8
```

Tarefas 1-3 são pré-requisitos de 4-7. Tarefa 8 é última (ativa o link público).
