'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Skeleton } from '@ui'
import { formatRate, formatTooltipDate } from '@/lib/currency-format'

interface ExchangeChartProps {
  from: string
  to: string
}

interface HistoryData {
  labels: string[]
  values: number[]
}

interface ChartPoint {
  date: string
  value: number
}

const PERIODS = [
  { label: '1M',  days: 30 },
  { label: '6M',  days: 180 },
  { label: '12M', days: 365 },
  { label: '2A',  days: 730 },
  { label: '3A',  days: 1095 },
  { label: '5A',  days: 1825 },
] as const

export function ExchangeChart({ from, to }: ExchangeChartProps) {
  const [days, setDays] = useState(365)
  const [data, setData] = useState<ChartPoint[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(`/api/exchange-history?from=${from}&to=${to}&days=${days}`)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar histórico')
        return res.json() as Promise<HistoryData>
      })
      .then(({ labels, values }) => {
        if (cancelled) return
        setData(labels.map((date, i) => ({ date, value: values[i] })))
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setError('Não foi possível carregar o histórico para este período.')
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [from, to, days])

  // Y-axis domain: tight around data range + 3% padding
  const yDomain = useMemo(() => {
    if (!data || data.length === 0) return ['auto', 'auto'] as const
    const values = data.map(d => d.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min
    const pad = range === 0 ? max * 0.01 : range * 0.03
    return [min - pad, max + pad] as [number, number]
  }, [data])

  // Y-axis tick formatter: adapts precision to the actual data range
  const yTickFormatter = useMemo(() => {
    if (!data || data.length === 0) return (v: number) => String(v)
    const values = data.map(d => d.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min

    return (value: number): string => {
      if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
      if (value >= 100_000)   return `${(value / 1_000).toFixed(0)}k`
      if (value >= 10_000)    return `${(value / 1_000).toFixed(1)}k`
      if (value >= 1_000)     return `${(value / 1_000).toFixed(2)}k`
      // sub-1000: precision based on the data range, not the absolute value
      if (range >= 100)  return value.toFixed(0)
      if (range >= 10)   return value.toFixed(1)
      if (range >= 1)    return value.toFixed(2)
      if (range >= 0.1)  return value.toFixed(3)
      if (range >= 0.01) return value.toFixed(4)
      if (range >= 0.001) return value.toFixed(5)
      return value.toFixed(6)
    }
  }, [data])

  // X-axis tick interval and formatter based on period and data density
  const xConfig = useMemo(() => {
    if (!data) return { interval: 30, formatter: (d: string) => d }
    const count = data.length
    const targetTicks = days <= 30 ? 7 : 12
    const interval = Math.max(1, Math.floor(count / targetTicks))

    const formatter = (dateStr: string): string => {
      const d = new Date(dateStr + 'T12:00:00')
      if (days <= 90) {
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      }
      return d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
    }

    return { interval, formatter }
  }, [data, days])

  return (
    <div>
      {/* Header: title + period badges */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <p className="text-sm font-medium text-muted-foreground">Taxa de câmbio histórica</p>
        <div className="flex items-center gap-1">
          {PERIODS.map(p => (
            <button
              key={p.days}
              onClick={() => setDays(p.days)}
              aria-pressed={days === p.days}
              className={[
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                days === p.days
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
              ].join(' ')}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart area */}
      {loading ? (
        <Skeleton className="h-[280px] w-full rounded-xl" />
      ) : error || !data ? (
        <p className="text-sm text-muted-foreground text-center py-16">
          {error ?? 'Sem dados disponíveis.'}
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 4, right: 8, left: 4, bottom: 4 }}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
              tickLine={false}
              axisLine={false}
              interval={xConfig.interval}
              tickFormatter={xConfig.formatter}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={yTickFormatter}
              domain={yDomain}
              width={76}
            />
            <Tooltip content={<CustomTooltip to={to} />} />
            <ReferenceLine
              y={typeof yDomain[0] === 'number' ? (yDomain[0] + (yDomain[1] as number)) / 2 : undefined}
              stroke="var(--color-border)"
              strokeDasharray="3 3"
              strokeOpacity={0.4}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'var(--color-primary)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
  to: string
}

function CustomTooltip({ active, payload, label, to }: CustomTooltipProps) {
  if (!active || !payload?.length || !label) return null

  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-sm shadow-md">
      <p className="text-muted-foreground mb-1">{formatTooltipDate(label)}</p>
      <p className="font-mono font-medium text-foreground">{formatRate(payload[0].value, to)}</p>
    </div>
  )
}
