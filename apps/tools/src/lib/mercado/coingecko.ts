import type { Asset, AssetQuote, HistoricalPoint } from "./types"

const BASE = "https://api.coingecko.com/api/v3"

function formatDate(timestampMs: number): string {
  const d = new Date(timestampMs)
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`
}

export async function fetchCryptoQuotes(assets: Asset[]): Promise<AssetQuote[]> {
  const ids = assets.map((a) => a.id).join(",")
  const url = `${BASE}/coins/markets?vs_currency=brl&ids=${ids}&price_change_percentage=24h`

  try {
    const res = await fetch(url, { next: { revalidate: 300 } })
    if (!res.ok) throw new Error(`coingecko ${res.status}`)
    const data: Array<{
      id: string
      current_price: number
      price_change_percentage_24h: number
    }> = await res.json()

    const byId = new Map(data.map((c) => [c.id, c]))

    return assets.flatMap((a) => {
      const c = byId.get(a.id)
      if (!c) return []
      return [
        {
          ...a,
          price: c.current_price ?? 0,
          changePercent: c.price_change_percentage_24h ?? 0,
        },
      ]
    })
  } catch (err) {
    console.error("[coingecko] fetchCryptoQuotes:", err)
    return []
  }
}

export async function fetchCryptoHistory(id: string): Promise<HistoricalPoint[]> {
  const url = `${BASE}/coins/${id}/market_chart?vs_currency=brl&days=30`

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`coingecko ${res.status}`)
    const data: { prices: [number, number][] } = await res.json()

    return (data.prices ?? []).map(([ts, price]) => ({
      date: formatDate(ts),
      price,
    }))
  } catch (err) {
    console.error("[coingecko] fetchCryptoHistory:", err)
    return []
  }
}
