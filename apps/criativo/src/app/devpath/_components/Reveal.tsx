"use client"

import { useEffect, useRef, useState } from "react"

type RevealVariant = "fade-up" | "scale-in" | "slide-right" | "slide-left"

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: RevealVariant
  /** Atraso em ms aplicado somente depois que o elemento entra em viewport. */
  delayMs?: number
  className?: string
}

// Wrapper genérico de "scroll reveal": observa a própria entrada na viewport
// e alterna `data-visible`, que o CSS em theme.css (`.devpath-reveal`) anima.
// IntersectionObserver puro, sem libs de animação, para manter a página leve.
// Dispara uma única vez — não reverte ao rolar para fora da tela.
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
      className={`devpath-reveal ${className ?? ""}`}
      data-variant={variant}
      data-visible={visible}
      {...rest}
    >
      {children}
    </div>
  )
}
