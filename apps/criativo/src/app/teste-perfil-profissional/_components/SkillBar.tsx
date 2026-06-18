"use client"

import { useEffect, useRef, useState } from "react"

interface SkillBarProps {
  label: string
  value: number // 0–100
  className?: string
}

// Barra de habilidade que anima de 0% até `value` ao entrar em viewport.
// Usa a classe `.perfil-progress-fill` (theme.css), que faz a transição de
// `width` via CSS — aqui só controlamos o gatilho `data-visible`.
export function SkillBar({ label, value, className }: SkillBarProps) {
  const ref = useRef<HTMLDivElement>(null)
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
      { threshold: 0.3 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      <div className="flex items-center justify-between mb-1.5 text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground tabular-nums">{value}%</span>
      </div>
      <div className="perfil-progress-track">
        <div
          className="perfil-progress-fill"
          data-visible={visible}
          style={{ "--target-width": `${value}%` } as React.CSSProperties}
        />
      </div>
    </div>
  )
}
