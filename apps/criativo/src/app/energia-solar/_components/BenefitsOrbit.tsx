"use client"

import { Sun, TrendingUp, Home as HomeIcon, Leaf, Shield, Wrench, ShieldCheck, type LucideIcon } from "lucide-react"
import { BENEFITS } from "../_lib/data"
import { Reveal } from "./Reveal"

const BENEFIT_ICONS: Record<string, LucideIcon> = {
  economia: TrendingUp,
  valorizacao: HomeIcon,
  sustentabilidade: Leaf,
  autonomia: Shield,
  manutencao: Wrench,
  protecao: ShieldCheck,
}

const RADIUS = 168

// Benefícios "em órbita": cada item anima o próprio ângulo (CSS, 38s, via
// custom property `--orbit-angle` injetada por item), girando ao redor do
// centro; `.solar-orbit-item` aplica a rotação inversa simultaneamente para
// que o ícone/texto permaneça sempre na vertical (técnica de "satellite
// orbit" só com CSS, sem libs de animação — sem depender de um container
// pai girando, o que evitava conflitos de especificidade com `transform`).
export function BenefitsOrbit() {
  const total = BENEFITS.length

  return (
    <section className="px-6 py-16 md:py-24 scroll-mt-20 overflow-hidden" aria-labelledby="benefits-title">
      <div className="max-w-3xl mx-auto text-center mb-4">
        <Reveal>
          <p className="text-sm font-semibold mb-2" style={{ color: "var(--solar-blue-light)" }}>
            Benefícios inteligentes
          </p>
          <h2 id="benefits-title" className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Tudo que a <span className="solar-gradient-text">energia solar</span> coloca a seu favor
          </h2>
        </Reveal>
      </div>

      <Reveal variant="scale-in">
        <div
          className="relative mx-auto"
          style={{ width: RADIUS * 2 + 140, height: RADIUS * 2 + 140, maxWidth: "100%" }}
        >
          <div
            className="absolute inset-0 m-auto rounded-full"
            style={{
              width: RADIUS * 1.05,
              height: RADIUS * 1.05,
              border: "1px dashed var(--color-border)",
            }}
          />

          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full solar-glow-sun text-center px-4 z-10"
            style={{
              width: 132,
              height: 132,
              backgroundImage: "var(--solar-gradient-sun)",
            }}
          >
            <div className="flex flex-col items-center gap-1 text-[#0a1f2e]">
              <Sun className="size-7" aria-hidden="true" />
              <span className="text-sm font-bold leading-tight">Energia
                <br />
                Solar</span>
            </div>
          </div>

          <div className="absolute inset-0">
            {BENEFITS.map((benefit, index) => {
              const angle = (360 / total) * index
              const Icon = BENEFIT_ICONS[benefit.key] ?? Sun
              // Cards na metade superior do círculo abrem o tooltip para
              // cima (em vez do padrão "abaixo"), senão o texto nasce em
              // direção ao centro e fica atrás do sol.
              const isTopHalf = Math.sin((angle * Math.PI) / 180) < -0.3
              return (
                <div
                  key={benefit.key}
                  className="solar-orbit-item-wrap absolute left-1/2 top-1/2"
                  style={
                    {
                      "--orbit-angle": `${angle}deg`,
                      "--orbit-radius": `${RADIUS}px`,
                    } as React.CSSProperties
                  }
                >
                  <div className="solar-orbit-item group relative">
                    <div
                      tabIndex={0}
                      className="solar-card-hover flex flex-col items-center justify-center gap-1 size-20 rounded-2xl bg-[var(--color-surface-raised)] border border-border text-center px-2 cursor-default"
                    >
                      <Icon className="size-5" style={{ color: "var(--solar-blue-light)" }} aria-hidden="true" />
                      <span className="text-[0.65rem] font-semibold text-foreground leading-tight">{benefit.label}</span>
                    </div>

                    <div
                      className={`absolute left-1/2 -translate-x-1/2 ${isTopHalf ? "bottom-[calc(100%+0.5rem)]" : "top-[calc(100%+0.5rem)]"} w-44 rounded-xl solar-glass p-3 text-xs text-foreground opacity-0 scale-95 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 group-focus-within:scale-100 z-20`}
                    >
                      {benefit.description}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
