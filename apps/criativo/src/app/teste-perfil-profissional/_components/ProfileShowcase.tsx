import type { LucideIcon } from "lucide-react"
import { LineChart, Rocket, Users, Lightbulb } from "lucide-react"
import { Reveal } from "./Reveal"
import { SkillBar } from "./SkillBar"

interface ProfileExample {
  icon: LucideIcon
  name: string
  traits: string[]
  compatibility: number
  accent: string
}

const profiles: ProfileExample[] = [
  {
    icon: LineChart,
    name: "Perfil Analítico",
    traits: ["Organização", "Planejamento", "Raciocínio lógico"],
    compatibility: 91,
    accent: "var(--color-primary)",
  },
  {
    icon: Rocket,
    name: "Perfil Executor",
    traits: ["Ação", "Resultado", "Velocidade"],
    compatibility: 86,
    accent: "var(--color-secondary)",
  },
  {
    icon: Users,
    name: "Perfil Comunicador",
    traits: ["Relacionamento", "Influência", "Colaboração"],
    compatibility: 89,
    accent: "var(--color-primary-light)",
  },
  {
    icon: Lightbulb,
    name: "Perfil Estratégico",
    traits: ["Visão", "Liderança", "Inovação"],
    compatibility: 94,
    accent: "var(--color-secondary-light)",
  },
]

export function ProfileShowcase() {
  return (
    <section className="relative px-6 py-20 md:py-28" aria-labelledby="profiles-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14">
          <h2 id="profiles-title" className="text-3xl md:text-4xl font-bold mb-4">
            Exemplos de <span className="perfil-gradient-text">perfis identificados</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            O teste mapeia combinações únicas de comportamento. Veja alguns dos perfis possíveis.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {profiles.map(({ icon: Icon, name, traits, compatibility, accent }, i) => (
            <Reveal key={name} delayMs={i * 90}>
              <div className="perfil-card-hover h-full rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6 flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="inline-flex items-center justify-center size-11 rounded-xl"
                    style={{ backgroundColor: "var(--color-surface-overlay)" }}
                  >
                    <Icon className="size-5" style={{ color: accent }} aria-hidden="true" />
                  </div>
                  <span className="text-xs font-semibold text-primary bg-accent rounded-full px-2.5 py-1">
                    {compatibility}% compatível
                  </span>
                </div>

                <h3 className="font-semibold text-foreground mb-3">{name}</h3>

                <ul className="flex flex-wrap gap-1.5 mb-5">
                  {traits.map((trait) => (
                    <li
                      key={trait}
                      className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-surface)] text-muted-foreground border border-border"
                    >
                      {trait}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <SkillBar label="Compatibilidade" value={compatibility} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
