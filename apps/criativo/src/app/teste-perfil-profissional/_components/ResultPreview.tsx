import { AlertTriangle, CheckCircle2, Compass, Award } from "lucide-react"
import { Reveal } from "./Reveal"
import { RadarChart } from "./RadarChart"
import { SkillBar } from "./SkillBar"

const competencies = [
  { label: "Comunicação", value: 88 },
  { label: "Liderança", value: 74 },
  { label: "Análise", value: 92 },
  { label: "Execução", value: 81 },
  { label: "Inovação", value: 69 },
  { label: "Colaboração", value: 85 },
]

const topSkills = [
  { label: "Visão Estratégica", value: 94 },
  { label: "Comunicação", value: 88 },
  { label: "Raciocínio Lógico", value: 92 },
]

const attentionPoints = [
  "Tendência a postergar decisões em cenários de alta incerteza.",
  "Pode delegar pouco em tarefas operacionais do dia a dia.",
]

const recommendations = [
  "Pratique tomada de decisão com prazos definidos em projetos pequenos.",
  "Busque mentorias em gestão de equipes para fortalecer a liderança.",
  "Invista em ferramentas de priorização para ganhar tempo estratégico.",
]

const careers = ["Gestão de Produto", "Consultoria Estratégica", "Liderança de Equipes", "Inovação Corporativa"]

// Simulação da página final de resultados — layout tipo dashboard SaaS,
// usada também como destino do CTA secundário "Ver Exemplo de Resultado".
export function ResultPreview() {
  return (
    <section id="previa-resultado" className="relative px-6 py-20 md:py-28 bg-[var(--color-surface)]" aria-labelledby="result-preview-title">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-14">
          <h2 id="result-preview-title" className="text-3xl md:text-4xl font-bold mb-4">
            Veja como é o seu <span className="perfil-gradient-text">resultado</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Um exemplo real do relatório que você recebe ao finalizar o teste.
          </p>
        </Reveal>

        <Reveal variant="scale-in">
          <div className="perfil-glass rounded-3xl p-6 md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-border">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Resultado de</p>
                <p className="text-2xl font-bold text-foreground">Perfil Estratégico</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full text-white text-sm font-semibold px-4 py-2 perfil-glow" style={{ backgroundImage: "var(--perfil-gradient-primary)" }}>
                <Award className="size-4" aria-hidden="true" />
                Score geral 87/100
              </span>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
                  Competências principais
                </h3>
                <RadarChart data={competencies} size={280} className="w-full max-w-[280px] mx-auto" />
              </div>

              <div className="flex flex-col gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
                    Pontos fortes
                  </h3>
                  <div className="flex flex-col gap-4">
                    {topSkills.map((s) => (
                      <SkillBar key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide flex items-center gap-2">
                    <AlertTriangle className="size-4 text-[var(--color-warning)]" aria-hidden="true" />
                    Pontos de atenção
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {attentionPoints.map((point) => (
                      <li key={point} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="mt-1.5 size-1.5 rounded-full bg-[var(--color-warning)] shrink-0" aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 mt-10 pt-10 border-t border-border">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-[var(--color-success)]" aria-hidden="true" />
                  Recomendações práticas
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {recommendations.map((rec) => (
                    <li key={rec} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle2 className="size-4 text-[var(--color-success)] shrink-0 mt-0.5" aria-hidden="true" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide flex items-center gap-2">
                  <Compass className="size-4 text-primary" aria-hidden="true" />
                  Carreiras sugeridas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {careers.map((career) => (
                    <span
                      key={career}
                      className="text-sm font-medium px-3 py-1.5 rounded-full bg-accent text-accent-foreground"
                    >
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
