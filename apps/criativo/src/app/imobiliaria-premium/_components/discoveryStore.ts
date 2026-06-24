"use client"

import { useEffect, useState } from "react"
import type { LifestyleKey, RegionKey } from "../_lib/data"

// Pub-sub leve para compartilhar o filtro ativo (categoria/região) entre
// LifestyleSection, RegionsSection e FeaturedProperties sem precisar subir
// estado até a página (que permanece um server component) nem introduzir
// Context/Provider para um caso tão simples. Mesmo padrão de
// FavoriteButton.tsx (CustomEvent + leitura local).

interface DiscoveryFilters {
  category: LifestyleKey | null
  region: RegionKey | null
}

let filters: DiscoveryFilters = { category: null, region: null }
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

export function setActiveCategory(category: LifestyleKey | null) {
  filters = { ...filters, category }
  emit()
}

export function setActiveRegion(region: RegionKey | null) {
  filters = { ...filters, region }
  emit()
}

export function clearDiscoveryFilters() {
  filters = { category: null, region: null }
  emit()
}

export function scrollToImoveis() {
  document.getElementById("imoveis")?.scrollIntoView({ behavior: "smooth", block: "start" })
}

export function useDiscoveryFilters() {
  const [state, setState] = useState<DiscoveryFilters>(filters)

  useEffect(() => {
    setState(filters)
    const listener = () => setState(filters)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  return state
}
