"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { FAQS } from "../_lib/data"
import { Reveal } from "./Reveal"

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="relative px-6 py-20 md:py-28 bg-[var(--devpath-bg-soft)]" aria-labelledby="faq-title">
      <div className="max-w-2xl mx-auto">
        <Reveal className="text-center mb-12">
          <p className="devpath-mono text-xs text-[var(--devpath-green)] mb-3">// perguntas_frequentes</p>
          <h2 id="faq-title" className="text-3xl md:text-4xl font-bold text-[var(--devpath-fg)]">
            Perguntas <span className="devpath-gradient-text">frequentes</span>
          </h2>
        </Reveal>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => {
            const open = openIndex === i
            const panelId = `faq-panel-${i}`
            const buttonId = `faq-button-${i}`

            return (
              <Reveal key={faq.question} delayMs={i * 50}>
                <div className="rounded-2xl border border-[var(--devpath-border)] bg-[var(--devpath-bg-raised)] overflow-hidden">
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
                  >
                    <span className="font-medium text-[var(--devpath-fg)]">{faq.question}</span>
                    <ChevronDown
                      className={`size-5 text-[var(--devpath-fg-faint)] shrink-0 transition-transform duration-300 ${
                        open ? "rotate-180 text-[var(--devpath-green)]" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <div id={panelId} role="region" aria-labelledby={buttonId} className="devpath-accordion-panel" data-open={open}>
                    <div>
                      <p className="px-6 pb-5 text-sm text-[var(--devpath-fg-muted)] leading-relaxed">{faq.answer}</p>
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
