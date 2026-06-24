import { PROPERTIES, TESTIMONIALS } from "../_lib/data"
import { Reveal } from "./Reveal"

const STORY_LABELS = [
  { key: "situation" as const, label: "Situação inicial" },
  { key: "challenge" as const, label: "Desafio" },
  { key: "solution" as const, label: "Solução encontrada" },
  { key: "result" as const, label: "Resultado" },
]

export function Testimonials() {
  return (
    <section id="depoimentos" className="px-6 py-20 md:py-28 bg-[var(--color-surface-overlay)]">
      <div className="max-w-6xl mx-auto">
        <Reveal className="max-w-2xl mb-12">
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--imob-moss)" }}>
            Histórias reais
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Quem encontrou seu espaço com a gente</h2>
          <p className="text-muted-foreground">
            Cada história começa com um desafio diferente — e termina com as chaves na mão.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((testimonial, index) => {
            const property = PROPERTIES.find((p) => p.name === testimonial.property)
            return (
              <Reveal key={testimonial.name} delayMs={index * 90}>
                <div className="imob-card-hover h-full flex flex-col gap-5 rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6">
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex items-center justify-center size-12 rounded-full text-sm font-semibold text-[var(--color-primary-foreground)] shrink-0"
                      style={{ backgroundImage: "var(--imob-gradient-primary)" }}
                      aria-hidden="true"
                    >
                      {testimonial.initials}
                    </span>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Adquiriu: {property?.name ?? testimonial.property}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3.5">
                    {STORY_LABELS.map(({ key, label }) => (
                      <div key={key}>
                        <p className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--imob-moss)" }}>
                          {label}
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">{testimonial[key]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
