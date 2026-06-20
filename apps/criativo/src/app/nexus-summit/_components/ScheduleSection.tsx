"use client"

import { useMemo, useState } from "react"
import { ChevronDown, Heart, Printer, MapPin, type LucideIcon, Mic2, Coffee, Wrench, PartyPopper } from "lucide-react"
import { Reveal } from "./Reveal"

type Category = "Geral" | "Palestra" | "Workshop" | "Networking"

interface Session {
  id: string
  time: string
  title: string
  category: Category
  location: string
  speaker?: string
  description: string
}

const CATEGORY_ICON: Record<Category, LucideIcon> = {
  Geral: Coffee,
  Palestra: Mic2,
  Workshop: Wrench,
  Networking: PartyPopper,
}

const CATEGORY_COLOR: Record<Category, string> = {
  Geral: "var(--nexus-fg-muted)",
  Palestra: "var(--nexus-purple)",
  Workshop: "var(--nexus-orange)",
  Networking: "var(--nexus-cyan)",
}

const sessions: Session[] = [
  {
    id: "credenciamento",
    time: "09:00",
    title: "Credenciamento",
    category: "Geral",
    location: "Hall principal",
    description: "Retirada de credencial, kit do participante e welcome coffee.",
  },
  {
    id: "abertura",
    time: "10:00",
    title: "Abertura Oficial",
    category: "Geral",
    location: "Auditório Aurora",
    description: "Boas-vindas, apresentação da agenda do dia e destaques da edição.",
  },
  {
    id: "palestra-principal",
    time: "11:00",
    title: "Palestra Principal: O Futuro do Trabalho",
    category: "Palestra",
    location: "Auditório Aurora",
    speaker: "Marina Costa",
    description: "Como tecnologia, dados e cultura organizacional estão redesenhando o trabalho nos próximos 5 anos.",
  },
  {
    id: "palestra-dados",
    time: "12:00",
    title: "Inovação Orientada a Dados",
    category: "Palestra",
    location: "Auditório Aurora",
    speaker: "Rafael Tavares",
    description: "Estudos de caso de empresas que usaram dados para acelerar decisões e crescimento.",
  },
  {
    id: "networking-almoco",
    time: "13:00",
    title: "Networking & Almoço",
    category: "Networking",
    location: "Lounge Central",
    description: "Espaço estruturado para conexões — mesas temáticas por área de atuação.",
  },
  {
    id: "workshop-growth",
    time: "14:00",
    title: "Workshop Prático: Growth Aplicado",
    category: "Workshop",
    location: "Sala Beta",
    speaker: "Juliana Prado",
    description: "Mão na massa: construção de um plano de growth de 90 dias em grupo.",
  },
  {
    id: "workshop-lideranca",
    time: "14:00",
    title: "Workshop Prático: Liderança de Alta Performance",
    category: "Workshop",
    location: "Sala Gama",
    speaker: "Diego Almeida",
    description: "Ferramentas práticas para liderar times remotos e híbridos com mais autonomia.",
  },
  {
    id: "painel-tendencias",
    time: "15:30",
    title: "Painel: Tendências do Setor",
    category: "Palestra",
    location: "Auditório Aurora",
    description: "Mesa-redonda com especialistas debatendo os próximos 12 meses do mercado.",
  },
  {
    id: "networking-lounge",
    time: "16:15",
    title: "Networking Lounge",
    category: "Networking",
    location: "Lounge Central",
    description: "Última oportunidade de conexão antes do encerramento — drinks e música ao vivo.",
  },
  {
    id: "encerramento",
    time: "17:00",
    title: "Encerramento & Sorteios",
    category: "Geral",
    location: "Auditório Aurora",
    description: "Mensagem final, sorteio de brindes exclusivos e divulgação da próxima edição.",
  },
]

const categories: Category[] = ["Geral", "Palestra", "Workshop", "Networking"]

export function ScheduleSection() {
  const [activeCategory, setActiveCategory] = useState<Category | "Todos">("Todos")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [openId, setOpenId] = useState<string | null>(sessions[2].id)

  const filtered = useMemo(
    () => (activeCategory === "Todos" ? sessions : sessions.filter((s) => s.category === activeCategory)),
    [activeCategory]
  )

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Diferencial de portfólio: em vez de gerar um PDF real (exigiria lib
  // extra só para esse mock), usamos a impressão nativa do navegador, que já
  // permite "Salvar como PDF" — funcionalidade real, não simulada. O CSS de
  // impressão em theme.css isola `#nexus-print-area`.
  function handlePrint() {
    window.print()
  }

  return (
    <section id="programacao" className="relative px-6 py-20 md:py-28 scroll-mt-20" aria-labelledby="schedule-title">
      <div className="max-w-3xl mx-auto">
        <Reveal className="text-center mb-10">
          <h2 id="schedule-title" className="text-3xl md:text-4xl font-bold mb-4 text-[var(--nexus-fg)]">
            Programação do <span className="nexus-gradient-text">dia</span>
          </h2>
          <p className="text-[var(--nexus-fg-muted)] text-lg">
            Filtre por categoria e favorite as sessões que não pode perder.
          </p>
        </Reveal>

        <Reveal className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <button
            type="button"
            onClick={() => setActiveCategory("Todos")}
            aria-pressed={activeCategory === "Todos"}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors border ${
              activeCategory === "Todos"
                ? "text-white border-transparent"
                : "text-[var(--nexus-fg-muted)] border-[var(--nexus-border)] hover:text-[var(--nexus-fg)]"
            }`}
            style={activeCategory === "Todos" ? { backgroundImage: "var(--nexus-gradient-primary)" } : undefined}
          >
            Todos
          </button>
          {categories.map((category) => {
            const active = activeCategory === category
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={active}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors border ${
                  active
                    ? "text-white border-transparent"
                    : "text-[var(--nexus-fg-muted)] border-[var(--nexus-border)] hover:text-[var(--nexus-fg)]"
                }`}
                style={active ? { backgroundColor: CATEGORY_COLOR[category] } : undefined}
              >
                {category}
              </button>
            )
          })}

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium border border-[var(--nexus-border)] text-[var(--nexus-fg-muted)] hover:text-[var(--nexus-fg)] transition-colors ml-auto"
          >
            <Printer className="size-3.5" aria-hidden="true" />
            Imprimir / Salvar PDF
          </button>
        </Reveal>

        <div id="nexus-print-area" className="relative flex flex-col gap-4" role="list">
          {filtered.map((session, i) => {
            const Icon = CATEGORY_ICON[session.category]
            const open = openId === session.id
            const isFavorite = favorites.has(session.id)

            return (
              <Reveal key={session.id} variant="fade-up" delayMs={i * 40} role="listitem">
                <div className="nexus-glass nexus-card-hover rounded-2xl overflow-hidden">
                  <div className="flex items-stretch gap-4 p-5">
                    <div className="flex flex-col items-center shrink-0 w-16">
                      <span className="text-sm font-bold text-[var(--nexus-fg)] tabular-nums">{session.time}</span>
                      <span
                        className="mt-2 inline-flex items-center justify-center size-9 rounded-xl"
                        style={{ backgroundColor: `${CATEGORY_COLOR[session.category]}1a` }}
                      >
                        <Icon className="size-4" style={{ color: CATEGORY_COLOR[session.category] }} aria-hidden="true" />
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : session.id)}
                      aria-expanded={open}
                      className="flex-1 flex items-center justify-between gap-3 text-left"
                    >
                      <div>
                        <p className="font-semibold text-[var(--nexus-fg)]">{session.title}</p>
                        <p className="text-xs text-[var(--nexus-fg-muted)] mt-0.5 flex items-center gap-1.5">
                          <MapPin className="size-3" aria-hidden="true" />
                          {session.location}
                          {session.speaker ? ` · ${session.speaker}` : ""}
                        </p>
                      </div>
                      <ChevronDown
                        className={`size-5 text-[var(--nexus-fg-faint)] shrink-0 transition-transform duration-300 ${
                          open ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleFavorite(session.id)}
                      aria-pressed={isFavorite}
                      aria-label={isFavorite ? "Remover dos favoritos" : "Favoritar sessão"}
                      className="shrink-0 self-center inline-flex items-center justify-center size-9 rounded-full transition-colors hover:bg-[var(--nexus-bg-soft)]"
                    >
                      <Heart
                        className={`size-4 transition-colors ${
                          isFavorite ? "fill-[var(--nexus-rose)] text-[var(--nexus-rose)]" : "text-[var(--nexus-fg-faint)]"
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  <div className="nexus-timeline-panel" data-open={open}>
                    <div>
                      <p className="px-5 pb-5 text-sm text-[var(--nexus-fg-muted)] leading-relaxed">
                        {session.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}

          {filtered.length === 0 && (
            <p className="text-center text-sm text-[var(--nexus-fg-muted)] py-10">
              Nenhuma sessão nesta categoria.
            </p>
          )}
        </div>

        {favorites.size > 0 && (
          <p className="text-center text-sm text-[var(--nexus-fg-muted)] mt-6">
            <Heart className="inline size-3.5 fill-[var(--nexus-rose)] text-[var(--nexus-rose)] mr-1" aria-hidden="true" />
            {favorites.size} {favorites.size === 1 ? "sessão favoritada" : "sessões favoritadas"}
          </p>
        )}
      </div>
    </section>
  )
}
