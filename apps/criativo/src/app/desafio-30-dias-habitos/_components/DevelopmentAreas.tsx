import { Target, Zap, HeartPulse, Eye, LayoutGrid, Brain } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription } from "@nico.dev/ui"

const AREAS = [
  {
    icon: Target,
    title: "Disciplina",
    description: "Pequenas ações diárias treinam sua capacidade de manter compromissos consigo mesmo.",
  },
  {
    icon: Zap,
    title: "Produtividade",
    description: "Hábitos simples liberam energia e foco para o que realmente importa no seu dia.",
  },
  {
    icon: HeartPulse,
    title: "Saúde",
    description: "Desafios leves de movimento, hidratação e descanso cuidam do seu corpo sem exageros.",
  },
  {
    icon: Eye,
    title: "Foco",
    description: "Reduzir distrações diárias treina sua atenção para tarefas que geram resultado.",
  },
  {
    icon: LayoutGrid,
    title: "Organização",
    description: "Pequenas rotinas de ordem no ambiente e no dia trazem mais clareza mental.",
  },
  {
    icon: Brain,
    title: "Autoconhecimento",
    description: "Ao repetir e observar seus hábitos, você entende melhor o que funciona para você.",
  },
] as const

export function DevelopmentAreas() {
  return (
    <section className="px-6 py-16 md:py-20" aria-labelledby="development-areas-title">
      <div className="max-w-5xl mx-auto">
        <h2
          id="development-areas-title"
          className="text-2xl md:text-3xl font-bold text-foreground text-center mb-3"
        >
          O que você vai desenvolver
        </h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
          Em 30 dias de prática consistente, pequenos desafios constroem mudanças reais.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AREAS.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardHeader>
                <div className="inline-flex items-center justify-center size-9 rounded-lg bg-accent text-accent-foreground mb-2">
                  <Icon className="size-4" aria-hidden="true" />
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
