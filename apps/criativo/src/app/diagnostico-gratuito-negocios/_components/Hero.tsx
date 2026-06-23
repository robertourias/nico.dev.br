import { BarChart3, Clock, ListChecks, Zap } from "lucide-react"

const indicators = [
  { icon: Clock, label: "3 minutos" },
  { icon: ListChecks, label: "12 perguntas" },
  { icon: Zap, label: "Relatório instantâneo" },
]

export function Hero() {
  return (
    <section id="topo" className="relative px-6 pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
      <div
        className="diag-blob diag-float-slow -top-20 -left-20 size-72"
        style={{ backgroundImage: "var(--diag-gradient-primary)" }}
        aria-hidden="true"
      />
      <div
        className="diag-blob diag-float-slower top-40 right-0 size-80"
        style={{ background: "var(--diag-accent)" }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-12 items-center">
        <div className="diag-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5 text-foreground">
            Descubra os principais{" "}
            <span className="diag-gradient-text">gargalos</span> que estão limitando o crescimento do seu negócio
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-xl diag-fade-up-delay-1">
            Responda algumas perguntas rápidas e receba gratuitamente um diagnóstico com insights estratégicos para
            aumentar resultados.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-8 diag-fade-up-delay-1">
            {indicators.map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-2 rounded-full diag-glass px-4 py-2 text-sm font-medium text-foreground"
              >
                <item.icon className="size-4 text-primary" aria-hidden="true" />
                {item.label}
              </span>
            ))}
          </div>

          <a
            href="#diagnostico"
            className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold text-white diag-glow transition-transform hover:scale-[1.02] active:scale-[0.98] diag-fade-up-delay-2"
            style={{ backgroundImage: "var(--diag-gradient-primary)" }}
          >
            Iniciar Diagnóstico Gratuito
          </a>
        </div>

        <div className="diag-fade-up-delay-1 relative">
          <div className="diag-glass rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6 text-sm font-semibold text-muted-foreground">
              <BarChart3 className="size-4 text-primary" aria-hidden="true" />
              Painel de indicadores
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Marketing", value: 78 },
                { label: "Vendas", value: 62 },
                { label: "Operação", value: 54 },
                { label: "Financeiro", value: 71 },
              ].map((metric) => (
                <div key={metric.label} className="rounded-2xl bg-[var(--color-surface-raised)] border border-border p-4">
                  <p className="text-xs text-muted-foreground mb-2">{metric.label}</p>
                  <p className="text-2xl font-bold text-foreground mb-2">{metric.value}%</p>
                  <div className="diag-progress-track">
                    <div className="diag-progress-fill" style={{ width: `${metric.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
