"use client"

import { useEffect, useRef, useState } from "react"
import { formatCurrencyCompact } from "../_lib/calculations"

interface GrowthChartProps {
  series: number[]
}

const WIDTH = 680
const HEIGHT = 280
const PAD_LEFT = 52
const PAD_RIGHT = 16
const PAD_TOP = 20
const PAD_BOTTOM = 32
// IDs fixos (não `useId`): só existe uma instância deste gráfico na página,
// e ids com `:` (gerados por `useId`) são problemáticos dentro de `url(#...)`
// em CSS/SVG.
const FILL_GRADIENT_ID = "economia-growth-fill"
const CLIP_PATH_ID = "economia-growth-clip"

// Gráfico de crescimento (economia acumulada mês a mês) em SVG puro — sem
// libs de chart. A "entrada" do gráfico é animada revelando progressivamente
// a área via um `clipPath` cuja largura cresce com `requestAnimationFrame`
// (mesmo padrão de easing usado em RadarChart de outras landings), disparado
// por IntersectionObserver. Reanima de forma mais rápida quando a série muda
// (troca de cenário ou de hábito), sem esperar novo scroll.
export function GrowthChart({ series }: GrowthChartProps) {
  const ref = useRef<SVGSVGElement>(null)
  const [progress, setProgress] = useState(0)
  const hasEntered = useRef(false)
  const seriesKey = series.join(",")
  const previousKey = useRef(seriesKey)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const animate = (durationMs: number) => {
      const start = performance.now()
      const tick = (now: number) => {
        const elapsed = now - start
        const p = Math.min(elapsed / durationMs, 1)
        setProgress(1 - Math.pow(1 - p, 3))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    if (hasEntered.current) {
      if (previousKey.current !== seriesKey) {
        previousKey.current = seriesKey
        setProgress(0)
        animate(700)
      }
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasEntered.current = true
          previousKey.current = seriesKey
          animate(1300)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [seriesKey])

  const maxValue = Math.max(1, ...series) * 1.15
  const chartWidth = WIDTH - PAD_LEFT - PAD_RIGHT
  const chartHeight = HEIGHT - PAD_TOP - PAD_BOTTOM
  const stepX = chartWidth / Math.max(1, series.length - 1)

  const points = series.map((value, i) => {
    const x = PAD_LEFT + stepX * i
    const y = PAD_TOP + chartHeight * (1 - value / maxValue)
    return [x, y] as const
  })

  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ")
  const areaPath = `${linePath} L${points[points.length - 1][0]},${PAD_TOP + chartHeight} L${PAD_LEFT},${PAD_TOP + chartHeight} Z`

  const gridLines = [0, 0.25, 0.5, 0.75, 1]
  const monthLabelIndexes = [0, 2, 5, 8, 11].filter((i) => i < series.length)

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full h-auto"
      role="img"
      aria-label="Gráfico de economia acumulada ao longo de 12 meses"
    >
      {gridLines.map((ratio) => {
        const y = PAD_TOP + chartHeight * (1 - ratio)
        return (
          <g key={ratio}>
            <line
              x1={PAD_LEFT}
              x2={WIDTH - PAD_RIGHT}
              y1={y}
              y2={y}
              stroke="var(--color-border)"
              strokeWidth={1}
              strokeDasharray={ratio === 0 ? undefined : "4 4"}
            />
            <text x={PAD_LEFT - 8} y={y + 3} textAnchor="end" fontSize={10} fill="var(--color-muted-foreground)">
              {formatCurrencyCompact(maxValue * ratio)}
            </text>
          </g>
        )
      })}

      {monthLabelIndexes.map((i) => (
        <text
          key={i}
          x={points[i][0]}
          y={HEIGHT - 10}
          textAnchor="middle"
          fontSize={10}
          fill="var(--color-muted-foreground)"
        >
          Mês {i + 1}
        </text>
      ))}

      <defs>
        <linearGradient id={FILL_GRADIENT_ID} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#059669" stopOpacity={0.32} />
          <stop offset="100%" stopColor="#059669" stopOpacity={0.02} />
        </linearGradient>
        <clipPath id={CLIP_PATH_ID}>
          <rect x={PAD_LEFT} y={0} width={chartWidth * progress} height={HEIGHT} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${CLIP_PATH_ID})`}>
        <path d={areaPath} fill={`url(#${FILL_GRADIENT_ID})`} stroke="none" />
        <path d={linePath} fill="none" stroke="var(--color-primary)" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {points.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i === points.length - 1 ? 4.5 : 3}
            fill={i === points.length - 1 ? "var(--color-secondary)" : "var(--color-primary)"}
            stroke="#fff"
            strokeWidth={1.5}
          />
        ))}
      </g>
    </svg>
  )
}
