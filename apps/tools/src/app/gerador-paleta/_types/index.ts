export type HarmonyType = 'analogous' | 'triadic' | 'split' | 'monochromatic' | 'ui'

export interface RGB {
  r: number
  g: number
  b: number
}

export interface HSL {
  h: number
  s: number
  l: number
}

export interface PaletteColor {
  hex: string
  rgb: RGB
  hsl: HSL
  name: string
}

export interface GeneratePaletteRequest {
  baseColor: string
  harmonyType: HarmonyType
  count: 3 | 5 | 7 | 10
}

export interface GeneratePaletteResult {
  baseColor: string
  harmonyType: HarmonyType
  colors: PaletteColor[]
}

export interface GeneratePaletteError {
  error: 'INVALID_COLOR' | 'INVALID_HARMONY' | 'INVALID_COUNT' | 'QUOTA_EXCEEDED' | 'GEMINI_API_ERROR' | 'GEMINI_PARSE_ERROR' | 'MISSING_API_KEY'
  detail?: string
}
