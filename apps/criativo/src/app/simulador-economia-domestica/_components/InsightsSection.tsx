import { Lightbulb } from "lucide-react"
import { Reveal } from "./Reveal"
import type { Insight } from "../_lib/calculations"

interface InsightsSectionProps {
  insights: Insight[]
}

// Recomendações automáticas calculadas a partir dos valores reais que o
// usuário informou no simulador (ver generateInsights em _lib/calculations),
// não são textos fixos — por isso recebem `insights` como prop e mudam junto
// com o formulário.
export function InsightsSection({ insights }: InsightsSectionProps) {
  return (
    <section className="relative px-6 py-16 md:py-20 bg-[var(--color-surface)] economia-no-print" aria-labelledby="insights-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-10">
          <h2 id="insights-title" className="text-3xl md:text-4xl font-bold mb-3">
            Insights para a <span className="economia-gradient-text">sua realidade</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Recomendações calculadas com base nos valores que você informou no simulador.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((insight, i) => (
            <Reveal key={insight.id} delayMs={i * 60}>
              <div className="economia-card-hover h-full rounded-2xl border border-border bg-[var(--color-surface-raised)] p-5 flex items-start gap-3">
                <span
                  className="inline-flex items-center justify-center size-9 rounded-xl shrink-0"
                  style={{ backgroundColor: "var(--color-surface-overlay)" }}
                  aria-hidden="true"
                >
                  <Lightbulb className="size-4.5" style={{ color: "var(--color-primary)" }} />
                </span>
                <p className="text-sm text-foreground leading-relaxed">{insight.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
