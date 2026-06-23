import { ArrowUpRight, MessageCircle } from "lucide-react"
import { Reveal } from "./Reveal"

export function FinalCta() {
  return (
    <section className="relative px-6 py-20 md:py-28 overflow-hidden" aria-labelledby="final-cta-title">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="roi-blob roi-float-slow w-[28rem] h-[28rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ background: "radial-gradient(circle, var(--color-primary-light), transparent 70%)", opacity: 0.3 }}
        />
      </div>

      <Reveal variant="scale-in" className="relative max-w-3xl mx-auto text-center">
        <div className="roi-glass roi-glow rounded-3xl p-10 md:p-14">
          <h2 id="final-cta-title" className="text-3xl md:text-4xl font-bold mb-4">
            Descubra o Potencial de Retorno do{" "}
            <span className="roi-gradient-text">Seu Projeto</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-9 max-w-xl mx-auto">
            Transforme números em decisões estratégicas e demonstre valor antes mesmo da contratação.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#calculadora"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-semibold text-white text-base roi-glow transition-transform hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto"
              style={{ backgroundImage: "var(--roi-gradient-primary)" }}
            >
              Solicitar Proposta
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#calculadora"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-semibold border border-border text-foreground transition-colors hover:border-primary hover:text-primary w-full sm:w-auto"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Falar com Especialista
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
