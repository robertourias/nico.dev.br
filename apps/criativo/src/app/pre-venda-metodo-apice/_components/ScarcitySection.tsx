import { Flame, Gift, Crown, Sparkles } from "lucide-react"
import { Reveal } from "./Reveal"

// Vagas preenchidas é copy ilustrativa fixa (mesma decisão de
// ParticipantCounter nas demais landings) — evita simular um dado "ao vivo"
// como se fosse telemetria real sem integração de fato.
const SPOTS_TOTAL = 150
const SPOTS_TAKEN = 112

const bonuses = [
  "Sessão de planejamento 1:1 com a equipe Ápice (vagas das 50 primeiras inscrições)",
  "Kit de templates e automações premium",
  "Acesso antecipado de 7 dias antes do lançamento público",
]

export function ScarcitySection() {
  const percentTaken = Math.round((SPOTS_TAKEN / SPOTS_TOTAL) * 100)

  return (
    <section className="relative px-6 py-20 md:py-28" aria-labelledby="scarcity-title">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <div className="apice-glass apice-glow rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div
              className="absolute -top-20 -right-20 size-64 rounded-full opacity-30 blur-3xl"
              style={{ background: "var(--apice-neon)" }}
              aria-hidden="true"
            />

            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--apice-rose)]/10 border border-[var(--apice-rose)]/30 text-[var(--apice-rose)] px-3 py-1 text-xs font-semibold uppercase tracking-wide mb-6">
                <Flame className="size-3.5" aria-hidden="true" />
                Condição só na pré-venda
              </span>

              <h2 id="scarcity-title" className="text-3xl md:text-4xl font-bold mb-3">
                Apenas <span className="apice-gradient-text">{SPOTS_TOTAL} vagas</span> nesta turma
              </h2>
              <p className="text-[var(--apice-fg-muted)] mb-8 max-w-xl">
                Para garantir acompanhamento de qualidade na comunidade, o Método Ápice abre turmas limitadas.
                Quem entra pela lista de espera garante a condição de pré-venda antes da abertura ao público.
              </p>

              <div className="mb-10">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[var(--apice-fg)] font-medium">
                    {SPOTS_TAKEN} de {SPOTS_TOTAL} vagas reservadas
                  </span>
                  <span className="text-[var(--apice-neon)] font-semibold">{percentTaken}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full apice-pulse-glow"
                    style={{ width: `${percentTaken}%`, backgroundImage: "var(--apice-gradient-primary)" }}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mb-10">
                <div className="rounded-2xl border border-white/10 p-5">
                  <p className="text-xs uppercase tracking-wider text-[var(--apice-fg-faint)] mb-2">
                    Investimento no lançamento
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl text-[var(--apice-fg-faint)] line-through">R$ 1.497</span>
                    <span className="text-4xl font-bold apice-gradient-text">R$ 897</span>
                  </div>
                  <p className="text-xs text-[var(--apice-fg-muted)] mt-2">
                    Preço exclusivo para quem está na lista de espera no dia do lançamento.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 p-5">
                  <p className="text-xs uppercase tracking-wider text-[var(--apice-fg-faint)] mb-3 flex items-center gap-1.5">
                    <Gift className="size-3.5" aria-hidden="true" />
                    Bônus exclusivos
                  </p>
                  <ul className="flex flex-col gap-2">
                    {bonuses.map((bonus) => (
                      <li key={bonus} className="flex items-start gap-2 text-sm text-[var(--apice-fg-muted)]">
                        <Sparkles className="size-3.5 text-[var(--apice-amber)] shrink-0 mt-0.5" aria-hidden="true" />
                        {bonus}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <a
                href="#lista-de-espera"
                className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
                style={{ backgroundImage: "var(--apice-gradient-primary)" }}
              >
                <Crown className="size-4" aria-hidden="true" />
                Garantir minha vaga na pré-venda
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
