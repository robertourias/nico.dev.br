import { Reveal } from "./Reveal"
import { AnimatedCounter } from "./AnimatedCounter"
import { KPIS } from "../_lib/data"

export function StatsSection() {
  return (
    <section className="relative px-6 py-20 md:py-24 overflow-hidden" aria-labelledby="stats-title">
      <div
        className="absolute inset-0"
        style={{ backgroundImage: "var(--consult-gradient-soft)" }}
        aria-hidden="true"
      />
      <div className="relative max-w-6xl mx-auto">
        <h2 id="stats-title" className="sr-only">
          Indicadores da consultoria
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
          {KPIS.map((kpi, index) => (
            <Reveal key={kpi.label} delayMs={index * 70} className="text-center">
              <p className="text-3xl md:text-4xl font-bold consult-gradient-text tabular-nums">
                <AnimatedCounter value={kpi.value} suffix={kpi.suffix} />
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-2">{kpi.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
