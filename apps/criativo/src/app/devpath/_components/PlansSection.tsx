import { Check } from "lucide-react"
import { PLANS } from "../_lib/data"
import { Reveal } from "./Reveal"

// Cards de planos (Gratuito / Pro / Empresas) — preços e features ilustrativos
// conforme módulo de monetização do briefing; sem checkout real.
export function PlansSection() {
  return (
    <section id="planos" className="relative px-6 py-20 md:py-28 bg-[var(--devpath-bg-soft)]" aria-labelledby="plans-title">
      <div className="max-w-5xl mx-auto">
        <Reveal className="max-w-2xl mx-auto text-center mb-14">
          <p className="devpath-mono text-xs text-[var(--devpath-green)] mb-3">// planos</p>
          <h2 id="plans-title" className="text-3xl md:text-4xl font-bold text-[var(--devpath-fg)] mb-4">
            Comece de graça, evolua quando quiser
          </h2>
          <p className="text-[var(--devpath-fg-muted)]">
            Acesso completo à busca de vagas e salários no plano gratuito. Desbloqueie recursos avançados de carreira
            no Pro.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.key} delayMs={i * 80}>
              <div
                className={`rounded-2xl border p-7 h-full flex flex-col ${plan.highlight ? "devpath-glow" : ""}`}
                style={{
                  borderColor: plan.highlight ? "var(--devpath-green)" : "var(--devpath-border)",
                  background: "var(--devpath-bg-raised)",
                }}
              >
                {plan.highlight && (
                  <span className="self-start mb-4 rounded-full bg-[rgba(52,211,153,0.14)] text-[var(--devpath-green)] px-3 py-1 text-xs font-semibold">
                    Mais escolhido
                  </span>
                )}
                <h3 className="text-lg font-semibold text-[var(--devpath-fg)] mb-1">{plan.name}</h3>
                <p className="text-sm text-[var(--devpath-fg-muted)] mb-5">{plan.description}</p>
                <p className="mb-6">
                  <span className="text-3xl font-bold text-[var(--devpath-fg)]">{plan.price}</span>
                  {plan.period && <span className="text-sm text-[var(--devpath-fg-muted)]"> {plan.period}</span>}
                </p>

                <ul className="flex flex-col gap-2.5 mb-7 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-[var(--devpath-fg-muted)]">
                      <Check className="size-4 text-[var(--devpath-green)] shrink-0 mt-0.5" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="#vagas"
                  className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-center transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={
                    plan.highlight
                      ? { backgroundImage: "var(--devpath-gradient-cta)", color: "#04140e" }
                      : { border: "1px solid var(--devpath-border)", color: "var(--devpath-fg)" }
                  }
                >
                  {plan.key === "teams" ? "Falar com vendas" : "Começar agora"}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
