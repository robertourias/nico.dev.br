import { QUESTIONS, type Category } from "./questions"

export type Answers = Record<number, string>

export type ScoreLabel = "Excelente" | "Bom" | "Atenção" | "Crítico"

export interface AreaResult {
  category: Exclude<Category, "contexto">
  label: string
  score: number
  comment: string
}

export interface DiagnosticResult {
  overallScore: number
  overallLabel: ScoreLabel
  areas: AreaResult[]
  recommendations: string[]
  challenge: string | null
}

const SCORED_CATEGORIES: Array<{ category: Exclude<Category, "contexto">; label: string }> = [
  { category: "marketing", label: "Marketing" },
  { category: "vendas", label: "Vendas" },
  { category: "operacao", label: "Operação" },
  { category: "financeiro", label: "Financeiro" },
  { category: "estrategia", label: "Estratégia" },
]

const COMMENTS: Record<Exclude<Category, "contexto">, { high: string; mid: string; low: string }> = {
  marketing: {
    high: "Geração de leads consistente e com retorno previsível.",
    mid: "Existe geração de leads, mas o retorno ainda não é previsível.",
    low: "Falta um processo estruturado de geração de leads.",
  },
  vendas: {
    high: "Processo comercial estruturado e apoiado por CRM.",
    mid: "Há espaço para estruturar melhor o funil comercial.",
    low: "Gargalos comerciais relevantes — funil e CRM precisam de atenção.",
  },
  operacao: {
    high: "Processos documentados e indicadores acompanhados de perto.",
    mid: "Processos parcialmente documentados, indicadores ainda inconsistentes.",
    low: "Processos pouco documentados e indicadores não acompanhados.",
  },
  financeiro: {
    high: "Fluxo de caixa saudável e sob controle.",
    mid: "Fluxo de caixa razoável, mas com instabilidades.",
    low: "Fluxo de caixa crítico — prioridade imediata.",
  },
  estrategia: {
    high: "Metas e planejamento estratégico bem definidos.",
    mid: "Metas existem, mas o planejamento estratégico é incompleto.",
    low: "Falta planejamento estratégico e metas claras.",
  },
}

const RECOMMENDATIONS: Record<Exclude<Category, "contexto">, string> = {
  marketing: "Criar processo de geração de leads previsível.",
  vendas: "Estruturar funil comercial e implantar CRM.",
  operacao: "Melhorar acompanhamento de métricas e documentar processos.",
  financeiro: "Organizar fluxo de caixa e indicadores financeiros.",
  estrategia: "Formalizar planejamento estratégico com metas claras.",
}

function questionScore(questionId: number, answer: string | undefined): number | null {
  if (!answer) return null
  const question = QUESTIONS.find((q) => q.id === questionId)
  if (!question) return null

  if (question.type === "scale") {
    const value = Number(answer)
    if (Number.isNaN(value)) return null
    return value * 20
  }

  const option = question.options?.find((o) => o.value === answer)
  return option ? option.score : null
}

function commentFor(category: Exclude<Category, "contexto">, score: number): string {
  const set = COMMENTS[category]
  if (score >= 80) return set.high
  if (score >= 50) return set.mid
  return set.low
}

function labelFor(score: number): ScoreLabel {
  if (score >= 80) return "Excelente"
  if (score >= 60) return "Bom"
  if (score >= 40) return "Atenção"
  return "Crítico"
}

export function calculateDiagnostic(answers: Answers): DiagnosticResult {
  const areas: AreaResult[] = SCORED_CATEGORIES.map(({ category, label }) => {
    const categoryQuestions = QUESTIONS.filter((q) => q.category === category)
    const scores = categoryQuestions
      .map((q) => questionScore(q.id, answers[q.id]))
      .filter((value): value is number => value !== null)

    const score = scores.length > 0 ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length) : 0

    return { category, label, score, comment: commentFor(category, score) }
  })

  const overallScore = Math.round(areas.reduce((sum, a) => sum + a.score, 0) / areas.length)

  const recommendations = areas
    .filter((area) => area.score < 60)
    .sort((a, b) => a.score - b.score)
    .map((area) => RECOMMENDATIONS[area.category])

  if (recommendations.length === 0) {
    recommendations.push("Continue monitorando indicadores e busque novas oportunidades de expansão.")
  }

  const challenge = answers[12]?.trim() || null

  return {
    overallScore,
    overallLabel: labelFor(overallScore),
    areas,
    recommendations,
    challenge,
  }
}

export const STORAGE_KEY = "diagnostico-gratuito-negocios:v1"
