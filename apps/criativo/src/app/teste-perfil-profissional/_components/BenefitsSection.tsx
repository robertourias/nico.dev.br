import type { LucideIcon } from "lucide-react"
import { Compass, Briefcase, TrendingUp, Zap, Crown, ShieldCheck } from "lucide-react"
import { Reveal } from "./Reveal"

interface Benefit {
  icon: LucideIcon
  title: string
  description: string
}

const benefits: Benefit[] = [
  {
    icon: Compass,
    title: "Autoconhecimento",
    description: "Entenda suas principais características e estilo de trabalho.",
  },
  {
    icon: Briefcase,
    title: "Carreira",
    description: "Receba sugestões de áreas e profissões compatíveis.",
  },
  {
    icon: TrendingUp,
    title: "Desenvolvimento",
    description: "Descubra habilidades que precisam ser fortalecidas.",
  },
  {
    icon: Zap,
    title: "Produtividade",
    description: "Aprenda a utilizar seus pontos fortes no dia a dia.",
  },
  {
    icon: Crown,
    title: "Liderança",
    description: "Identifique seu potencial para gestão e influência.",
  },
  {
    icon: ShieldCheck,
    title: "Decisão",
    description: "Tenha mais segurança ao planejar sua carreira.",
  },
]

export function BenefitsSection() {
  return (
    <section className="relative px-6 py-20 md:py-28" aria-labelledby="benefits-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14">
          <h2 id="benefits-title" className="text-3xl md:text-4xl font-bold mb-4">
            Por que realizar o <span className="perfil-gradient-text">Teste de Perfil Profissional</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Uma análise completa do seu comportamento profissional, pensada para gerar clareza e direção.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map(({ icon: Icon, title, description }, i) => (
            <Reveal key={title} delayMs={(i % 3) * 80}>
              <div className="perfil-card-hover h-full rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6">
                <div
                  className="inline-flex items-center justify-center size-11 rounded-xl mb-4"
                  style={{ backgroundImage: "var(--perfil-gradient-soft)" }}
                >
                  <Icon className="size-5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
