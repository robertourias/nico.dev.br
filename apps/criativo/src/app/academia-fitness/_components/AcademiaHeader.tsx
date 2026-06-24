"use client"

import { useEffect, useState } from "react"
import { Menu, X, Dumbbell } from "lucide-react"
import { NAV_LINKS } from "../_lib/data"

export function AcademiaHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-[var(--color-background)]/90 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
        <a href="#topo" className="flex items-center gap-2 font-bold text-foreground">
          <span
            className="inline-flex items-center justify-center size-9 rounded-lg text-[var(--color-primary-foreground)]"
            style={{ backgroundImage: "var(--aca-gradient-primary)" }}
            aria-hidden="true"
          >
            <Dumbbell className="size-4.5" />
          </span>
          <span className="text-lg tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            VIGOR
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-[var(--color-primary)] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#matricula"
          className="hidden md:inline-flex aca-cta-highlight items-center justify-center rounded-lg px-5 py-2.5 text-sm font-bold text-[var(--color-primary-foreground)]"
          style={{ backgroundImage: "var(--aca-gradient-primary)" }}
        >
          Matricule-se
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          className="md:hidden inline-flex items-center justify-center size-10 rounded-lg border border-border text-foreground"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-[var(--color-background)] px-6 py-5 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#matricula"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-bold text-[var(--color-primary-foreground)] mt-1"
            style={{ backgroundImage: "var(--aca-gradient-primary)" }}
          >
            Matricule-se
          </a>
        </div>
      )}
    </header>
  )
}
