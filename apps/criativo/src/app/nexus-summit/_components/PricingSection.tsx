"use client"

import { Check, Crown, Sparkles, type LucideIcon } from "lucide-react"
import { Reveal } from "./Reveal"
import { SELECTED_PLAN_STORAGE_KEY } from "../_lib/plan"

interface Plan {
  id: string
  icon: LucideIcon
  name: string
  price: string
  description: string
  features: string[]
  highlight?: boolean
}

const plans: Plan[] = [
  {
    id: "standard",
    icon: Check,
    name: "Standard",
    price: "R$ 197",
    description: "Para quem quer participar do conteúdo principal do evento.",
    features: ["Acesso a todas as palestras", "Certificado digital de participação", "Material de apoio em PDF"],
  },
  {
    id: "premium",
    icon: Sparkles,
    name: "Premium",
    price: "R$ 397",
    description: "A opção mais completa para aproveitar o evento de ponta a ponta.",
    features: [
      "Tudo do plano Standard",
      "Acesso a todos os workshops práticos",
      "Gravações de todas as sessões por 90 dias",
      "Brinde exclusivo do evento",
    ],
    highlight: true,
  },
  {
    id: "vip",
    icon: Crown,
    name: "VIP",
    price: "R$ 897",
    description: "Experiência premium com acesso direto aos palestrantes.",
    features: [
      "Tudo do plano Premium",
      "Networking fechado com palestrantes",
      "Mentoria em grupo pós-evento",
      "Jantar exclusivo com palestrantes",
    ],
  },
]

// Diferencial de portfólio: "simulação de compra de ingresso" sem coletar
// dados de pagamento reais. Ao escolher um plano, gravamos a intenção em
// localStorage e o formulário de inscrição (RegistrationForm) lê esse valor
// para pré-selecionar o campo "Plano de interesse" — sem Suspense/contexto
// extra, sem backend de pagamento simulado.
export function PricingSection() {
  function selectPlan(planId: string) {
    try {
      window.localStorage.setItem(SELECTED_PLAN_STORAGE_KEY, planId)
    } catch {
      // Ambiente sem localStorage (ex.: navegação privada) — sem efeito além
      // de não pré-selecionar o plano no formulário.
    }
  }

  return (
    <section id="ingressos" className="relative px-6 py-20 md:py-28 scroll-mt-20" aria-labelledby="pricing-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <h2 id="pricing-title" className="text-3xl md:text-4xl font-bold mb-4 text-[var(--nexus-fg)]">
            Escolha seu <span className="nexus-gradient-text">ingresso</span>
          </h2>
          <p className="text-[var(--nexus-fg-muted)] text-lg">
            Planos pensados para diferentes níveis de envolvimento com o evento.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <Reveal key={plan.id} variant="fade-up" delayMs={i * 90}>
              <div
                className={`relative rounded-3xl p-8 h-full flex flex-col nexus-card-hover ${
                  plan.highlight
                    ? "nexus-glow text-white"
                    : "bg-white border border-[var(--nexus-border)]"
                }`}
                style={plan.highlight ? { backgroundImage: "var(--nexus-gradient-primary)" } : undefined}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 right-7 rounded-full px-3 py-1 text-xs font-semibold text-white bg-[var(--nexus-orange)]">
                    Mais escolhido
                  </span>
                )}

                <div
                  className={`inline-flex items-center justify-center size-12 rounded-xl mb-6 ${
                    plan.highlight ? "bg-white/15" : ""
                  }`}
                  style={!plan.highlight ? { backgroundImage: "var(--nexus-gradient-primary)" } : undefined}
                >
                  <plan.icon className="size-6 text-white" aria-hidden="true" />
                </div>

                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className={`text-sm mb-5 ${plan.highlight ? "text-white/85" : "text-[var(--nexus-fg-muted)]"}`}>
                  {plan.description}
                </p>

                <p className="text-4xl font-bold mb-6">
                  {plan.price}
                  <span className={`text-sm font-normal ${plan.highlight ? "text-white/75" : "text-[var(--nexus-fg-faint)]"}`}>
                    {" "}
                    /pessoa
                  </span>
                </p>

                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check
                        className={`size-4 shrink-0 mt-0.5 ${plan.highlight ? "text-white" : "text-[var(--nexus-emerald)]"}`}
                        aria-hidden="true"
                      />
                      <span className={plan.highlight ? "text-white/95" : "text-[var(--nexus-fg-muted)]"}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#inscricao"
                  onClick={() => selectPlan(plan.id)}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition-transform hover:scale-[1.03] active:scale-[0.98] ${
                    plan.highlight ? "bg-white text-[var(--nexus-purple)]" : "text-white"
                  }`}
                  style={!plan.highlight ? { backgroundImage: "var(--nexus-gradient-cta)" } : undefined}
                >
                  Escolher {plan.name}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
