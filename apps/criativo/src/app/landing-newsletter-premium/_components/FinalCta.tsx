import { NewsletterForm } from "./NewsletterForm"

export function FinalCta() {
  return (
    <section className="px-6 py-20 md:py-28" aria-labelledby="final-cta-title">
      <div className="max-w-2xl mx-auto text-center">
        <h2
          id="final-cta-title"
          className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4"
        >
          Comece a receber a próxima edição
        </h2>

        <p className="text-muted-foreground mb-10">
          Gratuito, direto ao ponto, sem spam. Cancele quando quiser.
        </p>

        <div className="flex justify-center">
          <NewsletterForm />
        </div>
      </div>
    </section>
  )
}
