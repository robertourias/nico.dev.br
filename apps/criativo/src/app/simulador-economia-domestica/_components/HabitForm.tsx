"use client"

import type { LucideIcon } from "lucide-react"
import { UtensilsCrossed, Coffee, Car, CreditCard, Zap } from "lucide-react"
import { HabitField } from "./HabitField"
import type { SimulatorInputs } from "../_lib/calculations"

interface HabitFormProps {
  inputs: SimulatorInputs
  onChange: (patch: Partial<SimulatorInputs>) => void
}

function HabitSection({
  icon: Icon,
  title,
  hint,
  children,
}: {
  icon: LucideIcon
  title: string
  hint: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-[var(--color-surface-raised)] p-5">
      <div className="flex items-start gap-3 mb-4">
        <span
          className="inline-flex items-center justify-center size-9 rounded-xl shrink-0"
          style={{ backgroundColor: "var(--color-surface-overlay)" }}
          aria-hidden="true"
        >
          <Icon className="size-4.5" style={{ color: "var(--color-primary)" }} />
        </span>
        <div>
          <p className="font-semibold text-foreground text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  )
}

// Formulário principal do simulador: cada categoria de hábito recebe uma
// frequência semanal/mensal e um valor médio, exceto energia (que usa um
// slider de % de economia direto, sem cenário). Estado controlado pelo
// componente pai (EconomySimulator), que também persiste em localStorage.
export function HabitForm({ inputs, onChange }: HabitFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <HabitSection icon={UtensilsCrossed} title="Delivery" hint="Pedidos de comida por app">
        <HabitField
          label="Pedidos"
          unit="x/semana"
          value={inputs.deliveryOrdersPerWeek}
          onChange={(v) => onChange({ deliveryOrdersPerWeek: v })}
          min={0}
          max={21}
        />
        <HabitField
          label="Valor médio"
          unit="por pedido"
          variant="currency"
          value={inputs.deliveryAvgValue}
          onChange={(v) => onChange({ deliveryAvgValue: v })}
          min={0}
          max={500}
          step={5}
        />
      </HabitSection>

      <HabitSection icon={Coffee} title="Café fora de casa" hint="Cafeterias e conveniências">
        <HabitField
          label="Cafés"
          unit="x/semana"
          value={inputs.coffeePerWeek}
          onChange={(v) => onChange({ coffeePerWeek: v })}
          min={0}
          max={21}
        />
        <HabitField
          label="Valor médio"
          unit="por café"
          variant="currency"
          value={inputs.coffeeAvgValue}
          onChange={(v) => onChange({ coffeeAvgValue: v })}
          min={0}
          max={100}
          step={1}
        />
      </HabitSection>

      <HabitSection icon={Car} title="Transporte por aplicativo" hint="Corridas em apps de mobilidade">
        <HabitField
          label="Corridas"
          unit="x/semana"
          value={inputs.ridesPerWeek}
          onChange={(v) => onChange({ ridesPerWeek: v })}
          min={0}
          max={21}
        />
        <HabitField
          label="Valor médio"
          unit="por corrida"
          variant="currency"
          value={inputs.rideAvgValue}
          onChange={(v) => onChange({ rideAvgValue: v })}
          min={0}
          max={200}
          step={1}
        />
      </HabitSection>

      <HabitSection icon={CreditCard} title="Assinaturas" hint="Streaming, apps e clubes">
        <HabitField
          label="Quantidade"
          unit="assinaturas"
          value={inputs.subscriptionsCount}
          onChange={(v) => onChange({ subscriptionsCount: v })}
          min={0}
          max={30}
        />
        <HabitField
          label="Valor médio"
          unit="por mês"
          variant="currency"
          value={inputs.subscriptionsAvgValue}
          onChange={(v) => onChange({ subscriptionsAvgValue: v })}
          min={0}
          max={300}
          step={1}
        />
      </HabitSection>

      <div className="rounded-2xl border border-border bg-[var(--color-surface-raised)] p-5">
        <div className="flex items-start gap-3 mb-4">
          <span
            className="inline-flex items-center justify-center size-9 rounded-xl shrink-0"
            style={{ backgroundColor: "var(--color-surface-overlay)" }}
            aria-hidden="true"
          >
            <Zap className="size-4.5" style={{ color: "var(--color-primary)" }} />
          </span>
          <div>
            <p className="font-semibold text-foreground text-sm">Energia elétrica</p>
            <p className="text-xs text-muted-foreground">Conta de luz e economia estimada</p>
          </div>
        </div>

        <div className="mb-4">
          <HabitField
            label="Conta de energia"
            unit="por mês"
            variant="currency"
            value={inputs.energyBillMonthly}
            onChange={(v) => onChange({ energyBillMonthly: v })}
            min={0}
            max={2000}
            step={10}
          />
        </div>

        <label className="flex items-center justify-between text-sm font-medium text-foreground mb-2">
          Economia estimada
          <span className="text-xs font-normal text-muted-foreground tabular-nums">
            {inputs.energySavingsPct}%
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={30}
          step={1}
          value={inputs.energySavingsPct}
          onChange={(e) => onChange({ energySavingsPct: Number(e.target.value) })}
          className="economia-range"
          aria-label="Economia estimada de energia em percentual"
        />
        <div className="flex items-center justify-between text-[0.65rem] text-muted-foreground mt-1.5">
          <span>0%</span>
          <span>30%</span>
        </div>
      </div>
    </div>
  )
}
