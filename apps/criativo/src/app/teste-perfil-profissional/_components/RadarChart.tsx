"use client"

import { useEffect, useRef, useState } from "react"

export interface RadarDatum {
  label: string
  value: number // 0–100
}

interface RadarChartProps {
  data: RadarDatum[]
  size?: number
  className?: string
}

// Gráfico radar em SVG puro (sem libs de chart, para manter a página leve).
// Anima a expansão do polígono de 0 até os valores reais quando entra em
// viewport, via IntersectionObserver + transição CSS no atributo `points`
// (interpolado em JS, já que SVG não anima `points` nativamente em todos os
// navegadores de forma suave).
export function RadarChart({ data, size = 280, className }: RadarChartProps) {
  const ref = useRef<SVGSVGElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const start = performance.now()
          const durationMs = 1200

          const tick = (now: number) => {
            const elapsed = now - start
            const p = Math.min(elapsed / durationMs, 1)
            setProgress(1 - Math.pow(1 - p, 3))
            if (p < 1) requestAnimationFrame(tick)
          }

          requestAnimationFrame(tick)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const center = size / 2
  const radius = size * 0.36
  const levels = 4
  const angleStep = (Math.PI * 2) / data.length

  const pointFor = (index: number, valueRatio: number) => {
    const angle = angleStep * index - Math.PI / 2
    const r = radius * valueRatio
    return [center + r * Math.cos(angle), center + r * Math.sin(angle)] as const
  }

  const dataPoints = data
    .map((d, i) => pointFor(i, (d.value / 100) * progress).join(","))
    .join(" ")

  const labelPoints = data.map((d, i) => ({
    ...d,
    pos: pointFor(i, 1.22),
  }))

  return (
    <svg ref={ref} viewBox={`0 0 ${size} ${size}`} className={className} role="img" aria-label="Gráfico radar de competências">
      {/* grade circular */}
      {Array.from({ length: levels }, (_, lvl) => {
        const ratio = (lvl + 1) / levels
        const ring = data.map((_, i) => pointFor(i, ratio).join(",")).join(" ")
        return (
          <polygon
            key={lvl}
            points={ring}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={1}
          />
        )
      })}

      {/* eixos */}
      {data.map((_, i) => {
        const [x, y] = pointFor(i, 1)
        return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="var(--color-border)" strokeWidth={1} />
      })}

      {/* área de dados */}
      <polygon points={dataPoints} fill="url(#perfilRadarFill)" stroke="var(--color-primary)" strokeWidth={2} strokeLinejoin="round" />

      {data.map((d, i) => {
        const [x, y] = pointFor(i, (d.value / 100) * progress)
        return <circle key={d.label} cx={x} cy={y} r={3.5} fill="var(--color-secondary)" />
      })}

      <defs>
        <linearGradient id="perfilRadarFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.35} />
        </linearGradient>
      </defs>

      {/* labels */}
      {labelPoints.map((d) => (
        <text
          key={d.label}
          x={d.pos[0]}
          y={d.pos[1]}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.038}
          fill="var(--color-muted-foreground)"
          className="font-medium"
        >
          {d.label}
        </text>
      ))}
    </svg>
  )
}
