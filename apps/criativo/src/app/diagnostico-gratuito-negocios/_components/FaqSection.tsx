"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Reveal } from "./Reveal"

const faqs = [
  { question: "O diagnóstico é gratuito?", answer: "Sim." },
  { question: "Quanto tempo leva?", answer: "Cerca de 3 minutos." },
  { question: "Preciso informar cartão?", answer: "Não." },
  { question: "Como recebo meu resultado?", answer: "Imediatamente após concluir o questionário." },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="px-6 py-20" aria-labelledby="faq-title">
      <div className="max-w-2xl mx-auto">
        <Reveal className="text-center mb-10">
          <h2 id="faq-title" className="text-3xl md:text-4xl font-bold text-foreground">
            Perguntas <span className="diag-gradient-text">frequentes</span>
          </h2>
        </Reveal>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div key={faq.question} className="rounded-2xl border border-border bg-[var(--color-surface-raised)] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="font-medium text-foreground text-sm">{faq.question}</span>
                  <ChevronDown
                    className={`size-4 text-muted-foreground shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-muted-foreground">{faq.answer}</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
