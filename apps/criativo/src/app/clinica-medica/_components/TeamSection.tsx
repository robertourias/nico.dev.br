"use client"

import { useEffect, useState } from "react"
import { X, BadgeCheck, CalendarCheck } from "lucide-react"
import { Reveal } from "./Reveal"
import { TEAM, type TeamMember } from "../_lib/data"

export function TeamSection() {
  const [active, setActive] = useState<TeamMember | null>(null)

  useEffect(() => {
    if (!active) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null)
    }
    window.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [active])

  return (
    <section id="equipe" className="px-6 py-20 md:py-28 scroll-mt-20" aria-labelledby="team-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14 max-w-2xl mx-auto">
          <h2 id="team-title" className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Nossa <span className="text-[var(--color-primary)]">Equipe Médica</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Profissionais experientes e dedicados ao cuidado de cada paciente.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TEAM.map((member, index) => (
            <Reveal key={member.name} delayMs={index * 70}>
              <div className="clin-team-card flex flex-col h-full rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6">
                <span
                  className="inline-flex items-center justify-center size-16 rounded-full text-lg font-semibold text-white mb-4"
                  style={{ backgroundImage: "var(--clin-gradient-primary)" }}
                  aria-hidden="true"
                >
                  {member.initials}
                </span>
                <p className="font-semibold text-foreground mb-0.5">{member.name}</p>
                <p className="text-xs font-medium mb-2 text-[var(--color-primary)]">{member.role}</p>
                <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                  <BadgeCheck className="size-3.5 shrink-0" aria-hidden="true" />
                  {member.crm}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3 flex-1">{member.bio}</p>
                <p className="text-xs text-muted-foreground mb-4">{member.experience}</p>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setActive(member)}
                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-foreground border border-border hover:border-[var(--color-primary)] transition-colors"
                  >
                    Ver Perfil Completo
                  </button>
                  <a
                    href="#agendamento"
                    className="clin-cta-highlight inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white"
                    style={{ backgroundImage: "var(--clin-gradient-green)" }}
                  >
                    <CalendarCheck className="size-3.5" aria-hidden="true" />
                    Agendar Consulta
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="clin-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-[#0d2847]/40 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="team-modal-title"
          onClick={() => setActive(null)}
        >
          <div
            className="clin-modal-panel relative w-full max-w-lg rounded-3xl bg-[var(--color-surface)] p-7 md:p-9"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Fechar perfil"
              className="absolute top-5 right-5 inline-flex items-center justify-center size-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-[var(--color-surface-overlay)] transition-colors"
            >
              <X className="size-4.5" aria-hidden="true" />
            </button>

            <span
              className="inline-flex items-center justify-center size-16 rounded-full text-lg font-semibold text-white mb-5"
              style={{ backgroundImage: "var(--clin-gradient-primary)" }}
              aria-hidden="true"
            >
              {active.initials}
            </span>

            <h3 id="team-modal-title" className="text-2xl font-bold text-foreground mb-1">
              {active.name}
            </h3>
            <p className="text-sm font-medium mb-1 text-[var(--color-primary)]">
              {active.role} — {active.specialty}
            </p>
            <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <BadgeCheck className="size-3.5" aria-hidden="true" />
              {active.crm}
            </p>
            <p className="text-xs text-muted-foreground mb-5">{active.experience}</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{active.fullBio}</p>

            <a
              href="#agendamento"
              onClick={() => setActive(null)}
              className="clin-cta-highlight inline-flex items-center justify-center gap-2 w-full rounded-lg px-5 py-3 text-sm font-semibold text-white"
              style={{ backgroundImage: "var(--clin-gradient-green)" }}
            >
              <CalendarCheck className="size-4" aria-hidden="true" />
              Agendar Consulta com {active.name}
            </a>
          </div>
        </div>
      )}
    </section>
  )
}
