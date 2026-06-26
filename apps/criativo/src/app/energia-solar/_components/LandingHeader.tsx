import Link from "next/link"
import { Sun } from "lucide-react"

// Header minimalista, próprio desta campanha — sem navegação do site, para
// manter o foco na conversão. Link de volta para a home do criativo é a
// única saída disponível.
export function LandingHeader() {
  return (
    <header className="w-full sticky top-0 z-30 solar-glass solar-no-print">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold text-foreground hover:text-[var(--solar-blue-light)] transition-colors"
        >
          ← criativo.nico.dev
        </Link>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-accent text-accent-foreground">
          <Sun className="size-3.5" aria-hidden="true" />
          Energia Solar
        </span>
      </div>
    </header>
  )
}
