"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedCounterProps {
  /** Valor final exibido quando a animação termina. */
  value: number
  /** Texto exibido antes do número (ex.: "+"). */
  prefix?: string
  /** Texto exibido depois do número (ex.: "%"). */
  suffix?: string
  durationMs?: number
  className?: string
}

// Contador que anima de 0 até `value` quando entra na viewport, usando
// requestAnimationFrame com easing — sem dependências externas. Dispara uma
// única vez via IntersectionObserver. Mesmo padrão de
// `simulador-economia-domestica/AnimatedCounter.tsx`.
export function AnimatedCounter({ value, prefix = "", suffix = "", durationMs = 1400, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)
  const hasEntered = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const animate = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / durationMs, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(value * eased)
        if (progress < 1) requestAnimationFrame(tick)
        else setDisplay(value)
      }
      requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasEntered.current) {
          hasEntered.current = true
          animate()
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [value, durationMs])

  const formatted = Math.round(display).toLocaleString("pt-BR")

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}
