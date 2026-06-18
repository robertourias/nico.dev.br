import { X, Check, ArrowRight } from "lucide-react"
import { Reveal } from "./Reveal"

const before = [
  "Lista de tarefas infinita e a sensação de nunca terminar nada.",
  "Procrastinação seguida de culpa, repetida todos os dias.",
  "Trabalhar mais horas sem ver resultado proporcional.",
  "Motivação que some assim que a rotina aperta.",
]

const after = [
  "Foco nas 3 coisas que realmente movem seus resultados.",
  "Ação consistente, mesmo nos dias difíceis — o sistema carrega você.",
  "Mais resultado em menos tempo, com espaço real para descansar.",
  "Progresso que não depende de motivação para continuar.",
]

export function TransformationSection() {
  return (
    <section className="relative px-6 py-20 md:py-28" aria-labelledby="transformation-title">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <h2 id="transformation-title" className="text-3xl md:text-4xl font-bold mb-4">
            De onde você está, para onde quer <span className="apice-gradient-text">chegar</span>
          </h2>
          <p className="text-[var(--apice-fg-muted)] text-lg">
            O Método Ápice foi desenhado para essa virada — não em anos, em semanas.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-4 items-center">
          <Reveal variant="slide-right">
            <div className="apice-card-hover rounded-2xl p-7 h-full border border-[var(--apice-rose)]/20 bg-[var(--apice-rose)]/[0.04]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--apice-rose)] mb-5">
                Antes
              </p>
              <ul className="flex flex-col gap-4">
                {before.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--apice-fg-muted)]">
                    <X className="size-4 text-[var(--apice-rose)] shrink-0 mt-0.5" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <div className="hidden lg:flex items-center justify-center" aria-hidden="true">
            <div
              className="size-12 rounded-full flex items-center justify-center apice-glow"
              style={{ backgroundImage: "var(--apice-gradient-primary)" }}
            >
              <ArrowRight className="size-5 text-white" />
            </div>
          </div>

          <Reveal variant="slide-left">
            <div className="apice-glass apice-card-hover rounded-2xl p-7 h-full border-[var(--apice-neon)]/20">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--apice-neon)] mb-5">
                Depois
              </p>
              <ul className="flex flex-col gap-4">
                {after.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--apice-fg)]">
                    <Check className="size-4 text-[var(--apice-neon)] shrink-0 mt-0.5" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
