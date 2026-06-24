"use client"

import { MapPin, TrendingUp, Building } from "lucide-react"
import { REGIONS, type RegionKey } from "../_lib/data"
import { Reveal } from "./Reveal"
import { setActiveRegion, scrollToImoveis, useDiscoveryFilters } from "./discoveryStore"

export function RegionsSection() {
  const { region: activeRegion } = useDiscoveryFilters()

  function handleSelect(key: RegionKey) {
    setActiveRegion(activeRegion === key ? null : key)
    scrollToImoveis()
  }

  return (
    <section id="regioes" className="px-6 py-20 md:py-28 bg-[var(--color-surface-overlay)]">
      <div className="max-w-6xl mx-auto">
        <Reveal className="max-w-2xl mb-12">
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--imob-moss)" }}>
            Mapa de regiões
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Onde sua próxima história acontece</h2>
          <p className="text-muted-foreground">
            Cada região tem seu próprio ritmo de valorização e perfil de imóveis disponíveis.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {REGIONS.map((region, index) => {
            const isActive = activeRegion === region.key
            return (
              <Reveal key={region.key} delayMs={index * 70}>
                <button
                  type="button"
                  onClick={() => handleSelect(region.key)}
                  data-active={isActive}
                  className="imob-card-hover imob-filter-chip w-full h-full flex flex-col gap-4 rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6 text-left"
                >
                  <span
                    className="inline-flex items-center justify-center size-11 rounded-xl"
                    style={{
                      backgroundImage: isActive ? "var(--imob-gradient-primary)" : "var(--imob-gradient-soft)",
                      color: isActive ? "var(--color-primary-foreground)" : "var(--imob-moss)",
                    }}
                  >
                    <MapPin className="size-5" aria-hidden="true" />
                  </span>
                  <span className="font-semibold imob-font-serif text-lg">{region.title}</span>

                  <div className="flex flex-col gap-2 text-sm opacity-85">
                    <span className="flex items-center gap-2">
                      <Building className="size-3.5 shrink-0" aria-hidden="true" />
                      {region.propertiesCount} imóveis disponíveis
                    </span>
                    <span>Faixa média: {region.averagePrice}</span>
                    <span className="flex items-center gap-2" style={{ color: isActive ? undefined : "var(--imob-moss)" }}>
                      <TrendingUp className="size-3.5 shrink-0" aria-hidden="true" />
                      {region.valuationTrend}
                    </span>
                  </div>
                </button>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
