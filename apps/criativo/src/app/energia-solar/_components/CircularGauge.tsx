"use client"

import { useEffect, useRef, useState } from "react"

interface CircularGaugeProps {
  /** Percentual (0-100) preenchido no arco. */
  percent: number
  size?: number
  strokeWidth?: number
  label?: string
  valueLabel?: string
  colorVar?: string
  className?: string
}

// Gauge circular em SVG puro (sem libs de chart) — usado no dashboard do
// simulador para representar a redução percentual da conta de energia. O
// arco é desenhado via `stroke-dashoffset` animado por `requestAnimationFrame`
// na primeira entrada em viewport, e atualiza suavemente sempre que `percent`
// muda (recálculo em tempo real do simulador).
export function CircularGauge({
  percent,
  size = 132,
  strokeWidth = 12,
  label,
  valueLabel,
  colorVar = "var(--solar-yellow-deep)",
  className,
}: CircularGaugeProps) {
  const ref = useRef<SVGSVGElement>(null)
  const [displayPercent, setDisplayPercent] = useState(0)
  const hasEntered = useRef(false)
  const previousPercent = useRef(0)

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const animateTo = (target: number, from: number) => {
      const start = performance.now()
      const duration = 900
      const tick = (now: number) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplayPercent(from + (target - from) * eased)
        if (progress < 1) {
          requestAnimationFrame(tick)
        } else {
          setDisplayPercent(target)
          previousPercent.current = target
        }
      }
      requestAnimationFrame(tick)
    }

    if (hasEntered.current) {
      animateTo(percent, previousPercent.current)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasEntered.current = true
          animateTo(percent, 0)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [percent])

  const offset = circumference * (1 - displayPercent / 100)

  return (
    <div className={`relative inline-flex items-center justify-center ${className ?? ""}`}>
      <svg ref={ref} width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-surface-overlay)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorVar}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground tabular-nums">
          {valueLabel ?? `${Math.round(displayPercent)}%`}
        </span>
        {label && <span className="text-[0.65rem] text-muted-foreground text-center leading-tight px-2">{label}</span>}
      </div>
    </div>
  )
}
