"use client"

import { useEffect, useRef } from "react"
import { ArrowRight, CalendarCheck, Flame } from "lucide-react"
import { AnimatedCounter } from "./AnimatedCounter"
import { HERO_STATS } from "../_lib/data"

export function Hero() {
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = parallaxRef.current
    if (!node) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const offset = Math.min(window.scrollY, 600) * 0.12
        node.style.transform = `translateY(${offset}px)`
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section id="topo" className="relative px-6 pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
      <div ref={parallaxRef} className="absolute inset-0 aca-parallax" style={{ backgroundImage: "var(--aca-gradient-dark)" }}>
        <div className="absolute inset-0 aca-hero-bg" aria-hidden="true" />
        <div className="absolute inset-0 aca-noise" aria-hidden="true" />
        <div
          className="aca-blob -top-24 -left-20 size-[28rem]"
          style={{ backgroundColor: "var(--color-primary)" }}
          aria-hidden="true"
        />
        <div
          className="aca-blob top-1/3 -right-10 size-96"
          style={{ backgroundColor: "var(--color-secondary)" }}
          aria-hidden="true"
        />
      </div>

      <div className="relative max-w-6xl mx-auto text-center">
        <span className="aca-fade-up inline-flex items-center gap-2 rounded-full aca-glass px-4 py-1.5 text-xs font-semibold mb-7 text-[var(--color-primary)] uppercase tracking-wide">
          <span className="aca-pulse-dot" aria-hidden="true" />
          Matrículas abertas — vagas limitadas
        </span>

        <h1 className="aca-fade-up text-5xl md:text-7xl font-bold leading-[1.05] mb-6 text-foreground">
          Transforme Seu Corpo.
          <br />
          <span className="aca-highlight">Evolua Sua Performance.</span>
        </h1>

        <p className="aca-fade-up-delay-1 text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto aca-heading-alt">
          Treinos personalizados, equipamentos modernos e profissionais qualificados para acelerar seus resultados.
        </p>

        <div className="aca-fade-up-delay-2 flex flex-wrap items-center justify-center gap-4 mb-16">
          <a
            href="#matricula"
            className="aca-cta-highlight aca-glow inline-flex items-center gap-2 rounded-lg px-8 py-4 text-base font-bold text-[var(--color-primary-foreground)]"
            style={{ backgroundImage: "var(--aca-gradient-primary)" }}
          >
            <Flame className="size-4.5" aria-hidden="true" />
            Quero me matricular
          </a>
          <a
            href="#aula-experimental"
            className="aca-cta-highlight inline-flex items-center gap-2 rounded-lg px-8 py-4 text-base font-bold text-foreground border border-border hover:border-[var(--color-primary)] aca-glass transition-colors"
          >
            <CalendarCheck className="size-4.5" aria-hidden="true" />
            Agendar aula experimental
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>

        <div className="aca-fade-up-delay-3 flex flex-wrap items-center justify-center gap-10 md:gap-16 pt-10 border-t border-border/60 max-w-3xl mx-auto">
          {HERO_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-foreground tabular-nums" style={{ fontFamily: "var(--font-display)" }}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 aca-heading-alt">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
