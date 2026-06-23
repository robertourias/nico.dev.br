"use client"

import { Store, Megaphone, ShoppingCart } from "lucide-react"
import { EXAMPLE_PRESETS, type RoiInputs } from "../_lib/calculations"

const PRESET_ICONS: Record<string, typeof Store> = {
  "pequena-empresa": Store,
  agencia: Megaphone,
  ecommerce: ShoppingCart,
}

interface QuickExamplesProps {
  activePresetId: string | null
  onSelect: (presetId: string, inputs: RoiInputs) => void
}

// Cards de exemplos prontos (conforme briefing): ao clicar, preenchem a
// calculadora automaticamente com um cenário plausível para o tipo de
// negócio escolhido — útil para quem quer ver o resultado sem digitar nada.
export function QuickExamples({ activePresetId, onSelect }: QuickExamplesProps) {
  return (
    <div>
      <p className="text-center text-sm font-medium text-muted-foreground mb-4">
        Ou comece a partir de um exemplo pronto
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {EXAMPLE_PRESETS.map((preset) => {
          const Icon = PRESET_ICONS[preset.id]
          const active = activePresetId === preset.id

          return (
            <button
              key={preset.id}
              type="button"
              data-active={active}
              onClick={() => onSelect(preset.id, preset.inputs)}
              className="roi-example-card rounded-xl border border-border bg-[var(--color-surface-raised)] px-4 py-3.5 text-left flex items-center gap-3"
            >
              <span
                className="inline-flex items-center justify-center size-9 rounded-xl shrink-0"
                style={{ backgroundColor: "var(--color-surface-overlay)" }}
                aria-hidden="true"
              >
                <Icon className="size-4.5" style={{ color: "var(--color-primary)" }} />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{preset.label}</p>
                <p className="text-xs text-muted-foreground">{preset.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
