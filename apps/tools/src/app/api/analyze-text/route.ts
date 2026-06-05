import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import type { AnalysisResult, AnalysisApiError } from '@/app/analisador-texto/_types'

const MAX_TEXT_LENGTH = 5_000

const PROMPT_TEMPLATE = `You are a multilingual text analysis AI. Analyze the following text and return ONLY valid JSON (no markdown fences, no text outside JSON) matching exactly this schema:

{
  "detectedLanguage": "<ISO 639-1 code, e.g. 'pt', 'en', 'es'>",
  "sentiment": {
    "label": "<Positivo | Neutro | Negativo>",
    "score": <integer 0-100: 0=very negative, 50=neutral, 100=very positive>,
    "explanation": "<one sentence in Brazilian Portuguese explaining the sentiment>"
  },
  "entities": [
    {
      "name": "<entity name as it appears in text>",
      "type": "<Pessoa | Organização | Local | Produto | Evento | Outro>",
      "relevance": "<Alta | Média | Baixa>"
    }
  ],
  "summary": "<concise 2-4 sentence summary ALWAYS in Brazilian Portuguese>",
  "insights": ["<3-5 observations in Brazilian Portuguese, non-obvious, relevant>"],
  "humanizedText": "<full rewrite in the SAME language as input with more natural, fluid tone>"
}

Rules:
- entities may be empty array if no clear entities exist
- insights must have exactly 3-5 items
- humanizedText must be in the SAME language as the input text
- summary and insights are ALWAYS in Brazilian Portuguese regardless of input language
- Return ONLY the JSON object, nothing else

Text to analyze:
`

function stripMarkdownFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim()
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<AnalysisResult | AnalysisApiError>> {
  const body = (await req.json()) as { text?: string }
  const { text } = body

  if (!text || text.trim().length === 0) {
    return NextResponse.json({ error: 'EMPTY_TEXT' }, { status: 400 })
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json({ error: 'TEXT_TOO_LONG' }, { status: 400 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'MISSING_API_KEY' }, { status: 500 })
  }

  let raw: string
  try {
    const ai = new GoogleGenAI({ apiKey })
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: PROMPT_TEMPLATE + text,
    })
    raw = (response.text ?? '').trim()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[analyze-text] Gemini API error:', message)
    if (message.includes('429') || message.includes('RESOURCE_EXHAUSTED')) {
      return NextResponse.json({ error: 'QUOTA_EXCEEDED' }, { status: 429 })
    }
    return NextResponse.json({ error: 'GEMINI_API_ERROR', detail: message }, { status: 502 })
  }

  try {
    const parsed = JSON.parse(stripMarkdownFences(raw)) as AnalysisResult
    return NextResponse.json(parsed)
  } catch (err) {
    console.error('[analyze-text] JSON parse error. Raw:', raw, err)
    return NextResponse.json({ error: 'GEMINI_PARSE_ERROR' }, { status: 500 })
  }
}
