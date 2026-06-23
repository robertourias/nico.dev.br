import { Building2, Rocket, Megaphone, Cloud, Store } from "lucide-react"
import { Reveal } from "./Reveal"

const segments = [
  { icon: Building2, label: "Consultorias" },
  { icon: Rocket, label: "Startups" },
  { icon: Megaphone, label: "Agências" },
  { icon: Cloud, label: "SaaS" },
  { icon: Store, label: "Negócios Locais" },
]

const stats = [
  { value: "+1.000", label: "simulações realizadas" },
  { value: "+R$ 10M", label: "projetados em retorno" },
  { value: "95%", label: "de satisfação" },
]

// Seção de prova social: tipos de negócio que usam análise de ROI e
// indicadores agregados, conforme briefing. Valores estáticos, ilustrativos
// de portfólio.
export function SocialProofSection() {
  return (
    <section className="relative px-6 py-16 md:py-20" aria-labelledby="social-proof-title">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-10">
          <h2 id="social-proof-title" className="text-3xl md:text-4xl font-bold mb-3">
            Empresas que utilizam <span className="roi-gradient-text">análise de ROI</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            De pequenos negócios a operações de e-commerce, decisões melhores começam com números claros.
          </p>
        </Reveal>

        <Reveal variant="fade-up" className="mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {segments.map((segment) => (
              <div
                key={segment.label}
                className="roi-card-hover rounded-xl border border-border bg-[var(--color-surface-raised)] px-3 py-5 flex flex-col items-center gap-2.5 text-center"
              >
                <span
                  className="inline-flex items-center justify-center size-10 rounded-xl"
                  style={{ backgroundColor: "var(--color-surface-overlay)" }}
                  aria-hidden="true"
                >
                  <segment.icon className="size-5" style={{ color: "var(--color-primary)" }} />
                </span>
                <span className="text-xs font-medium text-foreground leading-tight">{segment.label}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal variant="fade-up">
          <div
            className="rounded-2xl p-6 md:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-white roi-glow"
            style={{ backgroundImage: "var(--roi-gradient-primary)" }}
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
