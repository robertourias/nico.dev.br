import { UtensilsCrossed, Coffee, Car } from "lucide-react"
import { Reveal } from "./Reveal"

// Exemplos fixos de referência (conforme briefing) — ilustrativos, não
// derivados dos inputs do usuário, ao contrário da InsightsSection.
const examples = [
  {
    icon: UtensilsCrossed,
    habit: "1 delivery a menos por semana",
    annual: "R$ 1.200",
  },
  {
    icon: Coffee,
    habit: "Café caseiro em vez de comprado",
    annual: "R$ 900",
  },
  {
    icon: Car,
    habit: "Menos corridas de aplicativo",
    annual: "R$ 1.500",
  },
]

export function EducationalSection() {
  return (
    <section id="educacional" className="relative px-6 py-16 md:py-20 economia-no-print" aria-labelledby="educational-title">
      <div className="max-w-4xl mx-auto">
        <Reveal className="text-center mb-10">
          <h2 id="educational-title" className="text-3xl md:text-4xl font-bold mb-3">
            Pequenas decisões, <span className="economia-gradient-text">grandes resultados</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Exemplos reais de quanto hábitos simples podem representar ao longo de um ano.
          </p>
        </Reveal>

        <div className="rounded-2xl border border-border bg-[var(--color-surface-raised)] overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_auto] gap-4 px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-[var(--color-surface)]">
            <span>Hábito</span>
            <span>Economia anual</span>
          </div>
          {examples.map((example, i) => (
            <Reveal key={example.habit} delayMs={i * 80}>
              <div
                className={`flex items-center justify-between gap-4 px-6 py-4 ${
                  i > 0 ? "border-t border-border" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex items-center justify-center size-9 rounded-xl shrink-0"
                    style={{ backgroundColor: "var(--color-surface-overlay)" }}
                    aria-hidden="true"
                  >
                    <example.icon className="size-4.5" style={{ color: "var(--color-primary)" }} />
                  </span>
                  <span className="text-sm font-medium text-foreground">{example.habit}</span>
                </div>
                <span className="text-sm font-bold economia-gradient-text shrink-0">{example.annual}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
