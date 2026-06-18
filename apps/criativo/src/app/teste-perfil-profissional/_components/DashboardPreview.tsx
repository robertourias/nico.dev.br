import { TrendingUp, Award, Sparkles } from "lucide-react"
import { RadarChart } from "./RadarChart"

const competencies = [
  { label: "Comunicação", value: 88 },
  { label: "Liderança", value: 74 },
  { label: "Análise", value: 92 },
  { label: "Execução", value: 81 },
  { label: "Inovação", value: 69 },
  { label: "Colaboração", value: 85 },
]

const skillCards = [
  { label: "Raciocínio Lógico", value: 92, accent: "var(--color-primary)" },
  { label: "Comunicação", value: 88, accent: "var(--color-secondary)" },
  { label: "Liderança", value: 74, accent: "var(--color-primary-light)" },
]

// Dashboard fictício exibido ao lado do conteúdo do Hero — mockup estático
// (não é um resultado real) para transmitir, de forma visual e imediata, o
// tipo de entrega do produto: radar de competências, score de compatibilidade
// e cards de habilidades.
export function DashboardPreview() {
  return (
    <div className="perfil-fade-up-delay-2 relative perfil-glass perfil-glow rounded-3xl p-6 md:p-7 max-w-md w-full mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs text-muted-foreground">Seu resultado</p>
          <p className="font-semibold text-foreground">Perfil Estratégico</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold px-3 py-1">
          <Award className="size-3.5" aria-hidden="true" />
          Score 87
        </span>
      </div>

      <div className="flex justify-center mb-4">
        <RadarChart data={competencies} size={240} className="w-full max-w-[240px]" />
      </div>

      <div className="flex flex-col gap-3 mb-4">
        {skillCards.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <span
              className="inline-flex items-center justify-center size-8 rounded-lg shrink-0"
              style={{ backgroundColor: "var(--color-surface-overlay)" }}
              aria-hidden="true"
            >
              <Sparkles className="size-4" style={{ color: s.accent }} />
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-foreground">{s.label}</span>
                <span className="text-muted-foreground">{s.value}%</span>
              </div>
              <div className="perfil-progress-track h-1.5">
                <div
                  className="perfil-progress-fill"
                  data-visible="true"
                  style={{ "--target-width": `${s.value}%` } as React.CSSProperties}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-accent text-accent-foreground px-3.5 py-2.5 text-xs font-medium">
        <TrendingUp className="size-3.5 shrink-0" aria-hidden="true" />
        Alta compatibilidade com cargos de gestão e estratégia
      </div>
    </div>
  )
}
