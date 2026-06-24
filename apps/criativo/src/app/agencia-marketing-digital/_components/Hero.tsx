import { ArrowRight, BarChart3, TrendingUp, Sparkles, Users2, Target } from "lucide-react"
import { AnimatedCounter } from "./AnimatedCounter"
import { ParticlesField } from "./ParticlesField"
import { HERO_STATS } from "../_lib/data"

const panelMetrics = [
  { label: "ROAS médio", value: 82 },
  { label: "Taxa de conversão", value: 64 },
  { label: "CTR de campanhas", value: 91 },
  { label: "Leads qualificados", value: 76 },
]

export function Hero() {
  return (
    <section id="topo" className="relative px-6 pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 agencia-mesh-bg" aria-hidden="true" />
      <div className="absolute inset-0 agencia-grid-bg" aria-hidden="true" />
      <div
        className="agencia-blob agencia-float-slow -top-24 -left-24 size-80"
        style={{ backgroundImage: "var(--agencia-gradient-primary)" }}
        aria-hidden="true"
      />
      <div
        className="agencia-blob agencia-float-slower top-32 right-0 size-96"
        style={{ backgroundImage: "var(--agencia-gradient-accent)" }}
        aria-hidden="true"
      />
      <ParticlesField />

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-12 items-center">
        <div className="agencia-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full agencia-glass px-4 py-1.5 text-xs font-semibold text-secondary mb-6">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Marketing digital orientado por dados
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-bold leading-tight mb-5 text-foreground">
            Transformamos <span className="agencia-gradient-text">Estratégias</span> em Resultados Reais
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-xl agencia-fade-up-delay-1">
            Marketing digital orientado por dados para aumentar vendas, gerar leads e acelerar o crescimento da sua
            empresa.
          </p>

          <div className="flex flex-wrap items-center gap-4 agencia-fade-up-delay-2">
            <a
              href="#proposta"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold text-white agencia-glow transition-transform hover:scale-[1.03] active:scale-[0.98]"
              style={{ backgroundImage: "var(--agencia-gradient-primary)" }}
            >
              Solicitar Proposta
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#cases"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold text-foreground border border-border hover:border-primary/50 transition-colors"
            >
              Ver Portfólio
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-8 mt-10 pt-8 border-t border-border agencia-fade-up-delay-3">
            {HERO_STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-bold text-foreground tabular-nums">
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="agencia-fade-up-delay-1 relative">
          <div
            className="hidden md:flex agencia-glass agencia-glow-pink absolute -top-8 -left-10 z-10 items-center gap-3 rounded-2xl px-4 py-3 agencia-float-slow"
            aria-hidden="true"
          >
            <span
              className="inline-flex items-center justify-center size-9 rounded-xl text-white"
              style={{ backgroundImage: "var(--agencia-gradient-accent)" }}
            >
              <TrendingUp className="size-4" />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">+320% ROAS</p>
              <p className="text-[0.65rem] text-muted-foreground">Bloom Cosméticos</p>
            </div>
          </div>

          <div
            className="hidden md:flex agencia-glass agencia-glow absolute -bottom-8 -right-6 z-10 items-center gap-3 rounded-2xl px-4 py-3 agencia-float-slower"
            aria-hidden="true"
          >
            <span
              className="inline-flex items-center justify-center size-9 rounded-xl text-white"
              style={{ backgroundImage: "var(--agencia-gradient-primary)" }}
            >
              <Users2 className="size-4" />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">1.240 leads/mês</p>
              <p className="text-[0.65rem] text-muted-foreground">Órbita SaaS</p>
            </div>
          </div>

          <div className="agencia-glass rounded-3xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <BarChart3 className="size-4 text-primary" aria-hidden="true" />
                Painel de performance
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-secondary">
                <Target className="size-3.5" aria-hidden="true" />
                Tempo real
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {panelMetrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl bg-[var(--color-surface-raised)] border border-border p-4">
                  <p className="text-xs text-muted-foreground mb-2">{metric.label}</p>
                  <p className="text-2xl font-bold text-foreground mb-2">{metric.value}%</p>
                  <div className="agencia-progress-track">
                    <div className="agencia-progress-fill" style={{ width: `${metric.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-[var(--color-surface-raised)] border border-border p-4 flex items-end gap-1.5 h-24">
              {[35, 48, 42, 58, 66, 60, 78, 95].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t-md"
                  style={{ height: `${height}%`, backgroundImage: "var(--agencia-gradient-primary)", opacity: 0.4 + index * 0.07 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
