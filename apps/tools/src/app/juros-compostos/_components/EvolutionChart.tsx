"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import type { MonthlySnapshot, Mode } from "@/lib/compound-interest"
import { formatBRL } from "@/lib/compound-interest"

interface EvolutionChartProps {
  data: MonthlySnapshot[]
  mode: Mode
  totalMonths: number
}

interface ChartPoint {
  label: string
  principal: number
  contributions: number
  interest: number
}

export function EvolutionChart({ data, mode, totalMonths }: EvolutionChartProps) {
  if (data.length === 0) return null

  const isAnnual = totalMonths > 120

  const chartData: ChartPoint[] = data.map((s) => ({
    label: isAnnual
      ? `Ano ${Math.round(s.month / 12)}`
      : `Mês ${s.month}`,
    // principal is the fixed starting investment, always flat
    principal: s.closingBalance - s.cumulativeContributions - s.cumulativeInterest,
    contributions: s.cumulativeContributions,
    interest: s.cumulativeInterest,
  }))

  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Evolução do investimento
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
          <defs>
            <linearGradient id="gradPrincipal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="gradContributions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="gradInterest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-chart-interest)" stopOpacity={0.5} />
              <stop offset="95%" stopColor="var(--color-chart-interest)" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatYAxis}
            width={60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            formatter={legendFormatter}
          />
          <Area
            type="monotone"
            dataKey="principal"
            name="Capital inicial"
            stackId="1"
            stroke="var(--color-primary)"
            fill="url(#gradPrincipal)"
            strokeWidth={2}
          />
          {mode === "contributions" && (
            <Area
              type="monotone"
              dataKey="contributions"
              name="Aportes"
              stackId="1"
              stroke="var(--color-secondary)"
              fill="url(#gradContributions)"
              strokeWidth={2}
            />
          )}
          <Area
            type="monotone"
            dataKey="interest"
            name="Juros"
            stackId="1"
            stroke="var(--color-chart-interest, var(--color-primary))"
            fill="url(#gradInterest)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatYAxis(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`
  return String(value)
}

function legendFormatter(value: string) {
  return <span style={{ fontSize: 12, color: "var(--color-muted-foreground)" }}>{value}</span>
}

interface TooltipPayload {
  name: string
  value: number
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  const total = payload.reduce((sum, p) => sum + (p.value ?? 0), 0)

  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-muted-foreground">
          {p.name}: <span className="font-mono text-foreground">{formatBRL(p.value)}</span>
        </p>
      ))}
      <p className="border-t border-border mt-1 pt-1 font-medium text-foreground">
        Total: <span className="font-mono">{formatBRL(total)}</span>
      </p>
    </div>
  )
}
