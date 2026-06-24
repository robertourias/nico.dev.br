"use client"

import { useState } from "react"
import { Gem, Shell, Beef, Sprout, MapPin, Sparkles, UtensilsCrossed, type LucideIcon } from "lucide-react"
import { INGREDIENTS, type IngredientIcon } from "../_lib/data"
import { Reveal } from "./Reveal"

const ICONS: Record<IngredientIcon, LucideIcon> = {
  gem: Gem,
  shell: Shell,
  beef: Beef,
  sprout: Sprout,
}

export function IngredientsSpotlight() {
  const [activeId, setActiveId] = useState(INGREDIENTS[0].id)
  const active = INGREDIENTS.find((ingredient) => ingredient.id === activeId) ?? INGREDIENTS[0]
  const ActiveIcon = ICONS[active.icon]

  return (
    <section className="px-6 py-24 bg-[var(--color-surface)]" aria-labelledby="ingredientes-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--color-primary)" }}>
            Origem e Curiosidades
          </p>
          <h2 id="ingredientes-title" className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Ingredientes em Evidência
          </h2>
          <p className="text-muted-foreground">
            Toque em um ingrediente para conhecer sua origem, curiosidades de seleção e os pratos em que ele
            protagoniza a experiência.
          </p>
        </Reveal>

        <Reveal className="grid lg:grid-cols-[0.85fr_1.15fr] gap-6 items-stretch">
          <div className="grid grid-cols-2 gap-4">
            {INGREDIENTS.map((ingredient) => {
              const Icon = ICONS[ingredient.icon]
              const isActive = ingredient.id === activeId
              return (
                <button
                  key={ingredient.id}
                  type="button"
                  onClick={() => setActiveId(ingredient.id)}
                  data-active={isActive}
                  aria-pressed={isActive}
                  className="rest-ingredient-chip rest-card-hover flex flex-col items-center gap-3 rounded-2xl border border-border bg-[var(--color-surface-raised)] px-5 py-7 text-center"
                >
                  <span
                    className="inline-flex items-center justify-center size-12 rounded-full text-[var(--color-primary-foreground)]"
                    style={{ backgroundImage: "var(--rest-gradient-gold)" }}
                    aria-hidden="true"
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="text-sm font-semibold text-foreground">{ingredient.name}</span>
                </button>
              )
            })}
          </div>

          <div key={active.id} className="rest-detail-in rounded-3xl rest-glass p-8 md:p-10 flex flex-col">
            <span
              className="inline-flex items-center justify-center size-14 rounded-full text-[var(--color-primary-foreground)] mb-6"
              style={{ backgroundImage: "var(--rest-gradient-gold)" }}
              aria-hidden="true"
            >
              <ActiveIcon className="size-6" />
            </span>
            <h3 className="text-2xl font-semibold text-foreground mb-5 rest-font-serif">{active.name}</h3>

            <div className="flex items-start gap-3 mb-4">
              <MapPin className="size-4 shrink-0 mt-1" style={{ color: "var(--color-primary)" }} aria-hidden="true" />
              <p className="text-sm text-muted-foreground leading-relaxed">{active.origem}</p>
            </div>

            <div className="flex items-start gap-3 mb-6">
              <Sparkles className="size-4 shrink-0 mt-1" style={{ color: "var(--color-primary)" }} aria-hidden="true" />
              <p className="text-sm text-muted-foreground leading-relaxed">{active.curiosidade}</p>
            </div>

            <div className="mt-auto pt-5 border-t border-border">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                <UtensilsCrossed className="size-3.5" aria-hidden="true" />
                Pratos relacionados
              </p>
              <div className="flex flex-wrap gap-2">
                {active.pratosRelacionados.map((dish) => (
                  <span
                    key={dish}
                    className="rounded-full border border-border bg-[var(--color-surface-overlay)] px-3.5 py-1.5 text-xs text-foreground"
                  >
                    {dish}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
