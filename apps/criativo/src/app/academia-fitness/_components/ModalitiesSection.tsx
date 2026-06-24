import { Dumbbell, Zap, Bike, Flower2, Trophy, UserCheck, Footprints, StretchHorizontal, Check } from "lucide-react"
import { Reveal } from "./Reveal"
import { MODALITIES, type ModalityIcon } from "../_lib/data"

const ICONS: Record<ModalityIcon, typeof Dumbbell> = {
  musculacao: Dumbbell,
  funcional: Zap,
  spinning: Bike,
  pilates: Flower2,
  cross: Trophy,
  personal: UserCheck,
  corrida: Footprints,
  alongamento: StretchHorizontal,
}

export function ModalitiesSection() {
  return (
    <section id="modalidades" className="px-6 py-20 md:py-28 scroll-mt-20" aria-labelledby="modalities-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14 max-w-2xl mx-auto">
          <h2 id="modalities-title" className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Modalidades <span className="aca-highlight">Disponíveis</span>
          </h2>
          <p className="text-muted-foreground text-lg aca-heading-alt">
            Escolha como você quer treinar — ou combine mais de uma modalidade no seu plano.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MODALITIES.map((modality, index) => {
            const Icon = ICONS[modality.icon]
            return (
              <Reveal key={modality.title} delayMs={index * 50}>
                <div className="aca-card-hover h-full flex flex-col rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6">
                  <span
                    className="inline-flex items-center justify-center size-11 rounded-xl mb-4 text-[var(--color-primary-foreground)]"
                    style={{ backgroundImage: "var(--aca-gradient-primary)" }}
                    aria-hidden="true"
                  >
                    <Icon className="size-5" />
                  </span>
                  <p className="font-semibold text-foreground mb-1.5 aca-heading-alt text-base">{modality.title}</p>
                  <p className="text-sm text-muted-foreground mb-4 flex-1 leading-relaxed">{modality.description}</p>

                  <ul className="flex flex-col gap-1.5 mb-4">
                    {modality.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Check className="size-3.5 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  <span className="inline-flex items-center self-start rounded-full bg-[var(--color-accent)] text-[var(--color-accent-foreground)] px-3 py-1 text-[11px] font-semibold">
                    {modality.audience}
                  </span>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
