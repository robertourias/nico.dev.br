import { ArrowRight, LineChart } from "lucide-react"
import { HeroIllustration } from "./HeroIllustration"

// Hero com headline em gradiente translúcido, dois CTAs (calcular ou ver
// exemplo pronto) e, ao lado, um mockup do dashboard de resultado — conforme
// briefing. Blobs de fundo sutis para reforçar a estética "premium" sem
// pesar a página (apenas CSS).
export function Hero() {
  return (
    <section className="relative px-6 pt-14 pb-20 md:pt-20 md:pb-28 overflow-hidden" aria-labelledby="hero-title">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="roi-blob roi-float-slow w-[30rem] h-[30rem] -top-32 -left-24"
          style={{ background: "radial-gradient(circle, var(--color-primary-light), transparent 70%)" }}
        />
        <div
          className="roi-blob roi-float-slower w-[26rem] h-[26rem] top-10 -right-20"
          style={{ background: "radial-gradient(circle, var(--color-secondary-light), transparent 70%)" }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <div className="text-center lg:text-left">
          <span className="roi-fade-up inline-flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground px-4 py-1.5 text-xs font-semibold mb-6">
            <LineChart className="size-3.5" aria-hidden="true" />
            Simulação instantânea · Baseada em dados
          </span>

          <h1
            id="hero-title"
            className="roi-fade-up-delay-1 text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.1] tracking-tight mb-6"
          >
            Descubra Quanto Sua Empresa Pode{" "}
            <span className="roi-gradient-text">Ganhar</span>
          </h1>

          <p className="roi-fade-up-delay-2 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-9">
            Simule o retorno financeiro do investimento e veja em poucos segundos o potencial de crescimento
            do seu negócio.
          </p>

          <div className="roi-fade-up-delay-3 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
            <a
              href="#calculadora"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-semibold text-white text-base roi-glow transition-transform hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto"
              style={{ backgroundImage: "var(--roi-gradient-primary)" }}
            >
              Calcular ROI
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#exemplos"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-semibold border border-border text-foreground transition-colors hover:border-primary hover:text-primary w-full sm:w-auto"
            >
              Ver Exemplo
            </a>
          </div>

          <p className="roi-fade-up-delay-3 text-xs text-muted-foreground mt-5">
            Sem cadastro · Cálculo 100% local · Resultados em tempo real
          </p>
        </div>

        <HeroIllustration />
      </div>
    </section>
  )
}
