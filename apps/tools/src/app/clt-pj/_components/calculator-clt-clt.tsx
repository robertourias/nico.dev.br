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
  Alert,
  AlertTitle,
  AlertDescription,
} from "@ui"
import {
  calculateCLT,
  formatBRL,
  type CLTResult,
} from "@/lib/salary-calculator"
import { ResultCard, type TableRow } from "./result-tables"
import InfoSection from "./info-section"

interface CalculationResult {
  a: CLTResult
  b: CLTResult
}

export default function CalculatorCltClt() {
  const [grossA, setGrossA] = useState("")
  const [dependentsA, setDependentsA] = useState("0")
  const [otherDeductionsA, setOtherDeductionsA] = useState("")
  const [vaA, setVaA] = useState("")
  const [vtA, setVtA] = useState("")
  const [otherBenefitsA, setOtherBenefitsA] = useState("")

  const [grossB, setGrossB] = useState("")
  const [dependentsB, setDependentsB] = useState("0")
  const [otherDeductionsB, setOtherDeductionsB] = useState("")
  const [vaB, setVaB] = useState("")
  const [vtB, setVtB] = useState("")
  const [otherBenefitsB, setOtherBenefitsB] = useState("")

  const [result, setResult] = useState<CalculationResult | null>(null)
  const [formError, setFormError] = useState("")

  const hasA = parseFloat(grossA) > 0
  const hasB = parseFloat(grossB) > 0
  const canCalculate = hasA && hasB

  function handleCalculate() {
    if (!canCalculate) {
      setFormError("Preencha o salário das duas propostas para calcular.")
      return
    }
    setFormError("")

    const resultA = calculateCLT({
      grossSalary: parseFloat(grossA) || 0,
      dependents: parseInt(dependentsA) || 0,
      otherDeductions: parseFloat(otherDeductionsA) || 0,
      va: parseFloat(vaA) || 0,
      vt: parseFloat(vtA) || 0,
      otherBenefits: parseFloat(otherBenefitsA) || 0,
    })

    const resultB = calculateCLT({
      grossSalary: parseFloat(grossB) || 0,
      dependents: parseInt(dependentsB) || 0,
      otherDeductions: parseFloat(otherDeductionsB) || 0,
      va: parseFloat(vaB) || 0,
      vt: parseFloat(vtB) || 0,
      otherBenefits: parseFloat(otherBenefitsB) || 0,
    })

    setResult({ a: resultA, b: resultB })
  }

  function handleReset() {
    setGrossA("")
    setDependentsA("0")
    setOtherDeductionsA("")
    setVaA("")
    setVtA("")
    setOtherBenefitsA("")
    setGrossB("")
    setDependentsB("0")
    setOtherDeductionsB("")
    setVaB("")
    setVtB("")
    setOtherBenefitsB("")
    setResult(null)
    setFormError("")
  }

  function buildDeductionRows(clt: CLTResult): TableRow[] {
    return [
      { label: "Salário Bruto", value: clt.grossSalary },
      { label: "(−) INSS", value: -clt.inss, variant: "deduction" },
      { label: "(−) IRRF", value: -clt.irrf, variant: "deduction" },
      ...(clt.otherDeductions > 0
        ? [{ label: "(−) Outros descontos", value: -clt.otherDeductions, variant: "deduction" as const }]
        : []),
    ]
  }

  function buildBenefitRows(clt: CLTResult): TableRow[] {
    return [
      { label: "(+) FGTS (8%)", value: clt.fgts, variant: "benefit" },
      { label: "(+) 13º salário (1/12)", value: clt.decimoTerceiro, variant: "benefit" },
      { label: "(+) Abono de férias (1/3 ÷ 12)", value: clt.abonoFerias, variant: "benefit" },
      ...(clt.va > 0 ? [{ label: "(+) Vale alimentação", value: clt.va, variant: "benefit" as const }] : []),
      ...(clt.vt > 0 ? [{ label: "(+) Vale transporte", value: clt.vt, variant: "benefit" as const }] : []),
      ...(clt.otherBenefits > 0 ? [{ label: "(+) Outros benefícios", value: clt.otherBenefits, variant: "benefit" as const }] : []),
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
                <CardTitle>Proposta A (CLT)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormGroup label="Salário bruto mensal" htmlFor="clt-gross-a" hint="Valor registrado em carteira">
                  <CurrencyInput id="clt-gross-a" placeholder="0,00" value={grossA} onChange={setGrossA} />
                </FormGroup>

                <FormGroup label="Dependentes (para IRRF)" htmlFor="clt-dependents-a" hint="Cada dependente deduz R$ 189,59 da base do IRRF">
                  <Input id="clt-dependents-a" type="number" min="0" step="1" value={dependentsA} onChange={(e) => setDependentsA(e.target.value)} />
                </FormGroup>

                <FormGroup label="Outros descontos em folha" htmlFor="clt-other-a" hint="Plano de saúde descontado, etc.">
                  <CurrencyInput id="clt-other-a" placeholder="0,00" value={otherDeductionsA} onChange={setOtherDeductionsA} />
                </FormGroup>

                <div className="border-t border-border/50 pt-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Benefícios (opcionais)</p>
                  <div className="space-y-4">
                    <FormGroup label="Vale alimentação" htmlFor="clt-va-a">
                      <CurrencyInput id="clt-va-a" placeholder="0,00" value={vaA} onChange={setVaA} />
                    </FormGroup>
                    <FormGroup label="Vale transporte" htmlFor="clt-vt-a">
                      <CurrencyInput id="clt-vt-a" placeholder="0,00" value={vtA} onChange={setVtA} />
                    </FormGroup>
                    <FormGroup label="Outros benefícios" htmlFor="clt-other-benefits-a">
                      <CurrencyInput id="clt-other-benefits-a" placeholder="0,00" value={otherBenefitsA} onChange={setOtherBenefitsA} />
                    </FormGroup>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Proposta B */}
            <Card>
              <CardHeader>
                <CardTitle>Proposta B (CLT)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormGroup label="Salário bruto mensal" htmlFor="clt-gross-b" hint="Valor registrado em carteira">
                  <CurrencyInput id="clt-gross-b" placeholder="0,00" value={grossB} onChange={setGrossB} />
                </FormGroup>

                <FormGroup label="Dependentes (para IRRF)" htmlFor="clt-dependents-b" hint="Cada dependente deduz R$ 189,59 da base do IRRF">
                  <Input id="clt-dependents-b" type="number" min="0" step="1" value={dependentsB} onChange={(e) => setDependentsB(e.target.value)} />
                </FormGroup>

                <FormGroup label="Outros descontos em folha" htmlFor="clt-other-b" hint="Plano de saúde descontado, etc.">
                  <CurrencyInput id="clt-other-b" placeholder="0,00" value={otherDeductionsB} onChange={setOtherDeductionsB} />
                </FormGroup>

                <div className="border-t border-border/50 pt-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Benefícios (opcionais)</p>
                  <div className="space-y-4">
                    <FormGroup label="Vale alimentação" htmlFor="clt-va-b">
                      <CurrencyInput id="clt-va-b" placeholder="0,00" value={vaB} onChange={setVaB} />
                    </FormGroup>
                    <FormGroup label="Vale transporte" htmlFor="clt-vt-b">
                      <CurrencyInput id="clt-vt-b" placeholder="0,00" value={vtB} onChange={setVtB} />
                    </FormGroup>
                    <FormGroup label="Outros benefícios" htmlFor="clt-other-benefits-b">
                      <CurrencyInput id="clt-other-benefits-b" placeholder="0,00" value={otherBenefitsB} onChange={setOtherBenefitsB} />
                    </FormGroup>
                  </div>
                </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResultCard
              title="Proposta A (CLT)"
              deductionRows={buildDeductionRows(result.a)}
              benefitRows={buildBenefitRows(result.a)}
              netValue={result.a.netSalary}
              total={result.a.effectiveIncome}
              totalLabel="Renda Efetiva"
            />
            <ResultCard
              title="Proposta B (CLT)"
              deductionRows={buildDeductionRows(result.b)}
              benefitRows={buildBenefitRows(result.b)}
              netValue={result.b.netSalary}
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

