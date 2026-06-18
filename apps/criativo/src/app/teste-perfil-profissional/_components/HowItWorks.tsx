import { ListChecks, BrainCircuit, FileBarChart, Rocket } from "lucide-react"
import { Reveal } from "./Reveal"

const steps = [
  {
    icon: ListChecks,
    title: "Responda ao questionário",
    description: "Pequenas perguntas objetivas e rápidas.",
  },
  {
    icon: BrainCircuit,
    title: "Análise Inteligente",
    description: "O sistema interpreta seu comportamento e preferências.",
  },
  {
    icon: FileBarChart,
    title: "Receba seu Perfil",
    description: "Visualize seu resultado completo instantaneamente.",
  },
  {
    icon: Rocket,
    title: "Aplique as Recomendações",
    description: "Utilize os insights para crescer profissionalmente.",
  },
]

export function HowItWorks() {
  return (
    <section className="relative px-6 py-20 md:py-28 bg-[var(--color-surface)]" aria-labelledby="how-it-works-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-16">
          <h2 id="how-it-works-title" className="text-3xl md:text-4xl font-bold mb-4">
            Como <span className="perfil-gradient-text">Funciona</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Do questionário ao seu plano de carreira, em quatro passos simples.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map(({ icon: Icon, title, description }, i) => (
            <Reveal key={title} delayMs={i * 100} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <div
                    className="inline-flex items-center justify-center size-16 rounded-2xl perfil-glow"
                    style={{ backgroundImage: "var(--perfil-gradient-primary)" }}
                  >
                    <Icon className="size-7 text-white" aria-hidden="true" />
                  </div>
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center size-6 rounded-full bg-white border border-border text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[14rem]">{description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
