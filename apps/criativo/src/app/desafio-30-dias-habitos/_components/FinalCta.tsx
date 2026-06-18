import { ChallengeForm } from "./ChallengeForm"

// `id="inscricao"` é o destino do CTA fixo mobile (StickyMobileCta) e de
// qualquer outro link de "pular para o cadastro" — fica aqui, não no Hero,
// porque é o ponto de captura mais relevante após o usuário já ter lido a
// proposta completa da página.
export function FinalCta() {
  return (
    <section id="inscricao" className="px-6 py-20 md:py-28" aria-labelledby="final-cta-title">
      <div className="max-w-2xl mx-auto text-center">
        <h2
          id="final-cta-title"
          className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4"
        >
          Você está pronto para transformar sua rotina?
        </h2>

        <p className="text-muted-foreground mb-10">
          Junte-se a centenas de pessoas construindo hábitos melhores todos os dias.
        </p>

        <div className="flex justify-center">
          <ChallengeForm submitLabel="Participar Gratuitamente" />
        </div>
      </div>
    </section>
  )
}
