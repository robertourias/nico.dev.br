import { ArrowRight } from "lucide-react"
import { Reveal } from "./Reveal"

export function CtaSection() {
  return (
    <section className="px-6 py-20 md:py-24">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl text-center p-10 md:p-16 consult-glow" style={{ backgroundImage: "var(--consult-gradient-primary)" }}>
            <div className="absolute inset-0 consult-grid-bg opacity-30" aria-hidden="true" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 max-w-2xl mx-auto">
                Descubra oportunidades de melhoria na sua operação de TI.
              </h2>
              <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">
                Converse com nossos especialistas e receba um diagnóstico gratuito personalizado para o seu negócio.
              </p>
              <a
                href="#diagnostico"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-primary transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Solicitar Diagnóstico Gratuito
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
