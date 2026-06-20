import { PiggyBank, Trophy, Crown, Lock } from "lucide-react"
import { Reveal } from "./Reveal"
import { AnimatedCounter } from "./AnimatedCounter"
import { SAVINGS_GOALS, clamp } from "../_lib/calculations"

interface GamificationSectionProps {
  annualSavings: number
}

const badgeConfig = [
  { goal: SAVINGS_GOALS[0], icon: PiggyBank, label: "Primeiros mil" },
  { goal: SAVINGS_GOALS[1], icon: Trophy, label: "Cinco mil guardados" },
  { goal: SAVINGS_GOALS[2], icon: Crown, label: "Dez mil no bolso" },
]

// Metas de gamificação calculadas sobre a economia anual projetada
// (result.annualSavings). Os badges desbloqueiam progressivamente conforme o
// usuário ajusta hábitos e cenários — reforço visual e motivacional do
// briefing ("pequenas mudanças, grandes resultados").
export function GamificationSection({ annualSavings }: GamificationSectionProps) {
  return (
    <section className="relative px-6 py-16 md:py-20 bg-[var(--color-surface)] economia-no-print" aria-labelledby="gamification-title">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-10">
          <h2 id="gamification-title" className="text-3xl md:text-4xl font-bold mb-3">
            Desbloqueie suas <span className="economia-gradient-text">conquistas</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Cada meta representa um marco de economia anual no cenário simulado.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {badgeConfig.map((badge, i) => {
            const unlocked = annualSavings >= badge.goal
            const progressPct = clamp((annualSavings / badge.goal) * 100, 0, 100)

            return (
              <Reveal key={badge.goal} delayMs={i * 80}>
                <div
                  className={`economia-badge rounded-2xl border p-6 text-center relative ${
                    unlocked ? "economia-glow-amber border-transparent" : "border-border"
                  }`}
                  style={unlocked ? { backgroundImage: "var(--economia-gradient-soft)" } : undefined}
                  data-unlocked={unlocked}
                >
                  <div
                    className="mx-auto mb-4 size-14 rounded-2xl flex items-center justify-center relative"
                    style={{
                      backgroundImage: unlocked ? "var(--economia-gradient-amber)" : undefined,
                      backgroundColor: unlocked ? undefined : "var(--color-surface-overlay)",
                    }}
                  >
                    <badge.icon
                      className="size-7"
                      style={{ color: unlocked ? "#ffffff" : "var(--color-muted-foreground)" }}
                      aria-hidden="true"
                    />
                    {!unlocked && (
                      <span className="absolute -bottom-1.5 -right-1.5 size-6 rounded-full bg-[var(--color-surface-raised)] border border-border flex items-center justify-center">
                        <Lock className="size-3" style={{ color: "var(--color-muted-foreground)" }} aria-hidden="true" />
                      </span>
                    )}
                  </div>

                  <p className="font-semibold text-foreground text-sm mb-1">{badge.label}</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Meta: <AnimatedCounter value={badge.goal} prefix="R$ " decimals={0} /> por ano
                  </p>

                  <div className="economia-progress-track">
                    <div
                      className="economia-progress-fill"
                      data-visible="true"
                      data-variant={unlocked ? "amber" : undefined}
                      style={{ "--target-width": `${progressPct}%` } as React.CSSProperties}
                    />
                  </div>
                  <p className="text-[0.65rem] text-muted-foreground mt-2 tabular-nums">
                    {progressPct.toFixed(0)}% concluído
                  </p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
