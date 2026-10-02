"use client"

import { useState } from "react"
import {
  Button,
  Input,
  FormGroup,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@ui"
import {
  calculatePJ,
  formatBRL,
  isMEIOverLimit,
  DEFAULT_PROLABORE,
  TAX_REGIME_LABELS,
  TAX_REGIME_DESCRIPTIONS,
  type PJResult,
  type TaxRegime,
} from "@/lib/salary-calculator"
import { ResultCard, type TableRow } from "./result-tables"
import InfoSection from "./info-section"

interface CalculationResult {
  a: PJResult
  b: PJResult
}

export default function CalculatorPjPj() {
  const [revenueA, setRevenueA] = useState("")
  const [regimeA, setRegimeA] = useState<TaxRegime>("simples-iii")
  const [prolaboreA, setProlaboreA] = useState(String(DEFAULT_PROLABORE))
  const [expensesA, setExpensesA] = useState("")
  const [healthInsuranceA, setHealthInsuranceA] = useState("")
  const [otherBenefitsA, setOtherBenefitsA] = useState("")

  const [revenueB, setRevenueB] = useState("")
  const [regimeB, setRegimeB] = useState<TaxRegime>("simples-iii")
  const [prolaboreB, setProlaboreB] = useState(String(DEFAULT_PROLABORE))
  const [expensesB, setExpensesB] = useState("")
  const [healthInsuranceB, setHealthInsuranceB] = useState("")
  const [otherBenefitsB, setOtherBenefitsB] = useState("")

  const [result, setResult] = useState<CalculationResult | null>(null)
  const [formError, setFormError] = useState("")

  const hasA = parseFloat(revenueA) > 0
  const hasB = parseFloat(revenueB) > 0
  const canCalculate = hasA && hasB

  function handleCalculate() {
    if (!canCalculate) {
      setFormError("Preencha o faturamento das duas propostas para calcular.")
      return
    }
    setFormError("")

    const resultA = calculatePJ({
      revenue: parseFloat(revenueA) || 0,
      regime: regimeA,
      prolabore: parseFloat(prolaboreA) || DEFAULT_PROLABORE,
      fixedExpenses: parseFloat(expensesA) || 0,
      healthInsurance: parseFloat(healthInsuranceA) || 0,
      otherBenefits: parseFloat(otherBenefitsA) || 0,
    })

    const resultB = calculatePJ({
      revenue: parseFloat(revenueB) || 0,
      regime: regimeB,
      prolabore: parseFloat(prolaboreB) || DEFAULT_PROLABORE,
      fixedExpenses: parseFloat(expensesB) || 0,
      healthInsurance: parseFloat(healthInsuranceB) || 0,
      otherBenefits: parseFloat(otherBenefitsB) || 0,
    })

    setResult({ a: resultA, b: resultB })
  }

  function handleReset() {
    setRevenueA("")
    setRegimeA("simples-iii")
    setProlaboreA(String(DEFAULT_PROLABORE))
    setExpensesA("")
    setHealthInsuranceA("")
    setOtherBenefitsA("")
    setRevenueB("")
    setRegimeB("simples-iii")
    setProlaboreB(String(DEFAULT_PROLABORE))
    setExpensesB("")
    setHealthInsuranceB("")
    setOtherBenefitsB("")
    setResult(null)
    setFormError("")
  }

  const showMeiWarningA = result !== null && regimeA === "mei" && isMEIOverLimit(result.a.revenue)
  const showMeiWarningB = result !== null && regimeB === "mei" && isMEIOverLimit(result.b.revenue)

  function buildDeductionRows(pj: PJResult): TableRow[] {
    return [
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
  }

  function buildBenefitRows(pj: PJResult): TableRow[] {
    return [
      ...(pj.otherBenefits > 0 ? [{ label: "(+) Outros benefícios", value: pj.otherBenefits, variant: "benefit" as const }] : []),
    ]
  }

  return (
    <div className="space-y-8 mt-8">
      {result === null && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Proposta A */}
            <Card>
              <CardHeader>
                <CardTitle>Proposta A (PJ)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormGroup label="Faturamento mensal" htmlFor="pj-revenue-a" hint="Valor total do contrato antes de impostos">
                  <CurrencyInput id="pj-revenue-a" placeholder="0,00" value={revenueA} onChange={setRevenueA} />
                </FormGroup>

                <FormGroup label="Regime tributário" htmlFor="pj-regime-a" hint={TAX_REGIME_DESCRIPTIONS[regimeA]}>
                  <Select value={regimeA} onValueChange={(v) => setRegimeA(v as TaxRegime)}>
                    <SelectTrigger id="pj-regime-a"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.entries(TAX_REGIME_LABELS) as [TaxRegime, string][]).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormGroup>

                <FormGroup label="Pró-labore mensal" htmlFor="pj-prolabore-a" hint="Base para cálculo de INSS e IRRF">
                  <CurrencyInput id="pj-prolabore-a" placeholder="1.518,00" value={prolaboreA} onChange={setProlaboreA} />
                </FormGroup>

                <FormGroup label="Despesas fixas mensais" htmlFor="pj-expenses-a" hint="Contador, infraestrutura, etc.">
                  <CurrencyInput id="pj-expenses-a" placeholder="0,00" value={expensesA} onChange={setExpensesA} />
                </FormGroup>

                <FormGroup label="Plano de saúde (pago pelo CNPJ)" htmlFor="pj-health-a">
                  <CurrencyInput id="pj-health-a" placeholder="0,00" value={healthInsuranceA} onChange={setHealthInsuranceA} />
                </FormGroup>

                <FormGroup label="Outros benefícios" htmlFor="pj-other-benefits-a" hint="Gym pass, auxílio home office, etc.">
                  <CurrencyInput id="pj-other-benefits-a" placeholder="0,00" value={otherBenefitsA} onChange={setOtherBenefitsA} />
                </FormGroup>
              </CardContent>
            </Card>

            {/* Proposta B */}
            <Card>
              <CardHeader>
                <CardTitle>Proposta B (PJ)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormGroup label="Faturamento mensal" htmlFor="pj-revenue-b" hint="Valor total do contrato antes de impostos">
                  <CurrencyInput id="pj-revenue-b" placeholder="0,00" value={revenueB} onChange={setRevenueB} />
                </FormGroup>

                <FormGroup label="Regime tributário" htmlFor="pj-regime-b" hint={TAX_REGIME_DESCRIPTIONS[regimeB]}>
                  <Select value={regimeB} onValueChange={(v) => setRegimeB(v as TaxRegime)}>
                    <SelectTrigger id="pj-regime-b"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.entries(TAX_REGIME_LABELS) as [TaxRegime, string][]).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormGroup>

                <FormGroup label="Pró-labore mensal" htmlFor="pj-prolabore-b" hint="Base para cálculo de INSS e IRRF">
                  <CurrencyInput id="pj-prolabore-b" placeholder="1.518,00" value={prolaboreB} onChange={setProlaboreB} />
                </FormGroup>

                <FormGroup label="Despesas fixas mensais" htmlFor="pj-expenses-b" hint="Contador, infraestrutura, etc.">
                  <CurrencyInput id="pj-expenses-b" placeholder="0,00" value={expensesB} onChange={setExpensesB} />
                </FormGroup>

                <FormGroup label="Plano de saúde (pago pelo CNPJ)" htmlFor="pj-health-b">
                  <CurrencyInput id="pj-health-b" placeholder="0,00" value={healthInsuranceB} onChange={setHealthInsuranceB} />
                </FormGroup>

                <FormGroup label="Outros benefícios" htmlFor="pj-other-benefits-b" hint="Gym pass, auxílio home office, etc.">
                  <CurrencyInput id="pj-other-benefits-b" placeholder="0,00" value={otherBenefitsB} onChange={setOtherBenefitsB} />
                </FormGroup>
              </CardContent>
            </Card>
          </div>

          {formError && (
            <Alert variant="destructive">
              <AlertTitle>Atenção</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <Button size="lg" onClick={handleCalculate} disabled={!canCalculate} className="w-full sm:w-auto">
            Comparar Propostas
          </Button>
        </div>
      )}

      {result !== null && (
        <div className="space-y-6">
          {showMeiWarningA && (
            <Alert variant="warning">
              <AlertTitle>Limite do MEI ultrapassado (Proposta A)</AlertTitle>
              <AlertDescription>O faturamento estimado supera R$ 6.750/mês. Considere migrar para Simples Nacional ou Lucro Presumido.</AlertDescription>
            </Alert>
          )}
          {showMeiWarningB && (
            <Alert variant="warning">
              <AlertTitle>Limite do MEI ultrapassado (Proposta B)</AlertTitle>
              <AlertDescription>O faturamento estimado supera R$ 6.750/mês. Considere migrar para Simples Nacional ou Lucro Presumido.</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultCard
              title="Proposta A (PJ)"
              subtitle={TAX_REGIME_LABELS[regimeA]}
              deductionRows={buildDeductionRows(result.a)}
              benefitRows={buildBenefitRows(result.a)}
              netValue={result.a.netValue}
              total={result.a.effectiveIncome}
              totalLabel="Renda Efetiva"
            />
            <ResultCard
              title="Proposta B (PJ)"
              subtitle={TAX_REGIME_LABELS[regimeB]}
              deductionRows={buildDeductionRows(result.b)}
              benefitRows={buildBenefitRows(result.b)}
              netValue={result.b.netValue}
              total={result.b.effectiveIncome}
              totalLabel="Renda Efetiva"
            />
          </div>

          {(() => {
            const diff = result.a.effectiveIncome - result.b.effectiveIncome;
            if (diff === 0) return null;
            const winner = diff > 0 ? "Proposta A" : "Proposta B";
            const loser = diff > 0 ? "Proposta B" : "Proposta A";
            const base = diff > 0 ? result.b.effectiveIncome : result.a.effectiveIncome;
            const diffPct = base > 0 ? (Math.abs(diff) / base) * 100 : 0;
            return (
              <div className="rounded-xl border border-border bg-surface-raised px-5 py-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold text-foreground">{winner} é mais vantajosa:</span>
                <span className="text-primary font-semibold">{formatBRL(Math.abs(diff))}</span>
                <span className="text-muted-foreground">({diffPct.toFixed(1)}% acima da {loser})</span>
              </div>
            );
          })()}

          <Button variant="outline" onClick={handleReset}>
            Refazer cálculo
          </Button>

          <InfoSection />
        </div>
      )}
    </div>
  )
}

function CurrencyInput({ id, placeholder, value, onChange }: { id: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none select-none">R$</span>
      <Input id={id} type="number" min="0" step="any" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="pl-10" />
    </div>
  )
}

