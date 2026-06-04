"use client"

import { Input, FormGroup, cn } from "@ui"
import type { Mode, PeriodUnit, RateUnit } from "@/lib/compound-interest"

interface FormState {
  mode: Mode
  principal: string
  monthlyContribution: string
  rate: string
  rateUnit: RateUnit
  period: string
  periodUnit: PeriodUnit
}

interface InputFormProps {
  state: FormState
  onChange: <K extends keyof FormState>(field: K, value: FormState[K]) => void
}

// ─── Currency mask ────────────────────────────────────────────────────────────

function applyCurrencyMask(raw: string): string {
  const digits = raw.replace(/\D/g, "")
  if (!digits) return ""
  const number = parseInt(digits, 10) / 100
  return number.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// ─── InputForm ────────────────────────────────────────────────────────────────

export function InputForm({ state, onChange }: InputFormProps) {
  return (
    <div className="space-y-6">
      {/* Mode selector — same pill style as UnitToggle */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">Modo de simulação</p>
        <UnitToggle
          options={[
            { value: "fixed", label: "Valor fixo" },
            { value: "contributions", label: "Com aportes mensais" },
          ]}
          value={state.mode}
          onChange={(v) => onChange("mode", v as Mode)}
          fullWidth
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormGroup label="Capital inicial" htmlFor="principal" hint="Valor investido no início">
          <CurrencyInput
            id="principal"
            value={state.principal}
            onChange={(v) => onChange("principal", v)}
          />
        </FormGroup>

        {state.mode === "contributions" && (
          <FormGroup label="Aporte mensal" htmlFor="monthly-contribution" hint="Valor depositado todo mês">
            <CurrencyInput
              id="monthly-contribution"
              value={state.monthlyContribution}
              onChange={(v) => onChange("monthlyContribution", v)}
            />
          </FormGroup>
        )}

        <FormGroup label="Taxa de juros" htmlFor="rate">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="rate"
                type="text"
                inputMode="decimal"
                placeholder="1,00"
                value={state.rate}
                onChange={(e) => onChange("rate", e.target.value)}
                className="pr-8 h-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none select-none">
                %
              </span>
            </div>
            <UnitToggle
              options={[
                { value: "monthly", label: "Mensal" },
                { value: "annual", label: "Anual" },
              ]}
              value={state.rateUnit}
              onChange={(v) => onChange("rateUnit", v as RateUnit)}
            />
          </div>
        </FormGroup>

        <FormGroup label="Período" htmlFor="period">
          <div className="flex gap-2">
            <Input
              id="period"
              type="text"
              inputMode="decimal"
              placeholder="12"
              value={state.period}
              onChange={(e) => onChange("period", e.target.value)}
              className="flex-1 h-10"
            />
            <UnitToggle
              options={[
                { value: "months", label: "Meses" },
                { value: "years", label: "Anos" },
              ]}
              value={state.periodUnit}
              onChange={(v) => onChange("periodUnit", v as PeriodUnit)}
            />
          </div>
        </FormGroup>
      </div>
    </div>
  )
}

// ─── CurrencyInput ────────────────────────────────────────────────────────────

interface CurrencyInputProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function CurrencyInput({ id, value, onChange, placeholder = "0,00" }: CurrencyInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(applyCurrencyMask(e.target.value))
  }

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none select-none">
        R$
      </span>
      <Input
        id={id}
        type="text"
        inputMode="decimal"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="pl-10 h-10"
      />
    </div>
  )
}

// ─── UnitToggle ───────────────────────────────────────────────────────────────

interface UnitToggleProps {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  fullWidth?: boolean
}

function UnitToggle({ options, value, onChange, fullWidth = false }: UnitToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-md border border-border overflow-hidden shrink-0",
        fullWidth && "w-full"
      )}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-3 h-10 text-sm font-medium transition-colors cursor-pointer select-none",
            fullWidth && "flex-1",
            value === opt.value
              ? "bg-primary text-primary-foreground"
              : "bg-background text-muted-foreground hover:bg-muted"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
