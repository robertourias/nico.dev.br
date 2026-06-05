export type AssetCategory = "indices" | "acoes" | "fiis" | "cripto"
export type AssetSource = "yahoo" | "coingecko"

export interface Asset {
  id: string
  name: string
  category: AssetCategory
  source: AssetSource
}

export interface AssetQuote extends Asset {
  price: number
  changePercent: number
}

export interface HistoricalPoint {
  date: string
  price: number
}
