"use client"

import { useState } from "react"
import { View, X, Maximize2 } from "lucide-react"
import { TOUR_STOPS, PROPERTIES } from "../_lib/data"
import { PropertyVisual } from "./PropertyVisual"
import { Reveal } from "./Reveal"

export function VirtualTour() {
  const [activeStop, setActiveStop] = useState<string | null>(null)
  const activeProperty = activeStop ? PROPERTIES.find((p) => p.id === activeStop) : null

  return (
    <section id="tour" className="px-6 py-20 md:py-28 bg-[var(--color-surface-overlay)]">
      <div className="max-w-6xl mx-auto">
        <Reveal className="max-w-2xl mb-12">
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--imob-moss)" }}>
            Tour virtual
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Visite sem saber de casa</h2>
          <p className="text-muted-foreground">
            Explore imóveis selecionados em 360° antes de agendar sua visita presencial.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TOUR_STOPS.map((stop, index) => {
            const property = PROPERTIES.find((p) => p.id === stop.propertyId)
            if (!property) return null
            return (
              <Reveal key={stop.propertyId} delayMs={index * 80}>
                <div className="imob-card-hover rounded-2xl border border-border bg-[var(--color-surface-raised)] overflow-hidden">
                  <div className="relative h-44">
                    <PropertyVisual
                      category={property.category}
                      imageUrl={property.image}
                      imageAlt={property.name}
                      className="absolute inset-0"
                      iconClassName="size-9"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="imob-tour-ring inline-flex items-center justify-center size-12 rounded-full imob-glass">
                        <View className="size-5" style={{ color: "var(--color-foreground)" }} aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="font-semibold text-foreground mb-1">{property.name}</p>
                    <p className="text-xs text-muted-foreground mb-4">{stop.address}</p>
                    <button
                      type="button"
                      onClick={() => setActiveStop(property.id)}
                      className="imob-cta-highlight inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-[var(--color-primary-foreground)]"
                      style={{ backgroundImage: "var(--imob-gradient-primary)" }}
                    >
                      <Maximize2 className="size-4" aria-hidden="true" />
                      Iniciar Tour
                    </button>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>

      {activeProperty && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Tour virtual de ${activeProperty.name}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,24,39,0.78)] p-6"
          onClick={() => setActiveStop(null)}
        >
          <div
            className="imob-modal-panel relative w-full max-w-3xl rounded-3xl overflow-hidden bg-[var(--color-surface-raised)]"
            onClick={(event) => event.stopPropagation()}
          >
            <PropertyVisual
              category={activeProperty.category}
              imageUrl={activeProperty.image}
              imageAlt={activeProperty.name}
              className="h-72 md:h-96"
              iconClassName="size-16"
            />
            <button
              type="button"
              onClick={() => setActiveStop(null)}
              aria-label="Fechar tour virtual"
              className="absolute top-4 right-4 inline-flex items-center justify-center size-10 rounded-full imob-glass text-foreground"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
            <div className="p-6">
              <p className="font-semibold imob-font-serif text-xl text-foreground mb-1">{activeProperty.name}</p>
              <p className="text-sm text-muted-foreground">
                Tour 360° simulado — em um ambiente real, esta área exibiria um visualizador panorâmico navegável.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
