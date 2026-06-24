import { Search, ClipboardList, Rocket, RefreshCw, TrendingUp } from "lucide-react"
import { Reveal } from "./Reveal"
import { PROCESS_STEPS } from "../_lib/data"

const ICONS = [Search, ClipboardList, Rocket, RefreshCw, TrendingUp]

export function ProcessTimeline() {
  return (
    <section
      id="processo"
      className="px-6 py-20 md:py-28 scroll-mt-20"
      aria-labelledby="process-title"
    >
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-16 max-w-2xl mx-auto">
          <h2 id="process-title" className="text-3xl md:text-4xl font-bold text-foreground">
            Nosso processo de <span className="agencia-gradient-text">trabalho</span>
          </h2>
        </Reveal>

        <div className="relative">
          <div
            className="hidden lg:block absolute top-7 left-0 right-0 h-px agencia-timeline-line"
            aria-hidden="true"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
            {PROCESS_STEPS.map((step, index) => {
              const Icon = ICONS[index]
              return (
                <Reveal key={step.title} delayMs={index * 90} className="relative text-center">
                  <div className="flex flex-col items-center">
                    <span
                      className="relative z-10 inline-flex items-center justify-center size-14 rounded-2xl mb-4 text-white agencia-glow"
                      style={{ backgroundImage: "var(--agencia-gradient-primary)" }}
                      aria-hidden="true"
                    >
                      <Icon className="size-6" />
                    </span>
                    <span className="text-xs font-semibold text-primary mb-1">Etapa {index + 1}</span>
                    <p className="font-semibold text-foreground text-sm mb-1">{step.title}</p>
                    <p className="text-xs text-muted-foreground leading-snug">{step.description}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
