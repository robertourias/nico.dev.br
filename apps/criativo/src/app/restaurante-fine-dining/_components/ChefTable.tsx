import { ChefHat, Quote } from "lucide-react"
import { CHEF_NAME, CHEF_ROLE, CHEF_THOUGHTS } from "../_lib/data"
import { Reveal } from "./Reveal"

// "Mesa do Chef" — layout de entrevista, sem o formato genérico de
// "Sobre o fundador". Foto do chef é uma composição estilizada (sem ativos
// de imagem reais), acompanhada de trechos de entrevista.
export function ChefTable() {
  return (
    <section className="px-6 py-24" aria-labelledby="mesa-chef-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--color-primary)" }}>
            Uma conversa com
          </p>
          <h2 id="mesa-chef-title" className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Mesa do Chef
          </h2>
        </Reveal>

        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
          <Reveal variant="slide-right" className="lg:sticky lg:top-28">
            <div className="relative aspect-[4/5] max-w-xs mx-auto rounded-3xl overflow-hidden rest-glow" style={{ backgroundImage: "var(--rest-gradient-dark)" }}>
              <div
                className="absolute -top-10 -right-10 size-44 rounded-full opacity-70"
                style={{ backgroundImage: "var(--rest-gradient-gold)" }}
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-16 -left-10 size-52 rounded-full opacity-50"
                style={{ backgroundImage: "var(--rest-gradient-olive)" }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="inline-flex items-center justify-center size-24 rounded-full text-[var(--color-primary-foreground)] rest-glass"
                  style={{ backgroundImage: "var(--rest-gradient-gold)" }}
                  aria-hidden="true"
                >
                  <ChefHat className="size-11" />
                </span>
              </div>
            </div>
            <div className="text-center mt-6">
              <p className="rest-font-script text-2xl text-foreground">{CHEF_NAME}</p>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">{CHEF_ROLE}</p>
            </div>
          </Reveal>

          <div className="flex flex-col gap-6">
            {CHEF_THOUGHTS.map((thought, index) => (
              <Reveal key={thought.topic} delayMs={index * 120} variant="slide-left">
                <div className="rounded-2xl border border-border bg-[var(--color-surface-raised)] p-7 md:p-8 rest-card-hover">
                  <div className="flex items-start gap-4">
                    <Quote
                      className="size-8 shrink-0 rest-quote-mark"
                      style={{ color: "var(--color-primary)" }}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--color-primary)" }}>
                        {thought.topic}
                      </p>
                      <p className="text-lg text-foreground leading-relaxed rest-font-script">{thought.quote}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
