// ─── Types ────────────────────────────────────────────────────────────────────

export type RateUnit = "monthly" | "annual"
export type PeriodUnit = "months" | "years"
export type Mode = "fixed" | "contributions"

export interface CompoundInterestParams {
  principal: number
  rate: number
  rateUnit: RateUnit
  period: number
  periodUnit: PeriodUnit
  monthlyContribution: number
}

export interface MonthlySnapshot {
  month: number
  openingBalance: number
  contribution: number
  interest: number
  closingBalance: number
  cumulativeContributions: number
  cumulativeInterest: number
}

export interface CompoundInterestResult {
  finalAmount: number
  totalInvested: number
  totalInterest: number
  interestPercentage: number
  months: number
  monthlyRate: number
  snapshots: MonthlySnapshot[]
}

// ─── Math helpers ─────────────────────────────────────────────────────────────

export function annualToMonthlyRate(annual: number): number {
  return Math.pow(1 + annual, 1 / 12) - 1
}

export function toMonths(period: number, unit: PeriodUnit): number {
  return unit === "years" ? period * 12 : period
}

// ─── Core calculation ─────────────────────────────────────────────────────────

export function calculateCompoundInterest(
  params: CompoundInterestParams
): CompoundInterestResult {
  const { principal, rate, rateUnit, period, periodUnit, monthlyContribution } = params

  const monthlyRate =
    rateUnit === "annual" ? annualToMonthlyRate(rate) : rate
  const months = toMonths(period, periodUnit)

  const snapshots: MonthlySnapshot[] = []
  let balance = principal
  let cumulativeContributions = 0
  let cumulativeInterest = 0

  for (let m = 1; m <= months; m++) {
    const openingBalance = balance
    // Contribution applied at start of month (before interest), matching standard convention
    const contribution = m === 1 ? 0 : monthlyContribution
    const balanceAfterContribution = openingBalance + contribution
    const interest = balanceAfterContribution * monthlyRate
    const closingBalance = balanceAfterContribution + interest

    cumulativeContributions += contribution
    cumulativeInterest += interest
    balance = closingBalance

    snapshots.push({
      month: m,
      openingBalance: roundDisplay(openingBalance),
      contribution: roundDisplay(contribution),
      interest: roundDisplay(interest),
      closingBalance: roundDisplay(closingBalance),
      cumulativeContributions: roundDisplay(cumulativeContributions),
      cumulativeInterest: roundDisplay(cumulativeInterest),
    })
  }

  const finalAmount = roundDisplay(balance)
  // totalInvested = principal + all monthly contributions (from month 2 onward)
  const totalInvested = roundDisplay(principal + monthlyContribution * Math.max(0, months - 1))
  const totalInterest = roundDisplay(finalAmount - totalInvested)
  const interestPercentage =
    totalInvested > 0 ? roundDisplay((totalInterest / totalInvested) * 100) : 0

  return {
    finalAmount,
    totalInvested,
    totalInterest,
    interestPercentage,
    months,
    monthlyRate,
    snapshots,
  }
}

/** Reduces snapshots to one point per year (for charts with > 120 months) */
export function sampleAnnually(snapshots: MonthlySnapshot[]): MonthlySnapshot[] {
  const last = snapshots[snapshots.length - 1]
  const annual = snapshots.filter((s) => s.month % 12 === 0)
  // Always include the last snapshot if it wasn't caught by mod 12
  if (last && last.month % 12 !== 0) {
    return [...annual, last]
  }
  return annual
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

function roundDisplay(value: number): number {
  return Math.round(value * 100) / 100
}
