"use client"

import { useState } from "react"
import { Flame, Menu, X, CalendarHeart } from "lucide-react"
import { NAV_LINKS } from "../_lib/data"

export function RestauranteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 px-6 py-4 rest-glass">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <a
          href="#topo"
          className="flex items-center gap-2.5 font-bold text-foreground rest-font-serif text-xl"
          onClick={() => setOpen(false)}
        >
          <span
            className="inline-flex items-center justify-center size-9 rounded-full text-[var(--color-primary-foreground)]"
            style={{ backgroundImage: "var(--rest-gradient-gold)" }}
            aria-hidden="true"
          >
            <Flame className="size-4.5" />
          </span>
          ÂMBAR
        </a>

        <nav className="hidden lg:flex items-center gap-7">
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

        <div className="hidden lg:block">
          <a
            href="#reservas"
            className="rest-cta-highlight inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--color-primary-foreground)]"
            style={{ backgroundImage: "var(--rest-gradient-gold)" }}
          >
            <CalendarHeart className="size-4" aria-hidden="true" />
            Reservar Mesa
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          className="lg:hidden inline-flex items-center justify-center size-10 rounded-full text-foreground"
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
            href="#reservas"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--color-primary-foreground)]"
            style={{ backgroundImage: "var(--rest-gradient-gold)" }}
          >
            <CalendarHeart className="size-4" aria-hidden="true" />
            Reservar Mesa
          </a>
        </nav>
      )}
    </header>
  )
}
