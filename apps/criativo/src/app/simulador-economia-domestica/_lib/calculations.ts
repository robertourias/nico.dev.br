// Núcleo de cálculo do simulador — puro TypeScript, sem dependências e sem
// acesso a `window`/DOM, para ser testável isoladamente e reaproveitado por
// qualquer componente (formulário, dashboard, gráficos, insights, badges).
// Todas as datas/valores são aproximações didáticas (produto de portfólio),
// não consultoria financeira real.

export type ScenarioKey = "conservador" | "moderado" | "agressivo"

export interface SimulatorInputs {
  deliveryOrdersPerWeek: number
  deliveryAvgValue: number
  coffeePerWeek: number
  coffeeAvgValue: number
  ridesPerWeek: number
  rideAvgValue: number
  subscriptionsCount: number
  subscriptionsAvgValue: number
  energyBillMonthly: number
  energySavingsPct: number
  scenario: ScenarioKey
}

export const DEFAULT_INPUTS: SimulatorInputs = {
  deliveryOrdersPerWeek: 3,
  deliveryAvgValue: 45,
  coffeePerWeek: 5,
  coffeeAvgValue: 12,
  ridesPerWeek: 4,
  rideAvgValue: 18,
  subscriptionsCount: 4,
  subscriptionsAvgValue: 35,
  energyBillMonthly: 280,
  energySavingsPct: 12,
  scenario: "moderado",
}

export const STORAGE_KEY = "simulador-economia-domestica:v1"

/** Semanas médias por mês (365.25 / 7 / 12), usado para anualizar hábitos semanais. */
export const WEEKS_PER_MONTH = 4.345
export const ANNUAL_RETURN_RATE = 0.08

export const SCENARIO_CONFIG: Record<
  ScenarioKey,
  { label: string; description: string; reductionRate: number }
> = {
  conservador: {
    label: "Conservador",
    description: "Pequenas mudanças, sem sacrificar o conforto.",
    reductionRate: 0.2,
  },
  moderado: {
    label: "Moderado",
    description: "Mudanças de hábito perceptíveis no dia a dia.",
    reductionRate: 0.45,
  },
  agressivo: {
    label: "Agressivo",
    description: "Cortes ambiciosos, foco total na economia.",
    reductionRate: 0.7,
  },
}

export interface CategoryResult {
  key: "delivery" | "coffee" | "rides" | "subscriptions" | "energy"
  label: string
  currentMonthly: number
  optimizedMonthly: number
  savingsMonthly: number
}

export interface SimulationResult {
  categories: CategoryResult[]
  monthlySavings: number
  annualSavings: number
  fiveYearSavings: number
  investedFiveYears: number
  monthlySeries: number[]
  totalCurrentMonthly: number
  totalOptimizedMonthly: number
}

export function calculateSimulation(inputs: SimulatorInputs): SimulationResult {
  const { reductionRate } = SCENARIO_CONFIG[inputs.scenario]

  const deliveryCurrent = inputs.deliveryOrdersPerWeek * inputs.deliveryAvgValue * WEEKS_PER_MONTH
  const coffeeCurrent = inputs.coffeePerWeek * inputs.coffeeAvgValue * WEEKS_PER_MONTH
  const ridesCurrent = inputs.ridesPerWeek * inputs.rideAvgValue * WEEKS_PER_MONTH
  const subscriptionsCurrent = inputs.subscriptionsCount * inputs.subscriptionsAvgValue

  const deliveryOptimized = deliveryCurrent * (1 - reductionRate)
  const coffeeOptimized = coffeeCurrent * (1 - reductionRate)
  const ridesOptimized = ridesCurrent * (1 - reductionRate)

  const subscriptionsCancelled = Math.round(inputs.subscriptionsCount * reductionRate)
  const subscriptionsRemaining = Math.max(0, inputs.subscriptionsCount - subscriptionsCancelled)
  const subscriptionsOptimized = subscriptionsRemaining * inputs.subscriptionsAvgValue

  const energySavings = inputs.energyBillMonthly * (inputs.energySavingsPct / 100)
  const energyOptimized = inputs.energyBillMonthly - energySavings

  const categories: CategoryResult[] = [
    {
      key: "delivery",
      label: "Delivery",
      currentMonthly: deliveryCurrent,
      optimizedMonthly: deliveryOptimized,
      savingsMonthly: deliveryCurrent - deliveryOptimized,
    },
    {
      key: "coffee",
      label: "Café fora",
      currentMonthly: coffeeCurrent,
      optimizedMonthly: coffeeOptimized,
      savingsMonthly: coffeeCurrent - coffeeOptimized,
    },
    {
      key: "rides",
      label: "Transporte",
      currentMonthly: ridesCurrent,
      optimizedMonthly: ridesOptimized,
      savingsMonthly: ridesCurrent - ridesOptimized,
    },
    {
      key: "subscriptions",
      label: "Assinaturas",
      currentMonthly: subscriptionsCurrent,
      optimizedMonthly: subscriptionsOptimized,
      savingsMonthly: subscriptionsCurrent - subscriptionsOptimized,
    },
    {
      key: "energy",
      label: "Energia",
      currentMonthly: inputs.energyBillMonthly,
      optimizedMonthly: energyOptimized,
      savingsMonthly: energySavings,
    },
  ]

  const monthlySavings = categories.reduce((sum, c) => sum + c.savingsMonthly, 0)
  const annualSavings = monthlySavings * 12
  const fiveYearSavings = monthlySavings * 60

  const monthlyRate = ANNUAL_RETURN_RATE / 12
  const months = 60
  const investedFiveYears =
    monthlySavings <= 0
      ? 0
      : monthlySavings * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)

  const monthlySeries = Array.from({ length: 12 }, (_, i) => monthlySavings * (i + 1))

  const totalCurrentMonthly = categories.reduce((sum, c) => sum + c.currentMonthly, 0)
  const totalOptimizedMonthly = categories.reduce((sum, c) => sum + c.optimizedMonthly, 0)

  return {
    categories,
    monthlySavings,
    annualSavings,
    fiveYearSavings,
    investedFiveYears,
    monthlySeries,
    totalCurrentMonthly,
    totalOptimizedMonthly,
  }
}

export interface Insight {
  id: string
  text: string
}

// Recomendações geradas a partir dos próprios valores informados pelo
// usuário (não são textos fixos) — reforça a percepção de cálculo real.
export function generateInsights(inputs: SimulatorInputs): Insight[] {
  const oneDeliveryLessAnnual = inputs.deliveryAvgValue * 52
  const subscriptionsToCancel = Math.max(1, Math.min(inputs.subscriptionsCount, Math.round(inputs.subscriptionsCount * 0.5)))
  const subscriptionsAnnual = subscriptionsToCancel * inputs.subscriptionsAvgValue * 12
  const energy10PctAnnual = inputs.energyBillMonthly * 0.1 * 12
  const oneRideLessAnnual = inputs.rideAvgValue * 52
  const coffeeHomeAnnual = inputs.coffeeAvgValue * inputs.coffeePerWeek * 52 * 0.7

  const insights: Insight[] = [
    {
      id: "delivery",
      text: `Trocar apenas 1 pedido de delivery por semana pode economizar ${formatCurrency(oneDeliveryLessAnnual)} por ano.`,
    },
    {
      id: "subscriptions",
      text:
        inputs.subscriptionsCount > 0
          ? `Cancelar ${subscriptionsToCancel} assinatura${subscriptionsToCancel > 1 ? "s" : ""} pouco utilizada${subscriptionsToCancel > 1 ? "s" : ""} pode gerar ${formatCurrency(subscriptionsAnnual)} por ano.`
          : `Revisar assinaturas ativas é um bom primeiro passo — cada uma cancelada economiza ${formatCurrency(inputs.subscriptionsAvgValue * 12)} por ano.`,
    },
    {
      id: "energy",
      text: `Reduzir 10% do consumo de energia representa ${formatCurrency(energy10PctAnnual)} por ano.`,
    },
    {
      id: "rides",
      text: `Uma corrida de aplicativo a menos por semana economiza ${formatCurrency(oneRideLessAnnual)} por ano.`,
    },
    {
      id: "coffee",
      text: `Preparar o café em casa em vez de comprar pode economizar até ${formatCurrency(coffeeHomeAnnual)} por ano.`,
    },
  ]

  return insights
}

export const SAVINGS_GOALS = [1000, 5000, 10000] as const

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

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
