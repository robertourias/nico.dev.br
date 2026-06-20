"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Reveal } from "./Reveal"

interface Testimonial {
  name: string
  role: string
  company: string
  quote: string
  initials: string
  accent: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    name: "Camila Rezende",
    role: "Gerente de Marketing",
    company: "Vetor Digital",
    quote:
      "Participei de três edições e todas entregaram conteúdo aplicável de verdade. O networking sozinho já paga o investimento.",
    initials: "CR",
    accent: "var(--nexus-purple)",
    rating: 5,
  },
  {
    name: "Thiago Bessa",
    role: "Fundador",
    company: "Orla Studio",
    quote:
      "Fechei duas parcerias estratégicas só no coffee break. A curadoria de público do NEXUS Summit é muito acima da média.",
    initials: "TB",
    accent: "var(--nexus-blue)",
    rating: 5,
  },
  {
    name: "Patrícia Gomes",
    role: "Coordenadora de RH",
    company: "Grupo Horizonte",
    quote:
      "Os workshops são realmente práticos — saí de lá com um plano de ação, não só slides bonitos.",
    initials: "PG",
    accent: "var(--nexus-cyan)",
    rating: 5,
  },
  {
    name: "Lucas Andrade",
    role: "Analista de Produto",
    company: "Faro Tech",
    quote:
      "Organização impecável, palestrantes de altíssimo nível e uma agenda que respeita o tempo de todo mundo.",
    initials: "LA",
    accent: "var(--nexus-orange)",
    rating: 4,
  },
  {
    name: "Renata Souza",
    role: "Head de Vendas",
    company: "Plano B Consultoria",
    quote:
      "Voltei para o escritório com ideias concretas e contatos que já se transformaram em negócio fechado.",
    initials: "RS",
    accent: "var(--nexus-emerald)",
    rating: 5,
  },
]

const AUTOPLAY_MS = 6000

export function TestimonialsCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback((i: number) => {
    setIndex(((i % testimonials.length) + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    if (paused) return
    timeoutRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length)
    }, AUTOPLAY_MS)
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current)
    }
  }, [paused])

  return (
    <section className="relative px-6 py-20 md:py-28" aria-labelledby="testimonials-title">
      <div className="max-w-3xl mx-auto">
        <Reveal className="text-center mb-14">
          <h2 id="testimonials-title" className="text-3xl md:text-4xl font-bold mb-4 text-[var(--nexus-fg)]">
            Quem participou, <span className="nexus-gradient-text">recomenda</span>
          </h2>
          <p className="text-[var(--nexus-fg-muted)] text-lg">
            Resultados reais de profissionais que já passaram por edições anteriores.
          </p>
        </Reveal>

        <div
          className="relative overflow-hidden rounded-3xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          role="region"
          aria-roledescription="carrossel"
          aria-label="Depoimentos de participantes"
        >
          <div className="nexus-carousel-track" style={{ transform: `translateX(-${index * 100}%)` }}>
            {testimonials.map((t) => (
              <figure key={t.name} className="w-full shrink-0 px-1">
                <div className="nexus-glass nexus-glow rounded-3xl p-8 md:p-10 text-center">
                  <Quote className="size-8 mx-auto mb-5 text-[var(--nexus-purple)]" aria-hidden="true" />
                  <div className="flex items-center justify-center gap-0.5 mb-4" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${i < t.rating ? "fill-[var(--nexus-amber)] text-[var(--nexus-amber)]" : "text-[var(--nexus-border)]"}`}
                      />
                    ))}
                  </div>
                  <blockquote className="text-lg md:text-xl text-[var(--nexus-fg)] leading-relaxed mb-7">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="flex items-center justify-center gap-3">
                    <span
                      className="inline-flex items-center justify-center size-11 rounded-full text-sm font-semibold text-white shrink-0"
                      style={{ backgroundColor: t.accent }}
                      aria-hidden="true"
                    >
                      {t.initials}
                    </span>
                    <span className="text-left">
                      <span className="block font-semibold text-[var(--nexus-fg)]">{t.name}</span>
                      <span className="block text-xs text-[var(--nexus-fg-muted)]">
                        {t.role} · {t.company}
                      </span>
                    </span>
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Depoimento anterior"
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 items-center justify-center size-10 rounded-full nexus-glass text-[var(--nexus-fg)] hover:text-[var(--nexus-purple)] transition-colors"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Próximo depoimento"
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 items-center justify-center size-10 rounded-full nexus-glass text-[var(--nexus-fg)] hover:text-[var(--nexus-purple)] transition-colors"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-7">
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ver depoimento de ${t.name}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-7 bg-[var(--nexus-purple)]" : "w-1.5 bg-[var(--nexus-border)] hover:bg-[var(--nexus-fg-faint)]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
