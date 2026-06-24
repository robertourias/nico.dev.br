import { ArrowRight, CalendarClock } from "lucide-react"
import { Reveal } from "./Reveal"

export function CtaSection() {
  return (
    <section className="px-6 py-20 md:py-24">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl text-center p-10 md:p-16 agencia-glow agencia-mesh-bg" style={{ backgroundImage: "var(--agencia-gradient-primary)" }}>
            <div className="absolute inset-0 agencia-grid-bg opacity-25" aria-hidden="true" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 max-w-2xl mx-auto">
                Vamos acelerar o crescimento da sua empresa?
              </h2>
              <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">
                Converse com nossos especialistas e receba uma proposta personalizada para o seu negócio.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#proposta"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-primary transition-transform hover:scale-[1.03] active:scale-[0.98]"
                >
                  Solicitar Proposta
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
                <a
                  href="#proposta"
                  className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold text-white border border-white/40 hover:bg-white/10 transition-colors"
                >
                  <CalendarClock className="size-4" aria-hidden="true" />
                  Agendar Reunião
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
