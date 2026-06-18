import { Footprints, LayoutGrid, GlassWater, BookOpen, CalendarClock, Smartphone } from "lucide-react"
import { Card, CardHeader, CardTitle } from "@nico.dev/ui"

const EXAMPLES = [
  { icon: Footprints, text: "Caminhe 15 minutos hoje" },
  { icon: LayoutGrid, text: "Organize sua mesa de trabalho" },
  { icon: GlassWater, text: "Beba 2 litros de água" },
  { icon: BookOpen, text: "Leia 10 páginas de um livro" },
  { icon: CalendarClock, text: "Planeje seu dia seguinte" },
  { icon: Smartphone, text: "Fique 1 hora sem redes sociais" },
] as const

export function ChallengeExamples() {
  return (
    <section
      className="px-6 py-16 md:py-20 bg-surface border-y border-border"
      aria-labelledby="examples-title"
    >
      <div className="max-w-5xl mx-auto">
        <h2
          id="examples-title"
          className="text-2xl md:text-3xl font-bold text-foreground text-center mb-3"
        >
          Exemplos de desafios
        </h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
          Cada dia traz um novo desafio simples e prático.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXAMPLES.map(({ icon: Icon, text }) => (
            <Card key={text}>
              <CardHeader className="flex-row items-center gap-3 space-y-0">
                <div className="inline-flex items-center justify-center size-9 shrink-0 rounded-lg bg-accent text-accent-foreground">
                  <Icon className="size-4" aria-hidden="true" />
                </div>
                <CardTitle className="text-base">{text}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
