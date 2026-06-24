import { Check, Star } from "lucide-react"
import { Reveal } from "./Reveal"
import { PLANS } from "../_lib/data"

export function PlansSection() {
  return (
    <section id="planos" className="px-6 py-20 md:py-28 scroll-mt-20 bg-[var(--color-surface)]" aria-labelledby="plans-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14 max-w-2xl mx-auto">
          <h2 id="plans-title" className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Escolha seu <span className="aca-highlight">Plano</span>
          </h2>
          <p className="text-muted-foreground text-lg aca-heading-alt">
            Planos flexíveis para qualquer objetivo, sem fidelidade obrigatória.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan, index) => (
            <Reveal key={plan.tier} delayMs={index * 80}>
              <div
                className={`aca-plan-card relative h-full rounded-3xl border p-8 flex flex-col ${
                  plan.featured
                    ? "aca-plan-featured border-[var(--color-primary)] aca-glow lg:-translate-y-3"
                    : "border-border bg-[var(--color-surface-raised)]"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full px-3.5 py-1 text-[11px] font-bold text-[var(--color-primary-foreground)]" style={{ backgroundImage: "var(--aca-gradient-primary)" }}>
                    <Star className="size-3 fill-current" aria-hidden="true" />
                    MAIS ESCOLHIDO
                  </span>
                )}

                <p className="aca-heading-alt text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-sm text-muted-foreground">R$</span>
                  <span
                    className={`text-4xl font-bold ${plan.featured ? "text-[var(--color-primary)]" : "text-foreground"}`}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">{plan.priceSuffix}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground">
                      <Check className={`size-4 shrink-0 mt-0.5 ${plan.featured ? "text-[var(--color-primary)]" : "text-muted-foreground"}`} aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="#matricula"
                  className={`aca-cta-highlight inline-flex items-center justify-center rounded-lg px-6 py-3.5 text-sm font-bold ${
                    plan.featured
                      ? "text-[var(--color-primary-foreground)]"
                      : "text-foreground border border-border hover:border-[var(--color-primary)]"
                  }`}
                  style={plan.featured ? { backgroundImage: "var(--aca-gradient-primary)" } : undefined}
                >
                  {plan.cta}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
