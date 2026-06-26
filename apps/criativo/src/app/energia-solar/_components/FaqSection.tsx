"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Reveal } from "./Reveal"
import { FAQS } from "../_lib/data"

// Acordeão moderno com ícone rotativo e transição suave (`.solar-accordion-content`),
// mesmo padrão usado nas demais landings do projeto. Mantém apenas um item
// aberto por vez para um layout mais limpo.
export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="px-6 py-16 md:py-24 scroll-mt-20" aria-labelledby="faq-title">
      <div className="max-w-2xl mx-auto">
        <Reveal className="text-center mb-10">
          <p className="text-sm font-semibold mb-2" style={{ color: "var(--solar-blue-light)" }}>
            Perguntas frequentes
          </p>
          <h2 id="faq-title" className="text-3xl md:text-4xl font-bold text-foreground">
            Ainda tem <span className="solar-gradient-text">dúvidas?</span>
          </h2>
        </Reveal>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-border bg-[var(--color-surface-raised)] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="font-medium text-foreground text-sm">{faq.question}</span>
                  <ChevronDown
                    className={`size-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    style={{ color: "var(--solar-blue-light)" }}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="solar-accordion-content px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
