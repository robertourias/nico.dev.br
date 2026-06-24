"use client"

import { useState } from "react"
import { Gem, Menu, X, Heart, MessageCircle } from "lucide-react"
import { NAV_LINKS } from "../_lib/data"
import { useFavorites } from "./FavoriteButton"

export function ImobHeader() {
  const [open, setOpen] = useState(false)
  const favorites = useFavorites()

  return (
    <header className="sticky top-0 z-40 px-6 py-4 imob-glass">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <a
          href="#topo"
          className="flex items-center gap-2.5 font-bold text-foreground imob-font-serif text-lg shrink-0"
          onClick={() => setOpen(false)}
        >
          <span
            className="inline-flex items-center justify-center size-9 rounded-lg text-[var(--color-primary-foreground)]"
            style={{ backgroundImage: "var(--imob-gradient-primary)" }}
            aria-hidden="true"
          >
            <Gem className="size-4.5" />
          </span>
          Altana <span style={{ color: "var(--imob-sand)" }}>Imóveis</span>
        </a>

        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="#imoveis"
            aria-label="Imóveis favoritos"
            className="relative inline-flex items-center justify-center size-10 rounded-lg border border-border text-foreground hover:border-[var(--imob-moss)] transition-colors"
          >
            <Heart className="size-4.5" aria-hidden="true" />
            {favorites.length > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center size-5 rounded-full text-[10px] font-semibold text-[var(--color-primary-foreground)]"
                style={{ backgroundImage: "var(--imob-gradient-primary)" }}
              >
                {favorites.length}
              </span>
            )}
          </a>
          <a
            href="#leads"
            className="imob-cta-highlight inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-[var(--color-primary-foreground)]"
            style={{ backgroundImage: "var(--imob-gradient-primary)" }}
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Falar com Consultor
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          className="lg:hidden inline-flex items-center justify-center size-10 rounded-lg text-foreground"
        >
          {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <nav className="lg:hidden max-w-6xl mx-auto mt-4 pt-4 border-t border-border flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-2 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#leads"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-[var(--color-primary-foreground)]"
            style={{ backgroundImage: "var(--imob-gradient-primary)" }}
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Falar com Consultor
          </a>
        </nav>
      )}
    </header>
  )
}
