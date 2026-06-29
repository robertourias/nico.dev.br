"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedCounterProps {
  /** Valor final exibido quando a animação termina. */
  value: number
  /** Texto exibido antes do número (ex.: "+"). */
  prefix?: string
  /** Texto exibido depois do número (ex.: "%", " vagas"). */
  suffix?: string
  /** Quantidade de casas decimais (ex.: 1 para "4,9"). */
  decimals?: number
  durationMs?: number
  className?: string
}

// Contador que anima de 0 até `value` quando entra na viewport, usando
// requestAnimationFrame com easing — sem dependências externas. Dispara uma
// única vez via IntersectionObserver, como o Reveal.
export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  durationMs = 1600,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()

          const tick = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / durationMs, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplay(value * eased)
            if (progress < 1) {
              requestAnimationFrame(tick)
            } else {
              setDisplay(value)
            }
          }

          requestAnimationFrame(tick)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [value, durationMs])

  const formatted = display.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}
