import { CalendarCheck } from "lucide-react"
import { ChallengeForm } from "./ChallengeForm"

// Pré-visualização estática dos 30 dias — reforça visualmente a promessa
// "transforme sua rotina em 30 dias" sem depender de dados reais de progresso
// (não há usuário autenticado nesta landing).
function ProgressPreview() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1)

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-sm font-medium text-foreground">
        <CalendarCheck className="size-4 text-primary" aria-hidden="true" />
        Seus 30 dias de transformação
      </div>
      <div className="grid grid-cols-10 gap-1.5">
        {days.map((day) => (
          <div
            key={day}
            aria-hidden="true"
            className={
              day <= 3
                ? "aspect-square rounded-sm bg-primary"
                : "aspect-square rounded-sm bg-muted"
            }
          />
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Um novo desafio a cada dia, direto no seu e-mail.
      </p>
    </div>
  )
}

export function Hero() {
  return (
    <section className="px-6 pt-10 pb-20 md:pt-16 md:pb-28" aria-labelledby="hero-title">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="cv-fade-up text-center lg:text-left">
          <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-4">
            Desafio gratuito de 30 dias
          </p>

          <h1
            id="hero-title"
            className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6"
          >
            Transforme sua rotina em apenas 30 dias.
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-10">
            Receba gratuitamente um desafio diário por e-mail e desenvolva hábitos que aumentam
            sua produtividade, disciplina, saúde e bem-estar.
          </p>

          <div className="flex justify-center lg:justify-start">
            <ChallengeForm submitLabel="Começar Meu Desafio" />
          </div>
        </div>

        <div className="cv-fade-up-delay-1">
          <ProgressPreview />
        </div>
      </div>
    </section>
  )
}
