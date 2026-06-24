import { Flame, MessageCircle } from "lucide-react"
import { Reveal } from "./Reveal"

export function CtaSection() {
  return (
    <section className="relative px-6 py-24 md:py-32 overflow-hidden" aria-labelledby="cta-title">
      <div className="absolute inset-0" style={{ backgroundImage: "var(--aca-gradient-dark)" }} aria-hidden="true">
        <div className="absolute inset-0 aca-hero-bg" />
        <div className="aca-blob top-0 left-1/4 size-80" style={{ backgroundColor: "var(--color-primary)" }} />
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        <Reveal>
          <h2 id="cta-title" className="text-4xl md:text-5xl font-bold text-foreground mb-5">
            Seu melhor resultado <span className="aca-highlight">começa hoje.</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto aca-heading-alt">
            Não deixe para depois. Garanta sua vaga agora e comece sua transformação com quem entende de
            performance.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#matricula"
              className="aca-cta-highlight aca-glow inline-flex items-center gap-2 rounded-lg px-8 py-4 text-base font-bold text-[var(--color-primary-foreground)]"
              style={{ backgroundImage: "var(--aca-gradient-primary)" }}
            >
              <Flame className="size-4.5" aria-hidden="true" />
              Matricule-se Agora
            </a>
            <a
              href="https://wa.me/5511988887766?text=Ol%C3%A1!%20Quero%20falar%20com%20um%20consultor%20da%20VIGOR."
              target="_blank"
              rel="noopener noreferrer"
              className="aca-cta-highlight inline-flex items-center gap-2 rounded-lg px-8 py-4 text-base font-bold text-foreground border border-border hover:border-[var(--color-primary)] aca-glass transition-colors"
            >
              <MessageCircle className="size-4.5" aria-hidden="true" />
              Falar com Consultor
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
