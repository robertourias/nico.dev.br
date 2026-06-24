"use client"

import { useMemo, useState } from "react"
import { ChevronDown, Ruler, BedDouble, Car, MessageCircle, X, SearchX } from "lucide-react"
import {
  PROPERTIES,
  LIFESTYLES,
  REGIONS,
  PRICE_RANGE_OPTIONS,
  BEDROOM_OPTIONS,
  type Property,
} from "../_lib/data"
import { Reveal } from "./Reveal"
import { PropertyVisual } from "./PropertyVisual"
import { FavoriteButton } from "./FavoriteButton"
import { ShareMenu } from "./ShareMenu"
import { setActiveCategory, setActiveRegion, clearDiscoveryFilters, useDiscoveryFilters } from "./discoveryStore"

type PriceRangeValue = (typeof PRICE_RANGE_OPTIONS)[number]["value"]
type BedroomValue = (typeof BEDROOM_OPTIONS)[number]["value"]
type PurposeFilter = "qualquer" | "morar" | "investir"

const PURPOSE_FILTER_OPTIONS: { value: PurposeFilter; label: string }[] = [
  { value: "qualquer", label: "Qualquer finalidade" },
  { value: "morar", label: "Morar" },
  { value: "investir", label: "Investir" },
]

function purposeOf(property: Property): "morar" | "investir" {
  return property.category === "investimento" || property.category === "comercial" ? "investir" : "morar"
}

function matchesPriceRange(price: number, range: PriceRangeValue): boolean {
  if (range === "todos") return true
  if (range === "até-800k") return price <= 800000
  if (range === "800k-3mi") return price > 800000 && price <= 3000000
  return price > 3000000
}

function matchesBedrooms(bedrooms: number | null, value: BedroomValue): boolean {
  if (value === "qualquer") return true
  return (bedrooms ?? 0) >= Number(value)
}

export function FeaturedProperties() {
  const { category: activeCategory, region: activeRegion } = useDiscoveryFilters()
  const [priceRange, setPriceRange] = useState<PriceRangeValue>("todos")
  const [bedrooms, setBedrooms] = useState<BedroomValue>("qualquer")
  const [purpose, setPurpose] = useState<PurposeFilter>("qualquer")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return PROPERTIES.filter((property) => {
      if (activeCategory && property.category !== activeCategory) return false
      if (activeRegion && property.region !== activeRegion) return false
      if (!matchesPriceRange(property.price, priceRange)) return false
      if (!matchesBedrooms(property.bedrooms, bedrooms)) return false
      if (purpose !== "qualquer" && purposeOf(property) !== purpose) return false
      return true
    })
  }, [activeCategory, activeRegion, priceRange, bedrooms, purpose])

  const hasActiveFilters = Boolean(activeCategory || activeRegion) || priceRange !== "todos" || bedrooms !== "qualquer" || purpose !== "qualquer"

  function clearAll() {
    clearDiscoveryFilters()
    setPriceRange("todos")
    setBedrooms("qualquer")
    setPurpose("qualquer")
  }

  return (
    <section id="imoveis" className="px-6 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <Reveal className="max-w-2xl mb-10">
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--imob-moss)" }}>
            Imóveis em destaque
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Busca inteligente</h2>
          <p className="text-muted-foreground">
            Combine tipo, região, orçamento e finalidade para encontrar exatamente o que você procura.
          </p>
        </Reveal>

        <Reveal className="rounded-2xl border border-border bg-[var(--color-surface-raised)] p-5 mb-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <FilterSelect
              label="Tipo"
              value={activeCategory ?? ""}
              onChange={(value) => setActiveCategory(value ? (value as typeof LIFESTYLES[number]["key"]) : null)}
              options={[{ value: "", label: "Qualquer tipo" }, ...LIFESTYLES.map((l) => ({ value: l.key, label: l.title }))]}
            />
            <FilterSelect
              label="Região"
              value={activeRegion ?? ""}
              onChange={(value) => setActiveRegion(value ? (value as typeof REGIONS[number]["key"]) : null)}
              options={[{ value: "", label: "Qualquer região" }, ...REGIONS.map((r) => ({ value: r.key, label: r.title }))]}
            />
            <FilterSelect
              label="Faixa de preço"
              value={priceRange}
              onChange={(value) => setPriceRange(value as PriceRangeValue)}
              options={PRICE_RANGE_OPTIONS}
            />
            <FilterSelect
              label="Quartos"
              value={bedrooms}
              onChange={(value) => setBedrooms(value as BedroomValue)}
              options={BEDROOM_OPTIONS}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-xs font-medium text-muted-foreground mr-1">Finalidade:</span>
            {PURPOSE_FILTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                data-active={purpose === option.value}
                onClick={() => setPurpose(option.value)}
                className="imob-filter-chip rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-foreground"
              >
                {option.label}
              </button>
            ))}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="ml-auto inline-flex items-center gap-1 text-xs font-semibold hover:underline"
                style={{ color: "var(--imob-moss)" }}
              >
                <X className="size-3.5" aria-hidden="true" />
                Limpar filtros
              </button>
            )}
          </div>
        </Reveal>

        <p className="text-sm text-muted-foreground mb-6">
          {filtered.length} {filtered.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
        </p>

        {filtered.length === 0 ? (
          <Reveal className="rounded-2xl border border-dashed border-border p-12 text-center">
            <SearchX className="size-8 mx-auto mb-3 text-muted-foreground" aria-hidden="true" />
            <p className="font-semibold text-foreground mb-1">Nenhum imóvel encontrado</p>
            <p className="text-sm text-muted-foreground mb-4">Ajuste os filtros para ver mais opções.</p>
            <button
              type="button"
              onClick={clearAll}
              className="imob-cta-highlight inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-semibold text-[var(--color-primary-foreground)]"
              style={{ backgroundImage: "var(--imob-gradient-primary)" }}
            >
              Limpar filtros
            </button>
          </Reveal>
        ) : (
          <div className="flex flex-col gap-5">
            {filtered.map((property, index) => (
              <Reveal key={property.id} delayMs={Math.min(index, 4) * 60}>
                <PropertyCard
                  property={property}
                  expanded={expandedId === property.id}
                  onToggle={() => setExpandedId((current) => (current === property.id ? null : property.id))}
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

interface FilterSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}

function FilterSelect({ label, value, onChange, options }: FilterSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-xl border border-input bg-[var(--color-surface)] px-3.5 py-2.5 pr-9 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

interface PropertyCardProps {
  property: Property
  expanded: boolean
  onToggle: () => void
}

function PropertyCard({ property, expanded, onToggle }: PropertyCardProps) {
  const lifestyle = LIFESTYLES.find((l) => l.key === property.category)
  const region = REGIONS.find((r) => r.key === property.region)

  return (
    <div className="imob-card-hover rounded-2xl border border-border bg-[var(--color-surface-raised)] overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="relative sm:w-72 shrink-0 h-52 sm:h-auto">
          <PropertyVisual
            category={property.category}
            imageUrl={property.image}
            imageAlt={property.name}
            className="absolute inset-0"
            iconClassName="size-10"
          />
          {property.tag && (
            <span
              className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold text-[var(--color-primary-foreground)]"
              style={{ backgroundImage: "var(--imob-gradient-sand)", color: "var(--color-foreground)" }}
            >
              {property.tag}
            </span>
          )}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <FavoriteButton propertyId={property.id} />
            <ShareMenu title={property.name} />
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--imob-moss)" }}>
                {lifestyle?.title} · {region?.title}
              </p>
              <h3 className="text-xl font-semibold imob-font-serif text-foreground">{property.name}</h3>
              <p className="text-sm text-muted-foreground">{property.neighborhood}</p>
            </div>
            <p className="text-xl font-bold imob-font-serif text-foreground whitespace-nowrap">{property.priceLabel}</p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Ruler className="size-4" aria-hidden="true" />
              {property.area} m²
            </span>
            <span className="flex items-center gap-1.5">
              <BedDouble className="size-4" aria-hidden="true" />
              {property.bedrooms ?? "—"} {property.bedrooms ? "quartos" : ""}
            </span>
            <span className="flex items-center gap-1.5">
              <Car className="size-4" aria-hidden="true" />
              {property.parking} vagas
            </span>
          </div>

          {expanded && (
            <div className="imob-accordion-content rounded-xl bg-[var(--color-accent)] p-4 text-sm text-foreground">
              <p className="mb-3">
                Imóvel {lifestyle?.title.toLowerCase()} em {property.neighborhood}, na região {region?.title}, com{" "}
                {property.area} m² de área e infraestrutura completa para {purposeOf(property) === "investir" ? "geração de renda" : "moradia"}.
                Documentação regularizada e disponível para visita presencial ou tour virtual.
              </p>
              <a
                href={`https://wa.me/5511930456789?text=${encodeURIComponent(`Olá! Tenho interesse no imóvel ${property.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                style={{ color: "var(--imob-moss)" }}
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Falar sobre este imóvel
              </a>
            </div>
          )}

          <button
            type="button"
            onClick={onToggle}
            className="imob-cta-highlight self-start inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-[var(--color-primary-foreground)] mt-auto"
            style={{ backgroundImage: "var(--imob-gradient-primary)" }}
          >
            {expanded ? "Ocultar Detalhes" : "Ver Detalhes"}
            <ChevronDown className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
