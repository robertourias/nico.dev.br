import { ArrowRight, Compass } from "lucide-react"
import { GradientOrbs } from "./GradientOrbs"
import { HeroDashboardPreview } from "./HeroDashboardPreview"

export function Hero() {
  return (
    <section id="top" className="relative px-6 pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden" aria-labelledby="hero-title">
      <GradientOrbs variant="hero" />

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <div className="text-center lg:text-left">
          <span className="devpath-fade-up devpath-mono inline-flex items-center gap-2 rounded-full border border-[var(--devpath-border-glass)] bg-[var(--devpath-bg-raised)] px-4 py-1.5 text-xs text-[var(--devpath-green)] mb-6">
            <span className="devpath-cursor">$ devpath --status pronto-para-decolar</span>
          </span>

          <h1
            id="hero-title"
            className="devpath-fade-up-delay-1 text-4xl sm:text-5xl lg:text-[3.3rem] font-bold leading-[1.1] tracking-tight mb-6 text-[var(--devpath-fg)]"
          >
            Sua próxima <span className="devpath-gradient-text">oportunidade em tecnologia</span> começa aqui.
          </h1>

          <p className="devpath-fade-up-delay-2 text-lg text-[var(--devpath-fg-muted)] max-w-xl mx-auto lg:mx-0 mb-9">
            Pesquise vagas, descubra salários, acompanhe tendências e construa seu roadmap profissional — tudo em um
            único painel, sem precisar consultar dez sites diferentes.
          </p>

          <div className="devpath-fade-up-delay-3 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
            <a
              href="#vagas"
              className="devpath-cta-pulse inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-semibold text-[#04140e] text-base transition-transform hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto"
              style={{ backgroundImage: "var(--devpath-gradient-cta)" }}
            >
              Encontrar vagas
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#comparador"
              className="devpath-glass inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-semibold text-[var(--devpath-fg)] text-base transition-transform hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto"
            >
              <Compass className="size-4" aria-hidden="true" />
              Explorar carreiras
            </a>
          </div>

          <p className="devpath-fade-up-delay-3 text-xs text-[var(--devpath-fg-faint)] mt-5">
            Gratuito para começar · Sem necessidade de cartão · +14 plataformas de vagas agregadas
          </p>
        </div>

        <HeroDashboardPreview />
      </div>
    </section>
  )
}
