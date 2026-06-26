import { ArrowRight, FileText } from "lucide-react"
import { HeroIllustration } from "./HeroIllustration"

// Hero dividido: headline + CTAs à esquerda, ilustração 3D/isométrica
// animada do fluxo de energia à direita (sol → painéis → casa), conforme
// briefing. Linhas de fluxo elétrico no fundo reforçam a identidade
// "tecnológica" sem pesar a página (apenas CSS).
export function Hero() {
  return (
    <section className="relative px-6 pt-14 pb-20 md:pt-20 md:pb-28 overflow-hidden" aria-labelledby="hero-title">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="solar-blob solar-float-slow w-[32rem] h-[32rem] -top-40 -left-28"
          style={{ background: "radial-gradient(circle, rgba(255,182,39,0.35), transparent 70%)" }}
        />
        <div
          className="solar-blob solar-float-slower w-[28rem] h-[28rem] top-6 -right-24"
          style={{ background: "radial-gradient(circle, rgba(28,127,166,0.3), transparent 70%)" }}
        />
        <div className="solar-power-line w-full top-1/4" style={{ animationDuration: "7s" }} />
        <div className="solar-power-line w-full top-2/3" style={{ animationDuration: "9s", animationDelay: "2s" }} />
      </div>

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <div className="text-center lg:text-left">
          <span className="solar-fade-up inline-flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground px-4 py-1.5 text-xs font-semibold mb-6">
            ☀️ Sua casa produzindo energia
          </span>

          <h1
            id="hero-title"
            className="solar-fade-up-delay-1 text-4xl sm:text-5xl lg:text-[3.3rem] font-bold leading-[1.1] tracking-tight mb-6 text-foreground"
          >
            Transforme a <span className="solar-gradient-text">luz do sol</span> em economia todos os meses.
          </h1>

          <p className="solar-fade-up-delay-2 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-9">
            Reduza drasticamente sua conta de energia com um projeto fotovoltaico personalizado para o seu telhado,
            seu consumo e sua cidade — do dimensionamento à instalação.
          </p>

          <div className="solar-fade-up-delay-3 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
            <a
              href="#simulador"
              className="solar-ripple inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-semibold text-white text-base solar-glow transition-transform hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto"
              style={{ backgroundImage: "var(--solar-gradient-primary)" }}
            >
              Simular Economia
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#cta-final"
              className="solar-ripple inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-semibold border border-border text-foreground transition-colors hover:border-[var(--solar-blue-light)] hover:text-[var(--solar-blue-light)] w-full sm:w-auto"
            >
              <FileText className="size-4" aria-hidden="true" />
              Solicitar Projeto
            </a>
          </div>

          <p className="solar-fade-up-delay-3 text-xs text-muted-foreground mt-5">
            Projeto sem compromisso · Resposta em até 24h · Atendimento em todo o Brasil
          </p>
        </div>

        <HeroIllustration />
      </div>
    </section>
  )
}
