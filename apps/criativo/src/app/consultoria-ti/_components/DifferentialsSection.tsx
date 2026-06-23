import { Award, Workflow, Target, MessageSquareText, Layers, ShieldCheck } from "lucide-react"
import { Reveal } from "./Reveal"
import { DIFFERENTIALS, type Differential } from "../_lib/data"

const ICONS: Record<Differential["icon"], typeof Award> = {
  award: Award,
  agile: Workflow,
  target: Target,
  transparency: MessageSquareText,
  scalable: Layers,
  shield: ShieldCheck,
}

export function DifferentialsSection() {
  return (
    <section className="px-6 py-20 md:py-28 bg-[var(--color-surface)]" aria-labelledby="differentials-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14 max-w-2xl mx-auto">
          <h2 id="differentials-title" className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Por que escolher a <span className="consult-gradient-text">VertexIT</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DIFFERENTIALS.map((item, index) => {
            const Icon = ICONS[item.icon]
            return (
              <Reveal key={item.title} delayMs={index * 60}>
                <div className="consult-card-hover h-full rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6 flex items-start gap-4">
                  <span
                    className="inline-flex items-center justify-center size-11 rounded-xl text-white shrink-0"
                    style={{ backgroundImage: "var(--consult-gradient-primary)" }}
                    aria-hidden="true"
                  >
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground mb-1">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
