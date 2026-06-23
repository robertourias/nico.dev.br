"use client"

import { useId } from "react"
import { parseDigitsToCurrency } from "../_lib/calculations"

interface CurrencyFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  placeholder?: string
  hint?: string
  /** Mensagem de erro exibida abaixo do campo (validação). */
  error?: string
}

// Input monetário com máscara brasileira simples: aceita apenas dígitos
// (interpretados como reais inteiros, sem centavos — alinhado aos exemplos
// do briefing, todos em valores redondos) e formata com separador de milhar
// a cada tecla digitada. Evita libs de máscara externas para manter o bundle
// leve, seguindo o mesmo critério das demais landings do projeto.
export function CurrencyField({ label, value, onChange, placeholder, hint, error }: CurrencyFieldProps) {
  const id = useId()
  const formatted = value > 0 ? value.toLocaleString("pt-BR", { maximumFractionDigits: 0 }) : ""

  return (
    <div>
      <label htmlFor={id} className="flex items-center justify-between text-sm font-medium text-foreground mb-2">
        {label}
        {hint ? <span className="text-xs font-normal text-muted-foreground">{hint}</span> : null}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
          R$
        </span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={formatted}
          placeholder={placeholder}
          onChange={(e) => onChange(parseDigitsToCurrency(e.target.value))}
          aria-invalid={Boolean(error)}
          className={`roi-input w-full rounded-xl border bg-[var(--color-surface-raised)] pl-10 pr-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
            error ? "border-destructive" : "border-input"
          }`}
        />
      </div>
      {error ? <p className="text-xs text-destructive mt-1.5">{error}</p> : null}
    </div>
  )
}
