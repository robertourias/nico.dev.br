import { TrendingUp } from "lucide-react"
import { AnimatedCounter } from "./AnimatedCounter"
import type { SimulationResult } from "../_lib/calculations"

interface ResultsDashboardProps {
  result: SimulationResult
}

const summaryCards = [
  { key: "monthlySavings" as const, label: "Mensal", suffix: "/mês" },
  { key: "annualSavings" as const, label: "Anual", suffix: "/ano" },
  { key: "fiveYearSavings" as const, label: "5 Anos", suffix: "" },
]

// Cards de destaque com os três horizontes de economia (mensal/anual/5 anos)
// e card adicional simulando o valor investido a 8% a.a. — todos animados
// via AnimatedCounter, recalculados a cada mudança de input ou cenário.
export function ResultsDashboard({ result }: ResultsDashboardProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.key}
            className="economia-card-hover rounded-2xl border border-border bg-[var(--color-surface-raised)] p-5"
          >
            <p className="text-xs font-medium text-muted-foreground mb-2">{card.label}</p>
            <p className="text-2xl md:text-[1.7rem] font-bold text-foreground tabular-nums">
              <AnimatedCounter value={result[card.key]} prefix="R$ " decimals={0} />
            </p>
            {card.suffix && <p className="text-xs text-muted-foreground mt-0.5">{card.suffix}</p>}
          </div>
        ))}
      </div>

      <div
        className="economia-glow rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ backgroundImage: "var(--economia-gradient-primary)" }}
      >
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2 text-white/85 text-xs font-semibold uppercase tracking-wide">
              <TrendingUp className="size-3.5" aria-hidden="true" />
              Investindo o valor a 8% a.a.
            </div>
            <p className="text-sm text-white/85 mb-1">Se investir essa economia todo mês:</p>
            <p className="text-3xl font-bold tabular-nums">
              <AnimatedCounter value={result.investedFiveYears} prefix="R$ " decimals={0} />
            </p>
            <p className="text-xs text-white/75 mt-1">em 5 anos, em vez de apenas guardar parado</p>
          </div>
        </div>
      </div>
    </div>
  )
}
