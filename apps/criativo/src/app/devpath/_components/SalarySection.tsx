"use client"

import { useState } from "react"
import { TrendingUp } from "lucide-react"
import { SALARY_BY_ROLE, SALARY_ROLE_OPTIONS, MAX_SALARY_REFERENCE } from "../_lib/data"
import { Reveal } from "./Reveal"

// Preview de pesquisa salarial: chips de cargo trocam a trilha de níveis
// exibida, com barras proporcionais a um teto de referência fixo
// (MAX_SALARY_REFERENCE) — dados ilustrativos, sem fonte de mercado real.
export function SalarySection() {
  const [role, setRole] = useState(SALARY_ROLE_OPTIONS[0])
  const levels = SALARY_BY_ROLE[role]

  return (
    <section id="salarios" className="relative px-6 py-20 md:py-28" aria-labelledby="salary-title">
      <div className="max-w-4xl mx-auto">
        <Reveal className="max-w-2xl mb-10">
          <p className="devpath-mono text-xs text-[var(--devpath-green)] mb-3">// pesquisa_de_salarios</p>
          <h2 id="salary-title" className="text-3xl md:text-4xl font-bold text-[var(--devpath-fg)] mb-3">
            Saiba quanto vale o seu trabalho
          </h2>
          <p className="text-[var(--devpath-fg-muted)]">
            Compare faixas salariais por cargo e nível de senioridade antes da próxima negociação.
          </p>
        </Reveal>

        <Reveal className="flex flex-wrap gap-2 mb-8">
          {SALARY_ROLE_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRole(option)}
              data-active={option === role}
              className="rounded-full border px-4 py-2 text-sm font-semibold transition-colors"
              style={
                option === role
                  ? { borderColor: "var(--devpath-green)", background: "rgba(52,211,153,0.14)", color: "var(--devpath-green)" }
                  : { borderColor: "var(--devpath-border)", color: "var(--devpath-fg-muted)" }
              }
            >
              {option}
            </button>
          ))}
        </Reveal>

        <Reveal className="rounded-2xl border border-[var(--devpath-border)] bg-[var(--devpath-bg-raised)] p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 text-[var(--devpath-fg-muted)]">
            <TrendingUp className="size-4 text-[var(--devpath-green)]" aria-hidden="true" />
            <p className="text-sm">
              Faixas de mercado para <span className="font-semibold text-[var(--devpath-fg)]">{role}</span>
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {levels.map((level) => {
              const widthPct = Math.round((level.max / MAX_SALARY_REFERENCE) * 100)
              return (
                <div key={level.level}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-[var(--devpath-fg)]">{level.level}</span>
                    <span className="devpath-mono text-xs text-[var(--devpath-green)]">{level.rangeLabel}</span>
                  </div>
                  <div className="devpath-progress-track">
                    <div className="devpath-progress-fill" style={{ width: `${widthPct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>

          <p className="text-xs text-[var(--devpath-fg-faint)] mt-6">
            Valores ilustrativos de exemplo, mensais e brutos, com base em médias de mercado por nível.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
