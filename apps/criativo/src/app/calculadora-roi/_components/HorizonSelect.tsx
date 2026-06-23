"use client"

import { useId } from "react"
import { ChevronDown } from "lucide-react"
import { HORIZON_OPTIONS, type HorizonMonths } from "../_lib/calculations"

interface HorizonSelectProps {
  value: HorizonMonths
  onChange: (value: HorizonMonths) => void
}

export function HorizonSelect({ value, onChange }: HorizonSelectProps) {
  const id = useId()

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-2">
        Horizonte de Análise
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) as HorizonMonths)}
          className="w-full appearance-none rounded-xl border border-input bg-[var(--color-surface-raised)] px-4 py-3 pr-10 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
        >
          {HORIZON_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
