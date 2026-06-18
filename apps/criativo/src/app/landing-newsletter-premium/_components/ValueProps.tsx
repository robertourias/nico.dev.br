import { Card, CardHeader, CardTitle, CardDescription } from "@nico.dev/ui"

const ITEMS = [
  {
    title: "Curadoria de IA",
    description:
      "As ferramentas e modelos mais relevantes da semana, testados e explicados em linguagem direta.",
  },
  {
    title: "Produtividade aplicada",
    description:
      "Técnicas e fluxos de trabalho reais — sem teoria genérica, só o que funciona no dia a dia.",
  },
  {
    title: "Tendências em tecnologia",
    description: "Contexto sobre o que está mudando no setor, sem o ruído das redes sociais.",
  },
  {
    title: "Edição semanal, sem enrolação",
    description: "Direto ao ponto: leitura de poucos minutos, toda semana, no mesmo dia.",
  },
] as const

export function ValueProps() {
  return (
    <section
      className="px-6 py-16 md:py-20 bg-surface border-y border-border"
      aria-labelledby="value-props-title"
    >
      <div className="max-w-5xl mx-auto">
        <h2
          id="value-props-title"
          className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12"
        >
          O que você recebe em cada edição
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ITEMS.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
