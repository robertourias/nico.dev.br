"use client"

import { useEffect, useRef } from "react"
import { ArrowRight, MessageCircle, ShieldCheck, Scale } from "lucide-react"
import { AnimatedCounter } from "./AnimatedCounter"
import { HERO_CREDENTIALS } from "../_lib/data"

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
    <section id="topo" className="relative px-6 pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
      <div ref={parallaxRef} className="absolute inset-0 adv-parallax">
        <div className="absolute inset-0 adv-grid-bg" aria-hidden="true" />
        <div
          className="adv-blob -top-20 -left-24 size-96"
          style={{ backgroundImage: "var(--adv-gradient-primary)" }}
          aria-hidden="true"
        />
        <div
          className="adv-blob top-40 right-0 size-80"
          style={{ backgroundImage: "var(--adv-gradient-gold)" }}
          aria-hidden="true"
        />
      </div>

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-12 items-center">
        <div className="adv-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full adv-glass px-4 py-1.5 text-xs font-semibold mb-6" style={{ color: "var(--adv-gold)" }}>
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Assessoria jurídica desde 2008
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5 text-foreground">
            Assessoria Jurídica Estratégica para{" "}
            <span className="adv-highlight">Proteger Seus Direitos</span> e Negócios
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-xl adv-fade-up-delay-1">
            Atuação especializada com atendimento humanizado e soluções jurídicas personalizadas.
          </p>

          <div className="flex flex-wrap items-center gap-4 adv-fade-up-delay-2">
            <a
              href="#agendamento"
              className="adv-cta-highlight inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-base font-semibold text-white adv-glow"
              style={{ backgroundImage: "var(--adv-gradient-primary)" }}
            >
              Agendar Consulta
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#agendamento"
              className="adv-cta-highlight inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-base font-semibold text-foreground border border-border hover:border-[var(--adv-gold)] transition-colors"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Falar com Especialista
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-8 mt-10 pt-8 border-t border-border adv-fade-up-delay-3">
            {HERO_CREDENTIALS.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-bold text-foreground tabular-nums adv-font-serif">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="adv-fade-up-delay-1 relative">
          <div className="adv-glass adv-glow rounded-3xl p-6 md:p-10 flex flex-col items-center text-center">
            <span
              className="inline-flex items-center justify-center size-20 rounded-2xl text-white mb-6"
              style={{ backgroundImage: "var(--adv-gradient-primary)" }}
              aria-hidden="true"
            >
              <Scale className="size-9" />
            </span>
            <p className="adv-font-serif text-xl font-bold text-foreground mb-2">Lemos &amp; Bastos</p>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Advocacia especializada, com tradição e resultados consolidados para pessoas e empresas.
            </p>
            <div className="grid grid-cols-2 gap-3 w-full">
              {["OAB/SP", "Atend. Online", "18 anos", "8 áreas"].map((badge) => (
                <span
                  key={badge}
                  className="rounded-xl border border-border bg-[var(--color-surface-overlay)] py-2.5 text-xs font-semibold text-foreground"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
