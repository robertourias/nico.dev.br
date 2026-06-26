import { Sun, Leaf, Clock } from "lucide-react"
import { AnimatedCounter } from "./AnimatedCounter"
import { CircularGauge } from "./CircularGauge"
import { formatPayback, type SimulationResult } from "../_lib/calculations"

interface ResultsDashboardProps {
  result: SimulationResult
}

const summaryCards = [
  { key: "monthlySavings" as const, label: "Economia mensal", suffix: "/mês" },
  { key: "annualSavings" as const, label: "Economia anual", suffix: "/ano" },
  { key: "tenYearSavings" as const, label: "Economia em 10 anos", suffix: "" },
]

// Dashboard "ao vivo" do simulador: cards de economia (mensal/anual/10 anos)
// com AnimatedCounter, gauge circular de redução percentual e cards
// secundários (placas, payback, CO2) — tudo recalculado a cada alteração de
// input em SimulatorSection, sem necessidade de recarregar a página.
export function ResultsDashboard({ result }: ResultsDashboardProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.key}
            className="solar-card-hover rounded-2xl border border-border bg-[var(--color-surface-raised)] p-5"
          >
            <p className="text-xs font-medium text-muted-foreground mb-2">{card.label}</p>
            <p className="text-xl md:text-[1.5rem] font-bold text-foreground tabular-nums">
              <AnimatedCounter value={result[card.key]} prefix="R$ " decimals={0} />
            </p>
            {card.suffix && <p className="text-xs text-muted-foreground mt-0.5">{card.suffix}</p>}
          </div>
        ))}
      </div>

      <div
        className="solar-glow rounded-2xl p-6 text-white relative overflow-hidden flex flex-wrap items-center gap-6 justify-between"
        style={{ backgroundImage: "var(--solar-gradient-primary)" }}
      >
        <div className="relative flex items-center gap-4">
          <CircularGauge
            percent={result.reductionPct}
            size={108}
            strokeWidth={10}
            colorVar="var(--solar-yellow)"
            valueLabel={`${Math.round(result.reductionPct)}%`}
            label="redução na conta"
          />
          <div>
            <p className="text-xs uppercase tracking-wide text-white/75 font-semibold mb-1">Sua nova conta</p>
            <p className="text-2xl font-bold tabular-nums">
              <AnimatedCounter value={result.monthlyBillAfter} prefix="R$ " decimals={0} />
            </p>
            <p className="text-xs text-white/70 mt-1">por mês, em vez do valor atual</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="solar-card-hover rounded-2xl border border-border bg-[var(--color-surface-raised)] p-5">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <Sun className="size-3.5" style={{ color: "var(--solar-yellow-deep)" }} aria-hidden="true" />
            Placas necessárias
          </div>
          <p className="text-xl font-bold text-foreground tabular-nums">
            <AnimatedCounter value={result.panelCount} suffix=" placas" />
          </p>
          <p className="text-xs text-muted-foreground mt-1">{result.systemSizeKwp.toFixed(1)} kWp instalados</p>
        </div>

        <div className="solar-card-hover rounded-2xl border border-border bg-[var(--color-surface-raised)] p-5">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <Leaf className="size-3.5" style={{ color: "var(--solar-green)" }} aria-hidden="true" />
            Redução de CO₂
          </div>
          <p className="text-xl font-bold tabular-nums" style={{ color: "var(--solar-green)" }}>
            <AnimatedCounter value={result.annualCo2KgAvoided} suffix=" kg/ano" decimals={0} />
          </p>
          <p className="text-xs text-muted-foreground mt-1">{result.treesEquivalent} árvores equivalentes</p>
        </div>

        <div className="solar-card-hover rounded-2xl border border-border bg-[var(--color-surface-raised)] p-5">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <Clock className="size-3.5" style={{ color: "var(--solar-blue-light)" }} aria-hidden="true" />
            Tempo de retorno
          </div>
          <p className="text-xl font-bold text-foreground tabular-nums">{formatPayback(result.paybackYears)}</p>
          <p className="text-xs text-muted-foreground mt-1">para recuperar o investimento</p>
        </div>
      </div>
    </div>
  )
}
