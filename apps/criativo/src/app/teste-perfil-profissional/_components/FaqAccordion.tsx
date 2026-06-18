"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Reveal } from "./Reveal"

const faqs = [
  {
    question: "Quanto tempo leva?",
    answer: "Entre 5 e 10 minutos.",
  },
  {
    question: "O teste é gratuito?",
    answer: "Sim.",
  },
  {
    question: "Recebo resultado imediato?",
    answer: "Sim, logo após finalizar.",
  },
  {
    question: "Preciso criar conta?",
    answer: "Não inicialmente.",
  },
  {
    question: "Posso refazer o teste?",
    answer: "Sim, quantas vezes desejar.",
  },
]

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="relative px-6 py-20 md:py-28 bg-[var(--color-surface)]" aria-labelledby="faq-title">
      <div className="max-w-2xl mx-auto">
        <Reveal className="text-center mb-12">
          <h2 id="faq-title" className="text-3xl md:text-4xl font-bold mb-4">
            Perguntas <span className="perfil-gradient-text">frequentes</span>
          </h2>
        </Reveal>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const open = openIndex === i
            const panelId = `faq-panel-${i}`
            const buttonId = `faq-button-${i}`

            return (
              <Reveal key={faq.question} delayMs={i * 50}>
                <div className="rounded-2xl border border-border bg-[var(--color-surface-raised)] overflow-hidden">
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
                  >
                    <span className="font-medium text-foreground">{faq.question}</span>
                    <ChevronDown
                      className={`size-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                        open ? "rotate-180 text-primary" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="perfil-accordion-panel"
                    data-open={open}
                  >
                    <div>
                      <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
