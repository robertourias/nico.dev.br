'use client'

import { useState } from 'react'
import type { AnalysisResult, AnalysisApiError } from '../_types'

const ERROR_MESSAGES: Record<string, string> = {
  EMPTY_TEXT: 'O texto não pode estar vazio.',
  TEXT_TOO_LONG: 'Texto muito longo. Máximo de 5.000 caracteres.',
  QUOTA_EXCEEDED: 'Limite de uso da API atingido. Aguarde alguns minutos.',
  GEMINI_PARSE_ERROR: 'Não foi possível processar a resposta da IA. Tente novamente.',
  GEMINI_API_ERROR: 'Erro ao chamar a API de IA. Tente novamente.',
  MISSING_API_KEY: 'Configuração do servidor incompleta.',
}

export function useTextAnalyzer() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const canAnalyze = text.trim().length > 0 && text.length <= 5_000 && !isLoading

  async function analyze() {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/analyze-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      const data = (await res.json()) as AnalysisResult | AnalysisApiError

      if (!res.ok) {
        const err = data as AnalysisApiError
        setError(ERROR_MESSAGES[err.error] ?? ERROR_MESSAGES.GEMINI_API_ERROR)
        return
      }

      setResult(data as AnalysisResult)
    } catch {
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  function reset() {
    setText('')
    setResult(null)
    setError(null)
  }

  return { text, setText, result, error, isLoading, canAnalyze, analyze, reset }
}
