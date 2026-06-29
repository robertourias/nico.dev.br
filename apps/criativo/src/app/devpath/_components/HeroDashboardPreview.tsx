import { Sparkles, TrendingUp, GitBranch } from "lucide-react"

// Mockup de dashboard (sem dados reais) que reforça visualmente o produto:
// vagas compatíveis, progresso de roadmap e faixa salarial sugerida, com
// chips de tecnologia flutuando ao redor — apenas CSS (sem canvas/lib de
// ilustração), mesma estratégia de `energia-solar/HeroIllustration.tsx`.
export function HeroDashboardPreview() {
  return (
    <div className="devpath-fade-up-delay-2 relative max-w-lg w-full mx-auto">
      <div className="devpath-glass devpath-glow rounded-3xl p-5 md:p-6">
        <div className="flex items-center justify-between mb-5">
          <p className="devpath-mono text-xs text-[var(--devpath-fg-faint)]">resumo_de_carreira.json</p>
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-[var(--devpath-rose)]" />
            <span className="size-2.5 rounded-full bg-[var(--devpath-amber)]" />
            <span className="size-2.5 rounded-full bg-[var(--devpath-green)]" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <DashboardRow
            icon={<Sparkles className="size-4" aria-hidden="true" />}
            label="Vagas compatíveis"
            value="24 novas"
            tone="green"
          />
          <DashboardRow
            icon={<GitBranch className="size-4" aria-hidden="true" />}
            label="Roadmap Frontend"
            value="64% concluído"
            tone="cyan"
          />
          <DashboardRow
            icon={<TrendingUp className="size-4" aria-hidden="true" />}
            label="Salário médio sugerido"
            value="R$ 11.200"
            tone="violet"
          />
        </div>

        <div className="mt-5 pt-5 border-t border-[var(--devpath-border)] flex flex-wrap gap-2">
          {["React", "TypeScript", "Node.js", "AWS"].map((tech) => (
            <span
              key={tech}
              className="devpath-mono rounded-md border border-[var(--devpath-border)] bg-[var(--devpath-bg-raised)] px-2.5 py-1 text-[0.7rem] text-[var(--devpath-fg-muted)]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="devpath-float-card absolute -top-5 -right-5 devpath-glass devpath-glow rounded-2xl px-4 py-3 hidden sm:block">
        <p className="text-[0.65rem] text-[var(--devpath-fg-faint)] leading-none mb-0.5">Próxima etapa</p>
        <p className="text-sm font-semibold text-[var(--devpath-fg)] leading-none">Next.js & TypeScript</p>
      </div>

      <div className="devpath-float-card-delay absolute -bottom-6 -left-6 devpath-glass devpath-glow rounded-2xl px-4 py-3 hidden sm:block">
        <p className="text-[0.65rem] text-[var(--devpath-fg-faint)] leading-none mb-0.5">Streak diária</p>
        <p className="text-sm font-semibold text-[var(--devpath-fg)] leading-none">🔥 7 dias seguidos</p>
      </div>
    </div>
  )
}

function DashboardRow({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  tone: "green" | "cyan" | "violet"
}) {
  const toneColor = {
    green: "var(--devpath-green)",
    cyan: "var(--devpath-cyan)",
    violet: "var(--devpath-violet)",
  }[tone]

  return (
    <div className="flex items-center justify-between rounded-xl bg-[var(--devpath-bg-raised)] border border-[var(--devpath-border)] px-4 py-3">
      <span className="flex items-center gap-2.5 text-sm text-[var(--devpath-fg-muted)]">
        <span style={{ color: toneColor }}>{icon}</span>
        {label}
      </span>
      <span className="text-sm font-semibold text-[var(--devpath-fg)]">{value}</span>
    </div>
  )
}
