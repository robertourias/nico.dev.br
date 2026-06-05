export type SentimentLabel = 'Positivo' | 'Neutro' | 'Negativo'
export type EntityType = 'Pessoa' | 'Organização' | 'Local' | 'Produto' | 'Evento' | 'Outro'
export type EntityRelevance = 'Alta' | 'Média' | 'Baixa'

export interface Entity {
  name: string
  type: EntityType
  relevance: EntityRelevance
}

export interface AnalysisResult {
  detectedLanguage: string
  sentiment: {
    label: SentimentLabel
    score: number
    explanation: string
  }
  entities: Entity[]
  summary: string
  insights: string[]
  humanizedText: string
}

export type AnalysisApiErrorCode =
  | 'EMPTY_TEXT'
  | 'TEXT_TOO_LONG'
  | 'QUOTA_EXCEEDED'
  | 'GEMINI_PARSE_ERROR'
  | 'GEMINI_API_ERROR'
  | 'MISSING_API_KEY'

export interface AnalysisApiError {
  error: AnalysisApiErrorCode
  detail?: string
}
