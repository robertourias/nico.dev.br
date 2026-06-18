import { Target, Zap, BrainCircuit, Layers, ShieldCheck, TrendingUp, type LucideIcon } from "lucide-react"
import { Reveal } from "./Reveal"

interface Benefit {
  icon: LucideIcon
  title: string
  description: string
}

const benefits: Benefit[] = [
  {
    icon: Target,
    title: "Foco em resultado, não em esforço",
    description: "Um sistema de priorização que elimina 80% das tarefas que não movem o ponteiro.",
  },
  {
    icon: Zap,
    title: "Execução em alta velocidade",
    description: "Rotinas e gatilhos prontos para você sair do planejamento e entrar em ação no mesmo dia.",
  },
  {
    icon: BrainCircuit,
    title: "Clareza mental constante",
    description: "Menos ruído, menos decisão fadigada — seu cérebro livre para o que realmente importa.",
  },
  {
    icon: Layers,
    title: "Sistema, não força de vontade",
    description: "Hábitos e processos que funcionam mesmo nos dias em que a motivação não aparece.",
  },
  {
    icon: ShieldCheck,
    title: "Sem esgotamento",
    description: "Performance sustentável: descanso e recuperação fazem parte do método, não são exceção.",
  },
  {
    icon: TrendingUp,
    title: "Resultados compostos",
    description: "Pequenos avanços diários que se acumulam em uma transformação real em 8 semanas.",
  },
]

export function BenefitsSection() {
  return (
    <section className="relative px-6 py-20 md:py-28" aria-labelledby="benefits-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <h2 id="benefits-title" className="text-3xl md:text-4xl font-bold mb-4">
            Por que o <span className="apice-gradient-text">Método Ápice</span> funciona
          </h2>
          <p className="text-[var(--apice-fg-muted)] text-lg">
            Não é mais um curso de produtividade. É um sistema completo, testado por milhares de pessoas.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((benefit, i) => (
            <Reveal key={benefit.title} variant="fade-up" delayMs={(i % 3) * 90}>
              <div className="apice-glass apice-card-hover rounded-2xl p-7 h-full">
                <div
                  className="inline-flex items-center justify-center size-12 rounded-xl mb-5"
                  style={{ backgroundImage: "var(--apice-gradient-primary)" }}
                >
                  <benefit.icon className="size-6 text-white" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-[var(--apice-fg)]">{benefit.title}</h3>
                <p className="text-sm text-[var(--apice-fg-muted)] leading-relaxed">{benefit.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
