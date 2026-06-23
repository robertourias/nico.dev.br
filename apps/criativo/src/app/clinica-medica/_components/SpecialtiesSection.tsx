import { Stethoscope, HeartPulse, Sparkles, Baby, Venus, Bone, Dna } from "lucide-react"
import { Reveal } from "./Reveal"
import { SPECIALTIES, type SpecialtyIcon } from "../_lib/data"

const ICONS: Record<SpecialtyIcon, typeof Stethoscope> = {
  geral: Stethoscope,
  cardiologia: HeartPulse,
  dermatologia: Sparkles,
  pediatria: Baby,
  ginecologia: Venus,
  ortopedia: Bone,
  endocrinologia: Dna,
}

export function SpecialtiesSection() {
  return (
    <section id="especialidades" className="px-6 py-20 md:py-28 scroll-mt-20 bg-[var(--color-surface)]" aria-labelledby="specialties-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14 max-w-2xl mx-auto">
          <h2 id="specialties-title" className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Nossas <span className="text-[var(--color-primary)]">Especialidades</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Atendimento especializado para cuidar de cada fase e necessidade da sua saúde.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SPECIALTIES.map((specialty, index) => {
            const Icon = ICONS[specialty.icon]
            return (
              <Reveal key={specialty.title} delayMs={index * 50}>
                <div className="clin-area-card h-full flex flex-col rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6">
                  <span
                    className="clin-area-icon inline-flex items-center justify-center size-12 rounded-xl mb-4 text-white"
                    style={{ backgroundImage: "var(--clin-gradient-primary)" }}
                    aria-hidden="true"
                  >
                    <Icon className="size-5.5" />
                  </span>
                  <p className="font-semibold text-foreground mb-1.5">{specialty.title}</p>
                  <p className="text-sm text-muted-foreground mb-5 flex-1">{specialty.description}</p>
                  <a
                    href={specialty.href}
                    className="clin-cta-highlight inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white"
                    style={{ backgroundImage: "var(--clin-gradient-green)" }}
                  >
                    Agendar
                  </a>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
