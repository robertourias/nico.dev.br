"use client"

import { useEffect, useRef, useState } from "react"
import { formatCurrency } from "../_lib/calculations"
import type { CategoryResult } from "../_lib/calculations"

interface BarComparisonChartProps {
  categories: CategoryResult[]
}

// Gráfico de barras agrupadas (gasto atual vs. otimizado) implementado em
// HTML/CSS puro — sem libs de chart, mesmo critério adotado nas demais
// landings do projeto para manter o bundle leve. A altura de cada barra é
// uma transição CSS disparada por IntersectionObserver (mesmo padrão de
// `.economia-progress-fill`), e recalculada a cada novo valor de `categories`
// (mudança de hábito ou de cenário) para reforçar a sensação de tempo real.
export function BarComparisonChart({ categories }: BarComparisonChartProps) {
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
      { threshold: 0.2 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const maxValue = Math.max(1, ...categories.map((c) => c.currentMonthly))

  return (
    <div ref={ref} className="rounded-2xl border border-border bg-[var(--color-surface-raised)] p-5 md:p-6">
      <div className="flex items-center justify-between mb-1">
        <p className="font-semibold text-foreground text-sm">Gasto atual vs. otimizado</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ background: "var(--color-border)" }} aria-hidden="true" />
            Atual
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundImage: "var(--economia-gradient-primary)" }}
              aria-hidden="true"
            />
            Otimizado
          </span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-5">Valores mensais por categoria de hábito</p>

      <div className="flex items-end gap-4 md:gap-6 h-48">
        {categories.map((category) => {
          const currentHeight = (category.currentMonthly / maxValue) * 100
          const optimizedHeight = (category.optimizedMonthly / maxValue) * 100

          return (
            <div key={category.key} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="flex items-end gap-1.5 w-full h-full justify-center">
                <div
                  className="economia-bar-fill w-2/5"
                  data-visible={visible}
                  style={{ "--target-height": `${currentHeight}%`, background: "var(--color-border)" } as React.CSSProperties}
                  title={formatCurrency(category.currentMonthly)}
                />
                <div
                  className="economia-bar-fill w-2/5"
                  data-visible={visible}
                  style={
                    {
                      "--target-height": `${optimizedHeight}%`,
                      backgroundImage: "var(--economia-gradient-primary)",
                    } as React.CSSProperties
                  }
                  title={formatCurrency(category.optimizedMonthly)}
                />
              </div>
              <span className="text-[0.65rem] font-medium text-foreground text-center leading-tight">
                {category.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
