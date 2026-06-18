import Link from "next/link"

export function LandingFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="px-6 py-10 pb-24 lg:pb-10 border-t border-border">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© {year} Roberto Nicoletti</p>
        <Link href="/" className="hover:text-primary transition-colors">
          ← Voltar para criativo.nico.dev
        </Link>
      </div>
    </footer>
  )
}
