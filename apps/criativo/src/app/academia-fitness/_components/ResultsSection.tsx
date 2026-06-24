import { ArrowRight, Trophy } from "lucide-react"
import { Reveal } from "./Reveal"
import { RESULTS } from "../_lib/data"

export function ResultsSection() {
  return (
    <section id="resultados" className="px-6 py-20 md:py-28 scroll-mt-20 bg-[var(--color-surface)]" aria-labelledby="results-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14 max-w-2xl mx-auto">
          <h2 id="results-title" className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Resultados dos <span className="aca-highlight">Alunos</span>
          </h2>
          <p className="text-muted-foreground text-lg aca-heading-alt">
            Transformações reais conquistadas com consistência e acompanhamento profissional.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RESULTS.map((result, index) => (
            <Reveal key={result.name} delayMs={index * 90}>
              <div className="aca-card-hover h-full rounded-2xl border border-border bg-[var(--color-surface-raised)] p-7">
                <span
                  className="inline-flex items-center justify-center size-11 rounded-xl mb-5 text-[var(--color-primary-foreground)]"
                  style={{ backgroundImage: "var(--aca-gradient-primary)" }}
                  aria-hidden="true"
                >
                  <Trophy className="size-5" />
                </span>
                <p className="font-bold text-foreground aca-heading-alt text-lg mb-1">{result.name}</p>
                <p className="text-sm text-[var(--color-primary)] font-semibold mb-1">{result.goal}</p>
                <p className="text-xs text-muted-foreground mb-6">Evolução em {result.duration}</p>

                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="text-center">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">Antes</p>
                    <p className="font-semibold text-foreground text-sm">{result.before}</p>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground shrink-0" aria-hidden="true" />
                  <div className="text-center">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">Depois</p>
                    <p className="font-semibold text-[var(--color-primary)] text-sm">{result.after}</p>
                  </div>
                </div>

                <div className="aca-progress-track">
                  <div className="aca-progress-fill" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
