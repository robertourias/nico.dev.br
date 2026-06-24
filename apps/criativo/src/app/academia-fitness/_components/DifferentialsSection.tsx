import { Dumbbell, Clock, GraduationCap, Smartphone, Building2, Car } from "lucide-react"
import { Reveal } from "./Reveal"
import { DIFFERENTIALS, type DifferentialIcon } from "../_lib/data"

const ICONS: Record<DifferentialIcon, typeof Dumbbell> = {
  equipment: Dumbbell,
  clock: Clock,
  teacher: GraduationCap,
  app: Smartphone,
  structure: Building2,
  parking: Car,
}

export function DifferentialsSection() {
  return (
    <section className="px-6 py-20 md:py-28" aria-labelledby="differentials-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14 max-w-2xl mx-auto">
          <h2 id="differentials-title" className="text-3xl md:text-4xl font-bold text-foreground">
            Por que treinar na <span className="aca-highlight">VIGOR</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DIFFERENTIALS.map((item, index) => {
            const Icon = ICONS[item.icon]
            return (
              <Reveal key={item.title} delayMs={index * 60}>
                <div className="aca-card-hover h-full rounded-2xl border border-border bg-[var(--color-surface-raised)] p-7">
                  <span
                    className="inline-flex items-center justify-center size-12 rounded-xl mb-5 text-[var(--color-primary-foreground)]"
                    style={{ backgroundImage: "var(--aca-gradient-primary)" }}
                    aria-hidden="true"
                  >
                    <Icon className="size-5.5" />
                  </span>
                  <p className="font-semibold text-foreground mb-1.5 aca-heading-alt text-lg">{item.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
