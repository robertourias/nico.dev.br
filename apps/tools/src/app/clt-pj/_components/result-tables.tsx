import { Badge } from "@ui"
import { formatBRL, type CLTResult, type PJResult, type TaxRegime, TAX_REGIME_LABELS } from "@/lib/salary-calculator"

interface ResultTablesProps {
  clt: CLTResult
  pj: PJResult
  cltIsEstimate: boolean
  pjIsEstimate: boolean
  pjRegime: TaxRegime
  cltIsSource: boolean
  pjIsSource: boolean
  equivalentGross: number | null
}

export default function ResultTables({
  clt,
  pj,
  cltIsEstimate,
  pjIsEstimate,
  pjRegime,
  cltIsSource,
  pjIsSource,
  equivalentGross,
}: ResultTablesProps) {
  const diff = pj.effectiveIncome - clt.effectiveIncome
  const base = diff > 0 ? clt.effectiveIncome : pj.effectiveIncome
  const diffPct = base > 0 ? (Math.abs(diff) / base) * 100 : 0
  const winner = diff > 0 ? "PJ" : diff < 0 ? "CLT" : null
  const loser = winner === "PJ" ? "CLT" : "PJ"

  const singleSource = cltIsSource !== pjIsSource
  const bothFilled = cltIsSource && pjIsSource
  const showEquivalencePanel = equivalentGross !== null

  // Determine source (winner/reference) and target (loser) for the equivalence panel
  let sourceLabel: string
  let targetLabel: string
  let sourceEffective: number
  let targetFieldLabel: string
  let estimateNote: string

  if (bothFilled) {
    // Both filled: winner is the reference, loser is the target
    if (winner === "PJ") {
      sourceLabel = "PJ"; targetLabel = "CLT"
      sourceEffective = pj.effectiveIncome
      targetFieldLabel = "salário bruto"
      estimateNote = "Com os dependentes e descontos informados"
    } else {
      sourceLabel = "CLT"; targetLabel = "PJ"
      sourceEffective = clt.effectiveIncome
      targetFieldLabel = "faturamento mensal"
      estimateNote = `Com o regime ${TAX_REGIME_LABELS[pjRegime]} e parâmetros informados`
    }
  } else {
    // Single source: non-source side is the target
    sourceLabel = cltIsSource ? "CLT" : "PJ"
    targetLabel = cltIsSource ? "PJ" : "CLT"
    sourceEffective = cltIsSource ? clt.effectiveIncome : pj.effectiveIncome
    targetFieldLabel = cltIsSource ? "faturamento mensal" : "salário bruto"
    estimateNote = cltIsSource
      ? `Estimado com ${TAX_REGIME_LABELS[pjRegime]}, sem despesas fixas`
      : "Estimado sem dependentes e sem outros descontos"
  }

  const cltDeductionRows: TableRow[] = [
    { label: "Salário Bruto", value: clt.grossSalary },
    { label: "(−) INSS", value: -clt.inss, variant: "deduction" },
    { label: "(−) IRRF", value: -clt.irrf, variant: "deduction" },
    ...(clt.otherDeductions > 0
      ? [{ label: "(−) Outros descontos", value: -clt.otherDeductions, variant: "deduction" as const }]
      : []),
  ]

  const cltBenefitRows: TableRow[] = [
    { label: "(+) FGTS (8%)", value: clt.fgts, variant: "benefit" },
    { label: "(+) 13º salário (1/12)", value: clt.decimoTerceiro, variant: "benefit" },
    { label: "(+) Abono de férias (1/3 ÷ 12)", value: clt.abonoFerias, variant: "benefit" },
    ...(clt.va > 0 ? [{ label: "(+) Vale alimentação", value: clt.va, variant: "benefit" as const }] : []),
    ...(clt.vt > 0 ? [{ label: "(+) Vale transporte", value: clt.vt, variant: "benefit" as const }] : []),
    ...(clt.otherBenefits > 0 ? [{ label: "(+) Outros benefícios", value: clt.otherBenefits, variant: "benefit" as const }] : []),
  ]

  const pjDeductionRows: TableRow[] = [
    { label: "Faturamento Bruto", value: pj.revenue },
    { label: "(−) Impostos PJ", value: -pj.taxOnRevenue, variant: "deduction" },
    { label: "(−) INSS (pró-labore)", value: -pj.inss, variant: "deduction" },
    { label: "(−) IRRF (pró-labore)", value: -pj.irrf, variant: "deduction" },
    ...(pj.fixedExpenses > 0
      ? [{ label: "(−) Despesas fixas", value: -pj.fixedExpenses, variant: "deduction" as const }]
      : []),
    ...(pj.healthInsurance > 0
      ? [{ label: "(−) Plano de saúde", value: -pj.healthInsurance, variant: "deduction" as const }]
      : []),
  ]

  const pjBenefitRows: TableRow[] = [
    ...(pj.otherBenefits > 0 ? [{ label: "(+) Outros benefícios", value: pj.otherBenefits, variant: "benefit" as const }] : []),
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard
          title="CLT"
          isEstimate={cltIsEstimate}
          estimateNote="Estimado sem dependentes e sem outros descontos"
          deductionRows={cltDeductionRows}
          benefitRows={cltBenefitRows}
          netValue={clt.netSalary}
          total={clt.effectiveIncome}
          totalLabel="Renda Efetiva CLT"
        />

        <ResultCard
          title="PJ"
          subtitle={TAX_REGIME_LABELS[pjRegime]}
          isEstimate={pjIsEstimate}
          estimateNote={`Estimado com ${TAX_REGIME_LABELS[pjRegime]}, sem despesas fixas`}
          deductionRows={pjDeductionRows}
          benefitRows={pjBenefitRows}
          netValue={pj.netValue}
          total={pj.effectiveIncome}
          totalLabel="Renda Efetiva PJ"
        />
      </div>

      {showEquivalencePanel && (
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-5 grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-3">
          <div>
            <p className="text-sm text-foreground">
              Confira o {targetFieldLabel} que você deve ganhar como{" "}
              <strong>{targetLabel}</strong> para receber a mesma renda efetiva de{" "}
              <strong>{formatBRL(sourceEffective)}</strong> que você tem como {sourceLabel}:
            </p>
            <p className="text-xs text-muted-foreground mt-1">{estimateNote}</p>
          </div>
          <p className="text-3xl font-bold text-primary font-mono tabular-nums whitespace-nowrap">
            {formatBRL(equivalentGross!)}
          </p>
        </div>
      )}

      {winner && (
        <div className="rounded-xl border border-border bg-surface-raised px-5 py-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold text-foreground">{winner} é mais vantajoso:</span>
          <span className="text-primary font-semibold">{formatBRL(Math.abs(diff))}</span>
          <span className="text-muted-foreground">
            ({diffPct.toFixed(1)}% acima do {loser})
          </span>
        </div>
      )}
    </div>
  )
}

export interface TableRow {
  label: string
  value: number
  variant?: "deduction" | "benefit"
}

export interface ResultCardProps {
  title: string
  subtitle?: string
  isEstimate?: boolean
  estimateNote?: string
  deductionRows: TableRow[]
  benefitRows: TableRow[]
  netValue: number
  total: number
  totalLabel: string
}

export function ResultCard({
  title,
  subtitle,
  isEstimate,
  estimateNote,
  deductionRows,
  benefitRows,
  netValue,
  total,
  totalLabel,
}: ResultCardProps) {
  const hasBenefits = benefitRows.length > 0

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="px-5 py-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        {isEstimate && (
          <Badge variant="default" className="shrink-0 text-xs">
            Equivalente estimado
          </Badge>
        )}
      </div>

      <div className="border-t border-border">
        <table className="w-full text-sm">
          <tbody>
            {deductionRows.map((row) => (
              <tr key={row.label} className="border-b border-border/50">
                <td className="px-5 py-2.5 text-muted-foreground">{row.label}</td>
                <td className="px-5 py-2.5 text-right font-mono tabular-nums text-foreground">
                  {formatBRL(Math.abs(row.value))}
                </td>
              </tr>
            ))}

            {/* Net salary subtotal row */}
            <tr className="border-b border-border bg-muted/20">
              <td className="px-5 py-2 text-xs font-medium text-muted-foreground">Salário / Valor Líquido</td>
              <td className="px-5 py-2 text-right font-mono tabular-nums text-sm font-semibold text-foreground">
                {formatBRL(netValue)}
              </td>
            </tr>

            {hasBenefits && (
              <>
                <tr className="bg-emerald-50 dark:bg-emerald-950/20">
                  <td colSpan={2} className="px-5 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                    Benefícios (proporção mensal)
                  </td>
                </tr>
                {benefitRows.map((row) => (
                  <tr key={row.label} className="border-b border-border/50 bg-emerald-50/50 dark:bg-emerald-950/10">
                    <td className="px-5 py-2.5 text-muted-foreground">{row.label}</td>
                    <td className="px-5 py-2.5 text-right font-mono tabular-nums text-emerald-700 dark:text-emerald-400 font-medium">
                      +{formatBRL(Math.abs(row.value))}
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-surface-raised">
              <td className="px-5 py-3 font-semibold text-foreground">{totalLabel}</td>
              <td className="px-5 py-3 text-right font-mono tabular-nums font-bold text-primary text-base">
                {formatBRL(total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {isEstimate && (
        <p className="px-5 py-2.5 text-xs text-muted-foreground border-t border-border/50 bg-muted/30">
          {estimateNote}
        </p>
      )}
    </div>
  )
}
