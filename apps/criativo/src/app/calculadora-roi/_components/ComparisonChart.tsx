"use client"

import { useEffect, useRef, useState } from "react"
import { formatCurrencyCompact } from "../_lib/calculations"

interface ComparisonChartProps {
  serieSemServico: number[]
  serieComServico: number[]
}

const WIDTH = 680
const HEIGHT = 280
const PAD_LEFT = 56
const PAD_RIGHT = 16
const PAD_TOP = 20
const PAD_BOTTOM = 32
// IDs fixos (não `useId`): só existe uma instância deste gráfico na página,
// e ids com `:` (gerados por `useId`) são problemáticos dentro de `url(#...)`
// em CSS/SVG.
const CLIP_PATH_ID = "roi-comparison-clip"

// Gráfico de linha comparando receita acumulada "sem serviço" (cinza) com
// "com serviço" (verde) ao longo do horizonte de análise — em SVG puro, sem
// libs de chart, mesmo critério adotado nas demais landings do projeto para
// manter o bundle leve. A entrada é animada revelando progressivamente as
// duas linhas via `clipPath`, disparado por IntersectionObserver, e reanima
// (mais rápido) quando a série muda.
export function ComparisonChart({ serieSemServico, serieComServico }: ComparisonChartProps) {
  const ref = useRef<SVGSVGElement>(null)
  const [progress, setProgress] = useState(0)
  const hasEntered = useRef(false)
  const seriesKey = `${serieSemServico.join(",")}|${serieComServico.join(",")}`
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

  const months = serieComServico.length
  const maxValue = Math.max(1, ...serieSemServico, ...serieComServico) * 1.1
  const chartWidth = WIDTH - PAD_LEFT - PAD_RIGHT
  const chartHeight = HEIGHT - PAD_TOP - PAD_BOTTOM
  const stepX = chartWidth / Math.max(1, months - 1)

  const toPoints = (series: number[]) =>
    series.map((value, i) => {
      const x = PAD_LEFT + stepX * i
      const y = PAD_TOP + chartHeight * (1 - value / maxValue)
      return [x, y] as const
    })

  const pointsSem = toPoints(serieSemServico)
  const pointsCom = toPoints(serieComServico)
  const toPath = (points: readonly (readonly [number, number])[]) =>
    points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ")

  const gridLines = [0, 0.25, 0.5, 0.75, 1]
  const labelStep = Math.max(1, Math.round(months / 5))
  const monthLabelIndexes = Array.from({ length: months }, (_, i) => i).filter(
    (i) => i % labelStep === 0 || i === months - 1
  )

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full h-auto"
      role="img"
      aria-label="Gráfico comparando receita acumulada com e sem o serviço ao longo do horizonte analisado"
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
          x={pointsCom[i][0]}
          y={HEIGHT - 10}
          textAnchor="middle"
          fontSize={10}
          fill="var(--color-muted-foreground)"
        >
          Mês {i + 1}
        </text>
      ))}

      <defs>
        <clipPath id={CLIP_PATH_ID}>
          <rect x={PAD_LEFT} y={0} width={chartWidth * progress} height={HEIGHT} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${CLIP_PATH_ID})`}>
        <path d={toPath(pointsSem)} fill="none" stroke="var(--color-border)" strokeWidth={2.5} strokeDasharray="5 5" strokeLinecap="round" />
        <path d={toPath(pointsCom)} fill="none" stroke="var(--color-secondary)" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {pointsCom.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i === pointsCom.length - 1 ? 4.5 : 3}
            fill="var(--color-secondary)"
            stroke="#fff"
            strokeWidth={1.5}
          />
        ))}
      </g>
    </svg>
  )
}
