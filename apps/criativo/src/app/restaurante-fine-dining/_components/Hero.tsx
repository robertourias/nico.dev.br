"use client"

import { useEffect, useRef } from "react"
import { ArrowRight, PlayCircle } from "lucide-react"
import { CHEF_NAME, HERO_CREDENTIALS } from "../_lib/data"

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
        const offset = Math.min(window.scrollY, 600) * 0.1
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
    <section id="topo" className="relative px-6 pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 rest-grid-bg" aria-hidden="true" />
      <div
        className="rest-blob -top-24 -left-20 size-96"
        style={{ backgroundImage: "var(--rest-gradient-gold)" }}
        aria-hidden="true"
      />
      <div
        className="rest-blob top-52 right-0 size-80"
        style={{ backgroundImage: "var(--rest-gradient-olive)" }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-14 items-center">
        {/* Lado esquerdo — frase de impacto, assinatura do chef, CTA */}
        <div className="rest-fade-up">
          <span
            className="inline-flex items-center gap-2 rounded-full rest-glass px-4 py-1.5 text-xs font-semibold mb-7 uppercase tracking-wide"
            style={{ color: "var(--color-primary)" }}
          >
            Cozinha de Autor · São Paulo
          </span>

          <h1 className="text-4xl md:text-6xl font-semibold leading-[1.08] mb-6 text-foreground rest-font-serif">
            Gastronomia que transforma <span className="rest-highlight">refeições</span> em lembranças.
          </h1>

          <p className="text-lg text-muted-foreground mb-9 max-w-lg rest-fade-up-delay-1">
            Uma experiência sensorial guiada por ingredientes selecionados, técnicas de cocção lenta e o olhar
            autoral de quem trata cada prato como uma narrativa.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-12 rest-fade-up-delay-2">
            <a
              href="#reservas"
              className="rest-cta-highlight inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-[var(--color-primary-foreground)] rest-glow"
              style={{ backgroundImage: "var(--rest-gradient-gold)" }}
            >
              Reservar Minha Mesa
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#prato-em-movimento"
              className="rest-cta-highlight inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-foreground border border-border hover:border-[var(--color-primary)] transition-colors"
            >
              <PlayCircle className="size-4" aria-hidden="true" />
              Ver a Experiência
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-border rest-fade-up-delay-3">
            <div>
              <p className="rest-font-script text-2xl text-foreground">{CHEF_NAME}</p>
              <p className="text-xs text-muted-foreground mt-1">Chef Executivo &amp; Sócio-fundador</p>
            </div>
            <div className="flex flex-wrap items-center gap-8">
              {HERO_CREDENTIALS.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-semibold text-foreground rest-font-serif tabular-nums">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[8rem]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lado direito — composição artística de pratos, movimento suave ao scroll */}
        <div ref={parallaxRef} className="relative rest-parallax rest-fade-up-delay-1">
          <div className="relative aspect-square max-w-md mx-auto">
            <div
              className="rest-plate rest-plate-float absolute inset-6 rounded-full"
              style={{ backgroundImage: "var(--rest-gradient-dark)", border: "1px solid var(--color-border)" }}
              aria-hidden="true"
            />
            <div
              className="rest-plate rest-plate-float-delay absolute inset-16 rounded-full opacity-90"
              style={{ backgroundImage: "var(--rest-gradient-soft)" }}
              aria-hidden="true"
            />
            <div
              className="rest-plate absolute inset-24 rounded-full"
              style={{ backgroundImage: "var(--rest-gradient-gold)", opacity: 0.85 }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-32 rounded-full rest-glass flex items-center justify-center text-center p-8"
              aria-hidden="true"
            >
              <p className="rest-font-script text-xl text-foreground leading-snug">
                &ldquo;Uma Noite Memorável&rdquo;
              </p>
            </div>
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 size-20 rounded-full rest-glow"
              style={{ backgroundImage: "var(--rest-gradient-copper)" }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
