import { ArrowRight, BarChart3, TrendingUp, ShieldCheck } from "lucide-react"
import { AnimatedCounter } from "./AnimatedCounter"
import { HERO_STATS } from "../_lib/data"

const panelMetrics = [
  { label: "Entregas no prazo", value: 96 },
  { label: "Cobertura de testes", value: 88 },
  { label: "Uptime médio", value: 99 },
  { label: "Automação de processos", value: 74 },
]

export function Hero() {
  return (
    <section id="topo" className="relative px-6 pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 consult-grid-bg" aria-hidden="true" />
      <div
        className="consult-blob consult-float-slow -top-24 -left-24 size-80"
        style={{ backgroundImage: "var(--consult-gradient-primary)" }}
        aria-hidden="true"
      />
      <div
        className="consult-blob consult-float-slower top-32 right-0 size-96"
        style={{ background: "var(--color-secondary)" }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-12 items-center">
        <div className="consult-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full consult-glass px-4 py-1.5 text-xs font-semibold text-secondary mb-6">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Consultoria de TI para transformação digital
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5 text-foreground">
            Transformamos desafios tecnológicos em{" "}
            <span className="consult-gradient-text">resultados reais</span> para sua empresa.
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-xl consult-fade-up-delay-1">
            Consultoria especializada em software, cloud, automação e transformação digital.
          </p>

          <div className="flex flex-wrap items-center gap-4 consult-fade-up-delay-2">
            <a
              href="#diagnostico"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold text-white consult-glow transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundImage: "var(--consult-gradient-primary)" }}
            >
              Solicitar Diagnóstico
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#cases"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold text-foreground border border-border hover:border-primary/50 transition-colors"
            >
              Ver Cases
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-8 mt-10 pt-8 border-t border-border consult-fade-up-delay-3">
            {HERO_STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-bold text-foreground tabular-nums">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="consult-fade-up-delay-1 relative">
          <div className="consult-glass rounded-3xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <BarChart3 className="size-4 text-primary" aria-hidden="true" />
                Painel de performance
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-secondary">
                <TrendingUp className="size-3.5" aria-hidden="true" />
                Tempo real
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {panelMetrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl bg-[var(--color-surface-raised)] border border-border p-4">
                  <p className="text-xs text-muted-foreground mb-2">{metric.label}</p>
                  <p className="text-2xl font-bold text-foreground mb-2">{metric.value}%</p>
                  <div className="consult-progress-track">
                    <div className="consult-progress-fill" style={{ width: `${metric.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-[var(--color-surface-raised)] border border-border p-4 flex items-end gap-1.5 h-24">
              {[40, 55, 48, 62, 70, 64, 80, 92].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t-md"
                  style={{ height: `${height}%`, backgroundImage: "var(--consult-gradient-primary)", opacity: 0.4 + index * 0.07 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
