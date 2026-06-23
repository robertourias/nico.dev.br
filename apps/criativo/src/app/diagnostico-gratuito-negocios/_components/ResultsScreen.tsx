"use client"

import { CalendarCheck, RotateCcw } from "lucide-react"
import { ScoreGauge } from "./ScoreGauge"
import type { DiagnosticResult } from "../_lib/scoring"

interface ResultsScreenProps {
  result: DiagnosticResult
  onRestart: () => void
}

export function ResultsScreen({ result, onRestart }: ResultsScreenProps) {
  return (
    <div className="diag-step-transition">
      <div className="text-center mb-10">
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Seu Diagnóstico Está Pronto</h3>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Analisamos suas respostas e identificamos os principais pontos de atenção.
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <ScoreGauge score={result.overallScore} label={result.overallLabel} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {result.areas.map((area) => (
          <div key={area.category} className="rounded-2xl border border-border bg-[var(--color-surface-raised)] p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-foreground text-sm">{area.label}</p>
              <span className="text-sm font-bold text-foreground tabular-nums">{area.score}%</span>
            </div>
            <div className="diag-progress-track mb-3">
              <div className="diag-progress-fill" style={{ width: `${area.score}%` }} />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{area.comment}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6 mb-10">
        <p className="font-semibold text-foreground text-sm mb-4">Recomendações</p>
        <ul className="flex flex-col gap-3">
          {result.recommendations.map((recommendation) => (
            <li key={recommendation} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span
                className="inline-flex items-center justify-center size-5 rounded-full text-white text-[0.6rem] font-bold shrink-0 mt-0.5"
                style={{ backgroundImage: "var(--diag-gradient-primary)" }}
                aria-hidden="true"
              >
                ✓
              </span>
              {recommendation}
            </li>
          ))}
        </ul>

        {result.challenge && (
          <div className="mt-5 pt-5 border-t border-border">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
              Maior desafio relatado
            </p>
            <p className="text-sm text-foreground italic">&ldquo;{result.challenge}&rdquo;</p>
          </div>
        )}
      </div>

      <div className="rounded-2xl text-center p-8 text-white diag-glow" style={{ backgroundImage: "var(--diag-gradient-primary)" }}>
        <p className="text-xl font-bold mb-2">Quer uma análise mais detalhada?</p>
        <p className="text-sm text-white/85 mb-6">
          Agende uma consultoria gratuita e aprofunde os resultados do seu diagnóstico.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <CalendarCheck className="size-4" aria-hidden="true" />
            Agendar Consultoria Gratuita
          </a>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white/85 hover:text-white transition-colors"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Refazer diagnóstico
          </button>
        </div>
      </div>
    </div>
  )
}
