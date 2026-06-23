import { ArrowUpRight, TrendingUp } from "lucide-react"

const sparklinePoints = "0,38 18,34 36,36 54,26 72,28 90,16 108,18 126,6"

// Mockup estático exibido ao lado do conteúdo do Hero — não é um resultado
// real, apenas transmite de forma visual e imediata o tipo de entrega do
// produto: um dashboard financeiro com gráfico crescente e cartões de
// métricas, conforme briefing.
export function HeroIllustration() {
  return (
    <div className="roi-fade-up-delay-2 relative roi-glass roi-glow rounded-3xl p-6 md:p-7 max-w-md w-full mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs text-muted-foreground">Simulação de retorno</p>
          <p className="font-semibold text-foreground">Horizonte de 12 meses</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold px-3 py-1">
          <TrendingUp className="size-3.5" aria-hidden="true" />
          Em alta
        </span>
      </div>

      <div className="rounded-2xl p-4 mb-5" style={{ background: "var(--color-surface-overlay)" }}>
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Receita acumulada</p>
            <p className="text-2xl font-bold roi-gradient-text">+184%</p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-secondary)]">
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
            vs. sem o serviço
          </span>
        </div>
        <svg viewBox="0 0 126 44" className="w-full h-14" role="img" aria-label="Tendência de crescimento da receita">
          <polyline
            points={sparklinePoints}
            fill="none"
            stroke="var(--color-secondary)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="0,40 18,40 36,39 54,38 72,37 90,36 108,35 126,34"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={2}
            strokeDasharray="3 3"
          />
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-xl border border-border bg-[var(--color-surface-raised)] px-2.5 py-3 text-center">
          <p className="text-[0.65rem] text-muted-foreground mb-1">ROI</p>
          <p className="text-base font-bold text-[var(--color-secondary)]">250%</p>
        </div>
        <div className="rounded-xl border border-border bg-[var(--color-surface-raised)] px-2.5 py-3 text-center">
          <p className="text-[0.65rem] text-muted-foreground mb-1">Lucro</p>
          <p className="text-base font-bold text-foreground">R$15k</p>
        </div>
        <div className="rounded-xl border border-border bg-[var(--color-surface-raised)] px-2.5 py-3 text-center">
          <p className="text-[0.65rem] text-muted-foreground mb-1">Payback</p>
          <p className="text-base font-bold text-foreground">3,2m</p>
        </div>
      </div>

      <div
        className="absolute -top-3 -right-3 size-10 rounded-2xl flex items-center justify-center roi-glow-positive"
        style={{ backgroundImage: "var(--roi-gradient-positive)" }}
        aria-hidden="true"
      >
        <TrendingUp className="size-5 text-white" />
      </div>
    </div>
  )
}
