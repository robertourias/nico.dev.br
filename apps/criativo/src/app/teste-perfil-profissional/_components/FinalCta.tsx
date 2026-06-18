import { ArrowRight } from "lucide-react"
import { Reveal } from "./Reveal"

export function FinalCta() {
  return (
    <section id="cta-final" className="relative px-6 py-20 md:py-28 overflow-hidden" aria-labelledby="final-cta-title">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="perfil-blob perfil-float-slow w-[28rem] h-[28rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ background: "radial-gradient(circle, var(--color-primary-light), transparent 70%)", opacity: 0.35 }}
        />
      </div>

      <Reveal variant="scale-in" className="relative max-w-3xl mx-auto text-center">
        <div className="perfil-glass perfil-glow rounded-3xl p-10 md:p-14">
          <h2 id="final-cta-title" className="text-3xl md:text-4xl font-bold mb-4">
            Seu próximo passo profissional começa pelo <span className="perfil-gradient-text">autoconhecimento</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-9 max-w-xl mx-auto">
            Descubra seus talentos, fortaleça suas habilidades e construa uma carreira alinhada ao seu potencial.
          </p>
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-semibold text-white text-base perfil-glow transition-transform hover:scale-[1.03] active:scale-[0.98]"
            style={{ backgroundImage: "var(--perfil-gradient-primary)" }}
          >
            Fazer Meu Teste Agora
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </section>
  )
}
