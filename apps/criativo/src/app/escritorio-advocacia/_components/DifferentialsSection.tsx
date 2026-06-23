import { HeartHandshake, GraduationCap, Eye, Award, Zap, Globe } from "lucide-react"
import { Reveal } from "./Reveal"
import { DIFFERENTIALS, type DifferentialIcon } from "../_lib/data"

const ICONS: Record<DifferentialIcon, typeof HeartHandshake> = {
  heart: HeartHandshake,
  graduation: GraduationCap,
  eye: Eye,
  award: Award,
  zap: Zap,
  globe: Globe,
}

export function DifferentialsSection() {
  return (
    <section className="px-6 py-20 md:py-28 bg-[var(--color-surface)]" aria-labelledby="differentials-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14 max-w-2xl mx-auto">
          <h2 id="differentials-title" className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Por que escolher a <span style={{ color: "var(--adv-gold)" }}>Lemos &amp; Bastos</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Combinamos rigor técnico, transparência e proximidade em cada caso que atendemos.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DIFFERENTIALS.map((item, index) => {
            const Icon = ICONS[item.icon]
            return (
              <Reveal key={item.title} delayMs={index * 70}>
                <div className="adv-card-hover h-full rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6">
                  <span
                    className="inline-flex items-center justify-center size-11 rounded-xl mb-4 text-white"
                    style={{ backgroundImage: "var(--adv-gradient-primary)" }}
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
