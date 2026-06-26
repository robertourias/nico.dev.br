"use client"

import { useEffect, useMemo, useState } from "react"
import { DEFAULT_INPUTS, STORAGE_KEY, calculateSimulation, type SimulatorInputs } from "../_lib/calculations"
import { Reveal } from "./Reveal"
import { SimulatorForm } from "./SimulatorForm"
import { ResultsDashboard } from "./ResultsDashboard"
import { GrowthChart } from "./GrowthChart"

// Orquestrador do simulador inteligente: dono único do estado dos inputs,
// persiste em localStorage (sem backend) e deriva o resultado via
// _lib/calculations a cada alteração — layout dividido (form à esquerda,
// dashboard à direita) conforme briefing.
export function SimulatorSection() {
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

  const updateInputs = (patch: Partial<SimulatorInputs>) => setInputs((current) => ({ ...current, ...patch }))

  return (
    <section id="simulador" className="relative px-6 py-16 md:py-24 scroll-mt-20" aria-labelledby="simulator-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-12">
          <p className="text-sm font-semibold mb-2" style={{ color: "var(--solar-blue-light)" }}>
            Simulador inteligente
          </p>
          <h2 id="simulator-title" className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Veja sua economia <span className="solar-gradient-text">em tempo real</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Ajuste os campos abaixo e acompanhe o impacto na sua conta, no meio ambiente e no seu bolso.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-8 lg:gap-10 items-start">
          <Reveal variant="slide-right">
            <SimulatorForm inputs={inputs} onChange={updateInputs} />
          </Reveal>

          <Reveal variant="slide-left" className="flex flex-col gap-6">
            <ResultsDashboard result={result} />
          </Reveal>
        </div>

        <Reveal className="mt-8">
          <div className="rounded-2xl border border-border bg-[var(--color-surface-raised)] p-5 md:p-6">
            <p className="font-semibold text-foreground text-sm mb-1">Economia acumulada em 12 meses</p>
            <p className="text-xs text-muted-foreground mb-4">
              Projeção simples (sem reinvestimento), somando a economia mensal mês a mês.
            </p>
            <GrowthChart series={result.monthlySeries} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
