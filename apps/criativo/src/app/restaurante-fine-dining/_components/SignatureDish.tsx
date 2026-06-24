import { Sparkles, Flame, Sparkle } from "lucide-react"
import { SIGNATURE_DISH } from "../_lib/data"
import { Reveal } from "./Reveal"

const STAGE_ICONS = [Sparkles, Flame, Sparkle]

// "Prato em Movimento" — grande destaque cinematográfico de um prato
// exclusivo, revelado em três estágios via scroll (sem vídeo real: a
// composição visual evolui com camadas e anéis decorativos por estágio).
export function SignatureDish() {
  return (
    <section id="prato-em-movimento" className="relative px-6 py-24 overflow-hidden bg-[var(--color-surface)]" aria-labelledby="prato-title">
      <div
        className="absolute inset-0 opacity-60"
        style={{ backgroundImage: "var(--rest-gradient-dark)" }}
        aria-hidden="true"
      />
      <div className="relative max-w-6xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--color-primary)" }}>
            Destaque Cinematográfico
          </p>
          <h2 id="prato-title" className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Prato em Movimento
          </h2>
          <p className="text-muted-foreground rest-font-script text-xl">{SIGNATURE_DISH.name}</p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          {SIGNATURE_DISH.stages.map((stage, index) => {
            const Icon = STAGE_ICONS[index] ?? Sparkles
            return (
              <Reveal key={stage.step} delayMs={index * 150} variant="scale-in">
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative size-32 mb-6">
                    <div className="absolute inset-0 rounded-full rest-stage-ring" aria-hidden="true" />
                    <div
                      className="absolute inset-4 rounded-full flex items-center justify-center text-[var(--color-primary-foreground)] rest-glow"
                      style={{ backgroundImage: "var(--rest-gradient-gold)" }}
                    >
                      <Icon className="size-9" aria-hidden="true" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 inline-flex items-center justify-center size-9 rounded-full bg-[var(--color-surface-overlay)] border border-border text-xs font-semibold text-foreground">
                      {stage.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 rest-font-serif">{stage.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{stage.description}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
