"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { DISHES, DISH_CATEGORIES, DISH_FILTERS, type DishCategory, type DishTag } from "../_lib/data"
import { DishCard } from "./DishCard"
import { Reveal } from "./Reveal"

const ALL_CATEGORIES = "Todos" as const

export function MenuExplorer() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<DishCategory | typeof ALL_CATEGORIES>(ALL_CATEGORIES)
  const [activeTags, setActiveTags] = useState<DishTag[]>([])

  const filteredDishes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return DISHES.filter((dish) => {
      const matchesCategory = category === ALL_CATEGORIES || dish.category === category
      const matchesTags = activeTags.every((tag) => dish.tags.includes(tag))
      const matchesQuery =
        normalizedQuery.length === 0 ||
        dish.name.toLowerCase().includes(normalizedQuery) ||
        dish.description.toLowerCase().includes(normalizedQuery) ||
        dish.ingredients.some((ingredient) => ingredient.toLowerCase().includes(normalizedQuery))

      return matchesCategory && matchesTags && matchesQuery
    })
  }, [query, category, activeTags])

  function toggleTag(tag: DishTag) {
    setActiveTags((current) => (current.includes(tag) ? current.filter((value) => value !== tag) : [...current, tag]))
  }

  return (
    <section id="cardapio" className="px-6 py-24 scroll-mt-20 bg-[var(--color-surface)]" aria-labelledby="cardapio-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--color-primary)" }}>
            Cardápio Digital
          </p>
          <h2 id="cardapio-title" className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Explore Nosso Cardápio
          </h2>
          <p className="text-muted-foreground">
            Busque por nome ou ingrediente, filtre por categoria e preferências e descubra os pratos assinados pelo
            chef.
          </p>
        </Reveal>

        <Reveal className="mb-10">
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar prato ou ingrediente..."
              aria-label="Buscar no cardápio"
              className="w-full rounded-full border border-input bg-[var(--color-surface-raised)] pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            <button
              type="button"
              onClick={() => setCategory(ALL_CATEGORIES)}
              data-active={category === ALL_CATEGORIES}
              className="rest-tab rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground"
            >
              Todos
            </button>
            {DISH_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                data-active={category === cat}
                className="rest-tab rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground"
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {DISH_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => toggleTag(filter.value)}
                data-active={activeTags.includes(filter.value)}
                aria-pressed={activeTags.includes(filter.value)}
                className="rest-filter-chip rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </Reveal>

        {filteredDishes.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDishes.map((dish, index) => (
              <Reveal key={dish.id} delayMs={(index % 3) * 90}>
                <DishCard dish={dish} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">
            Nenhum prato encontrado com esses filtros. Tente ajustar a busca.
          </p>
        )}
      </div>
    </section>
  )
}
