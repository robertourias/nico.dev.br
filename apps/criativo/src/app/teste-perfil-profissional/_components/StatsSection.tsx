import { Reveal } from "./Reveal"
import { AnimatedCounter } from "./AnimatedCounter"

// Estatísticas ilustrativas de exemplo (conforme briefing) — copy fixa, não
// representam telemetria real do produto.
const stats = [
  { value: 50000, prefix: "+", suffix: "", decimals: 0, label: "testes realizados" },
  { value: 1200, prefix: "+", suffix: "", decimals: 0, label: "empresas utilizando" },
  { value: 92, prefix: "", suffix: "%", decimals: 0, label: "de satisfação" },
  { value: 4.9, prefix: "", suffix: "/5", decimals: 1, label: "avaliação média" },
]

export function StatsSection() {
  return (
    <section className="relative px-6 py-16 md:py-20" aria-label="Estatísticas">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="perfil-glass rounded-3xl grid grid-cols-2 md:grid-cols-4 gap-8 px-8 py-10">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold perfil-gradient-text mb-1">
                  <AnimatedCounter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
                </p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
