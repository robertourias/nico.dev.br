import { Gift, ShieldCheck, Zap } from "lucide-react"
import { Reveal } from "./Reveal"
import { TrialClassForm } from "./TrialClassForm"

const points = [
  { icon: Gift, text: "Aula 100% gratuita, sem compromisso" },
  { icon: Zap, text: "Avaliação inicial com um professor" },
  { icon: ShieldCheck, text: "Sem necessidade de cartão de crédito" },
]

export function TrialClassSection() {
  return (
    <section id="aula-experimental" className="px-6 py-20 md:py-28 scroll-mt-20" aria-labelledby="trial-title">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-12 items-start">
        <Reveal variant="slide-right">
          <h2 id="trial-title" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Experimente uma <span className="aca-highlight">aula gratuita</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Conheça nossa estrutura e sinta na prática como é treinar na VIGOR. Preencha o formulário e um
            consultor agenda sua aula experimental.
          </p>
          <ul className="flex flex-col gap-4">
            {points.map((point) => (
              <li key={point.text} className="flex items-center gap-3 text-sm text-foreground">
                <span
                  className="inline-flex items-center justify-center size-9 rounded-xl text-[var(--color-primary-foreground)] shrink-0"
                  style={{ backgroundImage: "var(--aca-gradient-primary)" }}
                  aria-hidden="true"
                >
                  <point.icon className="size-4" />
                </span>
                {point.text}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal variant="slide-left">
          <div className="aca-glass aca-glow rounded-3xl p-6 md:p-8">
            <TrialClassForm />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
