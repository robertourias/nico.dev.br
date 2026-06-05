export interface DocumentAnalysis {
  detectedLanguage: string
  documentType: string
  summary: string
  keyPoints: string[]
}

export interface QAEntry {
  question: string
  answer: string
  isLoading?: boolean
}

export type DocumentApiErrorCode =
  | 'EMPTY_FILE'
  | 'FILE_TOO_LARGE'
  | 'UNSUPPORTED_FORMAT'
  | 'EMPTY_QUESTION'
  | 'QUOTA_EXCEEDED'
  | 'GEMINI_PARSE_ERROR'
  | 'GEMINI_API_ERROR'
  | 'MISSING_API_KEY'

export interface DocumentApiError {
  error: DocumentApiErrorCode
  detail?: string
}

export const ACCEPTED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'text/plain',
  'text/markdown',
])

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export function getMimeType(file: File): string {
  if (file.type) return file.type
  if (file.name.endsWith('.md')) return 'text/markdown'
  return ''
}

export function isTextFile(mimeType: string): boolean {
  return mimeType === 'text/plain' || mimeType === 'text/markdown'
}
