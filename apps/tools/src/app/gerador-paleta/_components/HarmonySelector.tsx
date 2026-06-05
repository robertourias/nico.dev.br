'use client'

import type { HarmonyType } from '../_types'

interface HarmonySelectorProps {
  value: HarmonyType
  onChange: (harmony: HarmonyType) => void
  disabled?: boolean
}

const HARMONIES: Array<{ type: HarmonyType; label: string; description: string }> = [
  {
    type: 'analogous',
    label: 'Análoga',
    description: 'Cores adjacentes no círculo cromático',
  },
  {
    type: 'triadic',
    label: 'Tríade',
    description: 'Três cores equidistantes',
  },
  {
    type: 'split',
    label: 'Dividida',
    description: 'Base + dois complementares',
  },
  {
    type: 'monochromatic',
    label: 'Monocromática',
    description: 'Tons e matizes da mesma cor',
  },
  {
    type: 'ui',
    label: 'UI App',
    description: 'Primária, secundária, acentos',
  },
]

export function HarmonySelector({
  value,
  onChange,
  disabled = false,
}: HarmonySelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium">Tipo de Harmonia</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {HARMONIES.map(({ type, label, description }) => (
          <label
            key={type}
            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
              value === type
                ? 'border-primary bg-primary/10'
                : 'border-input hover:border-primary/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input
              type="radio"
              name="harmony"
              value={type}
              checked={value === type}
              onChange={() => onChange(type)}
              disabled={disabled}
              className="mr-2 cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{label}</span>
              <span className="text-xs text-muted-foreground">{description}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
