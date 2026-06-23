// Núcleo de cálculo da calculadora — puro TypeScript, sem dependências e sem
// acesso a `window`/DOM, para ser testável isoladamente e reaproveitado por
// formulário, dashboard de resultados, gráfico e tabela comparativa. Valores
// são aproximações didáticas de portfólio, não consultoria financeira real.

export type HorizonMonths = 3 | 6 | 12 | 24

export interface RoiInputs {
  /** Investimento inicial no serviço/solução, em reais. */
  investimentoInicial: number
  /** Receita mensal atual da empresa, antes da contratação, em reais. */
  receitaMensalAtual: number
  /** Crescimento esperado de receita, em percentual (0–100). */
  crescimentoEsperado: number
  /** Economia mensal gerada pelo serviço (redução de custos), em reais. */
  economiaMensalGerada: number
  /** Horizonte de análise, em meses. */
  horizonteMeses: HorizonMonths
}

export const DEFAULT_INPUTS: RoiInputs = {
  investimentoInicial: 5000,
  receitaMensalAtual: 20000,
  crescimentoEsperado: 20,
  economiaMensalGerada: 1500,
  horizonteMeses: 12,
}

export const HORIZON_OPTIONS: { value: HorizonMonths; label: string }[] = [
  { value: 3, label: "3 meses" },
  { value: 6, label: "6 meses" },
  { value: 12, label: "12 meses" },
  { value: 24, label: "24 meses" },
]

export interface RoiResult {
  /** Receita adicional mensal gerada pelo crescimento esperado. */
  receitaAdicional: number
  /** Ganho total acumulado no horizonte (receita adicional + economia) × meses. */
  ganhoTotal: number
  /** Lucro gerado: ganho total − investimento inicial. */
  lucro: number
  /** Retorno sobre investimento, em percentual. */
  roi: number
  /** Prazo de retorno do investimento, em meses (fração). */
  paybackMeses: number | null
  /** Economia acumulada no horizonte (economia mensal × meses). */
  economiaAcumulada: number
  /** Série mensal de receita acumulada — cenário sem o serviço. */
  serieSemServico: number[]
  /** Série mensal de receita acumulada — cenário com o serviço. */
  serieComServico: number[]
}

export function calculateRoi(inputs: RoiInputs): RoiResult {
  const { investimentoInicial, receitaMensalAtual, crescimentoEsperado, economiaMensalGerada, horizonteMeses } =
    inputs

  const receitaAdicional = receitaMensalAtual * (crescimentoEsperado / 100)
  const ganhoMensal = receitaAdicional + economiaMensalGerada
  const ganhoTotal = ganhoMensal * horizonteMeses
  const lucro = ganhoTotal - investimentoInicial
  const roi = investimentoInicial > 0 ? (lucro / investimentoInicial) * 100 : 0
  const paybackMeses = ganhoMensal > 0 ? investimentoInicial / ganhoMensal : null
  const economiaAcumulada = economiaMensalGerada * horizonteMeses

  const serieSemServico = Array.from({ length: horizonteMeses }, (_, i) => receitaMensalAtual * (i + 1))
  const serieComServico = Array.from(
    { length: horizonteMeses },
    (_, i) => (receitaMensalAtual + receitaAdicional + economiaMensalGerada) * (i + 1)
  )

  return {
    receitaAdicional,
    ganhoTotal,
    lucro,
    roi,
    paybackMeses,
    economiaAcumulada,
    serieSemServico,
    serieComServico,
  }
}

export interface ComparisonRow {
  indicador: string
  semServico: string
  comServico: string
}

export function buildComparisonRows(inputs: RoiInputs, result: RoiResult): ComparisonRow[] {
  const receitaSemServico = inputs.receitaMensalAtual * inputs.horizonteMeses
  const receitaComServico = (inputs.receitaMensalAtual + result.receitaAdicional) * inputs.horizonteMeses

  return [
    {
      indicador: "Receita",
      semServico: formatCurrency(receitaSemServico),
      comServico: formatCurrency(receitaComServico),
    },
    {
      indicador: "Economia",
      semServico: formatCurrency(0),
      comServico: formatCurrency(result.economiaAcumulada),
    },
    {
      indicador: "Lucro",
      semServico: formatCurrency(0),
      comServico: formatCurrency(result.lucro),
    },
    {
      indicador: "ROI",
      semServico: "0%",
      comServico: `${formatNumber(result.roi)}%`,
    },
  ]
}

export interface ExamplePreset {
  id: string
  label: string
  description: string
  inputs: RoiInputs
}

// Exemplos prontos (conforme briefing): ao clicar, preenchem a calculadora
// com um cenário plausível para o tipo de negócio indicado.
export const EXAMPLE_PRESETS: ExamplePreset[] = [
  {
    id: "pequena-empresa",
    label: "Pequena Empresa",
    description: "Investimento de R$ 3.000",
    inputs: {
      investimentoInicial: 3000,
      receitaMensalAtual: 10000,
      crescimentoEsperado: 15,
      economiaMensalGerada: 800,
      horizonteMeses: 12,
    },
  },
  {
    id: "agencia",
    label: "Agência",
    description: "Investimento de R$ 8.000",
    inputs: {
      investimentoInicial: 8000,
      receitaMensalAtual: 35000,
      crescimentoEsperado: 25,
      economiaMensalGerada: 2000,
      horizonteMeses: 12,
    },
  },
  {
    id: "ecommerce",
    label: "E-commerce",
    description: "Investimento de R$ 15.000",
    inputs: {
      investimentoInicial: 15000,
      receitaMensalAtual: 60000,
      crescimentoEsperado: 30,
      economiaMensalGerada: 3500,
      horizonteMeses: 12,
    },
  },
]

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

export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/** Converte uma string digitada (apenas dígitos) em reais inteiros, para o input com máscara monetária. */
export function parseDigitsToCurrency(raw: string): number {
  const digitsOnly = raw.replace(/\D/g, "")
  if (!digitsOnly) return 0
  return Number(digitsOnly)
}
