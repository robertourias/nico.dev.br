import { NewsletterForm } from "./NewsletterForm"

export function Hero() {
  return (
    <section className="px-6 pt-10 pb-20 md:pt-16 md:pb-28" aria-labelledby="hero-title">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-sm font-semibold text-secondary tracking-wide uppercase mb-4">
          IA · Tecnologia · Produtividade
        </p>

        <h1
          id="hero-title"
          className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6"
        >
          As melhores ideias em IA e produtividade,{" "}
          <span className="block">direto na sua caixa de entrada.</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
          Toda semana, uma curadoria direta ao ponto: ferramentas de IA testadas, técnicas de
          produtividade que funcionam e análises sem enrolação.
        </p>

        <div className="flex justify-center">
          <NewsletterForm />
        </div>
      </div>
    </section>
  )
}
