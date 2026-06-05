"use server"

import { fetchYahooHistory } from "@/lib/mercado/yahoo-finance"
import { fetchCryptoHistory } from "@/lib/mercado/coingecko"
import type { AssetSource, HistoricalPoint } from "@/lib/mercado/types"

export async function fetchAssetHistory(
  id: string,
  source: AssetSource
): Promise<HistoricalPoint[]> {
  if (source === "yahoo") return fetchYahooHistory(id)
  return fetchCryptoHistory(id)
}
