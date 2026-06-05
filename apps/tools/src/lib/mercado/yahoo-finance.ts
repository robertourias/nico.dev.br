import type { Asset, AssetQuote, HistoricalPoint } from "./types"

const BASE = "https://query1.finance.yahoo.com"
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

type Auth = { crumb: string; cookie: string }

async function fetchAuth(): Promise<Auth | null> {
  try {
    const sessionRes = await fetch("https://fc.yahoo.com", {
      headers: { "User-Agent": UA },
      redirect: "follow",
    })

    const rawCookies =
      typeof (sessionRes.headers as { getSetCookie?: () => string[] }).getSetCookie === "function"
        ? (sessionRes.headers as { getSetCookie: () => string[] }).getSetCookie()
        : [sessionRes.headers.get("set-cookie") ?? ""]
    const cookie = rawCookies
      .map((c) => c.split(";")[0])
      .filter(Boolean)
      .join("; ")

    const crumbRes = await fetch(`${BASE}/v1/test/getcrumb`, {
      headers: { "User-Agent": UA, Cookie: cookie },
    })
    if (!crumbRes.ok) return null

    const crumb = await crumbRes.text()
    if (!crumb || crumb.includes("<")) return null // recebeu HTML em vez de crumb

    return { crumb, cookie }
  } catch (err) {
    console.error("[yahoo] fetchAuth:", err)
    return null
  }
}

function formatDate(unixSeconds: number): string {
  const d = new Date(unixSeconds * 1000)
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`
}

export async function fetchYahooQuotes(assets: Asset[]): Promise<AssetQuote[]> {
  const auth = await fetchAuth()
  if (!auth) {
    console.error("[yahoo] falha ao obter crumb — nenhum ativo retornado")
    return []
  }

  const symbols = assets.map((a) => a.id).join(",")
  const url = `${BASE}/v7/finance/quote?symbols=${symbols}&crumb=${encodeURIComponent(auth.crumb)}&lang=pt-BR&region=BR`

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Cookie: auth.cookie },
      next: { revalidate: 300 },
    })
    if (!res.ok) {
      const body = await res.text().catch(() => "")
      throw new Error(`yahoo ${res.status}: ${body}`)
    }
    const data = await res.json()
    const results: Array<{
      symbol: string
      regularMarketPrice: number
      regularMarketChangePercent: number
    }> = data.quoteResponse?.result ?? []

    const bySymbol = new Map(results.map((r) => [r.symbol, r]))

    return assets.flatMap((a) => {
      const q = bySymbol.get(a.id)
      if (!q) return []
      return [
        {
          ...a,
          price: q.regularMarketPrice ?? 0,
          changePercent: q.regularMarketChangePercent ?? 0,
        },
      ]
    })
  } catch (err) {
    console.error("[yahoo] fetchYahooQuotes:", err)
    return []
  }
}

export async function fetchYahooHistory(id: string): Promise<HistoricalPoint[]> {
  const auth = await fetchAuth()
  if (!auth) return []

  const url = `${BASE}/v8/finance/chart/${encodeURIComponent(id)}?range=1mo&interval=1d&crumb=${encodeURIComponent(auth.crumb)}`

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Cookie: auth.cookie },
    })
    if (!res.ok) {
      const body = await res.text().catch(() => "")
      throw new Error(`yahoo ${res.status}: ${body}`)
    }
    const data = await res.json()
    const result = data.chart?.result?.[0]
    if (!result) return []

    const timestamps: number[] = result.timestamp ?? []
    const closes: number[] = result.indicators?.quote?.[0]?.close ?? []

    return timestamps
      .map((ts, i) => ({ date: formatDate(ts), price: closes[i] ?? 0 }))
      .filter((p) => p.price > 0)
  } catch (err) {
    console.error("[yahoo] fetchYahooHistory:", err)
    return []
  }
}
