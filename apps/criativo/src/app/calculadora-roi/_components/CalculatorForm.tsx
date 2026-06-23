"use client"

import { Calculator } from "lucide-react"
import { CurrencyField } from "./CurrencyField"
import { GrowthSlider } from "./GrowthSlider"
import { HorizonSelect } from "./HorizonSelect"
import type { RoiInputs } from "../_lib/calculations"

interface CalculatorFormProps {
  inputs: RoiInputs
  errors: Partial<Record<keyof RoiInputs, string>>
  onChange: (patch: Partial<RoiInputs>) => void
  onSubmit: () => void
}

// Coluna esquerda da calculadora: entradas do usuário. O cálculo já é
// recalculado em tempo real a cada alteração (ver RoiCalculator), mas o
// botão "Calcular Resultado" reforça a ação esperada pelo briefing, valida
// os campos obrigatórios e leva o foco/scroll até os resultados — útil
// sobretudo no layout mobile, onde resultado e formulário não ficam lado a
// lado.
export function CalculatorForm({ inputs, errors, onChange, onSubmit }: CalculatorFormProps) {
  return (
    <form
      className="rounded-2xl border border-border bg-[var(--color-surface-raised)] p-5 md:p-7 flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <div>
        <p className="font-semibold text-foreground text-sm mb-1">Dados da simulação</p>
        <p className="text-xs text-muted-foreground">
          Preencha com os números do seu negócio (ou use um exemplo pronto abaixo).
        </p>
      </div>

      <CurrencyField
        label="Investimento Inicial"
        placeholder="5.000"
        value={inputs.investimentoInicial}
        onChange={(v) => onChange({ investimentoInicial: v })}
        error={errors.investimentoInicial}
      />

      <CurrencyField
        label="Receita Mensal Atual"
        placeholder="20.000"
        value={inputs.receitaMensalAtual}
        onChange={(v) => onChange({ receitaMensalAtual: v })}
        error={errors.receitaMensalAtual}
      />

      <GrowthSlider value={inputs.crescimentoEsperado} onChange={(v) => onChange({ crescimentoEsperado: v })} />

      <CurrencyField
        label="Economia Mensal Gerada"
        placeholder="1.500"
        value={inputs.economiaMensalGerada}
        onChange={(v) => onChange({ economiaMensalGerada: v })}
        error={errors.economiaMensalGerada}
      />

      <HorizonSelect value={inputs.horizonteMeses} onChange={(v) => onChange({ horizonteMeses: v })} />

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-white text-sm roi-glow transition-transform hover:scale-[1.02] active:scale-[0.98] mt-1"
        style={{ backgroundImage: "var(--roi-gradient-primary)" }}
      >
        <Calculator className="size-4" aria-hidden="true" />
        Calcular Resultado
      </button>
    </form>
  )
}
