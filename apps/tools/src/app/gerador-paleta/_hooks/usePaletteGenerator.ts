'use client'

import { useState } from 'react'
import type {
  GeneratePaletteResult,
  GeneratePaletteError,
  HarmonyType,
} from '../_types'

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_COLOR: 'Cor inválida. Use #HEX, rgb(...) ou hsl(...).',
  INVALID_HARMONY: 'Tipo de harmonia inválido.',
  INVALID_COUNT: 'Quantidade de cores inválida.',
  QUOTA_EXCEEDED: 'Limite de uso da API atingido. Aguarde alguns minutos.',
  GEMINI_PARSE_ERROR: 'Não foi possível processar a resposta da IA. Tente novamente.',
  GEMINI_API_ERROR: 'Erro ao chamar a API de IA. Tente novamente.',
  MISSING_API_KEY: 'Configuração do servidor incompleta.',
}

export function usePaletteGenerator() {
  const [baseColor, setBaseColor] = useState('#FF5733')
  const [harmonyType, setHarmonyType] = useState<HarmonyType>('triadic')
  const [count, setCount] = useState<3 | 5 | 7 | 10>(5)
  const [result, setResult] = useState<GeneratePaletteResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const canGenerate = baseColor.trim().length > 0 && !isLoading

  async function generate() {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/generate-palette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseColor, harmonyType, count }),
      })

      const data = (await res.json()) as GeneratePaletteResult | GeneratePaletteError

      if (!res.ok) {
        const err = data as GeneratePaletteError
        setError(ERROR_MESSAGES[err.error] ?? ERROR_MESSAGES.GEMINI_API_ERROR)
        return
      }

      setResult(data as GeneratePaletteResult)
    } catch {
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  function reset() {
    setBaseColor('#FF5733')
    setHarmonyType('triadic')
    setCount(5)
    setResult(null)
    setError(null)
  }

  async function copyColor(hex: string) {
    try {
      await navigator.clipboard.writeText(hex)
    } catch {
      console.error('Failed to copy color')
    }
  }

  return {
    baseColor,
    setBaseColor,
    harmonyType,
    setHarmonyType,
    count,
    setCount,
    result,
    error,
    isLoading,
    canGenerate,
    generate,
    reset,
    copyColor,
  }
}
