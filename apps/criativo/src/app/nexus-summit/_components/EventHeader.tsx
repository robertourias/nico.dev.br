import { Sparkles } from "lucide-react"
import { EVENT_NAME } from "../_lib/event"

// Header minimalista e fixo: wordmark + navegação por âncoras + CTA, sem
// navegação do site (mesma decisão das demais landings do app — a página é
// uma rolagem única de conversão, ver `pre-venda-metodo-apice/LaunchHeader`).
export function EventHeader() {
  return (
    <header className="sticky top-0 z-50 px-6 py-4 nexus-glass border-x-0 border-t-0">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-2 font-bold text-[var(--nexus-fg)]">
          <Sparkles className="size-4 text-[var(--nexus-purple)]" aria-hidden="true" />
          {EVENT_NAME}
        </span>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[var(--nexus-fg-muted)]">
          <a href="#programacao" className="hover:text-[var(--nexus-fg)] transition-colors">
            Programação
          </a>
          <a href="#palestrantes" className="hover:text-[var(--nexus-fg)] transition-colors">
            Palestrantes
          </a>
          <a href="#ingressos" className="hover:text-[var(--nexus-fg)] transition-colors">
            Ingressos
          </a>
          <a href="#faq" className="hover:text-[var(--nexus-fg)] transition-colors">
            FAQ
          </a>
        </nav>

        <a
          href="#inscricao"
          className="text-sm font-semibold rounded-lg px-4 py-2 text-white transition-transform hover:scale-[1.03]"
          style={{ backgroundImage: "var(--nexus-gradient-cta)" }}
        >
          Garantir Vaga
        </a>
      </div>
    </header>
  )
}
