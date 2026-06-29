import { ArrowRight } from "lucide-react"
import { GradientOrbs } from "./GradientOrbs"

export function FinalCta() {
  return (
    <section className="relative px-6 py-24 md:py-32 overflow-hidden text-center" aria-labelledby="final-cta-title">
      <GradientOrbs variant="cta" />

      <div className="relative max-w-2xl mx-auto">
        <span className="devpath-mono inline-flex items-center gap-2 rounded-full border border-[var(--devpath-border-glass)] bg-[var(--devpath-bg-raised)] px-4 py-1.5 text-xs text-[var(--devpath-green)] mb-6">
          <span className="devpath-cursor">$ devpath --start agora</span>
        </span>

        <h2 id="final-cta-title" className="text-3xl md:text-4xl font-bold text-[var(--devpath-fg)] mb-4">
          Sua carreira em tecnologia não espera
        </h2>
        <p className="text-[var(--devpath-fg-muted)] mb-9">
          Busque vagas, descubra sua faixa salarial e siga um roadmap até onde você quer chegar — gratuito para
          começar.
        </p>

        <a
          href="#vagas"
          className="devpath-cta-pulse inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 font-semibold text-[#04140e] text-base transition-transform hover:scale-[1.03] active:scale-[0.98]"
          style={{ backgroundImage: "var(--devpath-gradient-cta)" }}
        >
          Começar agora, é grátis
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
