import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import type { DocumentAnalysis, DocumentApiError } from '@/app/leitor-documentos/_types'
import {
  ACCEPTED_MIME_TYPES,
  MAX_FILE_SIZE,
  getMimeType,
  isTextFile,
} from '@/app/leitor-documentos/_types'

const ANALYSIS_PROMPT = `You are a document analysis AI. Analyze the provided document and return ONLY valid JSON (no markdown fences, no text outside JSON) matching exactly this schema:

{
  "detectedLanguage": "<ISO 639-1 code, e.g. 'pt', 'en', 'es'>",
  "documentType": "<brief classification in Brazilian Portuguese, e.g. 'Nota Fiscal', 'Contrato de Prestação de Serviços', 'Currículo', 'Artigo Científico', 'Receita Médica', 'Extrato Bancário', 'Relatório', 'Apresentação'>",
  "summary": "<concise 2-4 sentence summary ALWAYS in Brazilian Portuguese>",
  "keyPoints": ["<3-7 key information items ALWAYS in Brazilian Portuguese — extract dates, values, names, deadlines, obligations>"]
}

Rules:
- documentType: short, specific classification in pt-BR
- summary: ALWAYS in Brazilian Portuguese, regardless of document language
- keyPoints: ALWAYS in Brazilian Portuguese, 3 minimum, 7 maximum
- Return ONLY the JSON object, nothing else`

function stripMarkdownFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim()
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<DocumentAnalysis | DocumentApiError>> {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'EMPTY_FILE' }, { status: 400 })
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'FILE_TOO_LARGE' }, { status: 400 })
  }

  const mimeType = getMimeType(file)
  if (!ACCEPTED_MIME_TYPES.has(mimeType)) {
    return NextResponse.json({ error: 'UNSUPPORTED_FORMAT' }, { status: 400 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'MISSING_API_KEY' }, { status: 500 })
  }

  let raw: string
  try {
    const ai = new GoogleGenAI({ apiKey })

    const parts = isTextFile(mimeType)
      ? [{ text: `${ANALYSIS_PROMPT}\n\nDocument content:\n${await file.text()}` }]
      : [
          {
            inlineData: {
              mimeType,
              data: Buffer.from(await file.arrayBuffer()).toString('base64'),
            },
          },
          { text: ANALYSIS_PROMPT },
        ]

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts }],
    })
    raw = (response.text ?? '').trim()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[analyze-document] Gemini error:', message)
    if (message.includes('429') || message.includes('RESOURCE_EXHAUSTED')) {
      return NextResponse.json({ error: 'QUOTA_EXCEEDED' }, { status: 429 })
    }
    return NextResponse.json({ error: 'GEMINI_API_ERROR', detail: message }, { status: 502 })
  }

  try {
    const parsed = JSON.parse(stripMarkdownFences(raw)) as DocumentAnalysis
    return NextResponse.json(parsed)
  } catch (err) {
    console.error('[analyze-document] parse error. Raw:', raw, err)
    return NextResponse.json({ error: 'GEMINI_PARSE_ERROR' }, { status: 500 })
  }
}
