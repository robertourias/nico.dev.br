"use client"

import { useState, useTransition } from "react"
import { Loader2, PhoneCall, CheckCircle2 } from "lucide-react"
import { CITIES, PROPERTY_TYPES } from "../_lib/data"
import type { SimulatorInputs } from "../_lib/calculations"
import { submitLead } from "../_actions/submitLead"
import { SimulatorField } from "./SimulatorField"

interface SimulatorFormProps {
  inputs: SimulatorInputs
  onChange: (patch: Partial<SimulatorInputs>) => void
}

function formatPhoneBR(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11)
  if (digits.length === 0) return ""
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

// Formulário do simulador — todos os campos atualizam o resultado em tempo
// real (sem botão "calcular"), conforme briefing. O telefone é o único
// campo que dispara uma ação de servidor (submitLead), pois é o único dado
// de contato coletado nesta seção; os demais campos só alimentam o cálculo
// local feito em SimulatorSection.
export function SimulatorForm({ inputs, onChange }: SimulatorFormProps) {
  const [phoneDisplay, setPhoneDisplay] = useState(inputs.phone)
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmitPhone = () => {
    setStatus("idle")
    startTransition(async () => {
      const result = await submitLead({
        telefone: phoneDisplay,
        cidade: CITIES.find((c) => c.key === inputs.city)?.label,
        origem: "simulador-energia-solar",
      })
      if (result.status === "success") {
        setStatus("success")
      } else {
        setStatus("error")
        setErrorMessage(result.message)
      }
    })
  }

  return (
    <div className="rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6 md:p-7 flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--solar-blue-light)" }}>
          Simulador inteligente
        </p>
        <h3 className="text-xl font-bold text-foreground">Conte sobre sua conta de energia</h3>
        <p className="text-sm text-muted-foreground mt-1">
          O resultado ao lado é recalculado automaticamente, conforme você ajusta os campos.
        </p>
      </div>

      <SimulatorField
        label="Valor médio da conta"
        value={inputs.monthlyBill}
        onChange={(value) => onChange({ monthlyBill: value })}
        min={50}
        max={20000}
        step={25}
        variant="currency"
      />

      <div>
        <label className="block text-sm font-medium text-foreground mb-2" htmlFor="solar-property-type">
          Tipo do imóvel
        </label>
        <select
          id="solar-property-type"
          className="solar-select w-full rounded-lg border border-input bg-[var(--color-surface-raised)] px-3 py-2 text-sm text-foreground focus:outline-none"
          value={inputs.propertyType}
          onChange={(e) => onChange({ propertyType: e.target.value as SimulatorInputs["propertyType"] })}
        >
          {PROPERTY_TYPES.map((type) => (
            <option key={type.key} value={type.key}>
              {type.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground mt-1.5">
          {PROPERTY_TYPES.find((t) => t.key === inputs.propertyType)?.note}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2" htmlFor="solar-city">
          Cidade
        </label>
        <select
          id="solar-city"
          className="solar-select w-full rounded-lg border border-input bg-[var(--color-surface-raised)] px-3 py-2 text-sm text-foreground focus:outline-none"
          value={inputs.city}
          onChange={(e) => onChange({ city: e.target.value as SimulatorInputs["city"] })}
        >
          {CITIES.map((city) => (
            <option key={city.key} value={city.key}>
              {city.label}
            </option>
          ))}
        </select>
      </div>

      <SimulatorField
        label="Consumo mensal estimado"
        value={inputs.monthlyConsumptionKwh}
        onChange={(value) => onChange({ monthlyConsumptionKwh: value })}
        min={0}
        max={50000}
        step={10}
        unit="kWh/mês"
      />

      <div className="pt-2 border-t border-border">
        <label className="block text-sm font-medium text-foreground mb-2" htmlFor="solar-phone">
          Telefone para receber a proposta
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="solar-phone"
            type="tel"
            inputMode="tel"
            placeholder="(11) 99999-9999"
            value={phoneDisplay}
            onChange={(e) => {
              const formatted = formatPhoneBR(e.target.value)
              setPhoneDisplay(formatted)
              onChange({ phone: formatted })
            }}
            className="solar-input flex-1 rounded-lg border border-input bg-[var(--color-surface-raised)] px-3 py-2 text-sm text-foreground focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSubmitPhone}
            disabled={isPending || phoneDisplay.replace(/\D/g, "").length < 10}
            className="solar-ripple inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundImage: "var(--solar-gradient-primary)" }}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <PhoneCall className="size-4" aria-hidden="true" />
            )}
            Receber proposta
          </button>
        </div>

        {status === "success" && (
          <p className="flex items-center gap-1.5 text-sm text-[var(--solar-green)] mt-2">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Recebemos seu contato! Em breve falaremos com você.
          </p>
        )}
        {status === "error" && <p className="text-sm text-destructive mt-2">{errorMessage}</p>}
      </div>
    </div>
  )
}
