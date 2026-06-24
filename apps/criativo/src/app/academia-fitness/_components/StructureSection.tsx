"use client"

import { useEffect, useState } from "react"
import { Dumbbell, HeartPulse, Zap, Bike, StretchHorizontal, ShowerHead, X, Maximize2 } from "lucide-react"
import { Reveal } from "./Reveal"
import { STRUCTURE_AREAS, type AreaIcon } from "../_lib/data"

const ICONS: Record<AreaIcon, typeof Dumbbell> = {
  musculacao: Dumbbell,
  cardio: HeartPulse,
  funcional: Zap,
  spinning: Bike,
  alongamento: StretchHorizontal,
  vestiario: ShowerHead,
}

const GRADIENTS = [
  "linear-gradient(135deg, rgba(163,255,18,0.35), rgba(10,10,10,0.9))",
  "linear-gradient(135deg, rgba(30,144,255,0.35), rgba(10,10,10,0.9))",
  "linear-gradient(135deg, rgba(163,255,18,0.25), rgba(30,144,255,0.25))",
  "linear-gradient(135deg, rgba(30,144,255,0.3), rgba(163,255,18,0.2))",
  "linear-gradient(135deg, rgba(163,255,18,0.2), rgba(10,10,10,0.92))",
  "linear-gradient(135deg, rgba(30,144,255,0.22), rgba(10,10,10,0.92))",
]

export function StructureSection() {
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    if (active === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [active])

  const activeArea = active !== null ? STRUCTURE_AREAS[active] : null
  const ActiveIcon = activeArea ? ICONS[activeArea.icon] : null

  return (
    <section id="estrutura" className="px-6 py-20 md:py-28 scroll-mt-20 bg-[var(--color-surface)]" aria-labelledby="structure-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14 max-w-2xl mx-auto">
          <h2 id="structure-title" className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Nossa <span className="aca-highlight">Estrutura</span>
          </h2>
          <p className="text-muted-foreground text-lg aca-heading-alt">
            Ambientes pensados para cada etapa do seu treino, do aquecimento à recuperação.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STRUCTURE_AREAS.map((area, index) => {
            const Icon = ICONS[area.icon]
            return (
              <Reveal key={area.title} delayMs={index * 60}>
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  className="aca-area-card w-full text-left rounded-2xl border border-border overflow-hidden h-64 relative"
                >
                  <div
                    className="aca-area-media absolute inset-0"
                    style={{ backgroundImage: GRADIENTS[index % GRADIENTS.length] }}
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                    <Icon className="size-16 text-white/25" />
                  </div>
                  <div className="aca-area-overlay absolute inset-0 bg-black/55 flex items-center justify-center">
                    <Maximize2 className="size-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="font-semibold text-white aca-heading-alt text-lg">{area.title}</p>
                    <p className="text-xs text-white/70">{area.size}</p>
                  </div>
                </button>
              </Reveal>
            )
          })}
        </div>
      </div>

      {activeArea && ActiveIcon && (
        <div
          className="aca-modal-overlay fixed inset-0 z-[60] bg-black/80 flex items-center justify-center px-6"
          role="dialog"
          aria-modal="true"
          aria-label={activeArea.title}
          onClick={() => setActive(null)}
        >
          <div
            className="aca-modal-panel relative w-full max-w-lg rounded-3xl border border-border bg-[var(--color-surface-raised)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="h-48 relative flex items-center justify-center"
              style={{ backgroundImage: GRADIENTS[active! % GRADIENTS.length] }}
            >
              <ActiveIcon className="size-16 text-white/40" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Fechar"
                className="absolute top-4 right-4 inline-flex items-center justify-center size-9 rounded-full bg-black/40 text-white"
              >
                <X className="size-4.5" />
              </button>
            </div>
            <div className="p-7">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold text-xl text-foreground aca-heading-alt">{activeArea.title}</p>
                <span className="text-xs font-semibold text-[var(--color-primary)]">{activeArea.size}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{activeArea.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
