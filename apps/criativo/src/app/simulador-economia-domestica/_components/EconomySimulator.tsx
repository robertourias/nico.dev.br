"use client"

import { useEffect, useMemo, useState } from "react"
import {
  DEFAULT_INPUTS,
  STORAGE_KEY,
  calculateSimulation,
  generateInsights,
  SCENARIO_CONFIG,
  type SimulatorInputs,
} from "../_lib/calculations"
import { Reveal } from "./Reveal"
import { ScenarioTabs } from "./ScenarioTabs"
import { HabitForm } from "./HabitForm"
import { ResultsDashboard } from "./ResultsDashboard"
import { BarComparisonChart } from "./BarComparisonChart"
import { GrowthChart } from "./GrowthChart"
import { ShareExportBar } from "./ShareExportBar"
import { InsightsSection } from "./InsightsSection"
import { GamificationSection } from "./GamificationSection"

// Orquestrador do simulador: dono único do estado dos inputs, persiste em
// localStorage (sem backend, conforme briefing) e deriva todo o resultado
// via _lib/calculations a cada alteração. Concentra também os trechos que
// dependem do resultado calculado (insights e gamificação), evitando duplicar
// o cálculo em componentes irmãos fora desta árvore de cliente.
export function EconomySimulator() {
  const [inputs, setInputs] = useState<SimulatorInputs>(DEFAULT_INPUTS)
  const [hydrated, setHydrated] = useState(false)

  // Carrega a simulação salva apenas no cliente, após a primeira renderização
  // (que usa os defaults), para nunca divergir do HTML gerado no servidor.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<SimulatorInputs>
        setInputs((current) => ({ ...current, ...parsed }))
      }
    } catch {
      // localStorage indisponível (modo privado, etc.) — segue com defaults.
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs))
    } catch {
      // Sem espaço/permissão de storage — a simulação continua funcionando
      // normalmente, apenas sem persistência entre sessões.
    }
  }, [inputs, hydrated])

  const result = useMemo(() => calculateSimulation(inputs), [inputs])
  const insights = useMemo(() => generateInsights(inputs), [inputs])

  const updateInputs = (patch: Partial<SimulatorInputs>) => setInputs((current) => ({ ...current, ...patch }))

  const handleReset = () => setInputs(DEFAULT_INPUTS)

  return (
    <>
      <section id="simulador" className="relative px-6 py-16 md:py-20 scroll-mt-20" aria-labelledby="simulator-title">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-10">
            <h2 id="simulator-title" className="text-3xl md:text-4xl font-bold mb-3">
              Simule sua <span className="economia-gradient-text">economia</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Ajuste seus hábitos abaixo e veja o impacto financeiro recalculado instantaneamente.
            </p>
          </Reveal>

          <Reveal variant="fade-up" className="mb-8">
            <ScenarioTabs value={inputs.scenario} onChange={(scenario) => updateInputs({ scenario })} />
          </Reveal>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 lg:gap-10 items-start">
            <Reveal variant="slide-right">
              <HabitForm inputs={inputs} onChange={updateInputs} />
            </Reveal>

            <Reveal variant="slide-left" className="lg:sticky lg:top-24 flex flex-col gap-6">
              <ResultsDashboard result={result} />
              <BarComparisonChart categories={result.categories} />
            </Reveal>
          </div>

          <Reveal className="mt-8">
            <div className="rounded-2xl border border-border bg-[var(--color-surface-raised)] p-5 md:p-6">
              <p className="font-semibold text-foreground text-sm mb-1">Economia acumulada em 12 meses</p>
              <p className="text-xs text-muted-foreground mb-4">
                Projeção simples (sem reinvestimento) somando a economia mensal mês a mês.
              </p>
              <GrowthChart series={result.monthlySeries} />
            </div>
          </Reveal>

          <Reveal className="mt-8">
            <ShareExportBar result={result} scenarioLabel={SCENARIO_CONFIG[inputs.scenario].label} onReset={handleReset} />
          </Reveal>
        </div>
      </section>

      <InsightsSection insights={insights} />
      <GamificationSection annualSavings={result.annualSavings} />
    </>
  )
}
