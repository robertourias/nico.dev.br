import { ArrowRight } from "lucide-react"
import { GradientOrbs } from "./GradientOrbs"
import { CountdownTimer } from "./CountdownTimer"
import { Reveal } from "./Reveal"

export function FinalCta() {
  return (
    <section className="relative px-6 py-24 md:py-32 overflow-hidden" aria-labelledby="final-cta-title">
      <GradientOrbs variant="cta" />

      <Reveal variant="scale-in" className="relative max-w-3xl mx-auto text-center">
        <h2 id="final-cta-title" className="text-3xl md:text-5xl font-bold leading-tight mb-5">
          Sua <span className="apice-gradient-text">transformação</span> começa antes de todo mundo
        </h2>
        <p className="text-lg text-[var(--apice-fg-muted)] max-w-xl mx-auto mb-10">
          Entre para a lista de espera agora e garanta a condição exclusiva de pré-venda do Método Ápice.
          As vagas são limitadas e fecham no lançamento.
        </p>

        <div className="flex flex-col items-center gap-8">
          <CountdownTimer />

          <a
            href="#lista-de-espera"
            className="apice-glow inline-flex items-center gap-2 rounded-xl px-9 py-4 font-semibold text-white text-base transition-transform hover:scale-[1.04] active:scale-[0.98]"
            style={{ backgroundImage: "var(--apice-gradient-primary)" }}
          >
            Quero Acesso Antecipado
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </section>
  )
}
