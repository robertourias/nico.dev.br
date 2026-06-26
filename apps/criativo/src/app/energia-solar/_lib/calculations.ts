// Núcleo de cálculo do simulador solar — puro TypeScript, sem dependências e
// sem acesso a `window`/DOM, para ser testável isoladamente e reaproveitado
// por formulário, dashboard, gráficos e seção de impacto ambiental. Todos os
// parâmetros (tarifa, fator de performance, custo por kWp, fator de emissão)
// são aproximações didáticas de mercado — produto de portfólio, não um
// estudo de viabilidade técnica real.

import { CITIES, PROPERTY_TYPES, type CityKey, type PropertyTypeKey } from "./data"

export interface SimulatorInputs {
  monthlyBill: number
  propertyType: PropertyTypeKey
  city: CityKey
  monthlyConsumptionKwh: number
  phone: string
}

/** Tarifa residencial média usada apenas para sugerir o consumo a partir da conta informada. */
export const AVERAGE_TARIFF_PER_KWH = 0.92
/** Fator de performance do sistema (perdas por temperatura, fiação, inversor etc.). */
const PERFORMANCE_RATIO = 0.78
/** Potência nominal por painel (W), convertida para kWp. */
const PANEL_WATTAGE_KWP = 0.55
/** Redução média da conta após a instalação (a "taxa mínima"/custo de disponibilidade permanece). */
const REDUCTION_RATE = 0.93
/** Custo de disponibilidade da concessionária — valor mínimo que continua sendo cobrado. */
const MINIMUM_GRID_FEE = 50
/** Reajuste tarifário médio histórico ao ano, usado para projetar a economia futura. */
const TARIFF_INFLATION_RATE = 0.08
/** Custo médio do kWp instalado no Brasil (equipamento + instalação), didático. */
const COST_PER_KWP = 4200
/** Fator de emissão médio do Sistema Interligado Nacional (kg CO2/kWh), didático. */
const CO2_FACTOR_KG_PER_KWH = 0.084
/** Absorção média de CO2 por uma árvore adulta por ano (kg), didático. */
const CO2_KG_PER_TREE_YEAR = 22

export const DEFAULT_INPUTS: SimulatorInputs = {
  monthlyBill: 450,
  propertyType: "casa-terrea",
  city: "sao-paulo",
  monthlyConsumptionKwh: Math.round(450 / AVERAGE_TARIFF_PER_KWH),
  phone: "",
}

export const STORAGE_KEY = "energia-solar:v1"

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/** Sugere o consumo mensal (kWh) a partir do valor da conta, para pré-preencher o campo. */
export function estimateConsumptionFromBill(monthlyBill: number): number {
  return Math.max(0, Math.round(monthlyBill / AVERAGE_TARIFF_PER_KWH))
}

export interface SimulationResult {
  systemSizeKwp: number
  panelCount: number
  monthlyBillAfter: number
  monthlySavings: number
  annualSavings: number
  tenYearSavings: number
  monthlySeries: number[]
  totalInvestment: number
  paybackYears: number | null
  annualCo2KgAvoided: number
  tenYearCo2KgAvoided: number
  treesEquivalent: number
  reductionPct: number
  hsp: number
}

export function calculateSimulation(inputs: SimulatorInputs): SimulationResult {
  const city = CITIES.find((c) => c.key === inputs.city) ?? CITIES[0]
  const propertyType = PROPERTY_TYPES.find((p) => p.key === inputs.propertyType) ?? PROPERTY_TYPES[0]

  const consumption = Math.max(0, inputs.monthlyConsumptionKwh)
  const hsp = city.hsp

  const rawSystemSizeKwp = consumption / (hsp * 30 * PERFORMANCE_RATIO)
  const systemSizeKwp = rawSystemSizeKwp / propertyType.roofFactor
  const panelCount = systemSizeKwp > 0 ? Math.max(1, Math.ceil(systemSizeKwp / PANEL_WATTAGE_KWP)) : 0

  const rawSavings = inputs.monthlyBill - MINIMUM_GRID_FEE
  const monthlySavings = clamp(rawSavings, 0, inputs.monthlyBill * REDUCTION_RATE)
  const monthlyBillAfter = Math.max(MINIMUM_GRID_FEE, inputs.monthlyBill - monthlySavings)
  const reductionPct = inputs.monthlyBill > 0 ? (monthlySavings / inputs.monthlyBill) * 100 : 0

  const annualSavings = monthlySavings * 12
  const monthlySeries = Array.from({ length: 12 }, (_, i) => monthlySavings * (i + 1))

  let tenYearSavings = 0
  for (let year = 0; year < 10; year++) {
    tenYearSavings += annualSavings * Math.pow(1 + TARIFF_INFLATION_RATE, year)
  }

  const totalInvestment = systemSizeKwp * COST_PER_KWP
  const paybackYears = annualSavings > 0 ? totalInvestment / annualSavings : null

  const annualCo2KgAvoided = consumption * 12 * REDUCTION_RATE * CO2_FACTOR_KG_PER_KWH
  const tenYearCo2KgAvoided = annualCo2KgAvoided * 10
  const treesEquivalent = Math.max(0, Math.round(annualCo2KgAvoided / CO2_KG_PER_TREE_YEAR))

  return {
    systemSizeKwp,
    panelCount,
    monthlyBillAfter,
    monthlySavings,
    annualSavings,
    tenYearSavings,
    monthlySeries,
    totalInvestment,
    paybackYears,
    annualCo2KgAvoided,
    tenYearCo2KgAvoided,
    treesEquivalent,
    reductionPct,
    hsp,
  }
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  })
}

export function formatCurrencyCompact(value: number): string {
  if (Math.abs(value) >= 1000) {
    return `R$${(value / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}k`
  }
  return formatCurrency(value)
}

export function formatPayback(years: number | null): string {
  if (years === null || !Number.isFinite(years) || years <= 0) return "—"
  const wholeYears = Math.floor(years)
  const months = Math.round((years - wholeYears) * 12)
  if (months === 0) return `${wholeYears} ano${wholeYears !== 1 ? "s" : ""}`
  if (wholeYears === 0) return `${months} ${months !== 1 ? "meses" : "mês"}`
  return `${wholeYears}a ${months}m`
}
