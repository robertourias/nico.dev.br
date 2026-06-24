import { ArrowRight } from "lucide-react"
import { Reveal } from "./Reveal"

// "Encerramento Cinematográfico" — fechamento full-bleed que substitui o
// rodapé de CTA genérico, reforçando a sensação de experiência exclusiva.
export function CinematicClosing() {
  return (
    <section className="relative px-6 py-32 md:py-40 overflow-hidden rest-grid-bg" aria-labelledby="encerramento-title">
      <div
        className="rest-blob -top-24 -left-24 size-[28rem]"
        style={{ background: "var(--rest-gradient-gold)" }}
        aria-hidden="true"
      />
      <div
        className="rest-blob bottom-0 right-0 size-[24rem]"
        style={{ background: "var(--rest-gradient-olive)" }}
        aria-hidden="true"
      />

      <Reveal variant="scale-in" className="relative max-w-3xl mx-auto text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-6" style={{ color: "var(--color-primary)" }}>
          ÂMBAR · Cozinha de Autor
        </p>
        <h2 id="encerramento-title" className="text-4xl md:text-6xl font-semibold text-foreground mb-8 leading-[1.1] rest-font-serif">
          Algumas noites merecem ser reservadas.
        </h2>
        <p className="text-muted-foreground text-lg mb-12 max-w-xl mx-auto">
          Reserve sua mesa e deixe que cada prato conte uma história que você vai querer lembrar.
        </p>
        <a
          href="#reservas"
          className="rest-cta-highlight rest-glow inline-flex items-center gap-2.5 rounded-full px-9 py-4 text-base font-semibold text-[var(--color-primary-foreground)]"
          style={{ backgroundImage: "var(--rest-gradient-gold)" }}
        >
          Reservar Minha Mesa
          <ArrowRight className="size-5" aria-hidden="true" />
        </a>
      </Reveal>
    </section>
  )
}
