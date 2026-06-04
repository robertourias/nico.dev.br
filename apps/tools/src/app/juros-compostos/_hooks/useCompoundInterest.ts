"use client"

import { useMemo, useState } from "react"
import {
  calculateCompoundInterest,
  sampleAnnually,
  type CompoundInterestResult,
  type Mode,
  type MonthlySnapshot,
  type PeriodUnit,
  type RateUnit,
} from "@/lib/compound-interest"

interface FormState {
  mode: Mode
  principal: string
  monthlyContribution: string
  rate: string
  rateUnit: RateUnit
  period: string
  periodUnit: PeriodUnit
}

interface UseCompoundInterestReturn {
  formState: FormState
  setField: <K extends keyof FormState>(field: K, value: FormState[K]) => void
  result: CompoundInterestResult | null
  chartData: MonthlySnapshot[]
  canCalculate: boolean
  calculate: () => void
  reset: () => void
}

/** BRL mask: "1.234,56" → 1234.56 */
export function parseBRL(masked: string): number {
  if (!masked) return NaN
  return parseFloat(masked.replace(/\./g, "").replace(",", "."))
}

/** Plain decimal: accepts comma or dot as separator */
function parseDecimal(value: string): number {
  return parseFloat(value.replace(",", "."))
}

const DEFAULT_STATE: FormState = {
  mode: "fixed",
  principal: "",
  monthlyContribution: "",
  rate: "10",
  rateUnit: "annual",
  period: "2",
  periodUnit: "years",
}

function isFormValid(state: FormState): boolean {
  const principal = parseBRL(state.principal)
  const rate = parseDecimal(state.rate)
  const period = parseDecimal(state.period)
  const monthlyContribution =
    state.mode === "contributions" ? parseBRL(state.monthlyContribution) : 0

  const principalValid = !isNaN(principal) && principal >= 0
  const rateValid = !isNaN(rate) && rate > 0
  const periodValid = !isNaN(period) && period > 0
  const contributionValid =
    state.mode === "fixed" || (!isNaN(monthlyContribution) && monthlyContribution > 0)

  if (!principalValid || !rateValid || !periodValid || !contributionValid) return false
  if (principal === 0 && monthlyContribution === 0) return false
  return true
}

export function useCompoundInterest(): UseCompoundInterestReturn {
  const [formState, setFormState] = useState<FormState>(DEFAULT_STATE)
  const [result, setResult] = useState<CompoundInterestResult | null>(null)

  function setField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const canCalculate = useMemo(() => isFormValid(formState), [formState])

  function calculate() {
    if (!canCalculate) return
    const principal = parseBRL(formState.principal)
    const rate = parseDecimal(formState.rate)
    const period = parseDecimal(formState.period)
    const monthlyContribution =
      formState.mode === "contributions" ? parseBRL(formState.monthlyContribution) : 0

    setResult(
      calculateCompoundInterest({
        principal,
        rate: rate / 100,
        rateUnit: formState.rateUnit,
        period,
        periodUnit: formState.periodUnit,
        monthlyContribution,
      })
    )
  }

  function reset() {
    setResult(null)
  }

  const chartData = useMemo((): MonthlySnapshot[] => {
    if (!result) return []
    return result.months > 120 ? sampleAnnually(result.snapshots) : result.snapshots
  }, [result])

  return { formState, setField, result, chartData, canCalculate, calculate, reset }
}
