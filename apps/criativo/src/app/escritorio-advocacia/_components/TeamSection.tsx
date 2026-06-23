"use client"

import { useEffect, useState } from "react"
import { X, BadgeCheck } from "lucide-react"
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
            Nossa <span style={{ color: "var(--adv-gold)" }}>Equipe Jurídica</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Profissionais experientes, dedicados a cada detalhe do seu caso.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TEAM.map((member, index) => (
            <Reveal key={member.name} delayMs={index * 70}>
              <button
                type="button"
                onClick={() => setActive(member)}
                className="adv-team-card text-left w-full h-full rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6"
              >
                <span
                  className="inline-flex items-center justify-center size-16 rounded-full text-lg font-semibold text-white mb-4"
                  style={{ backgroundImage: "var(--adv-gradient-primary)" }}
                  aria-hidden="true"
                >
                  {member.initials}
                </span>
                <p className="font-semibold text-foreground mb-0.5">{member.name}</p>
                <p className="text-xs font-medium mb-2" style={{ color: "var(--adv-gold)" }}>
                  {member.role}
                </p>
                <p className="text-xs text-muted-foreground mb-3">{member.specialty}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="adv-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-primary)]/40 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="team-modal-title"
          onClick={() => setActive(null)}
        >
          <div
            className="adv-modal-panel relative w-full max-w-lg rounded-3xl bg-[var(--color-surface)] p-7 md:p-9"
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
              style={{ backgroundImage: "var(--adv-gradient-primary)" }}
              aria-hidden="true"
            >
              {active.initials}
            </span>

            <h3 id="team-modal-title" className="text-2xl font-bold text-foreground mb-1">
              {active.name}
            </h3>
            <p className="text-sm font-medium mb-1" style={{ color: "var(--adv-gold)" }}>
              {active.role} — {active.specialty}
            </p>
            <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mb-5">
              <BadgeCheck className="size-3.5" aria-hidden="true" />
              {active.oab}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">{active.fullBio}</p>
          </div>
        </div>
      )}
    </section>
  )
}
