import { ArrowRight, Calculator } from "lucide-react"

// CTA final com fundo "pôr do sol" (gradiente night + glow amarelo simulando
// o sol baixo no horizonte, sem depender de imagem externa pesada). Ancorada
// em `#cta-final`, mesmo destino do botão secundário do Hero.
export function FinalCta() {
  return (
    <section
      id="cta-final"
      className="relative px-6 py-20 md:py-28 scroll-mt-20 overflow-hidden text-white"
      style={{ backgroundImage: "var(--solar-gradient-night)" }}
      aria-labelledby="final-cta-title"
    >
      <div
        className="solar-blob solar-float-slow"
        style={{
          width: 420,
          height: 420,
          background: "var(--solar-gradient-sun)",
          left: "50%",
          bottom: "-18rem",
          transform: "translateX(-50%)",
          opacity: 0.45,
        }}
      />

      <div className="max-w-2xl mx-auto text-center relative">
        <p className="text-sm font-semibold mb-3 text-white/75 uppercase tracking-wide">Comece agora</p>
        <h2 id="final-cta-title" className="text-3xl md:text-5xl font-bold mb-4">
          Comece hoje a produzir <span className="solar-text-sun">sua própria energia</span>
        </h2>
        <p className="text-white/75 max-w-md mx-auto mb-9">
          Solicite um orçamento gratuito e descubra, em minutos, quanto você pode economizar todos os meses.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#simulador"
            className="solar-ripple inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold text-[#0a1f2e] solar-glow-sun"
            style={{ backgroundImage: "var(--solar-gradient-sun)" }}
          >
            Solicitar orçamento gratuito
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
          <a
            href="#simulador"
            className="solar-ripple inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold border border-white/30 text-white hover:bg-white/10 transition-colors"
          >
            <Calculator className="size-4" aria-hidden="true" />
            Fazer simulação
          </a>
        </div>
      </div>
    </section>
  )
}
