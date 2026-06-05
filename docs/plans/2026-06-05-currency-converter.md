# Plano Técnico: Conversor de Moedas

**Spec:** `docs/specs/2026-06-05-currency-converter.md`
**Status:** ready
**Data:** 2026-06-05
**Agente:** frontend

---

## Contexto

Feature nova em `apps/tools/` (tools.nico.dev). Sem banco, sem auth, sem backend NestJS.
Dados externos via dois provedores:
- **Frankfurter** (`api.frankfurter.app`) — fiat, open, sem API key
- **CoinGecko** (`api.coingecko.com/api/v3`) — cripto, free tier, sem API key

Recharts já instalado. Sem novas dependências.

---

## Estrutura de Arquivos

```
apps/tools/src/
  app/
    conversor-moedas/
      page.tsx                         ← Server Component
      _components/
        CurrencyConverter.tsx          ← 'use client' — orquestra conversor + gráfico
        ExchangeChart.tsx              ← 'use client' — recharts LineChart
        RatesTable.tsx                 ← display puro, recebe props do Server
      _lib/
        currency-data.ts              ← constantes, tipos, helpers de roteamento
        format.ts                     ← formatadores de número/moeda
    api/
      exchange-rate/route.ts          ← GET ?from&to → taxa atual
      exchange-history/route.ts       ← GET ?from&to → 12 meses histórico
      market-rates/route.ts           ← GET → tabela todas vs BRL
  app/page.tsx                        ← adicionar entry "Conversor de Moedas"
```

---

## Contratos de API

### `GET /api/exchange-rate?from=BRL&to=USD`
```json
{ "from": "BRL", "to": "USD", "rate": 0.1923, "timestamp": "2026-06-05T12:00:00Z" }
```
Cache: `revalidate = 300` (5 min). Errors: `{ "error": "string" }` com status 502.

### `GET /api/exchange-history?from=BRL&to=USD`
```json
{ "labels": ["2025-06-05", "2025-06-06", "..."], "values": [0.1901, 0.1908, "..."] }
```
Cache: `revalidate = 3600` (1h). Sempre 365 pontos diários. Errors: 502.

### `GET /api/market-rates`
```json
[
  { "code": "USD", "name": "Dólar Americano", "type": "fiat",   "rateInBRL": 5.19,    "change24h": -0.23 },
  { "code": "BTC", "name": "Bitcoin",          "type": "crypto", "rateInBRL": 522000,  "change24h": 2.41  }
]
```
Cache: `revalidate = 300`. Moedas na ordem: USD, EUR, JPY, GBP, CRC, BTC, ETH, BNB, SOL, XRP, USDT. BRL excluída (é a base).

---

## Lógica de Roteamento por Tipo de Par

```
fiat  → fiat  : Frankfurter
crypto → fiat  : CoinGecko simple/price  
fiat  → crypto : CoinGecko simple/price + inverter (1 / rate)
crypto → crypto: CoinGecko, pivot USD
```

Histórico:
```
fiat/fiat   : Frankfurter /{start}..{end}?from=X&to=Y
qualquer cripto: CoinGecko /coins/{id}/market_chart?vs_currency={fiat}&days=365
fiat/cripto : CoinGecko do cripto destino em {from}, inverter séries
cripto/cripto: CoinGecko de cada moeda em USD, dividir séries
```

---

## Tarefas

---

### Tarefa 1: Currency Data & Types
Tipo: feature
Agente: frontend

Criar `apps/tools/src/app/conversor-moedas/_lib/currency-data.ts`:

```ts
export type CurrencyType = 'fiat' | 'crypto'

export interface Currency {
  code: string        // "BRL", "BTC"
  name: string        // "Real Brasileiro", "Bitcoin"
  type: CurrencyType
  coingeckoId?: string  // só cripto
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'Dólar Americano',    type: 'fiat' },
  { code: 'EUR', name: 'Euro',               type: 'fiat' },
  { code: 'BRL', name: 'Real Brasileiro',    type: 'fiat' },
  { code: 'JPY', name: 'Iene Japonês',       type: 'fiat' },
  { code: 'GBP', name: 'Libra Esterlina',    type: 'fiat' },
  { code: 'CRC', name: 'Colón Costarriquenho', type: 'fiat' },
  { code: 'BTC', name: 'Bitcoin',            type: 'crypto', coingeckoId: 'bitcoin' },
  { code: 'ETH', name: 'Ethereum',           type: 'crypto', coingeckoId: 'ethereum' },
  { code: 'BNB', name: 'BNB',               type: 'crypto', coingeckoId: 'binancecoin' },
  { code: 'SOL', name: 'Solana',             type: 'crypto', coingeckoId: 'solana' },
  { code: 'XRP', name: 'XRP',               type: 'crypto', coingeckoId: 'ripple' },
  { code: 'USDT', name: 'Tether',            type: 'crypto', coingeckoId: 'tether' },
]

export const FIAT_CODES  = CURRENCIES.filter(c => c.type === 'fiat').map(c => c.code)
export const CRYPTO_CODES = CURRENCIES.filter(c => c.type === 'crypto').map(c => c.code)

export function isCrypto(code: string): boolean {
  return CRYPTO_CODES.includes(code)
}

export function getCurrency(code: string): Currency {
  const c = CURRENCIES.find(c => c.code === code)
  if (!c) throw new Error(`Unknown currency: ${code}`)
  return c
}
```

Criar `apps/tools/src/app/conversor-moedas/_lib/format.ts`:

```ts
export function formatRate(value: number, toCurrency: string): string {
  // cripto tem mais casas decimais
  const isCryptoTarget = ['BTC','ETH','BNB','SOL','XRP','USDT'].includes(toCurrency)
  const decimals = isCryptoTarget ? 8 : 4
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: decimals })
}

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatChange(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}
```

Critérios de Aceite:
- [ ] `isCrypto('BTC')` retorna `true`, `isCrypto('USD')` retorna `false`
- [ ] `getCurrency('XRP').coingeckoId` retorna `'ripple'`
- [ ] `formatBRL(5192.5)` retorna string com "R$" e vírgula decimal

Notas: Validar CRC no Frankfurter antes de implementar Tarefa 2. Endpoint de teste: `https://api.frankfurter.app/latest?from=BRL&to=CRC`. Se retornar erro, remover CRC das fiat e documentar no spec.

---

### Tarefa 2: Route Handler — Taxa Atual
Tipo: feature
Agente: frontend

Criar `apps/tools/src/app/api/exchange-rate/route.ts`:

```ts
export const revalidate = 300

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  if (!from || !to) {
    return Response.json({ error: 'from e to são obrigatórios' }, { status: 400 })
  }

  try {
    const rate = await fetchCurrentRate(from, to)
    return Response.json({ from, to, rate, timestamp: new Date().toISOString() })
  } catch {
    return Response.json({ error: 'Falha ao buscar cotação' }, { status: 502 })
  }
}
```

Lógica `fetchCurrentRate(from, to)`:
- `fiat/fiat`: `GET https://api.frankfurter.app/latest?from=${from}&to=${to}` → `data.rates[to]`
- `crypto/fiat`: `GET https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId(from)}&vs_currencies=${to.toLowerCase()}` → `data[id][to.lower]`
- `fiat/crypto`: igual acima com `to`, depois `1 / rate`
- `crypto/crypto`: buscar ambos vs USD, dividir `rateFrom / rateTo`

Critérios de Aceite:
- [ ] `GET /api/exchange-rate?from=BRL&to=USD` retorna `{ rate: number }` válido
- [ ] `GET /api/exchange-rate?from=BTC&to=BRL` retorna `{ rate: number }` válido
- [ ] `GET /api/exchange-rate?from=ETH&to=BTC` retorna `{ rate: number }` válido
- [ ] Parâmetros ausentes retornam 400
- [ ] Erros de upstream retornam 502 sem stacktrace

Notas: Nunca expor keys nem stacktraces na resposta. Timeout implícito do Next.js (default 30s) é suficiente.

---

### Tarefa 3: Route Handler — Histórico 12 Meses
Tipo: feature
Agente: frontend

Criar `apps/tools/src/app/api/exchange-history/route.ts`:

```ts
export const revalidate = 3600

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get('from')
  const to   = searchParams.get('to')

  if (!from || !to) {
    return Response.json({ error: 'from e to são obrigatórios' }, { status: 400 })
  }

  try {
    const history = await fetchHistory(from, to)
    return Response.json(history)
  } catch {
    return Response.json({ error: 'Falha ao buscar histórico' }, { status: 502 })
  }
}
```

Lógica `fetchHistory(from, to)` → `{ labels: string[], values: number[] }`:

- `fiat/fiat`:
  ```
  endDate   = hoje (YYYY-MM-DD)
  startDate = hoje - 365 dias
  GET https://api.frankfurter.app/{startDate}..{endDate}?from={from}&to={to}
  resposta: { rates: { "YYYY-MM-DD": { [to]: number } } }
  → ordenar por data, extrair labels e values
  ```

- Qualquer cripto envolvido:
  - Se `from` é crypto: `GET /coins/{coingeckoId(from)}/market_chart?vs_currency={to.lower()}&days=365&interval=daily`
    → `data.prices: [timestamp, value][]`
  - Se `to` é crypto: buscar cripto em `from`, inverter values (`1/v`)
  - `crypto/crypto`: buscar ambos vs USD → dividir séries ponto a ponto

- Normalizar labels para `YYYY-MM-DD` em todos os casos.

Critérios de Aceite:
- [ ] `GET /api/exchange-history?from=BRL&to=USD` retorna arrays com ~365 entradas
- [ ] `GET /api/exchange-history?from=BTC&to=BRL` retorna arrays com ~365 entradas
- [ ] `labels` e `values` têm sempre o mesmo length
- [ ] `labels` são strings no formato `YYYY-MM-DD`, ordenadas crescente

---

### Tarefa 4: Route Handler — Tabela de Mercado
Tipo: feature
Agente: frontend

Criar `apps/tools/src/app/api/market-rates/route.ts`:

```ts
export const revalidate = 300

// retorna todas as moedas cotadas em BRL
export async function GET() {
  try {
    const [fiatRates, cryptoRates] = await Promise.all([
      fetchFiatRatesInBRL(),
      fetchCryptoRatesInBRL(),
    ])
    return Response.json([...fiatRates, ...cryptoRates])
  } catch {
    return Response.json({ error: 'Falha ao buscar cotações' }, { status: 502 })
  }
}
```

`fetchFiatRatesInBRL()`:
- Hoje: `GET https://api.frankfurter.app/latest?from=BRL&to=USD,EUR,JPY,GBP,CRC`
- Ontem: `GET https://api.frankfurter.app/{ontem}?from=BRL&to=USD,EUR,JPY,GBP,CRC`
- Para cada moeda: `rateInBRL = 1 / rates[code]`, `change24h = ((todayRate - yesterdayRate) / yesterdayRate) * 100`

`fetchCryptoRatesInBRL()`:
- `GET https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,ripple,tether&vs_currencies=brl&include_24hr_change=true`
- Mapear ids para codes (BTC, ETH, etc.)
- `rateInBRL = data[id].brl`, `change24h = data[id].brl_24h_change`

Retorna `CurrencyRate[]`:
```ts
interface CurrencyRate {
  code: string
  name: string
  type: 'fiat' | 'crypto'
  rateInBRL: number
  change24h: number
}
```

Critérios de Aceite:
- [ ] Retorna 11 itens (USD, EUR, JPY, GBP, CRC, BTC, ETH, BNB, SOL, XRP, USDT)
- [ ] `rateInBRL` e `change24h` são números válidos para todas as moedas
- [ ] BRL não aparece na lista (é a base)
- [ ] Erro em um dos providers retorna 502

---

### Tarefa 5: Componente RatesTable
Tipo: feature
Agente: frontend

Criar `apps/tools/src/app/conversor-moedas/_components/RatesTable.tsx`.
Componente de display puro — sem `'use client'`, recebe props do Server Component.

```ts
interface RatesTableProps {
  rates: CurrencyRate[]
}
```

Layout da tabela:
- Colunas: **Moeda** (código em negrito + nome em muted) | **Valor em BRL** | **Variação 24h**
- Variação 24h: texto verde (`text-green-500`) se positiva, vermelho (`text-red-500`) se negativa
- Prefixo: `+` se positiva
- Separador visual entre fiat e cripto (linha fina ou label de seção)
- Responsive: em mobile mostrar apenas código, não nome completo

Critérios de Aceite:
- [ ] Tabela renderiza todas as 11 moedas
- [ ] Variação positiva aparece em verde com sinal `+`
- [ ] Variação negativa aparece em vermelho sem sinal `+`
- [ ] Formatação de BRL usa `formatBRL()` de `_lib/format.ts`

---

### Tarefa 6: Componente ExchangeChart
Tipo: feature
Agente: frontend

Criar `apps/tools/src/app/conversor-moedas/_components/ExchangeChart.tsx`.
`'use client'` — busca dados via Route Handler, renderiza com recharts `LineChart`.

```ts
interface ExchangeChartProps {
  from: string
  to: string
}
```

Comportamento:
- Ao montar e sempre que `from` ou `to` mudar: `fetch('/api/exchange-history?from=X&to=Y')`
- Estado: `loading`, `error`, `data: { labels, values }`
- Loading: skeleton de altura fixa (280px) com `animate-pulse`
- Error: mensagem inline, sem quebrar layout

Gráfico (recharts `LineChart`):
- `ResponsiveContainer width="100%" height={280}`
- `Line` com `type="monotone"`, `dot={false}`, `strokeWidth={2}`, cor `var(--color-primary)`
- `XAxis`: mostra apenas meses (reduzir densidade com `interval`)
- `YAxis`: formatado com `formatRate(value, to)`
- `Tooltip` custom: mostra data + taxa formatada
- Sem Legend (só um par)

Critérios de Aceite:
- [ ] Gráfico renderiza com ~365 pontos para par fiat/fiat
- [ ] Gráfico renderiza para par cripto/fiat (BTC/BRL)
- [ ] Atualiza automaticamente ao mudar o par (`from`/`to` props)
- [ ] Loading state visível durante fetch
- [ ] Tooltip mostra data no formato `DD/MM/YYYY` e taxa formatada

---

### Tarefa 7: Componente CurrencyConverter (orquestrador)
Tipo: feature
Agente: frontend

Criar `apps/tools/src/app/conversor-moedas/_components/CurrencyConverter.tsx`.
`'use client'` — gerencia estado do par, valor e resultado.

Estado:
```ts
const [from,   setFrom]   = useState<string>('USD')
const [to,     setTo]     = useState<string>('BRL')
const [amount, setAmount] = useState<string>('1')
const [rate,   setRate]   = useState<number | null>(null)
const [loading, setLoading] = useState(false)
const [error,   setError]   = useState<string | null>(null)
```

Efeito ao mudar `from` ou `to`:
- `fetch('/api/exchange-rate?from=X&to=Y')` → atualiza `rate`
- `result = parseFloat(amount) * rate`

UI:
```
[Seletor FROM] [valor]   →   [Seletor TO] [resultado]
                  [⇄ Swap]
Taxa atual: 1 USD = 5.19 BRL

[ExchangeChart from={from} to={to} />]
```

Seletores: `<select>` com todas as `CURRENCIES` agrupadas (Fiat / Cripto — usar `<optgroup>`)

Swap: inverter `from ↔ to` (amount permanece)

Resultado: recalculado instantaneamente ao digitar `amount` (sem nova chamada API)

Critérios de Aceite:
- [ ] Selecionar par dispara fetch e exibe taxa atual
- [ ] Digitar valor recalcula resultado sem nova chamada API
- [ ] Swap inverte o par e busca nova taxa
- [ ] Loading spinner no resultado durante fetch da taxa
- [ ] Erro de API exibido inline sem quebrar layout
- [ ] Não é possível selecionar a mesma moeda em `from` e `to`

Notas: Não criar same-currency guard na API — validar no componente apenas. Se `from === to`, `rate = 1` sem chamada.

---

### Tarefa 8: Page Assembly + Atualizar Homepage
Tipo: feature
Agente: frontend

**Criar** `apps/tools/src/app/conversor-moedas/page.tsx`:

```tsx
import type { Metadata } from 'next'
import ToolPageHeader from '@/components/tool-page-header'
import { CurrencyConverter } from './_components/CurrencyConverter'
import { RatesTable } from './_components/RatesTable'

export const metadata: Metadata = {
  title: 'Conversor de Moedas | tools.nico.dev',
  description: 'Converta moedas e criptomoedas em tempo real. Gráfico histórico de 12 meses e tabela de cotações em BRL.',
}

export default async function CurrencyConverterPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001'}/api/market-rates`, {
    next: { revalidate: 300 },
  })
  const rates = res.ok ? await res.json() : []

  return (
    <main className="flex-1 px-6 py-12 max-w-5xl mx-auto w-full">
      <ToolPageHeader
        name="Conversor de Moedas"
        description="Converta moedas e criptomoedas em tempo real. Gráfico histórico de 12 meses."
      />
      <CurrencyConverter />
      <section className="mt-12">
        <h2 className="text-lg font-semibold text-foreground mb-4">Cotações em BRL</h2>
        <RatesTable rates={rates} />
      </section>
    </main>
  )
}
```

**Atualizar** `apps/tools/src/app/page.tsx`:
- Adicionar no array `utilidades` (antes de `weather`):
```ts
{
  slug: 'conversor-moedas',
  name: 'Conversor de Moedas',
  description: 'Converta moedas e criptomoedas em tempo real. Gráfico de 12 meses e cotações atualizadas.',
  icon: '💱',
  status: 'active',
  href: '/conversor-moedas',
},
```

Critérios de Aceite:
- [ ] Página carrega em `tools.nico.dev/conversor-moedas`
- [ ] Tabela de cotações renderizada server-side (sem flash de loading)
- [ ] Card da ferramenta aparece na homepage com status `active`
- [ ] Metadata title e description corretos

---

## Ordem de Execução

```
T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8
```

T1 (tipos e dados) é pré-requisito para todas as demais.
T2, T3, T4 podem ser desenvolvidas em paralelo após T1.
T5, T6, T7 requerem respectivamente T4, T3, T2.
T8 requer T5, T6, T7.

---

## Riscos & Atenções

| Risco | Mitigação |
|-------|-----------|
| CRC não suportado no Frankfurter | Testar `https://api.frankfurter.app/latest?from=BRL&to=CRC` antes de implementar. Se falhar, remover CRC e atualizar spec. |
| CoinGecko rate limit (30 req/min free) | Route Handlers com `revalidate` garantem cache. Nunca chamar CoinGecko direto do cliente. |
| `NEXT_PUBLIC_APP_URL` em produção | Configurar env var no Vercel. Em dev, usar fallback `http://localhost:3001`. |
| Self-call de Route Handler no Server Component | Padrão válido no Next.js App Router. Alternativa: extrair lógica de fetch em função compartilhada. |
