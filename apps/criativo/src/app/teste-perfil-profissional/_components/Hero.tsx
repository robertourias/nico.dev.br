import { ArrowRight, PlayCircle } from "lucide-react"
import { DashboardPreview } from "./DashboardPreview"

// Hero com headline em gradiente translúcido, dois CTAs (primário e
// secundário) e, ao lado, um dashboard fictício do resultado — conforme
// briefing. Blobs de fundo sutis para reforçar a estética "premium" sem
// pesar a página (apenas CSS, sem canvas/lib de partículas).
export function Hero() {
  return (
    <section className="relative px-6 pt-14 pb-20 md:pt-20 md:pb-28 overflow-hidden" aria-labelledby="hero-title">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="perfil-blob perfil-float-slow w-[30rem] h-[30rem] -top-32 -left-24"
          style={{ background: "radial-gradient(circle, var(--color-primary-light), transparent 70%)" }}
        />
        <div
          className="perfil-blob perfil-float-slower w-[26rem] h-[26rem] top-10 -right-20"
          style={{ background: "radial-gradient(circle, var(--color-secondary-light), transparent 70%)" }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <div className="text-center lg:text-left">
          <span className="perfil-fade-up inline-flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground px-4 py-1.5 text-xs font-semibold mb-6">
            Questionário inteligente · Resultado instantâneo
          </span>

          <h1
            id="hero-title"
            className="perfil-fade-up-delay-1 text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.1] tracking-tight mb-6"
          >
            Descubra seu verdadeiro{" "}
            <span className="perfil-gradient-text">perfil profissional</span> e encontre oportunidades alinhadas ao seu potencial
          </h1>

          <p className="perfil-fade-up-delay-2 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-9">
            Responda algumas perguntas e receba uma análise personalizada com pontos fortes, áreas de
            desenvolvimento e recomendações para acelerar sua carreira.
          </p>

          <div className="perfil-fade-up-delay-3 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
            <a
              href="#cta-final"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-semibold text-white text-base perfil-glow transition-transform hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto"
              style={{ backgroundImage: "var(--perfil-gradient-primary)" }}
            >
              Iniciar Teste Gratuito
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#previa-resultado"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-semibold border border-border text-foreground transition-colors hover:border-primary hover:text-primary w-full sm:w-auto"
            >
              <PlayCircle className="size-4" aria-hidden="true" />
              Ver Exemplo de Resultado
            </a>
          </div>

          <p className="perfil-fade-up-delay-3 text-xs text-muted-foreground mt-5">
            Gratuito · Sem necessidade de cartão · Resultado em 5 minutos
          </p>
        </div>

        <DashboardPreview />
      </div>
    </section>
  )
}
