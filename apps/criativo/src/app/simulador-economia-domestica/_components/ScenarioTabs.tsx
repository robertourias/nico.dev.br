"use client"

import { Feather, Gauge, Flame } from "lucide-react"
import { SCENARIO_CONFIG, type ScenarioKey } from "../_lib/calculations"

interface ScenarioTabsProps {
  value: ScenarioKey
  onChange: (scenario: ScenarioKey) => void
}

const SCENARIO_ICONS: Record<ScenarioKey, typeof Feather> = {
  conservador: Feather,
  moderado: Gauge,
  agressivo: Flame,
}

// Abas de cenário: trocam a taxa de redução aplicada a delivery, café,
// transporte e assinaturas no cálculo (ver _lib/calculations.ts). O slider de
// energia permanece sob controle direto do usuário, fora deste seletor.
export function ScenarioTabs({ value, onChange }: ScenarioTabsProps) {
  return (
    <div role="tablist" aria-label="Cenário de economia" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {(Object.keys(SCENARIO_CONFIG) as ScenarioKey[]).map((key) => {
        const config = SCENARIO_CONFIG[key]
        const active = value === key
        const Icon = SCENARIO_ICONS[key]

        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active}
            data-active={active}
            onClick={() => onChange(key)}
            className="economia-tab relative text-left px-4 py-3.5 overflow-hidden"
          >
            <span className="economia-tab-bg" aria-hidden="true" />
            <span className="relative flex items-center gap-2 mb-1">
              <Icon
                className="size-4"
                style={{ color: active ? "var(--color-primary)" : "var(--color-muted-foreground)" }}
                aria-hidden="true"
              />
              <span className={`text-sm font-semibold ${active ? "text-primary" : "text-foreground"}`}>
                {config.label}
              </span>
            </span>
            <span className="relative block text-xs text-muted-foreground leading-snug">
              {config.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}
