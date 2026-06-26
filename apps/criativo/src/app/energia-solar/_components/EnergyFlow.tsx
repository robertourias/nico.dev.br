"use client"

import { useState, type LucideIcon } from "react"
import { Sun, Grid2x2, Zap, Home, Share2, TrendingDown } from "lucide-react"
import { ENERGY_FLOW_STEPS } from "../_lib/data"
import { Reveal } from "./Reveal"

const STEP_ICONS: Record<string, LucideIcon> = {
  sol: Sun,
  paineis: Grid2x2,
  inversor: Zap,
  casa: Home,
  rede: Share2,
  economia: TrendingDown,
}

// Seção 100% visual conectando sol → painéis → inversor → casa → rede →
// economia. Em vez de depender só de :hover (ruim em telas touch), o clique
// em cada nó também alterna o card explicativo — o hover apenas antecipa a
// expansão em telas com mouse.
export function EnergyFlow() {
  const [active, setActive] = useState<string>(ENERGY_FLOW_STEPS[0].key)
  const activeStep = ENERGY_FLOW_STEPS.find((s) => s.key === active) ?? ENERGY_FLOW_STEPS[0]

  return (
    <section className="px-6 py-16 md:py-24 scroll-mt-20" aria-labelledby="energy-flow-title">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-14">
          <p className="text-sm font-semibold mb-2" style={{ color: "var(--solar-blue-light)" }}>
            Fluxo de energia
          </p>
          <h2 id="energy-flow-title" className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Do <span className="solar-text-sun">sol</span> até a{" "}
            <span className="solar-gradient-text">economia na sua conta</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Passe o mouse ou toque em cada etapa para entender o caminho da energia.
          </p>
        </Reveal>

        <Reveal variant="scale-in">
          <div className="relative">
            <div
              className="hidden md:block absolute top-8 left-10 right-10 h-px"
              style={{ background: "var(--color-border)" }}
            >
              <div
                className="solar-flow-dash absolute inset-0 h-full"
                style={{ borderTop: "2px dashed var(--solar-blue-light)" }}
              />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 md:gap-2">
              {ENERGY_FLOW_STEPS.map((step) => {
                const Icon = STEP_ICONS[step.key] ?? Sun
                const isActive = active === step.key
                return (
                  <button
                    key={step.key}
                    type="button"
                    onMouseEnter={() => setActive(step.key)}
                    onClick={() => setActive(step.key)}
                    aria-pressed={isActive}
                    className="relative z-10 flex flex-col items-center gap-2 group focus:outline-none"
                  >
                    <span
                      className={`solar-card-hover inline-flex items-center justify-center size-16 rounded-2xl transition-all ${
                        isActive ? "solar-glow-sun scale-110" : "solar-glass"
                      }`}
                      style={
                        isActive
                          ? { backgroundImage: "var(--solar-gradient-sun)", color: "#0a1f2e" }
                          : { color: "var(--solar-blue)" }
                      }
                    >
                      <Icon className="size-7" aria-hidden="true" />
                    </span>
                    <span className={`text-xs font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div
            key={activeStep.key}
            className="solar-accordion-content solar-glass rounded-2xl p-6 md:p-7 mt-10 max-w-xl mx-auto text-center"
          >
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--solar-blue-light)" }}>
              {activeStep.label}
            </p>
            <p className="text-foreground">{activeStep.description}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
