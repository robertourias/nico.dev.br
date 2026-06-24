"use client"

import { useEffect, useState } from "react"
import { TrendingUp, ArrowUpRight, X, Target, Lightbulb } from "lucide-react"
import { Reveal } from "./Reveal"
import { CASES, type CaseStudy } from "../_lib/data"

export function CasesSection() {
  const [activeCase, setActiveCase] = useState<CaseStudy | null>(null)

  useEffect(() => {
    if (!activeCase) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveCase(null)
    }
    document.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [activeCase])

  return (
    <section id="cases" className="px-6 py-20 md:py-28 scroll-mt-20 bg-[var(--color-surface)]" aria-labelledby="cases-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14 max-w-2xl mx-auto">
          <h2 id="cases-title" className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Cases de <span className="agencia-gradient-text">sucesso</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Projetos reais, com objetivos claros e resultados mensuráveis.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CASES.map((item, index) => (
            <Reveal key={item.slug} delayMs={index * 80}>
              <button
                type="button"
                onClick={() => setActiveCase(item)}
                data-cursor-hover
                className="agencia-card-hover h-full w-full text-left rounded-2xl border border-border bg-[var(--color-surface-raised)] overflow-hidden flex flex-col"
              >
                <div
                  className="relative h-36 flex items-center justify-center agencia-grid-bg"
                  style={{ backgroundImage: "var(--agencia-gradient-soft)" }}
                >
                  <span className="text-3xl font-bold text-foreground/15">{item.name.charAt(0)}</span>
                  <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-accent text-accent-foreground text-xs font-semibold px-3 py-1">
                    {item.segment}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-lg font-bold text-foreground mb-1">{item.name}</p>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">{item.objective}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary">
                      <TrendingUp className="size-4" aria-hidden="true" />
                      {item.resultHeadline}
                    </span>
                    <ArrowUpRight className="size-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {activeCase && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-modal-title"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setActiveCase(null)}
            aria-hidden="true"
          />
          <div className="relative agencia-glass agencia-glow w-full max-w-lg rounded-3xl p-7 md:p-9 max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setActiveCase(null)}
              aria-label="Fechar"
              className="absolute top-5 right-5 inline-flex items-center justify-center size-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
            >
              <X className="size-4.5" aria-hidden="true" />
            </button>

            <span className="inline-flex items-center rounded-full bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 mb-4">
              {activeCase.segment}
            </span>

            <h3 id="case-modal-title" className="text-2xl font-bold text-foreground mb-2">
              {activeCase.name}
            </h3>
            <p className="text-secondary font-semibold mb-6">{activeCase.resultHeadline}</p>

            <div className="flex flex-col gap-5 mb-6">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                  <Target className="size-3.5" aria-hidden="true" />
                  Objetivo
                </p>
                <p className="text-sm text-foreground/90 leading-relaxed">{activeCase.objective}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Problema</p>
                <p className="text-sm text-foreground/90 leading-relaxed">{activeCase.problem}</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                  <Lightbulb className="size-3.5" aria-hidden="true" />
                  Solução
                </p>
                <p className="text-sm text-foreground/90 leading-relaxed">{activeCase.solution}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {activeCase.results.map((result) => (
                <div key={result} className="rounded-xl bg-[var(--color-surface-overlay)] border border-border p-3 text-center">
                  <p className="text-xs font-semibold text-foreground leading-snug">{result}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-5 border-t border-border">
              {activeCase.technologies.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-medium text-muted-foreground rounded-md bg-[var(--color-surface-overlay)] px-2.5 py-1"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
