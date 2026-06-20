import { Mic2, Users, CalendarDays } from "lucide-react"

// Mockups estáticos de UI flutuando ao lado do título do Hero — não são
// dados reais, só comunicam de forma visual e imediata o tipo de experiência
// do evento (palestrantes, comunidade, programação). Mesmo padrão de
// `HeroIllustration.tsx` em `simulador-economia-domestica`.
export function FloatingCards() {
  return (
    <div className="relative mx-auto mt-14 max-w-3xl hidden md:block" aria-hidden="true">
      <div className="nexus-glass nexus-glow nexus-float-card absolute -left-2 top-2 rounded-2xl px-4 py-3 flex items-center gap-3 w-56">
        <span
          className="inline-flex items-center justify-center size-10 rounded-xl shrink-0"
          style={{ backgroundImage: "var(--nexus-gradient-primary)" }}
        >
          <Mic2 className="size-5 text-white" />
        </span>
        <div>
          <p className="text-sm font-semibold text-[var(--nexus-fg)]">+40 palestrantes</p>
          <p className="text-xs text-[var(--nexus-fg-muted)]">líderes de mercado</p>
        </div>
      </div>

      <div className="nexus-glass nexus-glow nexus-float-card-delay absolute right-0 top-16 rounded-2xl px-4 py-3 flex items-center gap-3 w-52">
        <span className="inline-flex items-center justify-center size-10 rounded-xl shrink-0 bg-[var(--nexus-emerald)]/15">
          <Users className="size-5 text-[var(--nexus-emerald)]" />
        </span>
        <div>
          <p className="text-sm font-semibold text-[var(--nexus-fg)]">+5.000</p>
          <p className="text-xs text-[var(--nexus-fg-muted)]">participantes</p>
        </div>
      </div>

      <div className="nexus-glass nexus-glow nexus-float-card absolute left-1/3 bottom-[-2.5rem] rounded-2xl px-4 py-3 flex items-center gap-3 w-56">
        <span className="inline-flex items-center justify-center size-10 rounded-xl shrink-0 bg-[var(--nexus-orange)]/15">
          <CalendarDays className="size-5 text-[var(--nexus-orange)]" />
        </span>
        <div>
          <p className="text-sm font-semibold text-[var(--nexus-fg)]">17 de setembro</p>
          <p className="text-xs text-[var(--nexus-fg-muted)]">1 dia de evento</p>
        </div>
      </div>
    </div>
  )
}
