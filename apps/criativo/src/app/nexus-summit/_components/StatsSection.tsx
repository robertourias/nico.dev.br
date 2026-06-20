import { Users, CalendarDays, Smile, Building2 } from "lucide-react"
import { Reveal } from "./Reveal"
import { AnimatedCounter } from "./AnimatedCounter"

const stats = [
  { icon: Users, value: 5000, prefix: "+", suffix: "", label: "Participantes" },
  { icon: CalendarDays, value: 120, prefix: "+", suffix: "", label: "Eventos realizados" },
  { icon: Smile, value: 98, prefix: "", suffix: "%", label: "De satisfação" },
  { icon: Building2, value: 50, prefix: "+", suffix: "", label: "Empresas parceiras" },
]

export function StatsSection() {
  return (
    <section className="relative px-6 py-20 md:py-24" aria-labelledby="stats-title">
      <h2 id="stats-title" className="sr-only">
        Números do NEXUS Summit
      </h2>
      <div className="max-w-5xl mx-auto">
        <div
          className="rounded-3xl p-10 md:p-14 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 text-white"
          style={{ backgroundImage: "var(--nexus-gradient-primary)" }}
        >
          {stats.map((stat, i) => (
            <Reveal key={stat.label} variant="scale-in" delayMs={i * 80} className="text-center">
              <stat.icon className="size-6 mx-auto mb-3 opacity-80" aria-hidden="true" />
              <p className="text-3xl md:text-4xl font-bold tabular-nums">
                <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </p>
              <p className="text-sm opacity-85 mt-1">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
