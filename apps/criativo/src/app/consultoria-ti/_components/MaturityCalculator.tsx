"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Gauge } from "lucide-react"
import { MATURITY_QUESTIONS, TOTAL_MATURITY_QUESTIONS, calculateMaturity, type MaturityAnswers, type MaturityResult } from "../_lib/maturity"
import { ProgressBar } from "./ProgressBar"
import { MaturityQuestionCard } from "./MaturityQuestionCard"
import { MaturityResultsScreen } from "./MaturityResultsScreen"
import { Reveal } from "./Reveal"

// Diferencial de portfólio do briefing: calculadora interativa de
// maturidade tecnológica. Mesmo padrão de quiz step-a-step usado em outras
// landings do app (ver diagnostico-gratuito-negocios), mas com lib própria
// (_lib/maturity.ts) e recomendações cruzadas com os serviços da consultoria.
export function MaturityCalculator() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<MaturityAnswers>({})
  const [result, setResult] = useState<MaturityResult | null>(null)

  const currentQuestion = MATURITY_QUESTIONS[step]
  const canAdvance = Boolean(answers[currentQuestion.id])
  const isLastStep = step === TOTAL_MATURITY_QUESTIONS - 1

  const handleAnswer = (value: string) => {
    setAnswers((current) => ({ ...current, [currentQuestion.id]: value }))
  }

  const handleNext = () => {
    if (!canAdvance) return
    if (isLastStep) {
      setResult(calculateMaturity(answers))
      return
    }
    setStep((current) => current + 1)
  }

  const handleBack = () => {
    setStep((current) => Math.max(0, current - 1))
  }

  const handleRestart = () => {
    setStep(0)
    setAnswers({})
    setResult(null)
  }

  return (
    <section id="maturidade" className="px-6 py-20 md:py-28 scroll-mt-20 bg-[var(--color-surface)]" aria-labelledby="maturity-title">
      <div className="max-w-2xl mx-auto">
        <Reveal className="text-center mb-10">
          <span className="inline-flex items-center gap-2 rounded-full consult-glass px-4 py-1.5 text-xs font-semibold text-secondary mb-5">
            <Gauge className="size-3.5" aria-hidden="true" />
            Ferramenta gratuita
          </span>
          <h2 id="maturity-title" className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Qual o nível de <span className="consult-gradient-text">maturidade digital</span> da sua empresa?
          </h2>
          <p className="text-muted-foreground text-lg">
            Responda 10 perguntas rápidas e descubra sua pontuação em infraestrutura, engenharia, dados, segurança e
            cultura digital.
          </p>
        </Reveal>

        {!result ? (
          <Reveal>
            <div className="consult-glass rounded-3xl p-6 md:p-10">
              <div className="mb-8">
                <ProgressBar current={step + 1} total={TOTAL_MATURITY_QUESTIONS} />
              </div>

              <MaturityQuestionCard question={currentQuestion} value={answers[currentQuestion.id]} onChange={handleAnswer} />

              <div className="flex items-center justify-between mt-10">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={step === 0}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground disabled:opacity-40 hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                  Voltar
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canAdvance}
                  className="inline-flex items-center gap-1.5 rounded-xl px-6 py-3 text-sm font-semibold text-white disabled:opacity-50 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{ backgroundImage: "var(--consult-gradient-primary)" }}
                >
                  {isLastStep ? "Ver resultado" : "Próximo"}
                  <ChevronRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </Reveal>
        ) : (
          <MaturityResultsScreen result={result} onRestart={handleRestart} />
        )}
      </div>
    </section>
  )
}
