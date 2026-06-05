"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import type { AssetCategory, AssetQuote } from "@/lib/mercado/types"
import { AssetCard } from "./asset-card"
import { AssetChart } from "./asset-chart"

interface AssetGridProps {
  quotes: AssetQuote[]
}

const CATEGORY_LABELS: Record<AssetCategory, string> = {
  indices: "Índices",
  acoes: "Ações B3",
  fiis: "FIIs",
  cripto: "Criptomoedas",
}

const CATEGORY_ORDER: AssetCategory[] = ["indices", "acoes", "fiis", "cripto"]

export function AssetGrid({ quotes }: AssetGridProps) {
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<AssetQuote | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return quotes
    return quotes.filter(
      (a) =>
        a.id.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
    )
  }, [quotes, search])

  const grouped = useMemo(() => {
    const map = new Map<AssetCategory, AssetQuote[]>()
    for (const category of CATEGORY_ORDER) {
      const items = filtered.filter((a) => a.category === category)
      if (items.length > 0) map.set(category, items)
    }
    return map
  }, [filtered])

  return (
    <>
      <div className="relative mb-8 max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Buscar ativo ou ticker..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-surface text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {grouped.size === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum ativo encontrado.</p>
      ) : (
        <div className="space-y-10">
          {Array.from(grouped.entries()).map(([category, items]) => (
            <section key={category}>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                {CATEGORY_LABELS[category]}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((q) => (
                  <AssetCard key={q.id} quote={q} onClick={setSelected} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <AssetChart asset={selected} onClose={() => setSelected(null)} />
    </>
  )
}
