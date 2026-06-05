'use client'

import { Copy } from 'lucide-react'
import { Button } from '@ui'
import type { PaletteColor } from '../_types'

interface PaletteGridProps {
  colors: PaletteColor[]
  onCopyColor: (hex: string) => void
}

export function PaletteGrid({ colors, onCopyColor }: PaletteGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {colors.map((color) => (
        <div
          key={color.hex}
          className="flex flex-col rounded-lg border border-input overflow-hidden hover:shadow-md transition-shadow"
        >
          <div
            className="w-full h-32 border-b border-input"
            style={{ backgroundColor: color.hex }}
          />
          <div className="p-4 flex flex-col gap-3">
            <p className="font-semibold text-sm">{color.name}</p>

            <div className="flex flex-col gap-2 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Hex:</span>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded">{color.hex}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => onCopyColor(color.hex)}
                    title="Copiar hex"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">RGB:</span>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded">
                    {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => onCopyColor(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`)}
                    title="Copiar RGB"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">HSL:</span>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded">
                    {color.hsl.h}, {color.hsl.s}%, {color.hsl.l}%
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => onCopyColor(`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`)}
                    title="Copiar HSL"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
