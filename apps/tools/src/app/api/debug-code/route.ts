import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import type { DebugResult, DebugApiError } from '@/app/debug-code/_types';

const MAX_CODE_LENGTH = 10_000;

const PROMPT_TEMPLATE = `You are a code debugger. Analyze the following code for syntax errors, runtime errors, logic issues, and style problems.

Return ONLY valid JSON (no markdown fences, no text outside JSON) matching exactly this schema:
{
  "language": "<detected language, lowercase>",
  "correctedCode": "<full corrected code>",
  "errors": [
    {
      "line": <number | null>,
      "type": "<SyntaxError | RuntimeError | LogicError | StyleWarning>",
      "message": "<descrição clara do problema em Português do Brasil>",
      "fix": "<o que foi feito para corrigir, em Português do Brasil>"
    }
  ]
}

If no errors found, return errors as empty array and correctedCode equal to the original code.
The "message" and "fix" fields MUST be written in Brazilian Portuguese (pt-BR).

Code:
`;

function stripMarkdownFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<DebugResult | DebugApiError>> {
  const body = await req.json() as { code?: string };
  const { code } = body;

  if (!code || code.length > MAX_CODE_LENGTH) {
    return NextResponse.json({ error: 'CODE_TOO_LONG' }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'MISSING_API_KEY' }, { status: 500 });
  }

  let raw: string;
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: PROMPT_TEMPLATE + code,
    });
    raw = (response.text ?? '').trim();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[debug-code] Gemini API error:', message);
    if (message.includes('429') || message.includes('RESOURCE_EXHAUSTED')) {
      return NextResponse.json({ error: 'QUOTA_EXCEEDED' }, { status: 429 });
    }
    return NextResponse.json(
      { error: 'GEMINI_API_ERROR', detail: message },
      { status: 502 }
    );
  }

  try {
    const cleaned = stripMarkdownFences(raw);
    const parsed = JSON.parse(cleaned) as DebugResult;
    return NextResponse.json(parsed);
  } catch (err) {
    console.error('[debug-code] JSON parse error. Raw response:', raw, err);
    return NextResponse.json({ error: 'GEMINI_PARSE_ERROR' }, { status: 500 });
  }
}
