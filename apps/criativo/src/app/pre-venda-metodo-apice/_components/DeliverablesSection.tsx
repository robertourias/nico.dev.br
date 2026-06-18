import { Compass, Layers, Zap, Users, Crown, type LucideIcon } from "lucide-react"
import { Reveal } from "./Reveal"

interface Module {
  icon: LucideIcon
  name: string
  summary: string
  benefit: string
}

const modules: Module[] = [
  {
    icon: Compass,
    name: "Módulo 1 — Diagnóstico e Direção",
    summary: "Mapeie exatamente onde seu tempo está sendo desperdiçado e defina sua meta de 8 semanas.",
    benefit: "Clareza total sobre o que fazer primeiro.",
  },
  {
    icon: Layers,
    name: "Módulo 2 — Sistema Ápice",
    summary: "O framework completo de priorização, planejamento semanal e revisão diária.",
    benefit: "Um sistema que substitui a força de vontade.",
  },
  {
    icon: Zap,
    name: "Módulo 3 — Execução Acelerada",
    summary: "Técnicas de foco profundo e gatilhos de ação para eliminar a procrastinação.",
    benefit: "Tarefas concluídas em menos tempo.",
  },
  {
    icon: Users,
    name: "Módulo 4 — Comunidade e Mentoria",
    summary: "Acesso à comunidade exclusiva e encontros quinzenais de acompanhamento em grupo.",
    benefit: "Suporte real para não desistir no meio do caminho.",
  },
  {
    icon: Crown,
    name: "Bônus — Kit de Ferramentas Ápice",
    summary: "Templates, checklists e automações prontas para implementar o método no seu dia a dia.",
    benefit: "Implementação sem fricção, desde o primeiro dia.",
  },
]

export function DeliverablesSection() {
  return (
    <section className="relative px-6 py-20 md:py-28 bg-[var(--apice-bg-raised)]" aria-labelledby="deliverables-title">
      <div className="max-w-3xl mx-auto">
        <Reveal className="text-center mb-16">
          <h2 id="deliverables-title" className="text-3xl md:text-4xl font-bold mb-4">
            O que você vai <span className="apice-gradient-text">receber</span>
          </h2>
          <p className="text-[var(--apice-fg-muted)] text-lg">
            Uma jornada estruturada em módulos — cada um construindo sobre o anterior.
          </p>
        </Reveal>

        <div className="relative flex flex-col gap-8 sm:pl-2" role="list">
          <div
            className="absolute left-[27px] sm:left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-[var(--apice-purple)] via-[var(--apice-blue)] to-transparent"
            aria-hidden="true"
          />

          {modules.map((module, i) => (
            <Reveal key={module.name} variant="slide-right" delayMs={i * 80} className="relative flex gap-5 items-start" role="listitem">
              <div
                className="relative z-10 shrink-0 inline-flex items-center justify-center size-14 rounded-2xl apice-glow"
                style={{ backgroundImage: "var(--apice-gradient-primary)" }}
              >
                <module.icon className="size-6 text-white" aria-hidden="true" />
              </div>

              <div className="apice-glass apice-card-hover rounded-2xl p-6 flex-1">
                <h3 className="font-semibold text-lg mb-1.5 text-[var(--apice-fg)]">{module.name}</h3>
                <p className="text-sm text-[var(--apice-fg-muted)] leading-relaxed mb-3">{module.summary}</p>
                <p className="text-sm font-medium text-[var(--apice-neon)]">→ {module.benefit}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
