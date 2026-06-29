"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Terminal } from "lucide-react"

const NAV_LINKS = [
  { href: "#vagas", label: "Vagas" },
  { href: "#salarios", label: "Salários" },
  { href: "#roadmaps", label: "Roadmaps" },
  { href: "#empresas", label: "Empresas" },
  { href: "#assistente", label: "Assistente IA" },
  { href: "#planos", label: "Planos" },
]

// Header sticky com glass + navegação por âncoras das seções da própria
// landing (não é um app multi-rota). CTA duplo (Entrar / Criar conta) é
// apenas decorativo — sem autenticação real nesta página de showcase.
export function DevpathHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 devpath-glass">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="#top" className="flex items-center gap-2 font-bold text-[var(--devpath-fg)]" onClick={() => setOpen(false)}>
          <span
            className="inline-flex items-center justify-center size-8 rounded-lg shrink-0 text-[#04140e]"
            style={{ backgroundImage: "var(--devpath-gradient-primary)" }}
            aria-hidden="true"
          >
            <Terminal className="size-4.5" />
          </span>
          <span className="devpath-mono text-base">
            dev<span className="devpath-gradient-text">path</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--devpath-fg-muted)] hover:text-[var(--devpath-green)] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="#"
            className="text-sm font-medium text-[var(--devpath-fg-muted)] hover:text-[var(--devpath-fg)] transition-colors"
          >
            Entrar
          </a>
          <a
            href="#vagas"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-[#04140e] transition-transform hover:scale-[1.03] active:scale-[0.98]"
            style={{ backgroundImage: "var(--devpath-gradient-primary)" }}
          >
            Criar conta grátis
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="lg:hidden inline-flex items-center justify-center size-9 rounded-lg border border-[var(--devpath-border)] text-[var(--devpath-fg)]"
        >
          {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[var(--devpath-border)] px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-[var(--devpath-fg-muted)] hover:text-[var(--devpath-green)] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#vagas"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-[#04140e] mt-1"
            style={{ backgroundImage: "var(--devpath-gradient-primary)" }}
          >
            Criar conta grátis
          </a>
        </div>
      )}
    </header>
  )
}
