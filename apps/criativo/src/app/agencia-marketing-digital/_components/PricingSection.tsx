import { Check, Rocket, Sparkles, Building2 } from "lucide-react"
import { Reveal } from "./Reveal"
import { PLANS } from "../_lib/data"

const ICONS = { starter: Rocket, growth: Sparkles, enterprise: Building2 } as const

export function PricingSection() {
  return (
    <section id="planos" className="relative px-6 py-20 md:py-28 scroll-mt-20" aria-labelledby="pricing-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <h2 id="pricing-title" className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Planos para cada <span className="agencia-gradient-text">momento do seu negócio</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Escolha o nível de investimento que faz sentido agora — e evolua conforme os resultados aparecem.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan, i) => {
            const Icon = ICONS[plan.id as keyof typeof ICONS]
            return (
              <Reveal key={plan.id} variant="fade-up" delayMs={i * 90}>
                <div
                  className={`relative rounded-3xl p-8 h-full flex flex-col agencia-card-hover ${
                    plan.highlight
                      ? "agencia-glow text-white"
                      : "border border-border bg-[var(--color-surface-raised)]"
                  }`}
                  style={plan.highlight ? { backgroundImage: "var(--agencia-gradient-primary)" } : undefined}
                >
                  {plan.highlight && (
                    <span className="absolute -top-3 right-7 rounded-full px-3 py-1 text-xs font-semibold text-white bg-[var(--agencia-pink)]">
                      Mais escolhido
                    </span>
                  )}

                  <div
                    className={`inline-flex items-center justify-center size-12 rounded-xl mb-6 ${
                      plan.highlight ? "bg-white/15" : ""
                    }`}
                    style={!plan.highlight ? { backgroundImage: "var(--agencia-gradient-primary)" } : undefined}
                  >
                    <Icon className="size-6 text-white" aria-hidden="true" />
                  </div>

                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className={`text-sm mb-5 ${plan.highlight ? "text-white/85" : "text-muted-foreground"}`}>
                    {plan.audience}
                  </p>

                  <p className="text-3xl font-bold mb-1">{plan.price}</p>
                  <p className={`text-xs mb-6 ${plan.highlight ? "text-white/75" : "text-muted-foreground"}`}>
                    {plan.priceNote}
                  </p>

                  <p className={`text-sm mb-6 ${plan.highlight ? "text-white/90" : "text-muted-foreground"}`}>
                    {plan.description}
                  </p>

                  <ul className="flex flex-col gap-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <Check
                          className={`size-4 shrink-0 mt-0.5 ${plan.highlight ? "text-white" : "text-secondary"}`}
                          aria-hidden="true"
                        />
                        <span className={plan.highlight ? "text-white/95" : "text-muted-foreground"}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#proposta"
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition-transform hover:scale-[1.03] active:scale-[0.98] ${
                      plan.highlight ? "bg-white text-primary" : "text-white"
                    }`}
                    style={!plan.highlight ? { backgroundImage: "var(--agencia-gradient-primary)" } : undefined}
                  >
                    Escolher {plan.name}
                  </a>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
