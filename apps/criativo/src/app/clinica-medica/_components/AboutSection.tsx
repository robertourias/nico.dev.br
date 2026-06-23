import { Building2 } from "lucide-react"
import { Reveal } from "./Reveal"
import { AnimatedCounter } from "./AnimatedCounter"
import { ABOUT_STATS } from "../_lib/data"

export function AboutSection() {
  return (
    <section id="sobre" className="px-6 py-20 md:py-28 scroll-mt-20 bg-[var(--color-surface)]" aria-labelledby="about-title">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-12 items-start">
        <Reveal variant="slide-right">
          <h2 id="about-title" className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Sobre a <span className="text-[var(--color-primary)]">Clínica</span>
          </h2>

          <p className="text-muted-foreground leading-relaxed mb-6">
            Há 15 anos, a Clínica Vitalis acompanha a saúde de famílias e profissionais com uma equipe
            multidisciplinar dedicada e uma estrutura pensada para o conforto de cada paciente. Combinamos
            tecnologia, ambientes modernos e atendimento humanizado para que cada consulta seja também um momento
            de cuidado real.
          </p>

          <div className="grid sm:grid-cols-2 gap-5 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1.5 text-[var(--color-primary)]">
                Missão
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cuidar da saúde de cada paciente com excelência técnica, tecnologia e atenção verdadeiramente
                humanizada.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1.5 text-[var(--color-primary)]">
                Visão
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ser referência em atendimento médico multidisciplinar acessível, próximo e baseado em confiança.
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-[var(--color-primary)]">
              Valores
            </p>
            <ul className="flex flex-wrap gap-2">
              {["Acolhimento", "Excelência técnica", "Transparência", "Tecnologia", "Empatia"].map((value) => (
                <li
                  key={value}
                  className="text-sm font-medium text-foreground rounded-full border border-border px-3.5 py-1.5"
                >
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal variant="slide-left">
          <div className="clin-glass clin-glow rounded-3xl p-6 md:p-8 mb-6 flex items-center justify-center aspect-[4/3]">
            <div className="flex flex-col items-center text-center">
              <span
                className="inline-flex items-center justify-center size-16 rounded-2xl text-white mb-4"
                style={{ backgroundImage: "var(--clin-gradient-primary)" }}
                aria-hidden="true"
              >
                <Building2 className="size-7" />
              </span>
              <p className="text-lg font-semibold text-foreground">Av. Higienópolis, 980</p>
              <p className="text-sm text-muted-foreground">Higienópolis, São Paulo — SP</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {ABOUT_STATS.map((stat, index) => (
              <Reveal
                key={stat.label}
                delayMs={index * 70}
                className="rounded-2xl border border-border bg-[var(--color-surface-raised)] p-5 text-center"
              >
                <p className="text-2xl md:text-3xl font-bold text-foreground tabular-nums">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                </p>
                <p className="text-xs text-muted-foreground mt-1.5">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
