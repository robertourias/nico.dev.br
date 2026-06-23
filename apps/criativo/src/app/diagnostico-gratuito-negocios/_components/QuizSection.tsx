"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { QUESTIONS, TOTAL_QUESTIONS } from "../_lib/questions"
import { calculateDiagnostic, STORAGE_KEY, type Answers, type DiagnosticResult } from "../_lib/scoring"
import { ProgressBar } from "./ProgressBar"
import { QuestionCard } from "./QuestionCard"
import { ResultsScreen } from "./ResultsScreen"
import { Reveal } from "./Reveal"

export function QuizSection() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [result, setResult] = useState<DiagnosticResult | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as { step?: number; answers?: Answers }
        if (parsed.answers) setAnswers((current) => ({ ...current, ...parsed.answers }))
        if (typeof parsed.step === "number") setStep(() => parsed.step as number)
      }
    } catch {
      // localStorage indisponível (modo privado, etc.) — segue com estado padrão
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, answers }))
    } catch {
      // sem espaço/permissão para storage — diagnóstico continua normalmente
    }
  }, [step, answers, hydrated])

  const currentQuestion = QUESTIONS[step]
  const canAdvance = currentQuestion.type === "text" || Boolean(answers[currentQuestion.id])
  const isLastStep = step === TOTAL_QUESTIONS - 1

  const handleAnswer = (value: string) => {
    setAnswers((current) => ({ ...current, [currentQuestion.id]: value }))
  }

  const handleNext = () => {
    if (!canAdvance) return
    if (isLastStep) {
      setResult(calculateDiagnostic(answers))
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
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignora falha de storage
    }
  }

  return (
    <section id="diagnostico" className="px-6 py-20 scroll-mt-20" aria-labelledby="quiz-title">
      <div className="max-w-2xl mx-auto">
        {!result ? (
          <Reveal>
            <h2 id="quiz-title" className="sr-only">
              Questionário de diagnóstico
            </h2>
            <div className="diag-glass rounded-3xl p-6 md:p-10">
              <div className="mb-8">
                <ProgressBar current={step + 1} total={TOTAL_QUESTIONS} />
              </div>

              <QuestionCard question={currentQuestion} value={answers[currentQuestion.id]} onChange={handleAnswer} />

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
                  style={{ backgroundImage: "var(--diag-gradient-primary)" }}
                >
                  {isLastStep ? "Ver resultado" : "Próximo"}
                  <ChevronRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </Reveal>
        ) : (
          <ResultsScreen result={result} onRestart={handleRestart} />
        )}
      </div>
    </section>
  )
}
