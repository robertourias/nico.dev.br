"use client"

import { useMemo, useRef, useState } from "react"
import { Reveal } from "./Reveal"
import { CalculatorForm } from "./CalculatorForm"
import { ResultsCards } from "./ResultsCards"
import { ComparisonChart } from "./ComparisonChart"
import { ComparisonTable } from "./ComparisonTable"
import { QuickExamples } from "./QuickExamples"
import { DEFAULT_INPUTS, calculateRoi, buildComparisonRows, type RoiInputs } from "../_lib/calculations"

// Orquestrador da calculadora: dono único do estado dos inputs, deriva todo
// o resultado via _lib/calculations a cada alteração (atualização em tempo
// real, conforme briefing) e concentra a validação básica dos campos
// monetários obrigatórios.
export function RoiCalculator() {
  const [inputs, setInputs] = useState<RoiInputs>(DEFAULT_INPUTS)
  const [errors, setErrors] = useState<Partial<Record<keyof RoiInputs, string>>>({})
  const [activePresetId, setActivePresetId] = useState<string | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const result = useMemo(() => calculateRoi(inputs), [inputs])
  const comparisonRows = useMemo(() => buildComparisonRows(inputs, result), [inputs, result])

  const updateInputs = (patch: Partial<RoiInputs>) => {
    setActivePresetId(null)
    setInputs((current) => ({ ...current, ...patch }))
  }

  const applyPreset = (presetId: string, presetInputs: RoiInputs) => {
    setActivePresetId(presetId)
    setInputs(presetInputs)
    setErrors({})
  }

  const handleSubmit = () => {
    const nextErrors: Partial<Record<keyof RoiInputs, string>> = {}
    if (inputs.investimentoInicial <= 0) {
      nextErrors.investimentoInicial = "Informe um investimento inicial maior que zero."
    }
    if (inputs.receitaMensalAtual <= 0) {
      nextErrors.receitaMensalAtual = "Informe a receita mensal atual."
    }
    if (inputs.economiaMensalGerada < 0) {
      nextErrors.economiaMensalGerada = "A economia mensal não pode ser negativa."
    }
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <section id="calculadora" className="relative px-6 py-16 md:py-20 scroll-mt-20" aria-labelledby="calculator-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-10">
          <h2 id="calculator-title" className="text-3xl md:text-4xl font-bold mb-3">
            Simule o <span className="roi-gradient-text">retorno do seu investimento</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Ajuste os valores abaixo e veja o impacto financeiro recalculado instantaneamente.
          </p>
        </Reveal>

        <Reveal variant="fade-up" id="exemplos" className="mb-8 scroll-mt-24">
          <QuickExamples activePresetId={activePresetId} onSelect={applyPreset} />
        </Reveal>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-8 lg:gap-10 items-start">
          <Reveal variant="slide-right">
            <CalculatorForm inputs={inputs} errors={errors} onChange={updateInputs} onSubmit={handleSubmit} />
          </Reveal>

          <div ref={resultsRef} className="lg:sticky lg:top-24">
            <Reveal variant="slide-left">
              <ResultsCards result={result} />
            </Reveal>
          </div>
        </div>

        <Reveal className="mt-8">
          <div className="rounded-2xl border border-border bg-[var(--color-surface-raised)] p-5 md:p-6">
            <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
              <p className="font-semibold text-foreground text-sm">Receita acumulada projetada</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-0.5 rounded-full" style={{ background: "var(--color-border)" }} aria-hidden="true" />
                  Cenário Atual
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-0.5 rounded-full" style={{ background: "var(--color-secondary)" }} aria-hidden="true" />
                  Cenário com Serviço
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Projeção mês a mês ao longo do horizonte de análise selecionado.
            </p>
            <ComparisonChart serieSemServico={result.serieSemServico} serieComServico={result.serieComServico} />
          </div>
        </Reveal>

        <Reveal className="mt-8">
          <ComparisonTable rows={comparisonRows} />
        </Reveal>
      </div>
    </section>
  )
}
