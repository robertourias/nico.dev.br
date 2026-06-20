"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Reveal } from "./Reveal"

const faqs = [
  {
    question: "O evento é presencial ou online?",
    answer:
      "O NEXUS Summit é híbrido: você pode participar presencialmente no Centro de Eventos Aurora, em São Paulo, ou acompanhar a transmissão online ao vivo das principais sessões.",
  },
  {
    question: "Receberei certificado?",
    answer:
      "Sim. Todos os participantes recebem certificado digital de participação por e-mail em até 5 dias úteis após o evento.",
  },
  {
    question: "Posso transferir minha inscrição para outra pessoa?",
    answer:
      "Sim. A transferência pode ser feita gratuitamente até 7 dias antes do evento, enviando os dados do novo participante para nosso e-mail de suporte.",
  },
  {
    question: "Como acessar o evento?",
    answer:
      "Inscritos presenciais recebem o QR Code de credenciamento por e-mail. Inscritos online recebem o link de transmissão na semana do evento, junto com a programação detalhada.",
  },
  {
    question: "Quais as formas de pagamento?",
    answer:
      "Aceitamos cartão de crédito (em até 12x), Pix e boleto bancário. Para inscrições corporativas com mais de 5 participantes, também emitimos nota fiscal com faturamento direto.",
  },
  {
    question: "Há desconto para grupos ou empresas?",
    answer:
      "Sim. Grupos a partir de 5 inscrições têm 15% de desconto automático. Fale com nosso time pelo e-mail de contato para condições corporativas a partir de 10 participantes.",
  },
]

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="relative px-6 py-20 md:py-28 scroll-mt-20" aria-labelledby="faq-title">
      <div className="max-w-2xl mx-auto">
        <Reveal className="text-center mb-12">
          <h2 id="faq-title" className="text-3xl md:text-4xl font-bold mb-4 text-[var(--nexus-fg)]">
            Perguntas <span className="nexus-gradient-text">frequentes</span>
          </h2>
          <p className="text-[var(--nexus-fg-muted)] text-lg">Tudo que você precisa saber antes de se inscrever.</p>
        </Reveal>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const open = openIndex === i
            const panelId = `faq-panel-${i}`
            const buttonId = `faq-button-${i}`

            return (
              <Reveal key={faq.question} delayMs={i * 50}>
                <div className="nexus-glass rounded-2xl overflow-hidden">
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
                  >
                    <span className="font-medium text-[var(--nexus-fg)]">{faq.question}</span>
                    <ChevronDown
                      className={`size-5 text-[var(--nexus-fg-muted)] shrink-0 transition-transform duration-300 ${
                        open ? "rotate-180 text-[var(--nexus-purple)]" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <div id={panelId} role="region" aria-labelledby={buttonId} className="nexus-accordion-panel" data-open={open}>
                    <div>
                      <p className="px-6 pb-5 text-sm text-[var(--nexus-fg-muted)] leading-relaxed">{faq.answer}</p>
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
