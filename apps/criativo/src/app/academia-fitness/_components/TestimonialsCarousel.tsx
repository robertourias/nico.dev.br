"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Reveal } from "./Reveal"
import { TESTIMONIALS } from "../_lib/data"

const AUTOPLAY_MS = 6500

export function TestimonialsCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback((i: number) => {
    setIndex(((i % TESTIMONIALS.length) + TESTIMONIALS.length) % TESTIMONIALS.length)
  }, [])

  useEffect(() => {
    if (paused) return
    timeoutRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length)
    }, AUTOPLAY_MS)
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current)
    }
  }, [paused])

  return (
    <section className="relative px-6 py-20 md:py-28" aria-labelledby="testimonials-title">
      <div className="max-w-3xl mx-auto">
        <Reveal className="text-center mb-14">
          <h2 id="testimonials-title" className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            O que nossos <span className="aca-highlight">alunos dizem</span>
          </h2>
        </Reveal>

        <div
          className="relative overflow-hidden rounded-3xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          role="region"
          aria-roledescription="carrossel"
          aria-label="Depoimentos de alunos"
        >
          <div className="aca-carousel-track" style={{ transform: `translateX(-${index * 100}%)` }}>
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="w-full shrink-0 px-1">
                <div className="aca-glass aca-glow rounded-3xl p-8 md:p-10 text-center">
                  <Quote className="size-8 mx-auto mb-5 text-[var(--color-primary)]" aria-hidden="true" />
                  <div className="flex items-center justify-center gap-0.5 mb-4" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${i < t.rating ? "fill-[var(--color-primary)] text-[var(--color-primary)]" : "text-border"}`}
                      />
                    ))}
                  </div>
                  <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-7">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="flex items-center justify-center gap-3">
                    <span
                      className="inline-flex items-center justify-center size-11 rounded-full text-sm font-semibold text-[var(--color-primary-foreground)] shrink-0"
                      style={{ backgroundImage: "var(--aca-gradient-primary)" }}
                      aria-hidden="true"
                    >
                      {t.initials}
                    </span>
                    <span className="text-left">
                      <span className="block font-semibold text-foreground">{t.name}</span>
                      <span className="block text-xs text-muted-foreground">{t.since}</span>
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
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 items-center justify-center size-10 rounded-full aca-glass text-foreground hover:text-[var(--color-primary)] transition-colors"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Próximo depoimento"
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 items-center justify-center size-10 rounded-full aca-glass text-foreground hover:text-[var(--color-primary)] transition-colors"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-7">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.name}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ver depoimento de ${t.name}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-7" : "w-1.5 bg-border hover:bg-muted-foreground"
              }`}
              style={i === index ? { backgroundColor: "var(--color-primary)" } : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
