"use client"

import { useEffect, useRef } from "react"
import { ArrowRight, Stethoscope, ShieldCheck, CalendarDays, User } from "lucide-react"
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
      <div ref={parallaxRef} className="absolute inset-0 clin-parallax">
        <div className="absolute inset-0 clin-grid-bg" aria-hidden="true" />
        <div
          className="clin-blob -top-20 -left-24 size-96"
          style={{ backgroundImage: "var(--clin-gradient-primary)" }}
          aria-hidden="true"
        />
        <div
          className="clin-blob top-40 right-0 size-80"
          style={{ backgroundImage: "var(--clin-gradient-green)" }}
          aria-hidden="true"
        />
      </div>

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-12 items-center">
        <div className="clin-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full clin-glass px-4 py-1.5 text-xs font-semibold mb-6 text-[var(--color-primary)]">
            <span className="clin-pulse-dot" aria-hidden="true" />
            Vagas disponíveis para agendamento hoje
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5 text-foreground">
            Cuidando da sua saúde com{" "}
            <span className="clin-highlight">excelência e atenção personalizada</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-xl clin-fade-up-delay-1">
            Consultas, exames e acompanhamento médico com profissionais qualificados.
          </p>

          <div className="flex flex-wrap items-center gap-4 clin-fade-up-delay-2">
            <a
              href="#agendamento"
              className="clin-cta-highlight inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-base font-semibold text-white clin-glow-green"
              style={{ backgroundImage: "var(--clin-gradient-green)" }}
            >
              Agendar Consulta
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#especialidades"
              className="clin-cta-highlight inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-base font-semibold text-foreground border border-border hover:border-[var(--color-primary)] transition-colors"
            >
              <Stethoscope className="size-4" aria-hidden="true" />
              Conhecer Especialidades
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-8 mt-10 pt-8 border-t border-border clin-fade-up-delay-3">
            {HERO_CREDENTIALS.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-bold text-foreground tabular-nums">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                </p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="clin-fade-up-delay-1 relative">
          <div className="clin-glass clin-glow rounded-3xl p-6 md:p-8 flex flex-col items-center text-center">
            <span
              className="inline-flex items-center justify-center size-20 rounded-2xl text-white mb-6"
              style={{ backgroundImage: "var(--clin-gradient-primary)" }}
              aria-hidden="true"
            >
              <Stethoscope className="size-9" />
            </span>
            <p className="text-xl font-bold text-foreground mb-1">Clínica Vitalis</p>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Estrutura moderna, equipe multidisciplinar e atendimento humanizado.
            </p>

            <div className="w-full rounded-2xl border border-border bg-[var(--color-surface-overlay)] p-4 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)] mb-3">
                Próximo horário disponível
              </p>
              <div className="flex flex-col gap-2.5">
                <p className="flex items-center gap-2.5 text-sm text-foreground">
                  <Stethoscope className="size-4 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                  <span>
                    <span className="text-muted-foreground">Especialidade:</span>{" "}
                    <span className="font-medium">Cardiologia</span>
                  </span>
                </p>
                <p className="flex items-center gap-2.5 text-sm text-foreground">
                  <User className="size-4 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                  <span>
                    <span className="text-muted-foreground">Médico:</span>{" "}
                    <span className="font-medium">Dra. Fernanda Costa</span>
                  </span>
                </p>
                <p className="flex items-center gap-2.5 text-sm text-foreground">
                  <CalendarDays className="size-4 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                  <span>
                    <span className="text-muted-foreground">Data disponível:</span>{" "}
                    <span className="font-medium">Hoje, 14h30</span>
                  </span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full mt-4">
              {["Convênios e particular", "Online ou presencial"].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-[var(--color-surface-overlay)] py-2.5 text-xs font-semibold text-foreground"
                >
                  <ShieldCheck className="size-3.5 shrink-0 text-[var(--clin-green)]" aria-hidden="true" />
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
