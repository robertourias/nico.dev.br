"use client"

import { useMemo, useState } from "react"
import { Clock, User } from "lucide-react"
import { Reveal } from "./Reveal"
import { SCHEDULE, SCHEDULE_MODALITY_FILTERS, SCHEDULE_DAY_FILTERS } from "../_lib/data"

export function ScheduleSection() {
  const [modality, setModality] = useState("Todas")
  const [day, setDay] = useState<string>("Todos")

  const filtered = useMemo(
    () =>
      SCHEDULE.filter((c) => (modality === "Todas" || c.modality === modality) && (day === "Todos" || c.day === day)).sort(
        (a, b) => a.time.localeCompare(b.time)
      ),
    [modality, day]
  )

  return (
    <section className="px-6 py-20 md:py-28" aria-labelledby="schedule-title">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-10 max-w-2xl mx-auto">
          <h2 id="schedule-title" className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Grade de <span className="aca-highlight">Horários</span>
          </h2>
          <p className="text-muted-foreground text-lg aca-heading-alt">
            Filtre por modalidade ou dia da semana e encontre o horário ideal para o seu treino.
          </p>
        </Reveal>

        <Reveal delayMs={80}>
          <div className="flex flex-col gap-3 mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {SCHEDULE_MODALITY_FILTERS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModality(m)}
                  data-active={modality === m}
                  className="aca-tab rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground"
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {SCHEDULE_DAY_FILTERS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDay(d)}
                  data-active={day === d}
                  className="aca-tab rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-muted-foreground"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delayMs={120}>
          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="hidden sm:grid grid-cols-[100px_1fr_1fr_120px] bg-[var(--color-surface-raised)] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <span>Horário</span>
              <span>Modalidade</span>
              <span>Professor</span>
              <span>Dia</span>
            </div>
            <div className="divide-y divide-border">
              {filtered.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-muted-foreground">Nenhuma aula encontrada para esse filtro.</p>
              )}
              {filtered.map((c, index) => (
                <div
                  key={`${c.day}-${c.time}-${c.modality}-${index}`}
                  className="grid grid-cols-2 sm:grid-cols-[100px_1fr_1fr_120px] gap-2 px-5 py-4 text-sm bg-[var(--color-surface)] hover:bg-[var(--color-surface-raised)] transition-colors"
                >
                  <span className="flex items-center gap-1.5 font-semibold text-[var(--color-primary)]">
                    <Clock className="size-3.5 shrink-0" aria-hidden="true" />
                    {c.time}
                  </span>
                  <span className="text-foreground font-medium">{c.modality}</span>
                  <span className="flex items-center gap-1.5 text-muted-foreground sm:col-auto col-span-2">
                    <User className="size-3.5 shrink-0" aria-hidden="true" />
                    {c.teacher}
                  </span>
                  <span className="text-muted-foreground">{c.day}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
