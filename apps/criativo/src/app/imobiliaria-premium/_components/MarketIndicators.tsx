"use client"

import { useEffect, useRef, useState } from "react"
import { TrendingUp, LineChart as LineChartIcon, Building, Percent } from "lucide-react"
import { REGIONS } from "../_lib/data"
import { Reveal } from "./Reveal"
import { AnimatedCounter } from "./AnimatedCounter"

const GROWTH_TREND = [
  { year: "2022", value: 4.1 },
  { year: "2023", value: 5.6 },
  { year: "2024", value: 6.8 },
  { year: "2025", value: 7.9 },
  { year: "2026", value: 8.6 },
]

const HIGHLIGHTS = [
  { icon: Building, value: 8400, prefix: "R$ ", suffix: "/m²", label: "Menor m² médio (Centro)" },
  { icon: TrendingUp, value: 8.6, suffix: "%", decimals: 1, label: "Crescimento do mercado em 2026" },
  { icon: Percent, value: 9.4, suffix: "%", decimals: 1, label: "Maior valorização anual (Zona Sul)" },
  { icon: LineChartIcon, value: 47, suffix: "+", label: "Oportunidades de investimento ativas" },
]

export function MarketIndicators() {
  const maxSqm = Math.max(...REGIONS.map((r) => r.averageSqmPrice))

  return (
    <section id="mercado" className="px-6 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <Reveal className="max-w-2xl mb-12">
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--imob-moss)" }}>
            Indicadores de mercado
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Dados que sustentam sua decisão</h2>
          <p className="text-muted-foreground">
            Acompanhe preço médio do m², crescimento do mercado e oportunidades de investimento por região.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {HIGHLIGHTS.map((stat, index) => (
            <Reveal key={stat.label} delayMs={index * 80}>
              <div className="rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6 h-full">
                <span
                  className="inline-flex items-center justify-center size-10 rounded-xl mb-4"
                  style={{ backgroundImage: "var(--imob-gradient-soft)", color: "var(--imob-moss)" }}
                >
                  <stat.icon className="size-5" aria-hidden="true" />
                </span>
                <p className="text-2xl font-bold imob-font-serif text-foreground tabular-nums">
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} />
                </p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <Reveal className="rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6 md:p-8">
            <p className="font-semibold text-foreground mb-1">Média de m² por região</p>
            <p className="text-sm text-muted-foreground mb-6">Valores médios de venda por metro quadrado.</p>
            <div className="flex flex-col gap-5">
              {REGIONS.map((region) => (
                <MarketBar
                  key={region.key}
                  label={region.title}
                  value={region.averageSqmPrice}
                  max={maxSqm}
                  display={`R$ ${region.averageSqmPrice.toLocaleString("pt-BR")}/m²`}
                />
              ))}
            </div>
          </Reveal>

          <Reveal className="rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6 md:p-8" variant="scale-in">
            <p className="font-semibold text-foreground mb-1">Crescimento do mercado</p>
            <p className="text-sm text-muted-foreground mb-6">Valorização média anual consolidada (2022–2026).</p>
            <GrowthChart />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

interface MarketBarProps {
  label: string
  value: number
  max: number
  display: string
}

function MarketBar({ label, value, max, display }: MarketBarProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const percent = Math.round((value / max) * 100)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground tabular-nums">{display}</span>
      </div>
      <div className="imob-bar-track h-2.5 rounded-full">
        <div
          className="imob-bar-fill h-full rounded-full"
          data-visible={visible}
          style={{ "--imob-bar-value": `${percent}%` } as React.CSSProperties}
        />
      </div>
    </div>
  )
}

function GrowthChart() {
  const ref = useRef<SVGSVGElement>(null)
  const [visible, setVisible] = useState(false)
  const width = 280
  const height = 140
  const maxValue = Math.max(...GROWTH_TREND.map((p) => p.value))
  const stepX = width / (GROWTH_TREND.length - 1)

  const points = GROWTH_TREND.map((point, index) => {
    const x = index * stepX
    const y = height - (point.value / maxValue) * (height - 24) - 12
    return { x, y, ...point }
  })

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")
  const areaD = `${pathD} L${width},${height} L0,${height} Z`

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div>
      <svg ref={ref} viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label="Gráfico de crescimento do mercado de 2022 a 2026">
        <path d={areaD} fill="var(--imob-moss)" opacity={0.12} />
        <path
          d={pathD}
          fill="none"
          stroke="var(--imob-moss)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: visible ? 0 : 1,
            transition: "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
        {points.map((point) => (
          <circle
            key={point.year}
            cx={point.x}
            cy={point.y}
            r={3.5}
            fill="var(--imob-moss)"
            opacity={visible ? 1 : 0}
            style={{ transition: "opacity 0.6s ease 1s" }}
          />
        ))}
      </svg>
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
        {GROWTH_TREND.map((point) => (
          <span key={point.year}>{point.year}</span>
        ))}
      </div>
    </div>
  )
}
