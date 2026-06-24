"use client"

import { Building2, Home, TrendingUp, Gem, Briefcase, ArrowRight, type LucideIcon } from "lucide-react"
import { LIFESTYLES, type LifestyleKey } from "../_lib/data"
import { Reveal } from "./Reveal"
import { setActiveCategory, scrollToImoveis, useDiscoveryFilters } from "./discoveryStore"

const ICONS: Record<LifestyleKey, LucideIcon> = {
  urbana: Building2,
  familia: Home,
  investimento: TrendingUp,
  "alto-padrao": Gem,
  comercial: Briefcase,
}

export function LifestyleSection() {
  const { category: activeCategory } = useDiscoveryFilters()

  function handleSelect(key: LifestyleKey) {
    setActiveCategory(activeCategory === key ? null : key)
    scrollToImoveis()
  }

  return (
    <section id="estilos" className="px-6 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <Reveal className="max-w-2xl mb-12">
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--imob-moss)" }}>
            Navegue por estilo de vida
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Qual história combina com você?</h2>
          <p className="text-muted-foreground">
            Escolha o perfil que mais se aproxima do que você busca e veja imóveis filtrados automaticamente.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {LIFESTYLES.map((lifestyle, index) => {
            const Icon = ICONS[lifestyle.key]
            const isActive = activeCategory === lifestyle.key
            return (
              <Reveal key={lifestyle.key} delayMs={index * 70}>
                <button
                  type="button"
                  onClick={() => handleSelect(lifestyle.key)}
                  data-active={isActive}
                  className="imob-card-hover imob-filter-chip w-full h-full flex flex-col items-start gap-3 rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6 text-left"
                >
                  <span
                    className="inline-flex items-center justify-center size-11 rounded-xl"
                    style={{
                      backgroundImage: isActive ? "var(--imob-gradient-primary)" : "var(--imob-gradient-soft)",
                      color: isActive ? "var(--color-primary-foreground)" : "var(--imob-moss)",
                    }}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="font-semibold imob-font-serif text-lg">{lifestyle.title}</span>
                  <span className="text-sm opacity-80">{lifestyle.description}</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold mt-auto pt-2" style={{ color: isActive ? undefined : "var(--imob-moss)" }}>
                    Ver imóveis
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </span>
                </button>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
