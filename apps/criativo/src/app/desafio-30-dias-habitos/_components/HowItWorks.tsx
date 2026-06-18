import { UserPlus, Mail, Repeat } from "lucide-react"

const STEPS = [
  {
    day: "Dia 1",
    icon: UserPlus,
    title: "Cadastro",
    description: "Você se inscreve com nome e e-mail em poucos segundos, sem custo algum.",
  },
  {
    day: "Dia 2",
    icon: Mail,
    title: "Desafios diários por e-mail",
    description: "Todos os dias, um novo desafio simples chega direto na sua caixa de entrada.",
  },
  {
    day: "Dia 3",
    icon: Repeat,
    title: "Hábitos consistentes",
    description: "Repetindo pequenas ações todos os dias, você constrói hábitos que se mantêm.",
  },
] as const

export function HowItWorks() {
  return (
    <section
      className="px-6 py-16 md:py-20 bg-surface border-y border-border"
      aria-labelledby="how-it-works-title"
    >
      <div className="max-w-5xl mx-auto">
        <h2
          id="how-it-works-title"
          className="text-2xl md:text-3xl font-bold text-foreground text-center mb-12"
        >
          Como funciona
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map(({ day, icon: Icon, title, description }) => (
            <div key={day} className="text-center md:text-left">
              <div className="inline-flex items-center justify-center size-12 rounded-full bg-accent text-accent-foreground mb-4">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                {day}
              </p>
              <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
