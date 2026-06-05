import {
  FIAT_CURRENCIES,
  CRYPTO_CURRENCIES,
  type CurrencyRate,
} from '@/lib/currency-data'
import {
  fetchFrankfurterRates,
  fetchFrankfurterRatesOnDate,
} from '@/lib/frankfurter'
import { fetchCoinGeckoMarketRates } from '@/lib/coingecko'

export const revalidate = 300

export async function GET() {
  try {
    const [fiatRates, cryptoRates] = await Promise.all([
      fetchFiatRates(),
      fetchCryptoRates(),
    ])
    const all = [...fiatRates, ...cryptoRates]
    const usdInBRL = all.find(r => r.code === 'USD')?.rateInBRL ?? 1
    return Response.json(all.map(r => ({ ...r, rateInUSD: usdInBRL !== 0 ? r.rateInBRL / usdInBRL : 0 })))
  } catch (err) {
    console.error('[market-rates]', err)
    return Response.json({ error: 'Falha ao buscar cotações' }, { status: 502 })
  }
}

async function fetchFiatRates(): Promise<CurrencyRate[]> {
  const targets = FIAT_CURRENCIES.filter(c => c.code !== 'BRL').map(c => c.code)

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)

  const [todayRaw, yesterdayRaw] = await Promise.all([
    fetchFrankfurterRates('BRL', targets),
    fetchFrankfurterRatesOnDate(yesterdayStr, 'BRL', targets),
  ])

  return FIAT_CURRENCIES.filter(c => c.code !== 'BRL').map(c => {
    // Frankfurter: rates are "how much target per 1 BRL" → invert for "how much BRL per 1 target"
    const todayRawRate = todayRaw[c.code]
    const yesterdayRawRate = yesterdayRaw[c.code]
    const rateInBRL = todayRawRate ? 1 / todayRawRate : 0
    const yesterdayRate = yesterdayRawRate ? 1 / yesterdayRawRate : rateInBRL
    const change24h =
      yesterdayRate !== 0 ? ((rateInBRL - yesterdayRate) / yesterdayRate) * 100 : 0
    return { code: c.code, name: c.name, type: 'fiat' as const, rateInBRL, rateInUSD: 0, change24h }
  })
}

async function fetchCryptoRates(): Promise<CurrencyRate[]> {
  const ids = CRYPTO_CURRENCIES.map(c => c.coingeckoId!)
  const coinMap = new Map(CRYPTO_CURRENCIES.map(c => [c.coingeckoId!, c]))
  const rates = await fetchCoinGeckoMarketRates(ids)
  return rates.map(r => {
    const currency = coinMap.get(r.id)!
    return {
      code: currency.code,
      name: currency.name,
      type: 'crypto' as const,
      rateInBRL: r.rateInBRL,
      rateInUSD: 0,
      change24h: r.change24h,
    }
  })
}
