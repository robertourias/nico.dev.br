"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@ui"
import { formatBRL, type Mode, type MonthlySnapshot } from "@/lib/compound-interest"

interface EvolutionTableProps {
  snapshots: MonthlySnapshot[]
  mode: Mode
}

const TRUNCATE_THRESHOLD = 60
const SHOW_EDGES = 12

export function EvolutionTable({ snapshots, mode }: EvolutionTableProps) {
  const [open, setOpen] = useState(false)

  const shouldTruncate = snapshots.length > TRUNCATE_THRESHOLD
  const omittedCount = snapshots.length - SHOW_EDGES * 2

  const displayedRows: (MonthlySnapshot | "ellipsis")[] = (() => {
    if (!shouldTruncate) return snapshots
    return [
      ...snapshots.slice(0, SHOW_EDGES),
      "ellipsis" as const,
      ...snapshots.slice(snapshots.length - SHOW_EDGES),
    ]
  })()

  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5"
      >
        {open ? (
          <>
            <ChevronUp className="size-4" aria-hidden="true" />
            Ocultar tabela
          </>
        ) : (
          <>
            <ChevronDown className="size-4" aria-hidden="true" />
            Ver detalhes mês a mês
          </>
        )}
      </Button>

      {open && (
        <div className="mt-4 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Mês</th>
                <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Saldo inicial</th>
                {mode === "contributions" && (
                  <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Aporte</th>
                )}
                <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Juros do mês</th>
                <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">Saldo final</th>
              </tr>
            </thead>
            <tbody>
              {displayedRows.map((row, idx) => {
                if (row === "ellipsis") {
                  return (
                    <tr key="ellipsis" className="border-b border-border/50">
                      <td
                        colSpan={mode === "contributions" ? 5 : 4}
                        className="px-4 py-2 text-center text-xs text-muted-foreground italic"
                      >
                        ... {omittedCount} meses omitidos para brevidade ...
                      </td>
                    </tr>
                  )
                }

                return (
                  <tr
                    key={row.month}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-2 text-muted-foreground">{row.month}</td>
                    <td className="px-4 py-2 text-right font-mono tabular-nums">
                      {formatBRL(row.openingBalance)}
                    </td>
                    {mode === "contributions" && (
                      <td className="px-4 py-2 text-right font-mono tabular-nums">
                        {formatBRL(row.contribution)}
                      </td>
                    )}
                    <td className="px-4 py-2 text-right font-mono tabular-nums text-primary">
                      {formatBRL(row.interest)}
                    </td>
                    <td className="px-4 py-2 text-right font-mono tabular-nums font-medium">
                      {formatBRL(row.closingBalance)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
