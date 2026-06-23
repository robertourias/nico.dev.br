"use client"

import { useState } from "react"
import { Scale, Menu, X, CalendarCheck } from "lucide-react"
import { NAV_LINKS } from "../_lib/data"

export function AdvocaciaHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 px-6 py-4 adv-glass">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <a
          href="#topo"
          className="flex items-center gap-2.5 font-bold text-foreground adv-font-serif text-lg"
          onClick={() => setOpen(false)}
        >
          <span
            className="inline-flex items-center justify-center size-9 rounded-lg text-white"
            style={{ backgroundImage: "var(--adv-gradient-primary)" }}
            aria-hidden="true"
          >
            <Scale className="size-4.5" />
          </span>
          Lemos <span style={{ color: "var(--adv-gold)" }}>&amp;</span> Bastos
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
            href="#agendamento"
            className="adv-cta-highlight inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white"
            style={{ backgroundImage: "var(--adv-gradient-primary)" }}
          >
            <CalendarCheck className="size-4" aria-hidden="true" />
            Agendar Consulta
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
            href="#agendamento"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundImage: "var(--adv-gradient-primary)" }}
          >
            <CalendarCheck className="size-4" aria-hidden="true" />
            Agendar Consulta
          </a>
        </nav>
      )}
    </header>
  )
}
