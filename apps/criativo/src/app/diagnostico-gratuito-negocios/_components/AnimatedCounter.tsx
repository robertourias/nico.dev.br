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
  durationMs = 900,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)
  const hasEntered = useRef(false)
  const previousValue = useRef(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const animateTo = (target: number, from: number) => {
      const start = performance.now()
      const tick = (now: number) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / durationMs, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(from + (target - from) * eased)
        if (progress < 1) {
          requestAnimationFrame(tick)
        } else {
          setDisplay(target)
          previousValue.current = target
        }
      }
      requestAnimationFrame(tick)
    }

    if (hasEntered.current) {
      animateTo(value, previousValue.current)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasEntered.current) {
          hasEntered.current = true
          animateTo(value, 0)
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
