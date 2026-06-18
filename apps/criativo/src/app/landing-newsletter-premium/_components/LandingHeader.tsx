import Link from "next/link"

// Header minimalista, próprio desta campanha — sem navegação do site, para
// manter o foco na conversão. Link de volta para a home do criativo é a
// única saída disponível.
export function LandingHeader() {
  return (
    <header className="w-full">
      <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
        >
          ← criativo.nico.dev
        </Link>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent text-accent-foreground">
          Newsletter Premium
        </span>
      </div>
    </header>
  )
}
