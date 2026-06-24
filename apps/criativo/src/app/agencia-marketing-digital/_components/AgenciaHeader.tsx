"use client"

import { useState } from "react"
import { Zap, Menu, X } from "lucide-react"
import { NAV_LINKS } from "../_lib/data"

export function AgenciaHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 px-6 py-4 agencia-glass">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <a href="#topo" className="flex items-center gap-2 font-bold text-foreground" onClick={() => setOpen(false)}>
          <span
            className="inline-flex items-center justify-center size-9 rounded-xl text-white"
            style={{ backgroundImage: "var(--agencia-gradient-primary)" }}
            aria-hidden="true"
          >
            <Zap className="size-4.5" />
          </span>
          Lumen<span className="text-primary">Digital</span>
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
            href="#proposta"
            className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
            style={{ backgroundImage: "var(--agencia-gradient-primary)" }}
          >
            Solicitar Proposta
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          className="lg:hidden inline-flex items-center justify-center size-10 rounded-xl text-foreground"
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
            href="#proposta"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundImage: "var(--agencia-gradient-primary)" }}
          >
            Solicitar Proposta
          </a>
        </nav>
      )}
    </header>
  )
}
