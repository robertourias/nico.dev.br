"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { Reveal } from "./Reveal"

interface Testimonial {
  name: string
  role: string
  quote: string
  initials: string
  accent: string
}

const testimonials: Testimonial[] = [
  {
    name: "Carla Mendes",
    role: "Gerente de Produto",
    quote:
      "Em 3 semanas eu já tinha recuperado o controle da minha agenda. O sistema do Método Ápice é simples de seguir mesmo nas semanas mais caóticas.",
    initials: "CM",
    accent: "var(--apice-purple)",
  },
  {
    name: "Rafael Tavares",
    role: "Fundador de startup",
    quote:
      "Eu já tinha tentado de tudo — apps, planners, técnicas. O que mudou aqui foi ter um sistema completo, não mais uma dica isolada.",
    initials: "RT",
    accent: "var(--apice-blue)",
  },
  {
    name: "Juliana Prado",
    role: "Médica e pesquisadora",
    quote:
      "Pela primeira vez consegui produzir mais trabalhando menos horas. A parte de descanso estruturado mudou completamente minha relação com o trabalho.",
    initials: "JP",
    accent: "var(--apice-violet)",
  },
  {
    name: "Diego Almeida",
    role: "Consultor financeiro",
    quote:
      "A comunidade fez toda diferença. Ter pessoas no mesmo módulo que eu, na mesma semana, me manteve consistente do início ao fim.",
    initials: "DA",
    accent: "var(--apice-neon)",
  },
  {
    name: "Beatriz Lins",
    role: "Designer freelancer",
    quote:
      "Methodo Ápice é o equilíbrio raro entre prático e profundo. Implementei no primeiro dia e já senti diferença na mesma semana.",
    initials: "BL",
    accent: "var(--apice-amber)",
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
    <section className="relative px-6 py-20 md:py-28 bg-[var(--apice-bg-raised)]" aria-labelledby="testimonials-title">
      <div className="max-w-3xl mx-auto">
        <Reveal className="text-center mb-14">
          <h2 id="testimonials-title" className="text-3xl md:text-4xl font-bold mb-4">
            Quem entrou, <span className="apice-gradient-text">transformou</span>
          </h2>
          <p className="text-[var(--apice-fg-muted)] text-lg">
            Resultados reais de quem já passou pelo Método Ápice em turmas anteriores.
          </p>
        </Reveal>

        <div
          className="relative overflow-hidden rounded-3xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          role="region"
          aria-roledescription="carrossel"
          aria-label="Depoimentos de alunos"
        >
          <div
            className="apice-carousel-track"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {testimonials.map((t) => (
              <figure key={t.name} className="w-full shrink-0 px-1">
                <div className="apice-glass apice-glow rounded-3xl p-8 md:p-10 text-center">
                  <Quote className="size-8 mx-auto mb-5 text-[var(--apice-violet)]" aria-hidden="true" />
                  <blockquote className="text-lg md:text-xl text-[var(--apice-fg)] leading-relaxed mb-7">
                    “{t.quote}”
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
                      <span className="block font-semibold text-[var(--apice-fg)]">{t.name}</span>
                      <span className="block text-xs text-[var(--apice-fg-muted)]">{t.role}</span>
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
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 items-center justify-center size-10 rounded-full apice-glass text-[var(--apice-fg)] hover:text-[var(--apice-violet)] transition-colors"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Próximo depoimento"
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 items-center justify-center size-10 rounded-full apice-glass text-[var(--apice-fg)] hover:text-[var(--apice-violet)] transition-colors"
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
                i === index ? "w-7 bg-[var(--apice-violet)]" : "w-1.5 bg-white/15 hover:bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
