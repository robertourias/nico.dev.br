import { TrendingDown, TrendingUp } from "lucide-react"
import type { AssetQuote } from "@/lib/mercado/types"

interface AssetCardProps {
  quote: AssetQuote
  onClick: (quote: AssetQuote) => void
}

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export function AssetCard({ quote, onClick }: AssetCardProps) {
  const positive = quote.changePercent >= 0

  return (
    <button
      onClick={() => onClick(quote)}
      className="w-full text-left rounded-xl border border-border bg-surface p-4 hover:border-primary/50 transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="font-semibold text-foreground text-sm leading-snug">{quote.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{quote.id}</p>
        </div>
        <span
          className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
            positive
              ? "bg-green-500/10 text-green-600"
              : "bg-red-500/10 text-red-600"
          }`}
        >
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {positive ? "+" : ""}
          {quote.changePercent.toFixed(2)}%
        </span>
      </div>
      <p className="text-lg font-bold text-foreground">{BRL.format(quote.price)}</p>
    </button>
  )
}
