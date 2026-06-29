"use client"

import { useState } from "react"
import { Check, ChevronDown, PlayCircle, FileText, GraduationCap, BookOpen, FolderGit2 } from "lucide-react"
import { ROADMAPS, type RoadmapStep } from "../_lib/data"
import { Reveal } from "./Reveal"

const RESOURCE_ICONS: Record<RoadmapStep["resources"][number]["type"], React.ComponentType<{ className?: string }>> = {
  Vídeo: PlayCircle,
  Artigo: FileText,
  Curso: GraduationCap,
  Documentação: BookOpen,
  Projeto: FolderGit2,
}

// Centerpiece interativo: explorador de roadmap com tabs por área, etapas
// expansíveis (descrição + recursos) e checklist de progresso — o estado de
// conclusão vive apenas em memória do componente (sem persistência), só para
// demonstrar a experiência de acompanhamento descrita no briefing.
export function RoadmapExplorer() {
  const [activeTrack, setActiveTrack] = useState(ROADMAPS[0].key)
  const [openStepId, setOpenStepId] = useState<string | null>(ROADMAPS[0].steps[0]?.id ?? null)
  const [doneSteps, setDoneSteps] = useState<Set<string>>(new Set())

  const track = ROADMAPS.find((t) => t.key === activeTrack) ?? ROADMAPS[0]
  const doneCount = track.steps.filter((step) => doneSteps.has(step.id)).length
  const progressPct = Math.round((doneCount / track.steps.length) * 100)

  function toggleDone(stepId: string) {
    setDoneSteps((current) => {
      const next = new Set(current)
      if (next.has(stepId)) {
        next.delete(stepId)
      } else {
        next.add(stepId)
      }
      return next
    })
  }

  function selectTrack(key: string) {
    setActiveTrack(key)
    const nextTrack = ROADMAPS.find((t) => t.key === key)
    setOpenStepId(nextTrack?.steps[0]?.id ?? null)
  }

  return (
    <section id="roadmaps" className="relative px-6 py-20 md:py-28" aria-labelledby="roadmaps-title">
      <div className="max-w-5xl mx-auto">
        <Reveal className="max-w-2xl mb-10">
          <p className="devpath-mono text-xs text-[var(--devpath-green)] mb-3">// roadmaps_interativos</p>
          <h2 id="roadmaps-title" className="text-3xl md:text-4xl font-bold text-[var(--devpath-fg)] mb-3">
            Saiba exatamente o que estudar a seguir
          </h2>
          <p className="text-[var(--devpath-fg-muted)]">
            Roadmaps completos por área, com vídeos, artigos, cursos e projetos em cada etapa. Marque o que já
            domina e acompanhe seu progresso.
          </p>
        </Reveal>

        <Reveal className="flex flex-wrap gap-2 mb-8">
          {ROADMAPS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => selectTrack(t.key)}
              data-active={t.key === activeTrack}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors"
              style={
                t.key === activeTrack
                  ? { borderColor: "var(--devpath-green)", background: "rgba(52,211,153,0.14)", color: "var(--devpath-green)" }
                  : { borderColor: "var(--devpath-border)", color: "var(--devpath-fg-muted)" }
              }
            >
              <span aria-hidden="true">{t.icon}</span>
              {t.title}
            </button>
          ))}
        </Reveal>

        <Reveal className="rounded-2xl border border-[var(--devpath-border)] bg-[var(--devpath-bg-raised)] p-5 mb-8">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-sm font-semibold text-[var(--devpath-fg)]">
              Progresso da trilha {track.title}
            </p>
            <p className="devpath-mono text-sm text-[var(--devpath-green)]">{progressPct}%</p>
          </div>
          <div className="devpath-progress-track">
            <div className="devpath-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="text-xs text-[var(--devpath-fg-faint)] mt-2">
            {doneCount} de {track.steps.length} etapas concluídas
          </p>
        </Reveal>

        <div className="flex flex-col gap-3">
          {track.steps.map((step, index) => {
            const open = openStepId === step.id
            const done = doneSteps.has(step.id)

            return (
              <div
                key={step.id}
                className="rounded-2xl border bg-[var(--devpath-bg-raised)] overflow-hidden transition-colors"
                style={{ borderColor: done ? "rgba(52,211,153,0.4)" : "var(--devpath-border)" }}
              >
                <div className="w-full flex items-center gap-4 px-5 py-4">
                  <button
                    type="button"
                    onClick={() => toggleDone(step.id)}
                    aria-pressed={done}
                    aria-label={done ? "Marcar etapa como não concluída" : "Marcar etapa como concluída"}
                    className="inline-flex items-center justify-center size-7 rounded-full border-2 shrink-0 transition-colors"
                    style={{
                      borderColor: done ? "var(--devpath-green)" : "var(--devpath-border-strong)",
                      background: done ? "var(--devpath-green)" : "transparent",
                      color: "#04140e",
                    }}
                  >
                    {done ? <Check className="size-4" aria-hidden="true" /> : null}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOpenStepId(open ? null : step.id)}
                    aria-expanded={open}
                    className="flex-1 flex items-center justify-between gap-3 text-left"
                  >
                    <span className={`font-medium ${done ? "text-[var(--devpath-fg-muted)] line-through" : "text-[var(--devpath-fg)]"}`}>
                      <span className="devpath-mono text-xs text-[var(--devpath-fg-faint)] mr-2">{String(index + 1).padStart(2, "0")}</span>
                      {step.title}
                    </span>
                    <ChevronDown
                      className={`size-4 text-[var(--devpath-fg-faint)] shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                </div>

                <div className="devpath-accordion-panel" data-open={open}>
                  <div>
                    <div className="px-5 pb-5 pl-16">
                      <p className="text-sm text-[var(--devpath-fg-muted)] mb-3">{step.description}</p>
                      <div className="flex flex-col gap-2">
                        {step.resources.map((resource) => {
                          const Icon = RESOURCE_ICONS[resource.type]
                          return (
                            <span key={resource.label} className="flex items-center gap-2 text-sm text-[var(--devpath-fg)]">
                              <Icon className="size-4 text-[var(--devpath-cyan)]" />
                              <span className="devpath-mono text-xs text-[var(--devpath-fg-faint)]">{resource.type}</span>
                              {resource.label}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
