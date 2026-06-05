import ToolPageHeader from "@/components/tool-page-header"
import { CURATED_ASSETS } from "@/lib/mercado/curated-assets"
import { fetchYahooQuotes } from "@/lib/mercado/yahoo-finance"
import { fetchCryptoQuotes } from "@/lib/mercado/coingecko"
import { AssetGrid } from "./_components/asset-grid"

export const revalidate = 300

export default async function MercadoPage() {
  const yahooAssets = CURATED_ASSETS.filter((a) => a.source === "yahoo")
  const cryptoAssets = CURATED_ASSETS.filter((a) => a.source === "coingecko")

  const [yahooQuotes, cryptoQuotes] = await Promise.all([
    fetchYahooQuotes(yahooAssets),
    fetchCryptoQuotes(cryptoAssets),
  ])

  const quoteMap = new Map(
    [...yahooQuotes, ...cryptoQuotes].map((q) => [q.id, q])
  )

  const quotes = CURATED_ASSETS.flatMap((a) => {
    const q = quoteMap.get(a.id)
    return q ? [q] : []
  })

  return (
    <main className="flex-1 px-6 py-12 max-w-5xl mx-auto w-full">
      <ToolPageHeader
        name="Mercado Financeiro"
        description="Cotações, variações e histórico de ações B3, FIIs, índices e criptomoedas."
      />
      <AssetGrid quotes={quotes} />
    </main>
  )
}
