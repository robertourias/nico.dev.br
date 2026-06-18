const FAQS = [
  {
    q: "A newsletter é gratuita?",
    a: "Sim. O acesso à edição semanal é 100% gratuito.",
  },
  {
    q: "Com que frequência vou receber?",
    a: "Uma edição por semana, sempre no mesmo dia. Sem spam, sem e-mails extras.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim, o cancelamento é imediato e o link está disponível em todo e-mail enviado.",
  },
  {
    q: "Vou receber promoções ou apenas conteúdo?",
    a: "O foco é 100% conteúdo. Qualquer recomendação paga futura será sempre identificada com transparência.",
  },
] as const

export function FaqSection() {
  return (
    <section
      className="px-6 py-16 md:py-20 bg-surface border-y border-border"
      aria-labelledby="faq-title"
    >
      <div className="max-w-2xl mx-auto">
        <h2
          id="faq-title"
          className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10"
        >
          Perguntas frequentes
        </h2>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-lg border border-border bg-background px-5 py-4"
            >
              <summary className="cursor-pointer list-none font-medium text-foreground flex items-center justify-between gap-4">
                {faq.q}
                <span
                  aria-hidden="true"
                  className="text-muted-foreground transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
