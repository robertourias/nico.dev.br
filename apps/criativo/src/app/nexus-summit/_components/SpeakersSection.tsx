import { Linkedin } from "lucide-react"
import { Reveal } from "./Reveal"

interface Speaker {
  name: string
  role: string
  company: string
  bio: string
  initials: string
  accent: string
}

// Sem fotografias reais — avatares com iniciais e cor de destaque, mesmo
// padrão usado nos depoimentos (`TestimonialsCarousel.tsx`), para manter
// consistência visual entre seções com "pessoas" fictícias.
const speakers: Speaker[] = [
  {
    name: "Marina Costa",
    role: "VP de Produto",
    company: "Lumen Tech",
    bio: "Lidera squads de produto há 12 anos e já lançou 3 plataformas usadas por milhões de pessoas.",
    initials: "MC",
    accent: "var(--nexus-purple)",
  },
  {
    name: "Rafael Tavares",
    role: "Head de Dados",
    company: "Orbita Labs",
    bio: "Especialista em dados e IA aplicada, ajuda empresas a transformar dados em decisão estratégica.",
    initials: "RT",
    accent: "var(--nexus-blue)",
  },
  {
    name: "Juliana Prado",
    role: "Founder & CEO",
    company: "Crescer.io",
    bio: "Construiu e vendeu duas startups de growth; hoje mentora fundadores em fase de escala.",
    initials: "JP",
    accent: "var(--nexus-cyan)",
  },
  {
    name: "Diego Almeida",
    role: "Diretor de Pessoas",
    company: "Grupo Vértice",
    bio: "Referência em liderança de times híbridos, com passagens por empresas Fortune 500.",
    initials: "DA",
    accent: "var(--nexus-orange)",
  },
  {
    name: "Beatriz Lins",
    role: "Design Lead",
    company: "Studio Prisma",
    bio: "Premiada internacionalmente por projetos de design centrado em conversão e acessibilidade.",
    initials: "BL",
    accent: "var(--nexus-emerald)",
  },
  {
    name: "Eduardo Nunes",
    role: "CTO",
    company: "Nimbus Cloud",
    bio: "Arquiteto de sistemas distribuídos, palestrante recorrente em conferências de tecnologia.",
    initials: "EN",
    accent: "var(--nexus-rose)",
  },
]

export function SpeakersSection() {
  return (
    <section
      id="palestrantes"
      className="relative px-6 py-20 md:py-28 bg-[var(--nexus-bg-soft)] scroll-mt-20"
      aria-labelledby="speakers-title"
    >
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <h2 id="speakers-title" className="text-3xl md:text-4xl font-bold mb-4 text-[var(--nexus-fg)]">
            Quem vai estar no <span className="nexus-gradient-text">palco</span>
          </h2>
          <p className="text-[var(--nexus-fg-muted)] text-lg">
            Líderes que vivem o mercado na prática — passe o mouse para conhecer cada palestrante.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {speakers.map((speaker, i) => (
            <Reveal key={speaker.name} variant="fade-up" delayMs={(i % 3) * 90}>
              <div className="group nexus-card-hover rounded-2xl p-7 h-full bg-white border border-[var(--nexus-border)]">
                <div className="flex items-center gap-4 mb-4">
                  <span
                    className="inline-flex items-center justify-center size-14 rounded-2xl text-white font-bold text-lg shrink-0"
                    style={{ backgroundColor: speaker.accent }}
                    aria-hidden="true"
                  >
                    {speaker.initials}
                  </span>
                  <div>
                    <p className="font-semibold text-[var(--nexus-fg)]">{speaker.name}</p>
                    <p className="text-sm text-[var(--nexus-fg-muted)]">{speaker.role}</p>
                    <p className="text-xs text-[var(--nexus-fg-faint)]">{speaker.company}</p>
                  </div>
                </div>

                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
                  <div className="overflow-hidden">
                    <p className="text-sm text-[var(--nexus-fg-muted)] leading-relaxed pt-1 pb-1">{speaker.bio}</p>
                    <a
                      href="#"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--nexus-purple)] hover:underline mt-2"
                      aria-label={`Perfil de ${speaker.name} no LinkedIn`}
                    >
                      <Linkedin className="size-3.5" aria-hidden="true" />
                      Ver perfil
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
