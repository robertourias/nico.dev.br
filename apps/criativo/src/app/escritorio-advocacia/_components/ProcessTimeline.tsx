import { PhoneCall, FileSearch, Users, Target, TrendingUp } from "lucide-react"
import { Reveal } from "./Reveal"
import { PROCESS_STEPS } from "../_lib/data"

const ICONS = [PhoneCall, FileSearch, Users, Target, TrendingUp]

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
            Processo de <span style={{ color: "var(--adv-gold)" }}>Atendimento</span>
          </h2>
        </Reveal>

        {/* Timeline horizontal — desktop */}
        <div className="hidden lg:block relative">
          <div className="absolute top-7 left-0 right-0 h-px adv-timeline-line-h" aria-hidden="true" />
          <div className="grid grid-cols-5 gap-6">
            {PROCESS_STEPS.map((step, index) => {
              const Icon = ICONS[index]
              return (
                <Reveal key={step.title} delayMs={index * 90} className="relative text-center">
                  <div className="flex flex-col items-center">
                    <span
                      className="relative z-10 inline-flex items-center justify-center size-14 rounded-2xl mb-4 text-white adv-glow"
                      style={{ backgroundImage: "var(--adv-gradient-primary)" }}
                      aria-hidden="true"
                    >
                      <Icon className="size-6" />
                    </span>
                    <span className="text-xs font-semibold mb-1" style={{ color: "var(--adv-gold)" }}>
                      Etapa {index + 1}
                    </span>
                    <p className="font-semibold text-foreground text-sm mb-1">{step.title}</p>
                    <p className="text-xs text-muted-foreground leading-snug">{step.description}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>

        {/* Timeline vertical — mobile/tablet */}
        <div className="lg:hidden relative pl-8">
          <div className="absolute top-2 bottom-2 left-[1.6rem] w-px adv-timeline-line-v" aria-hidden="true" />
          <div className="flex flex-col gap-8">
            {PROCESS_STEPS.map((step, index) => {
              const Icon = ICONS[index]
              return (
                <Reveal key={step.title} delayMs={index * 90} variant="slide-right" className="relative flex items-start gap-4">
                  <span
                    className="relative z-10 inline-flex items-center justify-center size-12 rounded-2xl text-white shrink-0 -ml-8 adv-glow"
                    style={{ backgroundImage: "var(--adv-gradient-primary)" }}
                    aria-hidden="true"
                  >
                    <Icon className="size-5" />
                  </span>
                  <div className="pt-1.5">
                    <span className="text-xs font-semibold" style={{ color: "var(--adv-gold)" }}>
                      Etapa {index + 1}
                    </span>
                    <p className="font-semibold text-foreground text-sm mt-0.5 mb-1">{step.title}</p>
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
