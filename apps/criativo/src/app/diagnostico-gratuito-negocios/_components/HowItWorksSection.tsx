import { ClipboardList, Cpu, FileText, Lightbulb } from "lucide-react"
import { Reveal } from "./Reveal"

const steps = [
  { icon: ClipboardList, title: "Responda ao questionário" },
  { icon: Cpu, title: "O sistema analisa suas respostas" },
  { icon: FileText, title: "Receba um relatório personalizado" },
  { icon: Lightbulb, title: "Veja recomendações práticas para melhoria" },
]

export function HowItWorksSection() {
  return (
    <section className="px-6 py-20 bg-[var(--color-surface)]" aria-labelledby="how-it-works-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-12">
          <h2 id="how-it-works-title" className="text-3xl md:text-4xl font-bold text-foreground">
            Como <span className="diag-gradient-text">funciona</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Reveal key={step.title} delayMs={index * 80} className="relative text-center">
              <div className="flex flex-col items-center">
                <span
                  className="inline-flex items-center justify-center size-14 rounded-2xl mb-4 text-white diag-glow"
                  style={{ backgroundImage: "var(--diag-gradient-primary)" }}
                  aria-hidden="true"
                >
                  <step.icon className="size-6" />
                </span>
                <span className="text-xs font-semibold text-primary mb-1">Etapa {index + 1}</span>
                <p className="font-medium text-foreground text-sm leading-snug">{step.title}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
