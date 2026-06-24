import { UtensilsCrossed, Wine, GlassWater, IceCreamCone } from "lucide-react"
import { PAIRINGS } from "../_lib/data"
import { Reveal } from "./Reveal"

const STEPS = [
  { key: "dish" as const, label: "Prato", icon: UtensilsCrossed },
  { key: "wine" as const, label: "Vinho", icon: Wine },
  { key: "drink" as const, label: "Drink", icon: GlassWater },
  { key: "dessert" as const, label: "Sobremesa", icon: IceCreamCone },
]

// "Harmonizações Exclusivas" — interface no estilo de um guia gastronômico,
// conectando prato, vinho, drink e sobremesa em um único fluxo visual.
export function Pairings() {
  return (
    <section className="px-6 py-24" aria-labelledby="harmonizacoes-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--color-primary)" }}>
            Guia Gastronômico
          </p>
          <h2 id="harmonizacoes-title" className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Harmonizações Exclusivas
          </h2>
          <p className="text-muted-foreground">
            Combinações estudadas pela nossa equipe de sommeliers para potencializar cada camada de sabor.
          </p>
        </Reveal>

        <div className="flex flex-col gap-5">
          {PAIRINGS.map((pairing, index) => (
            <Reveal key={pairing.dish} delayMs={index * 90}>
              <div className="rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6 md:p-7 rest-card-hover">
                <div className="grid sm:grid-cols-4 gap-5 sm:gap-3 items-center relative">
                  <div className="hidden sm:block absolute top-7 left-[12.5%] right-[12.5%] rest-pairing-connector" aria-hidden="true" />
                  {STEPS.map((step) => {
                    const Icon = step.icon
                    return (
                      <div key={step.key} className="relative flex sm:flex-col items-center gap-3 sm:gap-2 sm:text-center">
                        <span
                          className="relative inline-flex items-center justify-center size-12 rounded-full shrink-0 text-[var(--color-primary-foreground)]"
                          style={{ backgroundImage: "var(--rest-gradient-gold)" }}
                          aria-hidden="true"
                        >
                          <Icon className="size-5" />
                        </span>
                        <div>
                          <p className="text-[0.7rem] uppercase tracking-wide text-muted-foreground">{step.label}</p>
                          <p className="text-sm font-medium text-foreground">{pairing[step.key]}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
