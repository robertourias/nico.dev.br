'use client'

import { useState } from 'react'
import { Button } from '@ui'
import { Download, Check } from 'lucide-react'
import type { PaletteColor } from '../_types'

interface ExportSectionProps {
  colors: PaletteColor[]
  onCopyToClipboard: (text: string) => void
}

function generateCSS(colors: PaletteColor[]): string {
  const vars = colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')
  return `:root {\n${vars}\n}`
}

function generateSCSS(colors: PaletteColor[]): string {
  const pairs = colors.map((c, i) => `  'color-${i + 1}': ${c.hex}`).join(',\n')
  return `$colors: (\n${pairs}\n);`
}

function generateJSON(colors: PaletteColor[]): string {
  return JSON.stringify(
    {
      colors: colors.map((c, i) => ({
        id: `color-${i + 1}`,
        hex: c.hex,
        name: c.name,
        rgb: `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`,
        hsl: `hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%)`,
      })),
    },
    null,
    2
  )
}

function generateTailwind(colors: PaletteColor[]): string {
  const pairs = colors.map((c, i) => `      'palette-${i + 1}': '${c.hex}'`).join(',\n')
  return `colors: {\n${pairs}\n}`
}

type ExportFormat = 'css' | 'scss' | 'json' | 'tailwind'

export function ExportSection({ colors, onCopyToClipboard }: ExportSectionProps) {
  const [copied, setCopied] = useState<ExportFormat | null>(null)

  const exports: Array<{ format: ExportFormat; label: string; generator: () => string }> = [
    { format: 'css', label: 'CSS', generator: () => generateCSS(colors) },
    { format: 'scss', label: 'SCSS', generator: () => generateSCSS(colors) },
    { format: 'json', label: 'JSON', generator: () => generateJSON(colors) },
    { format: 'tailwind', label: 'Tailwind', generator: () => generateTailwind(colors) },
  ]

  async function handleExport(format: ExportFormat) {
    const generator = exports.find((e) => e.format === format)?.generator
    if (!generator) return

    const text = generator()
    onCopyToClipboard(text)
    setCopied(format)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium">Exportar Paleta</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {exports.map(({ format, label }) => (
          <Button
            key={format}
            onClick={() => handleExport(format)}
            variant={copied === format ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            {copied === format ? (
              <>
                <Check className="w-4 h-4" />
                Copiado
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                {label}
              </>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}
