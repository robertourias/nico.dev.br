"use client"

import { SCALE_LABELS, type Question } from "../_lib/questions"

interface QuestionCardProps {
  question: Question
  value: string | undefined
  onChange: (value: string) => void
}

export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  return (
    <div key={question.id} className="diag-step-transition">
      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6">{question.title}</h3>

      {question.type === "single" && (
        <div className="grid sm:grid-cols-2 gap-3">
          {question.options?.map((option) => (
            <button
              key={option.value}
              type="button"
              data-active={value === option.value}
              onClick={() => onChange(option.value)}
              className="diag-option-btn px-5 py-3.5 text-left text-sm font-medium text-foreground"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {question.type === "scale" && (
        <div className="flex items-center justify-between gap-2">
          {[1, 2, 3, 4, 5].map((scaleValue) => (
            <button
              key={scaleValue}
              type="button"
              data-active={value === String(scaleValue)}
              onClick={() => onChange(String(scaleValue))}
              aria-label={SCALE_LABELS[scaleValue - 1]}
              className="diag-option-btn flex-1 flex flex-col items-center gap-1.5 py-4"
            >
              <span className="text-lg font-bold text-foreground">{scaleValue}</span>
              <span className="text-[0.65rem] text-muted-foreground text-center leading-tight px-1">
                {SCALE_LABELS[scaleValue - 1]}
              </span>
            </button>
          ))}
        </div>
      )}

      {question.type === "text" && (
        <textarea
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder="Escreva livremente sobre seu maior desafio..."
          className="w-full rounded-xl border border-input bg-[var(--color-surface-raised)] px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      )}
    </div>
  )
}
