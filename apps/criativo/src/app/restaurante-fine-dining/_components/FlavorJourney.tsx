import { DoorOpen, Leaf, UtensilsCrossed, Cherry, type LucideIcon } from "lucide-react"
import { JOURNEY_STEPS, type JourneyIcon } from "../_lib/data"
import { Reveal } from "./Reveal"

const ICONS: Record<JourneyIcon, LucideIcon> = {
  "door-open": DoorOpen,
  leaf: Leaf,
  "utensils-crossed": UtensilsCrossed,
  cherry: Cherry,
}

// Substitui a seção tradicional "Sobre Nós": a experiência gastronômica é
// apresentada como uma jornada em etapas, em timeline horizontal no desktop
// e vertical no mobile.
export function FlavorJourney() {
  return (
    <section className="px-6 py-24" aria-labelledby="jornada-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--color-primary)" }}>
            A Experiência
          </p>
          <h2 id="jornada-title" className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            A Jornada dos Sabores
          </h2>
          <p className="text-muted-foreground">
            Cada visita ao ÂMBAR é construída como uma narrativa em quatro atos — do primeiro gesto de acolhida à
            última lembrança que fica na mesa.
          </p>
        </Reveal>

        <div className="relative">
          <div className="hidden md:block absolute top-7 left-0 right-0 h-px rest-timeline-line" aria-hidden="true" />

          <div className="grid md:grid-cols-4 gap-10 md:gap-6">
            {JOURNEY_STEPS.map((step, index) => {
              const Icon = ICONS[step.icon]
              return (
                <Reveal key={step.title} delayMs={index * 120} className="rest-timeline-step relative">
                  <div className="hidden md:block absolute -left-3 top-0 bottom-0 w-px rest-timeline-line-v" aria-hidden="true" style={{ display: index === 0 ? "none" : undefined }} />
                  <div className="flex md:flex-col items-start md:items-center gap-4 md:gap-5 md:text-center">
                    <span
                      className="rest-timeline-dot inline-flex items-center justify-center size-14 rounded-full shrink-0 text-[var(--color-primary-foreground)]"
                      style={{ backgroundImage: "var(--rest-gradient-gold)" }}
                      aria-hidden="true"
                    >
                      <Icon className="size-6" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{step.caption}</p>
                      <h3 className="text-xl font-semibold text-foreground mb-2 rest-font-serif">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
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
