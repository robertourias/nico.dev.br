import Link from "next/link"

export function LandingFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="px-6 py-10 border-t border-border economia-no-print">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <span className="font-semibold text-foreground">Simulador de Economia Doméstica</span>
          <nav className="flex items-center gap-4">
            <Link href="#" className="hover:text-primary transition-colors">
              Política de Privacidade
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Termos de Uso
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <p>© {year} Roberto Nicoletti</p>
          <Link href="/" className="hover:text-primary transition-colors">
            ← Voltar para criativo.nico.dev
          </Link>
        </div>
      </div>
    </footer>
  )
}
