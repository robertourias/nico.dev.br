export type CurrencyType = 'fiat' | 'crypto'

export interface Currency {
  code: string
  name: string
  type: CurrencyType
  coingeckoId?: string
}

export interface CurrencyRate {
  code: string
  name: string
  type: CurrencyType
  rateInBRL: number
  rateInUSD: number
  change24h: number
}

export const CURRENCIES: Currency[] = [
  { code: 'USD',  name: 'Dólar Americano',       type: 'fiat' },
  { code: 'EUR',  name: 'Euro',                  type: 'fiat' },
  { code: 'BRL',  name: 'Real Brasileiro',       type: 'fiat' },
  { code: 'JPY',  name: 'Iene Japonês',          type: 'fiat' },
  { code: 'GBP',  name: 'Libra Esterlina',       type: 'fiat' },
  { code: 'BTC',  name: 'Bitcoin',               type: 'crypto', coingeckoId: 'bitcoin' },
  { code: 'ETH',  name: 'Ethereum',              type: 'crypto', coingeckoId: 'ethereum' },
  { code: 'BNB',  name: 'BNB',                   type: 'crypto', coingeckoId: 'binancecoin' },
  { code: 'SOL',  name: 'Solana',                type: 'crypto', coingeckoId: 'solana' },
  { code: 'XRP',  name: 'XRP',                   type: 'crypto', coingeckoId: 'ripple' },
  { code: 'USDT', name: 'Tether',                type: 'crypto', coingeckoId: 'tether' },
]

export const FIAT_CURRENCIES  = CURRENCIES.filter(c => c.type === 'fiat')
export const CRYPTO_CURRENCIES = CURRENCIES.filter(c => c.type === 'crypto')
export const FIAT_CODES  = FIAT_CURRENCIES.map(c => c.code)
export const CRYPTO_CODES = CRYPTO_CURRENCIES.map(c => c.code)

export function isCrypto(code: string): boolean {
  return CRYPTO_CODES.includes(code)
}

export function getCurrency(code: string): Currency {
  const c = CURRENCIES.find(c => c.code === code)
  if (!c) throw new Error(`Unknown currency: ${code}`)
  return c
}

export function getCoingeckoId(code: string): string {
  const c = getCurrency(code)
  if (!c.coingeckoId) throw new Error(`No CoinGecko ID for ${code}`)
  return c.coingeckoId
}
