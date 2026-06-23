import { TrendingUp, Wallet, PiggyBank, Clock3 } from "lucide-react"
import { AnimatedCounter } from "./AnimatedCounter"
import type { RoiResult } from "../_lib/calculations"

interface ResultsCardsProps {
  result: RoiResult
}

// Cards de destaque com os quatro indicadores centrais do briefing (ROI,
// Lucro Gerado, Economia Acumulada, Payback), animados via AnimatedCounter e
// recalculados a cada mudança de input. ROI e Lucro usam o verde de
// indicador positivo quando o resultado é favorável; ficam neutros/negativos
// caso contrário, para não transmitir uma falsa sensação de retorno.
export function ResultsCards({ result }: ResultsCardsProps) {
  const roiPositive = result.roi >= 0
  const lucroPositive = result.lucro >= 0

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="roi-card-hover rounded-2xl p-5 text-white relative overflow-hidden" style={{ backgroundImage: "var(--roi-gradient-positive)" }}>
        <div className="flex items-center gap-2 mb-3 text-white/85 text-xs font-semibold uppercase tracking-wide">
          <TrendingUp className="size-3.5" aria-hidden="true" />
          ROI
        </div>
        <p className="text-3xl font-bold tabular-nums">
          <AnimatedCounter value={result.roi} suffix="%" decimals={0} />
        </p>
        <p className="text-xs text-white/75 mt-1">retorno sobre investimento</p>
      </div>

      <div className="roi-card-hover rounded-2xl border border-border bg-[var(--color-surface-raised)] p-5">
        <div className="flex items-center gap-2 mb-3 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
          <Wallet className="size-3.5" aria-hidden="true" />
          Lucro Gerado
        </div>
        <p
          className="text-2xl md:text-[1.65rem] font-bold tabular-nums"
          style={{ color: lucroPositive ? "var(--color-secondary)" : "var(--color-destructive)" }}
        >
          <AnimatedCounter value={result.lucro} prefix="R$ " decimals={0} />
        </p>
        <p className="text-xs text-muted-foreground mt-1">no horizonte selecionado</p>
      </div>

      <div className="roi-card-hover rounded-2xl border border-border bg-[var(--color-surface-raised)] p-5">
        <div className="flex items-center gap-2 mb-3 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
          <PiggyBank className="size-3.5" aria-hidden="true" />
          Economia Acumulada
        </div>
        <p className="text-2xl md:text-[1.65rem] font-bold text-foreground tabular-nums">
          <AnimatedCounter value={result.economiaAcumulada} prefix="R$ " decimals={0} />
        </p>
        <p className="text-xs text-muted-foreground mt-1">redução de custos no período</p>
      </div>

      <div className="roi-card-hover rounded-2xl border border-border bg-[var(--color-surface-raised)] p-5">
        <div className="flex items-center gap-2 mb-3 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
          <Clock3 className="size-3.5" aria-hidden="true" />
          Payback
        </div>
        <p className="text-2xl md:text-[1.65rem] font-bold text-foreground tabular-nums">
          {result.paybackMeses === null ? (
            "—"
          ) : (
            <AnimatedCounter value={result.paybackMeses} suffix=" meses" decimals={1} />
          )}
        </p>
        <p className="text-xs text-muted-foreground mt-1">tempo até recuperar o investimento</p>
      </div>

      {!roiPositive && (
        <p className="col-span-2 text-xs text-muted-foreground -mt-1">
          Com os valores informados, o retorno ainda não é positivo no horizonte escolhido — tente aumentar o
          prazo de análise ou ajustar as estimativas.
        </p>
      )}
    </div>
  )
}
