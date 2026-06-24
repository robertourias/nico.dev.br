"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedCounterProps {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  durationMs?: number
  className?: string
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  durationMs = 1100,
  className,
}: AnimatedCounterProps) {
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
        if (progress < 1) {
          requestAnimationFrame(tick)
        } else {
          setDisplay(value)
        }
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
