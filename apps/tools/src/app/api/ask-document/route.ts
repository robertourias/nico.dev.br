import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import type { DocumentApiError } from '@/app/leitor-documentos/_types'
import {
  ACCEPTED_MIME_TYPES,
  MAX_FILE_SIZE,
  getMimeType,
  isTextFile,
} from '@/app/leitor-documentos/_types'

const QA_PROMPT_PREFIX = `You are a document assistant. Answer clearly and directly based solely on the document content provided. Be concise but complete. Respond in the SAME language as the question.\n\nQuestion: `

export async function POST(
  req: NextRequest
): Promise<NextResponse<{ answer: string } | DocumentApiError>> {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const question = (formData.get('question') as string | null)?.trim()

  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'EMPTY_FILE' }, { status: 400 })
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'FILE_TOO_LARGE' }, { status: 400 })
  }
  if (!question) {
    return NextResponse.json({ error: 'EMPTY_QUESTION' }, { status: 400 })
  }

  const mimeType = getMimeType(file)
  if (!ACCEPTED_MIME_TYPES.has(mimeType)) {
    return NextResponse.json({ error: 'UNSUPPORTED_FORMAT' }, { status: 400 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'MISSING_API_KEY' }, { status: 500 })
  }

  try {
    const ai = new GoogleGenAI({ apiKey })
    const promptText = `${QA_PROMPT_PREFIX}${question}`

    const parts = isTextFile(mimeType)
      ? [{ text: `${promptText}\n\nDocument content:\n${await file.text()}` }]
      : [
          {
            inlineData: {
              mimeType,
              data: Buffer.from(await file.arrayBuffer()).toString('base64'),
            },
          },
          { text: promptText },
        ]

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts }],
    })

    return NextResponse.json({ answer: (response.text ?? '').trim() })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[ask-document] Gemini error:', message)
    if (message.includes('429') || message.includes('RESOURCE_EXHAUSTED')) {
      return NextResponse.json({ error: 'QUOTA_EXCEEDED' }, { status: 429 })
    }
    return NextResponse.json({ error: 'GEMINI_API_ERROR', detail: message }, { status: 502 })
  }
}
