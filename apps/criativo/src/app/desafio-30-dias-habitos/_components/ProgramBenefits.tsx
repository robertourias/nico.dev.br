import { CheckCircle2 } from "lucide-react"

const BENEFITS = [
  "100% gratuito, sem custos escondidos",
  "Apenas alguns minutos do seu dia",
  "Desafios simples e progressivos",
  "Recebimento automático por e-mail, sem precisar lembrar",
  "Método focado em consistência, não em perfeição",
  "Comunidade de participantes opcional para compartilhar progresso",
] as const

export function ProgramBenefits() {
  return (
    <section className="px-6 py-16 md:py-20" aria-labelledby="benefits-title">
      <div className="max-w-2xl mx-auto">
        <h2
          id="benefits-title"
          className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10"
        >
          Benefícios do programa
        </h2>

        <ul className="flex flex-col gap-4">
          {BENEFITS.map((text) => (
            <li key={text} className="flex items-start gap-3 text-foreground">
              <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
