// Lógica da "Calculadora de Maturidade Tecnológica" — diferencial de
// portfólio do briefing. Cada pergunta pertence a uma categoria; a média das
// categorias gera o score geral e recomendações cruzadas com os serviços
// (ver SERVICES em ./data), reforçando a leitura consultiva da ferramenta.

export type MaturityCategory = "infraestrutura" | "engenharia" | "dados" | "seguranca" | "cultura"

export interface MaturityOption {
  value: string
  label: string
  score: number
}

export interface MaturityQuestion {
  id: number
  category: MaturityCategory
  title: string
  options: MaturityOption[]
}

const SCALE: MaturityOption[] = [
  { value: "0", label: "Não fazemos isso", score: 0 },
  { value: "1", label: "Em estágio inicial", score: 33 },
  { value: "2", label: "Parcialmente implementado", score: 66 },
  { value: "3", label: "Maduro e consolidado", score: 100 },
]

export const MATURITY_QUESTIONS: MaturityQuestion[] = [
  { id: 1, category: "infraestrutura", title: "Sua infraestrutura está hospedada em cloud (AWS, Azure, GCP)?", options: SCALE },
  { id: 2, category: "infraestrutura", title: "Sua infraestrutura escala automaticamente conforme a demanda?", options: SCALE },
  { id: 3, category: "engenharia", title: "Sua equipe utiliza integração e entrega contínua (CI/CD)?", options: SCALE },
  { id: 4, category: "engenharia", title: "Os sistemas possuem testes automatizados relevantes?", options: SCALE },
  { id: 5, category: "dados", title: "Decisões de negócio são apoiadas por dados e indicadores em tempo real?", options: SCALE },
  { id: 6, category: "dados", title: "Vocês utilizam automação ou IA em processos operacionais?", options: SCALE },
  { id: 7, category: "seguranca", title: "Existem políticas formais de segurança e controle de acesso?", options: SCALE },
  { id: 8, category: "seguranca", title: "Backups e plano de recuperação de desastres são testados periodicamente?", options: SCALE },
  { id: 9, category: "cultura", title: "A liderança trata tecnologia como prioridade estratégica?", options: SCALE },
  { id: 10, category: "cultura", title: "Times de negócio e tecnologia colaboram de forma integrada?", options: SCALE },
]

export const TOTAL_MATURITY_QUESTIONS = MATURITY_QUESTIONS.length

export type MaturityAnswers = Record<number, string>

export type MaturityLevel = "Inicial" | "Em Desenvolvimento" | "Avançado" | "Líder Digital"

export interface MaturityAreaResult {
  category: MaturityCategory
  label: string
  score: number
  recommendation: string
}

export interface MaturityResult {
  overallScore: number
  level: MaturityLevel
  areas: MaturityAreaResult[]
  topRecommendations: string[]
}

const CATEGORY_META: Record<MaturityCategory, { label: string; recommendation: string }> = {
  infraestrutura: {
    label: "Infraestrutura & Cloud",
    recommendation: "Avalie uma consultoria Cloud para ganhar escalabilidade e reduzir custos de infraestrutura.",
  },
  engenharia: {
    label: "Engenharia & Processos",
    recommendation: "Modernizar pipelines e arquitetura pode acelerar entregas com mais qualidade.",
  },
  dados: {
    label: "Dados & Automação",
    recommendation: "Iniciativas de IA e automação podem destravar decisões mais rápidas e precisas.",
  },
  seguranca: {
    label: "Segurança & Compliance",
    recommendation: "Uma revisão de arquitetura com foco em segurança reduz riscos operacionais e regulatórios.",
  },
  cultura: {
    label: "Cultura Digital",
    recommendation: "Alinhar liderança e times de tecnologia é a base para qualquer transformação digital sustentável.",
  },
}

function levelFor(score: number): MaturityLevel {
  if (score >= 80) return "Líder Digital"
  if (score >= 60) return "Avançado"
  if (score >= 35) return "Em Desenvolvimento"
  return "Inicial"
}

export function calculateMaturity(answers: MaturityAnswers): MaturityResult {
  const categories: MaturityCategory[] = ["infraestrutura", "engenharia", "dados", "seguranca", "cultura"]

  const areas: MaturityAreaResult[] = categories.map((category) => {
    const questions = MATURITY_QUESTIONS.filter((q) => q.category === category)
    const scores = questions
      .map((q) => {
        const answer = answers[q.id]
        if (!answer) return null
        const option = q.options.find((o) => o.value === answer)
        return option ? option.score : null
      })
      .filter((value): value is number => value !== null)

    const score = scores.length > 0 ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length) : 0
    const meta = CATEGORY_META[category]

    return { category, label: meta.label, score, recommendation: meta.recommendation }
  })

  const overallScore = Math.round(areas.reduce((sum, a) => sum + a.score, 0) / areas.length)

  const topRecommendations = areas
    .slice()
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((area) => area.recommendation)

  return {
    overallScore,
    level: levelFor(overallScore),
    areas,
    topRecommendations,
  }
}

export const MATURITY_STORAGE_KEY = "consultoria-ti:maturidade:v1"
