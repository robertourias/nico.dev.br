import { HeartHandshake, CalendarCheck, Building2, ShieldCheck, ClipboardCheck, GraduationCap } from "lucide-react"
import { Reveal } from "./Reveal"
import { DIFFERENTIALS, type DifferentialIcon } from "../_lib/data"

const ICONS: Record<DifferentialIcon, typeof HeartHandshake> = {
  heart: HeartHandshake,
  calendar: CalendarCheck,
  building: Building2,
  shield: ShieldCheck,
  results: ClipboardCheck,
  graduation: GraduationCap,
}

export function DifferentialsSection() {
  return (
    <section className="px-6 py-20 md:py-28" aria-labelledby="differentials-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14 max-w-2xl mx-auto">
          <h2 id="differentials-title" className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Por que escolher a <span className="text-[var(--color-primary)]">Clínica Vitalis</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Combinamos cuidado humano, tecnologia e praticidade em cada etapa do seu atendimento.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DIFFERENTIALS.map((item, index) => {
            const Icon = ICONS[item.icon]
            return (
              <Reveal key={item.title} delayMs={index * 70}>
                <div className="clin-card-hover h-full rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6">
                  <span
                    className="inline-flex items-center justify-center size-11 rounded-xl mb-4 text-white"
                    style={{ backgroundImage: "var(--clin-gradient-primary)" }}
                    aria-hidden="true"
                  >
                    <Icon className="size-5" />
                  </span>
                  <p className="font-semibold text-foreground mb-1.5">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
