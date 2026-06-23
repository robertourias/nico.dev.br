"use client"

import { useEffect, useRef, useState } from "react"

type RevealVariant = "fade-up" | "scale-in" | "slide-right" | "slide-left"

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: RevealVariant
  delayMs?: number
  className?: string
}

export function Reveal({ children, variant = "fade-up", delayMs = 0, className, ...rest }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delayMs > 0) {
            const timeout = setTimeout(() => setVisible(true), delayMs)
            return () => clearTimeout(timeout)
          }
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [delayMs])

  return (
    <div
      ref={ref}
      className={`consult-reveal ${className ?? ""}`}
      data-variant={variant}
      data-visible={visible}
      {...rest}
    >
      {children}
    </div>
  )
}
