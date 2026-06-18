import { Sparkles } from "lucide-react"

// Header minimalista e fixo: só wordmark + CTA, sem navegação de site — a
// página inteira é uma rolagem única de conversão (mesma decisão das demais
// landings do app, ver `landing-newsletter-premium`).
export function LaunchHeader() {
  return (
    <header className="sticky top-0 z-50 px-6 py-4 apice-glass border-x-0 border-t-0">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <span className="inline-flex items-center gap-2 font-semibold text-[var(--apice-fg)]">
          <Sparkles className="size-4 text-[var(--apice-violet)]" aria-hidden="true" />
          Método Ápice
        </span>

        <a
          href="#lista-de-espera"
          className="text-sm font-medium rounded-lg px-4 py-2 text-white transition-transform hover:scale-[1.03]"
          style={{ backgroundImage: "var(--apice-gradient-primary)" }}
        >
          Entrar na lista
        </a>
      </div>
    </header>
  )
}
