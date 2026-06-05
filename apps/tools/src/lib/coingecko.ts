const BASE_URL = 'https://api.coingecko.com/api/v3'

type SimplePriceResponse = Record<string, Record<string, number>>

interface MarketChartResponse {
  prices: [number, number][]
}

export async function fetchCoinGeckoRate(
  coingeckoId: string,
  vsCurrency: string,
): Promise<number> {
  const vc = vsCurrency.toLowerCase()
  const res = await fetch(
    `${BASE_URL}/simple/price?ids=${coingeckoId}&vs_currencies=${vc}`,
    { next: { revalidate: 300 } },
  )
  if (!res.ok) throw new Error(`CoinGecko error ${res.status}: ${coingeckoId}/${vc}`)
  const data: SimplePriceResponse = await res.json()
  const rate = data[coingeckoId]?.[vc]
  if (rate === undefined) throw new Error(`CoinGecko rate not found for ${coingeckoId}/${vc}`)
  return rate
}

export interface CryptoMarketRate {
  id: string
  rateInBRL: number
  change24h: number
}

export async function fetchCoinGeckoMarketRates(ids: string[]): Promise<CryptoMarketRate[]> {
  const res = await fetch(
    `${BASE_URL}/simple/price?ids=${ids.join(',')}&vs_currencies=brl&include_24hr_change=true`,
    { next: { revalidate: 300 } },
  )
  if (!res.ok) throw new Error(`CoinGecko market rates error ${res.status}`)
  const data: SimplePriceResponse = await res.json()
  return ids.map(id => ({
    id,
    rateInBRL: data[id]?.['brl'] ?? 0,
    change24h: data[id]?.['brl_24h_change'] ?? 0,
  }))
}

export async function fetchCoinGeckoHistory(
  coingeckoId: string,
  vsCurrency: string,
  days = 365,
): Promise<{ labels: string[]; values: number[] }> {
  const vc = vsCurrency.toLowerCase()
  const res = await fetch(
    `${BASE_URL}/coins/${coingeckoId}/market_chart?vs_currency=${vc}&days=${days}&interval=daily`,
    { next: { revalidate: 3600 } },
  )
  if (!res.ok) throw new Error(`CoinGecko history error ${res.status}`)
  const data: MarketChartResponse = await res.json()
  const sorted = [...data.prices].sort(([a], [b]) => a - b)
  return {
    labels: sorted.map(([ts]) => new Date(ts).toISOString().slice(0, 10)),
    values: sorted.map(([, v]) => v),
  }
}
