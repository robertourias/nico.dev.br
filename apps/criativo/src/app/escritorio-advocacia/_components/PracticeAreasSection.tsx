import {
  Scale,
  Briefcase,
  Building2,
  Landmark,
  Home,
  Users,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
} from "lucide-react"
import { Reveal } from "./Reveal"
import { PRACTICE_AREAS, type PracticeAreaIcon } from "../_lib/data"

const ICONS: Record<PracticeAreaIcon, typeof Scale> = {
  civil: Scale,
  trabalhista: Briefcase,
  empresarial: Building2,
  tributario: Landmark,
  imobiliario: Home,
  familia: Users,
  previdenciario: ShieldCheck,
  consumidor: ShoppingBag,
}

export function PracticeAreasSection() {
  return (
    <section id="areas" className="px-6 py-20 md:py-28 scroll-mt-20" aria-labelledby="areas-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14 max-w-2xl mx-auto">
          <h2 id="areas-title" className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Áreas de <span style={{ color: "var(--adv-gold)" }}>Atuação</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Atuação especializada nas principais demandas jurídicas de pessoas e empresas.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRACTICE_AREAS.map((area, index) => {
            const Icon = ICONS[area.icon]
            return (
              <Reveal key={area.title} delayMs={index * 50}>
                <a
                  href={area.href}
                  className="adv-area-card group block h-full rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6"
                >
                  <span
                    className="adv-area-icon inline-flex items-center justify-center size-12 rounded-xl mb-4 text-white"
                    style={{ backgroundImage: "var(--adv-gradient-primary)" }}
                    aria-hidden="true"
                  >
                    <Icon className="size-5.5" />
                  </span>
                  <p className="font-semibold text-foreground mb-1.5">{area.title}</p>
                  <p className="text-sm text-muted-foreground mb-4">{area.description}</p>
                  <span
                    className="inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all"
                    style={{ color: "var(--adv-gold)" }}
                  >
                    Saber mais
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </span>
                </a>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
