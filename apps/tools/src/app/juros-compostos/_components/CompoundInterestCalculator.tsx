"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef } from "react"
import { Button } from "@ui"
import { useCompoundInterest } from "../_hooks/useCompoundInterest"
import { InputForm } from "./InputForm"
import { ResultSummary } from "./ResultSummary"
import { EvolutionTable } from "./EvolutionTable"
import { FormulaExplanation } from "./FormulaExplanation"

// Recharts uses browser-only APIs — load without SSR to avoid hydration errors
const EvolutionChart = dynamic(
  () => import("./EvolutionChart").then((m) => ({ default: m.EvolutionChart })),
  { ssr: false }
)

const SCROLL_OFFSET_PX = 24

export function CompoundInterestCalculator() {
  const { formState, setField, result, chartData, canCalculate, calculate, reset } =
    useCompoundInterest()

  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!result || !resultRef.current) return
    const top = resultRef.current.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET_PX
    window.scrollTo({ top, behavior: "smooth" })
  }, [result])

  return (
    <div className="flex flex-col gap-8">
      <InputForm state={formState} onChange={setField} />

      <FormulaExplanation />

      <div className="flex gap-3">
        <Button onClick={calculate} disabled={!canCalculate} size="lg">
          Calcular
        </Button>
        {result && (
          <Button variant="outline" size="lg" onClick={reset}>
            Limpar
          </Button>
        )}
      </div>

      {result && (
        <div ref={resultRef} className="flex flex-col gap-8">
          <ResultSummary result={result} />
          <EvolutionChart
            data={chartData}
            mode={formState.mode}
            totalMonths={result.months}
          />
          <EvolutionTable snapshots={result.snapshots} mode={formState.mode} />
        </div>
      )}
    </div>
  )
}
