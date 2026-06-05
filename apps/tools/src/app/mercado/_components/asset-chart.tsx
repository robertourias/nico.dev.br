"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Skeleton } from "@ui"
import { fetchAssetHistory } from "../_actions/fetch-history"
import type { AssetQuote, HistoricalPoint } from "@/lib/mercado/types"

interface AssetChartProps {
  asset: AssetQuote | null
  onClose: () => void
}

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export function AssetChart({ asset, onClose }: AssetChartProps) {
  const [history, setHistory] = useState<HistoricalPoint[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!asset) {
      setHistory([])
      return
    }
    setLoading(true)
    fetchAssetHistory(asset.id, asset.source)
      .then(setHistory)
      .finally(() => setLoading(false))
  }, [asset])

  if (!asset) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative bg-surface border border-border rounded-xl p-6 w-full max-w-2xl shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label={`Histórico de ${asset.name}`}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{asset.name}</h2>
            <p className="text-sm text-muted-foreground">{asset.id} · últimos 30 dias</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <Skeleton className="h-52 w-full rounded-lg" />
        ) : history.length > 0 ? (
          <ResponsiveContainer width="100%" height={208}>
            <LineChart data={history} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => BRL.format(v)}
                width={80}
              />
              <Tooltip
                formatter={(value: number) => [BRL.format(value), "Preço"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-16">
            Dados históricos indisponíveis.
          </p>
        )}
      </div>
    </div>
  )
}
