"use client"

import { useEffect, useRef, useState } from "react"
import { COMPARISON_ROWS, ACCUMULATED_SAVINGS_5Y } from "../_lib/data"
import { Reveal } from "./Reveal"

function formatValue(value: number, prefix?: string, unit?: string): string {
  const formatted = value.toLocaleString("pt-BR")
  if (prefix) return `${prefix} ${formatted}`
  if (unit) return `${formatted} ${unit}`
  return formatted
}

// Comparativo "Conta tradicional vs Energia Solar" com toggle — alternar o
// toggle não troca os números (são duas colunas fixas lado a lado), mas
// reforça qual lado está em foco e reanima o crescimento das barras,
// conforme briefing ("ao alternar a visualização, as barras crescem com
// animação").
export function ComparisonSection() {
  const [highlightSolar, setHighlightSolar] = useState(true)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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
      { threshold: 0.25 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const handleToggle = () => {
    setHighlightSolar((current) => !current)
    // Reforça a sensação de "crescimento" ao alternar: zera e re-anima as
    // barras, mesmo após a primeira entrada em viewport.
    setVisible(false)
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
  }

  const maxAccumulated = Math.max(...ACCUMULATED_SAVINGS_5Y)

  return (
    <section className="px-6 py-16 md:py-24 scroll-mt-20" aria-labelledby="comparison-title">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-10">
          <p className="text-sm font-semibold mb-2" style={{ color: "var(--solar-blue-light)" }}>
            Antes x depois
          </p>
          <h2 id="comparison-title" className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Conta tradicional <span className="text-muted-foreground">vs</span>{" "}
            <span className="solar-gradient-text">energia solar</span>
          </h2>
        </Reveal>

        <Reveal variant="fade-up" className="flex items-center justify-center gap-3 mb-10">
          <span className={`text-sm font-medium ${!highlightSolar ? "text-foreground" : "text-muted-foreground"}`}>
            Conta tradicional
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={highlightSolar}
            aria-label="Alternar destaque entre conta tradicional e energia solar"
            className="solar-toggle-track"
            data-active={highlightSolar}
            onClick={handleToggle}
          >
            <span className="solar-toggle-thumb" />
          </button>
          <span className={`text-sm font-medium ${highlightSolar ? "text-foreground" : "text-muted-foreground"}`}>
            Energia solar
          </span>
        </Reveal>

        <div ref={ref} className="flex flex-col gap-6">
          {COMPARISON_ROWS.map((row) => {
            const max = Math.max(row.traditional, row.solar, 1)
            const traditionalPct = (row.traditional / max) * 100
            const solarPct = (row.solar / max) * 100

            return (
              <Reveal key={row.label} variant="fade-up">
                <div className="rounded-2xl border border-border bg-[var(--color-surface-raised)] p-5 md:p-6">
                  <p className="font-semibold text-foreground text-sm mb-4">{row.label}</p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className={`transition-opacity ${highlightSolar ? "opacity-50" : "opacity-100"}`}>
                      <div className="flex items-end h-24 mb-2">
                        <div
                          className="solar-bar-fill w-full"
                          data-visible={visible}
                          style={
                            {
                              "--target-height": `${traditionalPct}%`,
                              background: "var(--color-muted-foreground)",
                              opacity: 0.45,
                            } as React.CSSProperties
                          }
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mb-0.5">Tradicional</p>
                      <p className="font-bold text-foreground tabular-nums">
                        {formatValue(row.traditional, row.prefix, row.unit)}
                      </p>
                    </div>

                    <div className={`transition-opacity ${highlightSolar ? "opacity-100" : "opacity-50"}`}>
                      <div className="flex items-end h-24 mb-2">
                        <div
                          className="solar-bar-fill w-full"
                          data-visible={visible}
                          style={
                            {
                              "--target-height": `${solarPct}%`,
                              backgroundImage: "var(--solar-gradient-primary)",
                            } as React.CSSProperties
                          }
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mb-0.5">Energia solar</p>
                      <p className="font-bold tabular-nums" style={{ color: "var(--solar-blue-light)" }}>
                        {formatValue(row.solar, row.prefix, row.unit)}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}

          <Reveal variant="fade-up">
            <div
              className="solar-glow rounded-2xl p-6 md:p-7 text-white"
              style={{ backgroundImage: "var(--solar-gradient-night)" }}
            >
              <p className="font-semibold text-sm mb-1 text-white/85">Economia acumulada</p>
              <p className="text-xs text-white/65 mb-5">Projeção de quanto fica no seu bolso ano a ano.</p>
              <div className="grid grid-cols-5 gap-3 items-end h-32">
                {ACCUMULATED_SAVINGS_5Y.map((value, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 h-full justify-end">
                    <div
                      className="solar-bar-fill w-full rounded-t-lg"
                      data-visible={visible}
                      style={
                        {
                          "--target-height": `${(value / maxAccumulated) * 100}%`,
                          backgroundImage: "var(--solar-gradient-sun)",
                          transitionDelay: `${i * 0.1}s`,
                        } as React.CSSProperties
                      }
                    />
                    <span className="text-[0.65rem] text-white/70">Ano {i + 1}</span>
                  </div>
                ))}
              </div>
              <p className="text-2xl font-bold mt-5 tabular-nums">
                R$ {ACCUMULATED_SAVINGS_5Y[ACCUMULATED_SAVINGS_5Y.length - 1].toLocaleString("pt-BR")}
              </p>
              <p className="text-xs text-white/70">economizados em 5 anos</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
