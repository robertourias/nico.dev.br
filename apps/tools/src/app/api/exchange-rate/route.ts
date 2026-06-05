import { isCrypto, getCurrency } from '@/lib/currency-data'
import { fetchFrankfurterRate } from '@/lib/frankfurter'
import { fetchCoinGeckoRate } from '@/lib/coingecko'

export const revalidate = 300

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get('from')?.toUpperCase()
  const to = searchParams.get('to')?.toUpperCase()

  if (!from || !to) {
    return Response.json({ error: 'from e to são obrigatórios' }, { status: 400 })
  }

  if (from === to) {
    return Response.json({ from, to, rate: 1, timestamp: new Date().toISOString() })
  }

  try {
    const rate = await resolveRate(from, to)
    return Response.json({ from, to, rate, timestamp: new Date().toISOString() })
  } catch (err) {
    console.error('[exchange-rate]', err)
    return Response.json({ error: 'Falha ao buscar cotação' }, { status: 502 })
  }
}

async function resolveRate(from: string, to: string): Promise<number> {
  const fromCrypto = isCrypto(from)
  const toCrypto = isCrypto(to)

  if (!fromCrypto && !toCrypto) {
    return fetchFrankfurterRate(from, to)
  }

  if (fromCrypto && !toCrypto) {
    return fetchCoinGeckoRate(getCurrency(from).coingeckoId!, to)
  }

  if (!fromCrypto && toCrypto) {
    const rate = await fetchCoinGeckoRate(getCurrency(to).coingeckoId!, from)
    return 1 / rate
  }

  // crypto/crypto: both in USD, then divide
  const [fromUSD, toUSD] = await Promise.all([
    fetchCoinGeckoRate(getCurrency(from).coingeckoId!, 'usd'),
    fetchCoinGeckoRate(getCurrency(to).coingeckoId!, 'usd'),
  ])
  return fromUSD / toUSD
}
