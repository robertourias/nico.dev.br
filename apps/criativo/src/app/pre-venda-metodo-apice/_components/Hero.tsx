import { Sparkles, Lock, ArrowRight } from "lucide-react"
import { GradientOrbs } from "./GradientOrbs"
import { CountdownTimer } from "./CountdownTimer"

export function Hero() {
  return (
    <section className="relative px-6 pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden" aria-labelledby="hero-title">
      <GradientOrbs variant="hero" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="apice-fade-up flex flex-wrap items-center justify-center gap-2 mb-8">
          <span className="apice-glass inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium text-[var(--apice-violet)]">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Pré-venda Exclusiva
          </span>
          <span className="apice-glass inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium text-[var(--apice-neon)]">
            <Lock className="size-3.5" aria-hidden="true" />
            Vagas Limitadas
          </span>
        </div>

        <h1
          id="hero-title"
          className="apice-fade-up-delay-1 text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-6"
        >
          Transforme sua{" "}
          <span className="apice-gradient-text">produtividade</span> com o{" "}
          <span className="apice-glass-text">método</span> que já ajudou{" "}
          <span className="apice-gradient-text">milhares de pessoas</span>.
        </h1>

        <p className="apice-fade-up-delay-2 text-lg md:text-xl text-[var(--apice-fg-muted)] max-w-2xl mx-auto mb-10">
          O <strong className="text-[var(--apice-fg)] font-semibold">Método Ápice</strong> é o programa de alta
          performance que entra em pré-venda exclusiva: sistema, hábitos e ferramentas guiadas em 8 semanas para você
          executar mais, com menos esforço e sem esgotamento.
        </p>

        <div className="apice-fade-up-delay-2 flex flex-col items-center gap-4 mb-12">
          <a
            href="#lista-de-espera"
            className="apice-glow inline-flex items-center gap-2 rounded-xl px-8 py-4 font-semibold text-white text-base transition-transform hover:scale-[1.04] active:scale-[0.98]"
            style={{ backgroundImage: "var(--apice-gradient-primary)" }}
          >
            Quero Acesso Antecipado
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
          <p className="text-xs text-[var(--apice-fg-faint)]">
            Sem custo para entrar na lista. Condição de pré-venda só para quem chegar antes.
          </p>
        </div>

        <div className="apice-fade-up-delay-3 flex flex-col items-center gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--apice-fg-faint)]">
            As inscrições fecham em
          </p>
          <CountdownTimer />
        </div>
      </div>
    </section>
  )
}
