import type { Metadata } from 'next'
import ToolPageHeader from '@/components/tool-page-header'
import { CurrencyConverter } from './_components/CurrencyConverter'
import { RatesTable } from './_components/RatesTable'
import type { CurrencyRate } from '@/lib/currency-data'
import { FIAT_CURRENCIES, CRYPTO_CURRENCIES } from '@/lib/currency-data'
import { fetchFrankfurterRates, fetchFrankfurterRatesOnDate } from '@/lib/frankfurter'
import { fetchCoinGeckoMarketRates } from '@/lib/coingecko'

export const metadata: Metadata = {
  title: 'Conversor de Moedas | tools.nico.dev',
  description:
    'Converta moedas e criptomoedas em tempo real. Gráfico histórico de 12 meses e cotações atualizadas em BRL.',
}

export default async function CurrencyConverterPage() {
  const rates = await fetchAllMarketRates()

  return (
    <main className="flex-1 px-6 py-12 max-w-5xl mx-auto w-full">
      <ToolPageHeader
        name="Conversor de Moedas"
        description="Converta moedas e criptomoedas em tempo real. Gráfico histórico de 12 meses."
      />
      <CurrencyConverter />
      <section className="mt-12">
        <h2 className="text-lg font-semibold text-foreground mb-4">Cotações em BRL e USD</h2>
        <RatesTable rates={rates} />
      </section>
    </main>
  )
}

async function fetchAllMarketRates(): Promise<CurrencyRate[]> {
  try {
    const [fiat, crypto] = await Promise.all([fetchFiatRates(), fetchCryptoRates()])
    const all = [...fiat, ...crypto]
    const usdInBRL = all.find(r => r.code === 'USD')?.rateInBRL ?? 1
    return all.map(r => ({ ...r, rateInUSD: usdInBRL !== 0 ? r.rateInBRL / usdInBRL : 0 }))
  } catch {
    return []
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
