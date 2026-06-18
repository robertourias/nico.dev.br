import { Quote } from "lucide-react"
import { Reveal } from "./Reveal"

// Depoimentos fictícios (copy de exemplo, conforme briefing) — não
// representam usuários reais nem dados coletados.
const testimonials = [
  {
    quote: "Finalmente entendi quais funções combinam comigo.",
    name: "Marina Costa",
    role: "Analista de Marketing",
    initials: "MC",
  },
  {
    quote: "Recebi insights valiosos para minha evolução profissional.",
    name: "Thiago Almeida",
    role: "Engenheiro de Software",
    initials: "TA",
  },
  {
    quote: "O resultado foi surpreendentemente preciso.",
    name: "Patrícia Lima",
    role: "Gerente de Projetos",
    initials: "PL",
  },
]

export function Testimonials() {
  return (
    <section className="relative px-6 py-20 md:py-28" aria-labelledby="testimonials-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14">
          <h2 id="testimonials-title" className="text-3xl md:text-4xl font-bold mb-4">
            Quem fez, <span className="perfil-gradient-text">recomenda</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delayMs={i * 90}>
              <figure className="h-full rounded-2xl border border-border bg-[var(--color-surface-raised)] p-7">
                <Quote className="size-7 text-primary/50 mb-4" aria-hidden="true" />
                <blockquote className="text-foreground font-medium leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <span
                    className="inline-flex items-center justify-center size-10 rounded-full text-sm font-semibold text-white shrink-0"
                    style={{ backgroundImage: "var(--perfil-gradient-primary)" }}
                    aria-hidden="true"
                  >
                    {t.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground">{t.name}</span>
                    <span className="block text-xs text-muted-foreground">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
