export type Category = "marketing" | "vendas" | "operacao" | "financeiro" | "estrategia" | "contexto"

export type QuestionType = "single" | "scale" | "text"

export interface QuestionOption {
  value: string
  label: string
  score: number
}

export interface Question {
  id: number
  category: Category
  title: string
  type: QuestionType
  options?: QuestionOption[]
}

export const TOTAL_QUESTIONS = 12

export const QUESTIONS: Question[] = [
  {
    id: 1,
    category: "contexto",
    title: "Qual o porte da sua empresa?",
    type: "single",
    options: [
      { value: "mei", label: "MEI", score: 0 },
      { value: "pequena", label: "Pequena", score: 0 },
      { value: "media", label: "Média", score: 0 },
      { value: "grande", label: "Grande", score: 0 },
    ],
  },
  {
    id: 2,
    category: "contexto",
    title: "Quantos clientes ativos possui?",
    type: "single",
    options: [
      { value: "menos-50", label: "Menos de 50", score: 0 },
      { value: "50-200", label: "50 a 200", score: 0 },
      { value: "200-1000", label: "200 a 1000", score: 0 },
      { value: "mais-1000", label: "Mais de 1000", score: 0 },
    ],
  },
  {
    id: 3,
    category: "vendas",
    title: "Como você avalia suas vendas atuais?",
    type: "scale",
  },
  {
    id: 4,
    category: "marketing",
    title: "Seu negócio gera leads regularmente?",
    type: "single",
    options: [
      { value: "sim", label: "Sim", score: 100 },
      { value: "parcialmente", label: "Parcialmente", score: 50 },
      { value: "nao", label: "Não", score: 0 },
    ],
  },
  {
    id: 5,
    category: "estrategia",
    title: "Você possui metas definidas?",
    type: "single",
    options: [
      { value: "sim", label: "Sim", score: 100 },
      { value: "nao", label: "Não", score: 0 },
    ],
  },
  {
    id: 6,
    category: "operacao",
    title: "Sua equipe acompanha indicadores?",
    type: "single",
    options: [
      { value: "sempre", label: "Sempre", score: 100 },
      { value: "as-vezes", label: "Às vezes", score: 50 },
      { value: "nunca", label: "Nunca", score: 0 },
    ],
  },
  {
    id: 7,
    category: "vendas",
    title: "Você utiliza CRM?",
    type: "single",
    options: [
      { value: "sim", label: "Sim", score: 100 },
      { value: "nao", label: "Não", score: 0 },
    ],
  },
  {
    id: 8,
    category: "marketing",
    title: "Seu marketing gera retorno previsível?",
    type: "scale",
  },
  {
    id: 9,
    category: "operacao",
    title: "Os processos são documentados?",
    type: "single",
    options: [
      { value: "sim", label: "Sim", score: 100 },
      { value: "parcialmente", label: "Parcialmente", score: 50 },
      { value: "nao", label: "Não", score: 0 },
    ],
  },
  {
    id: 10,
    category: "financeiro",
    title: "Como está o fluxo de caixa?",
    type: "scale",
  },
  {
    id: 11,
    category: "estrategia",
    title: "Existe planejamento estratégico?",
    type: "single",
    options: [
      { value: "sim", label: "Sim", score: 100 },
      { value: "nao", label: "Não", score: 0 },
    ],
  },
  {
    id: 12,
    category: "contexto",
    title: "Qual é seu maior desafio atualmente?",
    type: "text",
  },
]

export const SCALE_LABELS = ["Muito ruim", "Ruim", "Regular", "Boa", "Excelente"]
