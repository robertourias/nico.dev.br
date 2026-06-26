import { INDICATORS } from "../_lib/data"
import { AnimatedCounter } from "./AnimatedCounter"
import { Reveal } from "./Reveal"

// Barra de indicadores logo abaixo do Hero — cards horizontais com contador
// animado, conforme briefing. `prefix`/`suffix` vêm de `_lib/data.ts` para
// manter o conteúdo editorial fora do componente visual.
export function StatsBar() {
  return (
    <section className="px-6 pb-16 md:pb-20" aria-label="Indicadores">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {INDICATORS.map((indicator, index) => (
            <Reveal key={indicator.label} delayMs={index * 70}>
              <div className="solar-card-hover rounded-2xl border border-border bg-[var(--color-surface-raised)] p-5 text-center h-full">
                <p className="text-2xl md:text-3xl font-bold solar-gradient-text tabular-nums">
                  <AnimatedCounter value={indicator.value} prefix={indicator.prefix} suffix={indicator.suffix} decimals={indicator.decimals} />
                </p>
                <p className="text-xs text-muted-foreground mt-1.5 leading-tight">{indicator.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
