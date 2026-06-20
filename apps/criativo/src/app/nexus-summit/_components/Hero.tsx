import { CalendarCheck2, MapPin, ArrowRight, CalendarDays } from "lucide-react"
import { GradientOrbs } from "./GradientOrbs"
import { CountdownTimer } from "./CountdownTimer"
import { FloatingCards } from "./FloatingCards"
import { EVENT_VENUE, formatEventDateLabel } from "../_lib/event"

export function Hero() {
  return (
    <section className="relative px-6 pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden" aria-labelledby="hero-title">
      <GradientOrbs variant="hero" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="nexus-fade-up flex flex-wrap items-center justify-center gap-2 mb-8">
          <span className="nexus-glass inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--nexus-purple)]">
            <CalendarCheck2 className="size-3.5" aria-hidden="true" />
            Inscrições Abertas
          </span>
          <span className="nexus-glass inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium text-[var(--nexus-fg-muted)]">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {formatEventDateLabel()}
          </span>
          <span className="nexus-glass inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium text-[var(--nexus-fg-muted)]">
            <MapPin className="size-3.5" aria-hidden="true" />
            {EVENT_VENUE}
          </span>
        </div>

        <h1
          id="hero-title"
          className="nexus-fade-up-delay-1 text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08] tracking-tight mb-6 text-[var(--nexus-fg)]"
        >
          Participe do <span className="nexus-gradient-text">maior encontro</span> de profissionais e especialistas
          do mercado
        </h1>

        <p className="nexus-fade-up-delay-2 text-lg md:text-xl text-[var(--nexus-fg-muted)] max-w-2xl mx-auto mb-10">
          Workshops, palestras e networking com grandes nomes da indústria.
        </p>

        <div className="nexus-fade-up-delay-2 flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <a
            href="#inscricao"
            className="nexus-glow-cta nexus-cta-pulse inline-flex items-center gap-2 rounded-xl px-8 py-4 font-semibold text-white text-base transition-transform hover:scale-[1.04] active:scale-[0.98]"
            style={{ backgroundImage: "var(--nexus-gradient-cta)" }}
          >
            Garantir Minha Vaga
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
          <a
            href="#programacao"
            className="nexus-glass inline-flex items-center gap-2 rounded-xl px-8 py-4 font-semibold text-[var(--nexus-fg)] text-base transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            Ver Programação
          </a>
        </div>

        <p className="nexus-fade-up-delay-2 text-xs text-[var(--nexus-fg-faint)] mb-12">
          Formato híbrido — participe presencialmente ou acompanhe a transmissão online.
        </p>

        <div className="nexus-fade-up-delay-3 flex flex-col items-center gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--nexus-fg-faint)]">
            As inscrições com condição especial fecham em
          </p>
          <CountdownTimer />
        </div>

        <FloatingCards />
      </div>
    </section>
  )
}
