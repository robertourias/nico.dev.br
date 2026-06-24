import { Star } from "lucide-react"
import { TESTIMONIALS } from "../_lib/data"
import { Reveal } from "./Reveal"

const ROTATIONS = ["rest-rotate-1", "rest-rotate-2", "rest-rotate-3"]
// Deslocamentos verticais alternados para reforçar o layout assimétrico
// (substitui o padrão de depoimentos em carrossel/grade uniforme).
const OFFSETS = ["mt-0", "mt-6", "mt-2", "mt-8", "mt-1"]

// "Mural de Experiências" — cartões com aspecto de bilhete manuscrito,
// dispostos de forma assimétrica, no lugar de depoimentos convencionais.
export function ExperienceWall() {
  return (
    <section className="px-6 py-24 scroll-mt-20" aria-labelledby="mural-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--color-primary)" }}>
            Mural de Experiências
          </p>
          <h2 id="mural-title" className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Palavras de Quem Esteve à Mesa
          </h2>
          <p className="text-muted-foreground">
            Fragmentos de noites memoráveis, escritos por quem viveu a experiência ÂMBAR.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <Reveal key={testimonial.name} delayMs={index * 90} className={OFFSETS[index % OFFSETS.length]}>
              <div className={`rest-manuscript rounded-2xl p-7 ${ROTATIONS[index % ROTATIONS.length]} transition-transform`}>
                <p className="rest-quote-mark text-5xl mb-2" style={{ color: "var(--color-primary)" }} aria-hidden="true">
                  &ldquo;
                </p>
                <p className="text-sm text-foreground/90 leading-relaxed mb-6 rest-font-serif italic">
                  {testimonial.quote}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex items-center justify-center size-9 rounded-full text-xs font-semibold text-[var(--color-primary-foreground)]"
                      style={{ backgroundImage: "var(--rest-gradient-gold)" }}
                    >
                      {testimonial.initials}
                    </span>
                    <p className="text-sm font-medium text-foreground">{testimonial.name}</p>
                  </div>
                  <div className="flex items-center gap-0.5" aria-label={`${testimonial.rating} de 5 estrelas`}>
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className="size-3.5"
                        style={{
                          color: starIndex < testimonial.rating ? "var(--color-primary)" : "var(--color-border)",
                          fill: starIndex < testimonial.rating ? "var(--color-primary)" : "transparent",
                        }}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
