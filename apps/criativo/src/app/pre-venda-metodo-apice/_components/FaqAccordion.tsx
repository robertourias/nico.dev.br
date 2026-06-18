"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Reveal } from "./Reveal"
import { formatLaunchDateLabel } from "../_lib/launch"

const faqs = [
  {
    question: "Quando será lançado o Método Ápice?",
    answer: `O lançamento oficial acontece em ${formatLaunchDateLabel()}. Quem está na lista de espera recebe o link de acesso antes de qualquer divulgação pública.`,
  },
  {
    question: "Como vou receber o acesso?",
    answer:
      "No dia do lançamento, enviamos por e-mail o link de matrícula com a condição exclusiva de pré-venda. O acesso à plataforma e à comunidade é liberado imediatamente após a confirmação da inscrição.",
  },
  {
    question: "Haverá desconto para quem entrar na lista de espera?",
    answer:
      "Sim. Todos os inscritos na lista de espera recebem a condição de pré-venda (preço promocional + bônus exclusivos) antes da abertura ao público geral, por tempo limitado.",
  },
  {
    question: "O produto possui garantia?",
    answer:
      "Sim. Você tem 7 dias corridos após o início do programa para testar o método com tranquilidade. Se não fizer sentido para você, devolvemos 100% do valor investido, sem perguntas.",
  },
  {
    question: "Preciso ter algum conhecimento prévio?",
    answer:
      "Não. O Método Ápice foi desenhado para ser aplicado desde o primeiro dia, independentemente do seu nível de organização atual. Os módulos são sequenciais e guiados passo a passo.",
  },
  {
    question: "Quanto tempo por dia preciso dedicar?",
    answer:
      "O programa foi desenhado para rotinas reais: entre 20 e 40 minutos por dia são suficientes para acompanhar o conteúdo e aplicar o sistema na sua semana.",
  },
]

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="relative px-6 py-20 md:py-28" aria-labelledby="faq-title">
      <div className="max-w-2xl mx-auto">
        <Reveal className="text-center mb-12">
          <h2 id="faq-title" className="text-3xl md:text-4xl font-bold mb-4">
            Perguntas <span className="apice-gradient-text">frequentes</span>
          </h2>
          <p className="text-[var(--apice-fg-muted)] text-lg">Tudo que você precisa saber antes de entrar na lista.</p>
        </Reveal>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const open = openIndex === i
            const panelId = `faq-panel-${i}`
            const buttonId = `faq-button-${i}`

            return (
              <Reveal key={faq.question} delayMs={i * 50}>
                <div className="apice-glass rounded-2xl overflow-hidden">
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
                  >
                    <span className="font-medium text-[var(--apice-fg)]">{faq.question}</span>
                    <ChevronDown
                      className={`size-5 text-[var(--apice-fg-muted)] shrink-0 transition-transform duration-300 ${
                        open ? "rotate-180 text-[var(--apice-violet)]" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="apice-accordion-panel"
                    data-open={open}
                  >
                    <div>
                      <p className="px-6 pb-5 text-sm text-[var(--apice-fg-muted)] leading-relaxed">{faq.answer}</p>
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
