'use client'

import { useState } from 'react'
import type { DocumentAnalysis, QAEntry, DocumentApiError } from '../_types'
import { ACCEPTED_MIME_TYPES, MAX_FILE_SIZE, getMimeType } from '../_types'

const ERROR_MESSAGES: Record<string, string> = {
  EMPTY_FILE: 'Nenhum arquivo selecionado.',
  FILE_TOO_LARGE: 'Arquivo muito grande. Máximo de 5 MB.',
  UNSUPPORTED_FORMAT: 'Formato não suportado. Use PDF, imagem ou texto.',
  EMPTY_QUESTION: 'Digite uma pergunta antes de enviar.',
  QUOTA_EXCEEDED: 'Limite de uso da API atingido. Aguarde alguns minutos.',
  GEMINI_PARSE_ERROR: 'Não foi possível processar a resposta da IA. Tente novamente.',
  GEMINI_API_ERROR: 'Erro ao chamar a API de IA. Tente novamente.',
  MISSING_API_KEY: 'Configuração do servidor incompleta.',
}

export function useDocumentReader() {
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [qaEntries, setQaEntries] = useState<QAEntry[]>([])
  const [question, setQuestion] = useState('')
  const [isAsking, setIsAsking] = useState(false)

  function selectFile(f: File) {
    const mimeType = getMimeType(f)
    if (!ACCEPTED_MIME_TYPES.has(mimeType)) {
      setFileError('Formato não suportado. Use PDF, imagem (JPG, PNG, WebP) ou texto (.txt, .md).')
      return
    }
    if (f.size > MAX_FILE_SIZE) {
      setFileError('Arquivo muito grande. Máximo de 5 MB.')
      return
    }
    setFileError(null)
    setFile(f)
    setAnalysis(null)
    setAnalysisError(null)
    setQaEntries([])
    setQuestion('')
  }

  async function analyze() {
    if (!file) return
    setIsAnalyzing(true)
    setAnalysisError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/analyze-document', { method: 'POST', body: formData })
      const data = (await res.json()) as DocumentAnalysis | DocumentApiError
      if (!res.ok) {
        setAnalysisError(
          ERROR_MESSAGES[(data as DocumentApiError).error] ?? ERROR_MESSAGES.GEMINI_API_ERROR
        )
        return
      }
      setAnalysis(data as DocumentAnalysis)
    } catch {
      setAnalysisError('Erro inesperado. Tente novamente.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  async function askQuestion() {
    if (!file || !question.trim()) return
    const q = question.trim()
    setQuestion('')
    setIsAsking(true)

    setQaEntries((prev) => [...prev, { question: q, answer: '', isLoading: true }])

    const formData = new FormData()
    formData.append('file', file)
    formData.append('question', q)

    try {
      const res = await fetch('/api/ask-document', { method: 'POST', body: formData })
      const data = (await res.json()) as { answer: string } | DocumentApiError
      if (!res.ok) {
        const msg =
          ERROR_MESSAGES[(data as DocumentApiError).error] ?? ERROR_MESSAGES.GEMINI_API_ERROR
        setQaEntries((prev) =>
          prev.map((e, i) => (i === prev.length - 1 ? { ...e, answer: msg, isLoading: false } : e))
        )
        return
      }
      setQaEntries((prev) =>
        prev.map((e, i) =>
          i === prev.length - 1
            ? { ...e, answer: (data as { answer: string }).answer, isLoading: false }
            : e
        )
      )
    } catch {
      setQaEntries((prev) =>
        prev.map((e, i) =>
          i === prev.length - 1
            ? { ...e, answer: 'Erro inesperado. Tente novamente.', isLoading: false }
            : e
        )
      )
    } finally {
      setIsAsking(false)
    }
  }

  function reset() {
    setFile(null)
    setFileError(null)
    setAnalysis(null)
    setAnalysisError(null)
    setIsAnalyzing(false)
    setQaEntries([])
    setQuestion('')
    setIsAsking(false)
  }

  const canAnalyze = !!file && !isAnalyzing
  const canAsk = !!file && !!analysis && question.trim().length > 0 && !isAsking

  return {
    file,
    selectFile,
    fileError,
    analysis,
    analysisError,
    isAnalyzing,
    analyze,
    qaEntries,
    question,
    setQuestion,
    isAsking,
    askQuestion,
    canAnalyze,
    canAsk,
    reset,
  }
}
