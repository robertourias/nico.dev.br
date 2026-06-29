import { Flame } from "lucide-react"
import { GAMIFICATION_BADGES } from "../_lib/data"
import { Reveal } from "./Reveal"
import { AnimatedCounter } from "./AnimatedCounter"

// Preview ilustrativo de gamificação: XP, sequência diária e badges
// conquistadas — copy fixa, sem progresso real de usuário (sem conta/login
// nesta landing).
export function GamificationSection() {
  return (
    <section id="gamificacao" className="relative px-6 py-20 md:py-28 bg-[var(--devpath-bg-soft)]" aria-labelledby="gamification-title">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <p className="devpath-mono text-xs text-[var(--devpath-green)] mb-3">// gamificacao</p>
          <h2 id="gamification-title" className="text-3xl md:text-4xl font-bold text-[var(--devpath-fg)] mb-4">
            Evolua a carreira como quem evolui de nível
          </h2>
          <p className="text-[var(--devpath-fg-muted)] mb-6">
            Ganhe XP ao concluir etapas de roadmap, mantenha sua sequência de estudos e desbloqueie badges conforme
            avança nos seus objetivos de carreira.
          </p>
          <div className="flex flex-wrap gap-3">
            {GAMIFICATION_BADGES.map((badge) => (
              <span
                key={badge.label}
                className="devpath-card-hover inline-flex items-center gap-2 rounded-full border border-[var(--devpath-border)] bg-[var(--devpath-bg-raised)] px-4 py-2 text-sm text-[var(--devpath-fg)]"
              >
                <span aria-hidden="true">{badge.icon}</span>
                {badge.label}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delayMs={100} variant="scale-in">
          <div className="devpath-glow rounded-2xl border border-[var(--devpath-border)] bg-[var(--devpath-bg-raised)] p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="devpath-mono text-xs text-[var(--devpath-fg-faint)]">perfil_demo.xp</p>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--devpath-amber)]">
                <Flame className="size-4" aria-hidden="true" />
                <AnimatedCounter value={12} /> dias
              </span>
            </div>

            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-[var(--devpath-fg)]">Nível 7 — Explorador</span>
              <span className="devpath-mono text-xs text-[var(--devpath-green)]">
                <AnimatedCounter value={2480} /> XP
              </span>
            </div>
            <div className="devpath-progress-track mb-6">
              <div className="devpath-progress-fill" style={{ width: "64%" }} />
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xl font-bold devpath-gradient-text"><AnimatedCounter value={9} /></p>
                <p className="text-xs text-[var(--devpath-fg-faint)]">badges</p>
              </div>
              <div>
                <p className="text-xl font-bold devpath-gradient-text"><AnimatedCounter value={3} /></p>
                <p className="text-xs text-[var(--devpath-fg-faint)]">roadmaps ativos</p>
              </div>
              <div>
                <p className="text-xl font-bold devpath-gradient-text"><AnimatedCounter value={41} /></p>
                <p className="text-xs text-[var(--devpath-fg-faint)]">etapas concluídas</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
