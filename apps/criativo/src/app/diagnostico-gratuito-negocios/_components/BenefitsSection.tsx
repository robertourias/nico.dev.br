import { TrendingUp, Megaphone, Handshake, Settings, Wallet, Target } from "lucide-react"
import { Reveal } from "./Reveal"

const benefits = [
  { icon: TrendingUp, title: "Crescimento", description: "Identifique oportunidades de expansão." },
  { icon: Megaphone, title: "Marketing", description: "Avalie sua geração de leads." },
  { icon: Handshake, title: "Vendas", description: "Entenda gargalos comerciais." },
  { icon: Settings, title: "Operação", description: "Detecte processos ineficientes." },
  { icon: Wallet, title: "Financeiro", description: "Analise indicadores importantes." },
  { icon: Target, title: "Estratégia", description: "Avalie o posicionamento do negócio." },
]

export function BenefitsSection() {
  return (
    <section className="px-6 py-20" aria-labelledby="benefits-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-12">
          <h2 id="benefits-title" className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            O que você vai <span className="diag-gradient-text">descobrir</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((benefit, index) => (
            <Reveal key={benefit.title} delayMs={index * 60}>
              <div className="diag-card-hover h-full rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6">
                <span
                  className="inline-flex items-center justify-center size-11 rounded-xl mb-4 text-white"
                  style={{ backgroundImage: "var(--diag-gradient-primary)" }}
                  aria-hidden="true"
                >
                  <benefit.icon className="size-5" />
                </span>
                <p className="font-semibold text-foreground mb-1">{benefit.title}</p>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
