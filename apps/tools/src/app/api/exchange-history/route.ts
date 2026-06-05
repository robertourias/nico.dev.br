import { isCrypto, getCurrency } from '@/lib/currency-data'
import { fetchFrankfurterHistory } from '@/lib/frankfurter'
import { fetchCoinGeckoHistory } from '@/lib/coingecko'

export const revalidate = 3600

const ALLOWED_DAYS = new Set([30, 180, 365, 730, 1095, 1825])

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get('from')?.toUpperCase()
  const to = searchParams.get('to')?.toUpperCase()
  const daysParam = parseInt(searchParams.get('days') ?? '365', 10)
  const days = ALLOWED_DAYS.has(daysParam) ? daysParam : 365

  if (!from || !to) {
    return Response.json({ error: 'from e to são obrigatórios' }, { status: 400 })
  }

  try {
    const history = await resolveHistory(from, to, days)
    return Response.json(history)
  } catch (err) {
    console.error('[exchange-history]', err)
    return Response.json({ error: 'Falha ao buscar histórico' }, { status: 502 })
  }
}

async function resolveHistory(
  from: string,
  to: string,
  days: number,
): Promise<{ labels: string[]; values: number[] }> {
  const fromCrypto = isCrypto(from)
  const toCrypto = isCrypto(to)

  if (!fromCrypto && !toCrypto) {
    return fetchFrankfurterHistory(from, to, days)
  }

  if (fromCrypto && !toCrypto) {
    return fetchCoinGeckoHistory(getCurrency(from).coingeckoId!, to, days)
  }

  if (!fromCrypto && toCrypto) {
    const { labels, values } = await fetchCoinGeckoHistory(getCurrency(to).coingeckoId!, from, days)
    return { labels, values: values.map(v => (v !== 0 ? 1 / v : 0)) }
  }

  // crypto/crypto: both in USD, align by date, divide
  const [fromH, toH] = await Promise.all([
    fetchCoinGeckoHistory(getCurrency(from).coingeckoId!, 'usd', days),
    fetchCoinGeckoHistory(getCurrency(to).coingeckoId!, 'usd', days),
  ])
  const toMap = new Map(toH.labels.map((l, i) => [l, toH.values[i]]))
  const labels: string[] = []
  const values: number[] = []
  for (let i = 0; i < fromH.labels.length; i++) {
    const label = fromH.labels[i]
    const toVal = toMap.get(label)
    if (toVal !== undefined && toVal !== 0) {
      labels.push(label)
      values.push(fromH.values[i] / toVal)
    }
  }
  return { labels, values }
}
