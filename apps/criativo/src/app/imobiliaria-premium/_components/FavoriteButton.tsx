"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"

const STORAGE_KEY = "imob-premium-favoritos"
export const FAVORITES_EVENT = "imob-premium-favoritos-changed"

function readFavorites(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function writeFavorites(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  window.dispatchEvent(new CustomEvent(FAVORITES_EVENT, { detail: ids }))
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    setFavorites(readFavorites())
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<string[]>).detail
      setFavorites(detail ?? readFavorites())
    }
    window.addEventListener(FAVORITES_EVENT, onChange)
    return () => window.removeEventListener(FAVORITES_EVENT, onChange)
  }, [])

  return favorites
}

interface FavoriteButtonProps {
  propertyId: string
  className?: string
}

export function FavoriteButton({ propertyId, className }: FavoriteButtonProps) {
  const favorites = useFavorites()
  const isFavorite = favorites.includes(propertyId)

  function toggle(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    const current = readFavorites()
    const next = current.includes(propertyId)
      ? current.filter((id) => id !== propertyId)
      : [...current, propertyId]
    writeFavorites(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? "Remover dos favoritos" : "Salvar nos favoritos"}
      className={`imob-cta-highlight inline-flex items-center justify-center size-9 rounded-full imob-glass ${className ?? ""}`}
    >
      <Heart
        className="size-4"
        style={{ color: isFavorite ? "var(--imob-moss)" : "var(--color-muted-foreground)" }}
        fill={isFavorite ? "var(--imob-moss)" : "none"}
        aria-hidden="true"
      />
    </button>
  )
}
