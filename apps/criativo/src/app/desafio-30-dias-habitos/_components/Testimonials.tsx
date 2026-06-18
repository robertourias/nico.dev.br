// Depoimentos fictícios de placeholder — solicitados explicitamente para esta
// campanha. Atribuição mantida genérica (sem nomes/fotos inventados) para não
// fabricar identidades reais; substituir por depoimentos reais de
// participantes assim que disponíveis.
const TESTIMONIALS = [
  {
    quote: "Em poucos dias já senti diferença na minha disciplina. Os desafios são simples, mas funcionam.",
  },
  {
    quote: "Gostei de não precisar pensar no que fazer — o e-mail chega e eu só sigo o passo do dia.",
  },
  {
    quote: "Comecei sem muita expectativa e terminei com hábitos que continuo até hoje.",
  },
] as const

export function Testimonials() {
  return (
    <section
      className="px-6 py-16 md:py-20 bg-surface border-y border-border"
      aria-labelledby="testimonials-title"
    >
      <div className="max-w-5xl mx-auto">
        <h2
          id="testimonials-title"
          className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12"
        >
          Depoimentos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map(({ quote }, i) => (
            <figure
              key={i}
              className="rounded-2xl border border-border bg-background p-6 flex flex-col gap-4"
            >
              <blockquote className="text-foreground text-sm leading-relaxed">
                “{quote}”
              </blockquote>
              <figcaption className="text-xs font-medium text-muted-foreground">
                — Participante do Desafio
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
