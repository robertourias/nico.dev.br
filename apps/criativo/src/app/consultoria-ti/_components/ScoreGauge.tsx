"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatedCounter } from "./AnimatedCounter"
import type { MaturityLevel } from "../_lib/maturity"

interface ScoreGaugeProps {
  score: number
  label: MaturityLevel
}

const RADIUS = 80
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function colorFor(score: number): string {
  if (score >= 80) return "var(--color-success)"
  if (score >= 60) return "var(--color-secondary)"
  if (score >= 35) return "var(--color-warning)"
  return "var(--color-destructive)"
}

export function ScoreGauge({ score, label }: ScoreGaugeProps) {
  const ref = useRef<SVGSVGElement>(null)
  const [visible, setVisible] = useState(false)

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
      { threshold: 0.4 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE
  const color = colorFor(score)

  return (
    <div className="relative flex items-center justify-center">
      <svg
        ref={ref}
        viewBox="0 0 200 200"
        className="w-56 h-56 -rotate-90"
        role="img"
        aria-label={`Score de maturidade: ${score}%, ${label}`}
      >
        <circle cx={100} cy={100} r={RADIUS} fill="none" stroke="var(--color-border)" strokeWidth={14} />
        <circle
          cx={100}
          cy={100}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={visible ? offset : CIRCUMFERENCE}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-foreground tabular-nums">
          <AnimatedCounter value={score} suffix="%" />
        </span>
        <span className="text-sm font-semibold mt-1" style={{ color }}>
          {label}
        </span>
      </div>
    </div>
  )
}
