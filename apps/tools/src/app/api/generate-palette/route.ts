import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import type {
  GeneratePaletteRequest,
  GeneratePaletteResult,
  GeneratePaletteError,
  HarmonyType,
  PaletteColor,
} from '@/app/gerador-paleta/_types'

const VALID_HARMONY_TYPES: HarmonyType[] = ['analogous', 'triadic', 'split', 'monochromatic', 'ui']
const VALID_COUNTS = [3, 5, 7, 10] as const

function parseHexColor(color: string): string | null {
  const hex = color.trim().toLowerCase()
  if (/^#[0-9a-f]{6}$/.test(hex)) return hex
  if (/^#[0-9a-f]{3}$/.test(hex)) {
    return '#' + hex.slice(1).split('').map(c => c + c).join('')
  }
  return null
}

function parseRgbColor(color: string): string | null {
  const match = color.trim().match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/)
  if (!match) return null
  const r = parseInt(match[1], 10)
  const g = parseInt(match[2], 10)
  const b = parseInt(match[3], 10)
  if (r > 255 || g > 255 || b > 255) return null
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

function parseHslColor(color: string): string | null {
  const match = color.trim().match(/hsl\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/)
  if (!match) return null
  const h = parseInt(match[1], 10)
  const s = parseInt(match[2], 10)
  const l = parseInt(match[3], 10)
  if (h > 360 || s > 100 || l > 100) return null

  const c = ((100 - Math.abs(2 * l - 100)) / 100) * (s / 100)
  const hh = h / 60
  const x = c * (1 - Math.abs((hh % 2) - 1))
  let r1 = 0,
    g1 = 0,
    b1 = 0
  if (hh < 1) [r1, g1, b1] = [c, x, 0]
  else if (hh < 2) [r1, g1, b1] = [x, c, 0]
  else if (hh < 3) [r1, g1, b1] = [0, c, x]
  else if (hh < 4) [r1, g1, b1] = [0, x, c]
  else if (hh < 5) [r1, g1, b1] = [x, 0, c]
  else [r1, g1, b1] = [c, 0, x]

  const m = (l / 100) - c / 2
  const r = Math.round((r1 + m) * 255)
  const g = Math.round((g1 + m) * 255)
  const b = Math.round((b1 + m) * 255)
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

function normalizeColor(color: string): string | null {
  let hex = parseHexColor(color)
  if (hex) return hex
  hex = parseRgbColor(color)
  if (hex) return hex
  hex = parseHslColor(color)
  return hex
}

const PROMPT_TEMPLATE = `You are a color harmony expert. Generate a color palette with the following requirements:

- Base color (hex): {baseColor}
- Harmony type: {harmonyType}
- Number of colors: {count}

Return ONLY valid JSON (no markdown, no text outside JSON) matching exactly this schema:

{
  "colors": [
    {
      "hex": "#RRGGBB",
      "rgb": { "r": <0-255>, "g": <0-255>, "b": <0-255> },
      "hsl": { "h": <0-360>, "s": <0-100>, "l": <0-100> },
      "name": "<color name in English>"
    }
  ]
}

Rules:
- Return exactly {count} colors
- All hex values must be valid #RRGGBB format
- RGB values must be 0-255
- HSL: h is 0-360, s and l are 0-100
- Colors must be harmonic according to the harmony type:
  * analogous: colors adjacent on color wheel
  * triadic: three colors evenly spaced (120° apart)
  * split: base + two colors 150° away (split-complementary)
  * monochromatic: shades and tints of base color
  * ui: base (primary), complementary (secondary), lighter/darker variants (accents)
- Return ONLY the JSON object, nothing else`

function stripMarkdownFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim()
}

interface GeminiColorResponse {
  colors: PaletteColor[]
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<GeneratePaletteResult | GeneratePaletteError>> {
  const body = (await req.json()) as GeneratePaletteRequest

  const { baseColor, harmonyType, count } = body

  if (!baseColor || typeof baseColor !== 'string') {
    return NextResponse.json({ error: 'INVALID_COLOR' }, { status: 400 })
  }

  const normalizedColor = normalizeColor(baseColor)
  if (!normalizedColor) {
    return NextResponse.json({ error: 'INVALID_COLOR' }, { status: 400 })
  }

  if (!harmonyType || !VALID_HARMONY_TYPES.includes(harmonyType)) {
    return NextResponse.json({ error: 'INVALID_HARMONY' }, { status: 400 })
  }

  if (!count || !VALID_COUNTS.includes(count)) {
    return NextResponse.json({ error: 'INVALID_COUNT' }, { status: 400 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'MISSING_API_KEY' }, { status: 500 })
  }

  let raw: string
  try {
    const ai = new GoogleGenAI({ apiKey })
    const prompt = PROMPT_TEMPLATE.replace('{baseColor}', normalizedColor)
      .replace('{harmonyType}', harmonyType)
      .replace(/{count}/g, String(count))

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    })
    raw = (response.text ?? '').trim()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[generate-palette] Gemini API error:', message)
    if (message.includes('429') || message.includes('RESOURCE_EXHAUSTED')) {
      return NextResponse.json({ error: 'QUOTA_EXCEEDED' }, { status: 429 })
    }
    return NextResponse.json(
      { error: 'GEMINI_API_ERROR', detail: message },
      { status: 502 }
    )
  }

  try {
    const parsed = JSON.parse(stripMarkdownFences(raw)) as GeminiColorResponse
    if (!Array.isArray(parsed.colors) || parsed.colors.length !== count) {
      throw new Error('Invalid colors array')
    }

    for (const color of parsed.colors) {
      if (!color.hex || !/^#[0-9a-f]{6}$/i.test(color.hex)) {
        throw new Error(`Invalid hex: ${color.hex}`)
      }
      if (!color.rgb || typeof color.rgb.r !== 'number') {
        throw new Error('Invalid RGB')
      }
      if (!color.hsl || typeof color.hsl.h !== 'number') {
        throw new Error('Invalid HSL')
      }
    }

    const result: GeneratePaletteResult = {
      baseColor: normalizedColor,
      harmonyType,
      colors: parsed.colors,
    }
    return NextResponse.json(result)
  } catch (err) {
    console.error('[generate-palette] JSON parse error. Raw:', raw, err)
    return NextResponse.json({ error: 'GEMINI_PARSE_ERROR' }, { status: 500 })
  }
}
