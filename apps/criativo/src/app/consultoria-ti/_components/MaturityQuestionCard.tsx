"use client"

import type { MaturityQuestion } from "../_lib/maturity"

interface MaturityQuestionCardProps {
  question: MaturityQuestion
  value: string | undefined
  onChange: (value: string) => void
}

export function MaturityQuestionCard({ question, value, onChange }: MaturityQuestionCardProps) {
  return (
    <div key={question.id} className="consult-step-transition">
      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6">{question.title}</h3>

      <div className="grid sm:grid-cols-2 gap-3">
        {question.options.map((option) => (
          <button
            key={option.value}
            type="button"
            data-active={value === option.value}
            onClick={() => onChange(option.value)}
            className="consult-option-btn px-5 py-3.5 text-left text-sm font-medium text-foreground"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
