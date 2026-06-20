import { Target, Users2, GraduationCap, Gem } from "lucide-react"
import { Reveal } from "./Reveal"
import { EventIllustration } from "./EventIllustration"

const points = [
  {
    icon: Target,
    title: "Objetivo do evento",
    description:
      "Conectar profissionais e empresas em torno das principais tendências do mercado, com conteúdo prático aplicável imediatamente.",
  },
  {
    icon: Users2,
    title: "Público-alvo",
    description:
      "Profissionais, gestores, empreendedores e especialistas que querem se atualizar e ampliar sua rede de contatos.",
  },
  {
    icon: GraduationCap,
    title: "O que você vai aprender",
    description:
      "Estratégias validadas, estudos de caso reais e ferramentas práticas apresentadas por quem vive o mercado todos os dias.",
  },
  {
    icon: Gem,
    title: "Diferenciais",
    description:
      "Curadoria de palestrantes, agenda enxuta sem sobreposição de conteúdo relevante e espaço dedicado para networking qualificado.",
  },
]

export function AboutSection() {
  return (
    <section className="relative px-6 py-20 md:py-28 bg-[var(--nexus-bg-soft)]" aria-labelledby="about-title">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        <Reveal variant="slide-right">
          <h2 id="about-title" className="text-3xl md:text-4xl font-bold mb-6 text-[var(--nexus-fg)]">
            Sobre o <span className="nexus-gradient-text">NEXUS Summit</span>
          </h2>
          <p className="text-[var(--nexus-fg-muted)] text-lg mb-10 max-w-xl">
            Um dia inteiro dedicado a conteúdo de alto nível, conexões reais e tendências que vão moldar o
            próximo ciclo do seu mercado — em formato híbrido, presencial e online.
          </p>

          <div className="flex flex-col gap-6">
            {points.map((point) => (
              <div key={point.title} className="flex items-start gap-4">
                <span
                  className="inline-flex items-center justify-center size-11 rounded-xl shrink-0"
                  style={{ backgroundImage: "var(--nexus-gradient-primary)" }}
                >
                  <point.icon className="size-5 text-white" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold text-[var(--nexus-fg)] mb-1">{point.title}</h3>
                  <p className="text-sm text-[var(--nexus-fg-muted)] leading-relaxed">{point.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal variant="slide-left">
          <EventIllustration />
        </Reveal>
      </div>
    </section>
  )
}
