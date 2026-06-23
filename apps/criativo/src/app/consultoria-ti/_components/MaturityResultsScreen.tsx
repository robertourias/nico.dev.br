"use client"

import { CalendarCheck, RotateCcw } from "lucide-react"
import { ScoreGauge } from "./ScoreGauge"
import type { MaturityResult } from "../_lib/maturity"

interface MaturityResultsScreenProps {
  result: MaturityResult
  onRestart: () => void
}

export function MaturityResultsScreen({ result, onRestart }: MaturityResultsScreenProps) {
  return (
    <div className="consult-step-transition">
      <div className="text-center mb-10">
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Seu Nível de Maturidade Digital</h3>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Avaliamos cinco dimensões da sua operação de tecnologia e identificamos onde estão as maiores oportunidades.
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <ScoreGauge score={result.overallScore} label={result.level} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {result.areas.map((area) => (
          <div key={area.category} className="rounded-2xl border border-border bg-[var(--color-surface-raised)] p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-foreground text-sm">{area.label}</p>
              <span className="text-sm font-bold text-foreground tabular-nums">{area.score}%</span>
            </div>
            <div className="consult-progress-track mb-3">
              <div className="consult-progress-fill" style={{ width: `${area.score}%` }} />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{area.recommendation}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6 mb-10">
        <p className="font-semibold text-foreground text-sm mb-4">Principais recomendações</p>
        <ul className="flex flex-col gap-3">
          {result.topRecommendations.map((recommendation) => (
            <li key={recommendation} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span
                className="inline-flex items-center justify-center size-5 rounded-full text-white text-[0.6rem] font-bold shrink-0 mt-0.5"
                style={{ backgroundImage: "var(--consult-gradient-primary)" }}
                aria-hidden="true"
              >
                ✓
              </span>
              {recommendation}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl text-center p-8 text-white consult-glow" style={{ backgroundImage: "var(--consult-gradient-primary)" }}>
        <p className="text-xl font-bold mb-2">Quer um plano de ação detalhado?</p>
        <p className="text-sm text-white/85 mb-6">
          Leve este resultado para um diagnóstico completo e gratuito com nossos especialistas.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="#diagnostico"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <CalendarCheck className="size-4" aria-hidden="true" />
            Solicitar Diagnóstico Gratuito
          </a>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white/85 hover:text-white transition-colors"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Refazer avaliação
          </button>
        </div>
      </div>
    </div>
  )
}
