import { CalendarCheck, MessageCircle } from "lucide-react"
import { Reveal } from "./Reveal"

export function CtaSection() {
  return (
    <section className="px-6 py-20 md:py-24">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-3xl text-center p-10 md:p-16 adv-glow"
            style={{ backgroundImage: "var(--adv-gradient-dark)" }}
          >
            <div className="absolute inset-0 adv-grid-bg opacity-20" aria-hidden="true" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 max-w-2xl mx-auto">
                Precisa de Orientação Jurídica Especializada?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Entre em contato e receba uma análise inicial do seu caso.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#agendamento"
                  className="adv-cta-highlight inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-base font-semibold"
                  style={{ backgroundImage: "var(--adv-gradient-gold)", color: "#0b2545" }}
                >
                  <CalendarCheck className="size-4" aria-hidden="true" />
                  Agendar Consulta
                </a>
                <a
                  href="https://wa.me/5511988884455?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20consulta."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="adv-cta-highlight inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-base font-semibold text-white border border-white/30 hover:border-white/60 transition-colors"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
