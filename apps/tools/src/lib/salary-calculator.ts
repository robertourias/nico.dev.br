// ─── Types ────────────────────────────────────────────────────────────────────

export type TaxRegime = "mei" | "simples-iii" | "simples-v" | "lucro-presumido"

export interface CLTInput {
  grossSalary: number
  dependents: number
  otherDeductions: number
  va?: number
  vt?: number
  otherBenefits?: number
}

export interface CLTResult {
  grossSalary: number
  inss: number
  irrf: number
  otherDeductions: number
  netSalary: number
  va: number
  vt: number
  otherBenefits: number
  fgts: number           // 8% of gross, deposited by employer monthly
  decimoTerceiro: number // 1/12 of net salary (one extra salary per year)
  abonoFerias: number    // 1/36 of net salary (vacation bonus = 1/3 of 1 monthly)
  effectiveIncome: number
}

export interface PJConfig {
  regime: TaxRegime
  prolabore: number
  fixedExpenses: number
  healthInsurance: number
  otherBenefits?: number
}

export interface PJInput extends PJConfig {
  revenue: number
}

export interface PJResult {
  revenue: number
  taxOnRevenue: number
  inss: number
  irrf: number
  fixedExpenses: number
  healthInsurance: number
  netValue: number
  otherBenefits: number
  effectiveIncome: number
}

// ─── Tax Tables (2026) ────────────────────────────────────────────────────────

// Portaria MPS — tabela INSS 2026 (salário mínimo R$ 1.621, teto R$ 8.475,55)
const INSS_BRACKETS = [
  { limit: 1621.0, rate: 0.075 },
  { limit: 2902.84, rate: 0.09 },
  { limit: 4354.27, rate: 0.12 },
  { limit: 8475.55, rate: 0.14 },
] as const

const INSS_SALARY_CEILING = 8475.55

// Tabela IRRF 2026 — alíquotas e parcelas a deduzir
// A partir de 2026, aplica-se também o mecanismo de redução progressiva (ver calculateIRRF):
// isenção efetiva para base ≤ ~R$4.593 (equivalente a ~R$5.000 bruto) e redução parcial até R$7.350
const IRRF_BRACKETS = [
  { limit: 2428.8, rate: 0, deduction: 0 },
  { limit: 2826.65, rate: 0.075, deduction: 182.16 },
  { limit: 3751.05, rate: 0.15, deduction: 394.16 },
  { limit: 4664.68, rate: 0.225, deduction: 675.49 },
  { limit: Infinity, rate: 0.275, deduction: 908.73 },
] as const

const IRRF_DEDUCTION_PER_DEPENDENT = 189.59
// Redução 2026: max(0, 978.62 − 0.133145 × base); zera quando base ≥ R$7.350
const IRRF_REDUCTION_CONSTANT = 978.62
const IRRF_REDUCTION_RATE = 0.133145

// PJ tax rates by regime (1st bracket / base estimate — see note in spec)
const REGIME_RATES: Record<TaxRegime, number | "mei"> = {
  "mei": "mei",
  "simples-iii": 0.06,     // Simples Anexo III, faixa 1 (até R$180k/ano)
  "simples-v": 0.155,      // Simples Anexo V, faixa 1
  "lucro-presumido": 0.17, // IRPJ + CSLL + PIS + COFINS + ISS (presunção 32%)
}

const MEI_FIXED_MONTHLY_TAX = 86.05 // 5% do SM (R$81,05 INSS) + ISS R$5,00 — serviços (2026)
const INSS_PROLABORE_RATE = 0.11

// ─── Public constants ─────────────────────────────────────────────────────────

export const DEFAULT_PROLABORE = 1621.0 // salário mínimo 2026
export const MEI_MONTHLY_REVENUE_LIMIT = 6750 // R$ 81k/ano ÷ 12

export const TAX_REGIME_LABELS: Record<TaxRegime, string> = {
  "mei": "MEI",
  "simples-iii": "Simples Nacional — Anexo III",
  "simples-v": "Simples Nacional — Anexo V",
  "lucro-presumido": "Lucro Presumido",
}

export const TAX_REGIME_DESCRIPTIONS: Record<TaxRegime, string> = {
  "mei": "DAS fixo R$ 86,05/mês (serviços). Faturamento máximo R$ 6.750/mês",
  "simples-iii": "TI, consultoria e atividades correlatas — alíquota efetiva ~6%",
  "simples-v": "Serviços profissionais intensivos em capital — alíquota efetiva ~15,5%",
  "lucro-presumido": "IRPJ + CSLL + PIS + COFINS + ISS — carga total ~17%",
}

// ─── Core calculation functions ───────────────────────────────────────────────

export function calculateINSS(grossSalary: number): number {
  const salary = Math.min(grossSalary, INSS_SALARY_CEILING)
  let total = 0
  let previousLimit = 0

  for (const bracket of INSS_BRACKETS) {
    if (salary <= previousLimit) break
    const taxableInBracket = Math.min(salary, bracket.limit) - previousLimit
    total += taxableInBracket * bracket.rate
    previousLimit = bracket.limit
  }

  return round(total)
}

export function calculateIRRF(base: number): number {
  if (base <= 0) return 0

  let regularIRRF = 0
  for (const bracket of IRRF_BRACKETS) {
    if (base <= bracket.limit) {
      regularIRRF = Math.max(0, base * bracket.rate - bracket.deduction)
      break
    }
  }

  // 2026: desconto progressivo que garante isenção efetiva até ~R$5.000 bruto.
  // A redução usa a base de cálculo (após INSS e dependentes) e zera em base = R$7.350.
  const reduction = Math.max(0, IRRF_REDUCTION_CONSTANT - IRRF_REDUCTION_RATE * base)
  return round(Math.max(0, regularIRRF - reduction))
}

export function calculateCLT(input: CLTInput): CLTResult {
  const { grossSalary, dependents, otherDeductions, va = 0, vt = 0, otherBenefits = 0 } = input
  const inss = calculateINSS(grossSalary)
  const dependentDeduction = dependents * IRRF_DEDUCTION_PER_DEPENDENT
  const irrfBase = Math.max(0, grossSalary - inss - dependentDeduction)
  const irrf = calculateIRRF(irrfBase)
  const netSalary = round(grossSalary - inss - irrf - otherDeductions)
  const fgts = round(grossSalary * 0.08)
  const decimoTerceiro = round(netSalary / 12)
  const abonoFerias = round(netSalary / 3 / 12)
  const effectiveIncome = round(netSalary + va + vt + otherBenefits + fgts + decimoTerceiro + abonoFerias)
  return { grossSalary, inss, irrf, otherDeductions, netSalary, va, vt, otherBenefits, fgts, decimoTerceiro, abonoFerias, effectiveIncome }
}

// Renda efetiva mensal: o que entra todo mês (sem FGTS, 13º e abono de férias).
export function cltMonthlyEffectiveIncome(clt: CLTResult): number {
  return round(clt.netSalary + clt.va + clt.vt + clt.otherBenefits)
}

export function calculatePJ(input: PJInput): PJResult {
  const { revenue, regime, prolabore, fixedExpenses, healthInsurance, otherBenefits = 0 } = input

  const rateOrFixed = REGIME_RATES[regime]
  const taxOnRevenue =
    rateOrFixed === "mei" ? MEI_FIXED_MONTHLY_TAX : round(revenue * rateOrFixed)

  // Contribuinte individual: INSS flat 11% on pró-labore, capped at ceiling contribution
  const effectiveProlabore = prolabore > 0 ? prolabore : DEFAULT_PROLABORE
  const maxINSS = calculateINSS(INSS_SALARY_CEILING)
  const inss = Math.min(round(effectiveProlabore * INSS_PROLABORE_RATE), maxINSS)

  const irrfBase = Math.max(0, effectiveProlabore - inss)
  const irrf = calculateIRRF(irrfBase)
  const netValue = round(
    revenue - taxOnRevenue - inss - irrf - fixedExpenses - healthInsurance
  )
  const effectiveIncome = round(netValue + otherBenefits)

  return { revenue, taxOnRevenue, inss, irrf, fixedExpenses, healthInsurance, netValue, otherBenefits, effectiveIncome }
}

// ─── Equivalence estimation (binary search) ──────────────────────────────────

// Finds CLT gross salary that yields a net equal to targetNet.
// Uses default assumptions (0 dependents, 0 other deductions) for the estimate.
export function estimateCLTEquivalent(targetNet: number): {
  gross: number
  result: CLTResult
} {
  const baseInput = { dependents: 0, otherDeductions: 0 }
  let low = targetNet
  let high = targetNet * 4

  for (let i = 0; i < 60; i++) {
    const mid = (low + high) / 2
    const result = calculateCLT({ grossSalary: mid, ...baseInput })
    if (Math.abs(result.netSalary - targetNet) < 0.01) {
      return { gross: round(mid), result }
    }
    if (result.netSalary < targetNet) low = mid
    else high = mid
  }

  const gross = (low + high) / 2
  return { gross: round(gross), result: calculateCLT({ grossSalary: gross, ...baseInput }) }
}

// Finds CLT gross salary that yields an effectiveIncome equal to targetEffective.
// Uses the full CLT input (including benefits) so the equivalence accounts for FGTS,
// 13th salary, vacation bonus, and any entered benefits.
export function estimateCLTEffectiveEquivalent(
  targetEffective: number,
  config: Omit<CLTInput, "grossSalary">
): { gross: number; result: CLTResult } {
  let low = 0
  let high = targetEffective * 3

  for (let i = 0; i < 60; i++) {
    const mid = (low + high) / 2
    const result = calculateCLT({ grossSalary: mid, ...config })
    if (Math.abs(result.effectiveIncome - targetEffective) < 0.01) {
      return { gross: round(mid), result }
    }
    if (result.effectiveIncome < targetEffective) low = mid
    else high = mid
  }

  const gross = (low + high) / 2
  return { gross: round(gross), result: calculateCLT({ grossSalary: gross, ...config }) }
}

// Finds PJ revenue that yields a net equal to targetNet with the given config.
export function estimatePJEquivalent(
  targetNet: number,
  config: PJConfig
): { revenue: number; result: PJResult } {
  let low = targetNet
  let high = targetNet * 4

  for (let i = 0; i < 60; i++) {
    const mid = (low + high) / 2
    const result = calculatePJ({ revenue: mid, ...config })
    if (Math.abs(result.netValue - targetNet) < 0.01) {
      return { revenue: round(mid), result }
    }
    if (result.netValue < targetNet) low = mid
    else high = mid
  }

  const revenue = (low + high) / 2
  return { revenue: round(revenue), result: calculatePJ({ revenue, ...config }) }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function isMEIOverLimit(revenue: number): boolean {
  return revenue > MEI_MONTHLY_REVENUE_LIMIT
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

function round(value: number): number {
  return Math.round(value * 100) / 100
}
