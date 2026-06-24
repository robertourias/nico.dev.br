import { Megaphone, MessageCircle } from "lucide-react"
import { Reveal } from "./Reveal"

export function OwnerCta() {
  return (
    <section className="px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <Reveal
          className="relative overflow-hidden rounded-3xl px-8 py-14 md:px-16 md:py-16 text-center"
          style={{ backgroundImage: "var(--imob-gradient-dark)" }}
        >
          <div className="absolute inset-0 imob-grid-bg opacity-30" aria-hidden="true" />
          <div className="relative max-w-2xl mx-auto">
            <span
              className="inline-flex items-center justify-center size-14 rounded-2xl mb-6"
              style={{ backgroundImage: "var(--imob-gradient-sand)" }}
              aria-hidden="true"
            >
              <Megaphone className="size-6" style={{ color: "var(--color-foreground)" }} />
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary-foreground)] mb-3">
              Tem um imóvel para vender?
            </h2>
            <p className="text-[rgba(248,250,252,0.78)] mb-8">
              Cadastre seu imóvel e alcance compradores qualificados já em busca do que você tem a oferecer.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="#leads"
                className="imob-cta-highlight inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-base font-semibold text-[var(--color-foreground)]"
                style={{ backgroundImage: "var(--imob-gradient-sand)" }}
              >
                Anunciar Imóvel
              </a>
              <a
                href="https://wa.me/5511930456789?text=Ol%C3%A1!%20Quero%20falar%20com%20um%20corretor%20sobre%20meu%20im%C3%B3vel."
                target="_blank"
                rel="noopener noreferrer"
                className="imob-cta-highlight inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-base font-semibold text-[var(--color-primary-foreground)] border border-[rgba(248,250,252,0.3)] hover:border-[rgba(248,250,252,0.6)] transition-colors"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Falar com Corretor
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
