"use client"

import { Minus, Plus } from "lucide-react"
import { clamp } from "../_lib/calculations"

interface SimulatorFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  /** Sufixo curto exibido após o valor (ex.: "kWh/mês"). */
  unit?: string
  /** Quando "currency", mostra prefixo "R$". */
  variant?: "currency" | "count"
}

// Campo numérico com steppers -/+, padrão consistente com os demais
// simuladores do projeto. Evita o spinner nativo do navegador (removido via
// `.solar-input` em theme.css) para um visual uniforme entre navegadores.
export function SimulatorField({
  label,
  value,
  onChange,
  min = 0,
  max = 999999,
  step = 1,
  unit,
  variant = "count",
}: SimulatorFieldProps) {
  const update = (next: number) => onChange(clamp(Math.round(next), min, max))

  return (
    <div>
      <label className="flex items-center justify-between text-sm font-medium text-foreground mb-2">
        {label}
        {unit ? <span className="text-xs font-normal text-muted-foreground">{unit}</span> : null}
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Diminuir ${label}`}
          className="solar-stepper-btn shrink-0"
          onClick={() => update(value - step)}
          disabled={value <= min}
        >
          <Minus className="size-3.5" aria-hidden="true" />
        </button>

        <div className="relative flex-1">
          {variant === "currency" && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
          )}
          <input
            type="number"
            inputMode="decimal"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              const parsed = Number(e.target.value)
              if (!Number.isNaN(parsed)) update(parsed)
            }}
            className={`solar-input w-full rounded-lg border border-input bg-[var(--color-surface-raised)] px-3 py-2 text-sm text-foreground text-center focus:outline-none focus:ring-2 focus:ring-ring ${
              variant === "currency" ? "pl-8" : ""
            }`}
          />
        </div>

        <button
          type="button"
          aria-label={`Aumentar ${label}`}
          className="solar-stepper-btn shrink-0"
          onClick={() => update(value + step)}
          disabled={value >= max}
        >
          <Plus className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
