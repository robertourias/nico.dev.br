import { Mic2, Handshake, BookOpenCheck, Rocket, Gift, Award, type LucideIcon } from "lucide-react"
import { Reveal } from "./Reveal"

interface Highlight {
  icon: LucideIcon
  title: string
  description: string
}

const highlights: Highlight[] = [
  {
    icon: Mic2,
    title: "Especialistas renomados",
    description: "Palestrantes que lideram empresas e iniciativas de referência no mercado.",
  },
  {
    icon: Handshake,
    title: "Networking estratégico",
    description: "Conexões reais com profissionais, decisores e potenciais parceiros de negócio.",
  },
  {
    icon: BookOpenCheck,
    title: "Conteúdo prático",
    description: "Workshops aplicáveis no dia seguinte, sem teoria solta ou conteúdo genérico.",
  },
  {
    icon: Rocket,
    title: "Tendências do mercado",
    description: "Panorama atualizado sobre o que está mudando e o que vem a seguir no seu setor.",
  },
  {
    icon: Gift,
    title: "Materiais exclusivos",
    description: "Apresentações, templates e relatórios liberados só para participantes do evento.",
  },
  {
    icon: Award,
    title: "Certificado de participação",
    description: "Certificado digital reconhecido, válido para currículo e horas de capacitação.",
  },
]

export function HighlightsSection() {
  return (
    <section className="relative px-6 py-20 md:py-28" aria-labelledby="highlights-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <h2 id="highlights-title" className="text-3xl md:text-4xl font-bold mb-4 text-[var(--nexus-fg)]">
            Por que participar do <span className="nexus-gradient-text">NEXUS Summit</span>
          </h2>
          <p className="text-[var(--nexus-fg-muted)] text-lg">
            Um evento desenhado para gerar resultado real — não apenas mais um item na agenda.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {highlights.map((item, i) => (
            <Reveal key={item.title} variant="fade-up" delayMs={(i % 3) * 90}>
              <div className="nexus-glass nexus-card-hover rounded-2xl p-7 h-full">
                <div
                  className="inline-flex items-center justify-center size-12 rounded-xl mb-5"
                  style={{ backgroundImage: "var(--nexus-gradient-primary)" }}
                >
                  <item.icon className="size-6 text-white" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-[var(--nexus-fg)]">{item.title}</h3>
                <p className="text-sm text-[var(--nexus-fg-muted)] leading-relaxed">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
