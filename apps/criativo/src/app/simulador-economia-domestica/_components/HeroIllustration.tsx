import { PiggyBank, TrendingUp, Sparkles } from "lucide-react"

const previewBars = [
  { label: "Delivery", current: 58, optimized: 32 },
  { label: "Café", current: 40, optimized: 22 },
  { label: "Transporte", current: 70, optimized: 38 },
  { label: "Energia", current: 50, optimized: 36 },
]

// Mockup estático exibido ao lado do conteúdo do Hero — não é um resultado
// real, apenas transmite de forma visual e imediata o tipo de entrega do
// produto: comparação de gastos e economia mensal projetada.
export function HeroIllustration() {
  return (
    <div className="economia-fade-up-delay-2 relative economia-glass economia-glow rounded-3xl p-6 md:p-7 max-w-md w-full mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs text-muted-foreground">Sua economia projetada</p>
          <p className="font-semibold text-foreground">Cenário Moderado</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold px-3 py-1">
          <PiggyBank className="size-3.5" aria-hidden="true" />
          Mensal
        </span>
      </div>

      <div className="flex items-end gap-2 mb-1">
        <span className="text-4xl font-bold economia-gradient-text">R$ 280</span>
        <span className="text-sm text-muted-foreground pb-1">/mês</span>
      </div>
      <p className="text-xs text-muted-foreground mb-6">Equivale a R$ 3.360 por ano</p>

      <div className="flex items-end gap-3 h-28 mb-4" aria-hidden="true">
        {previewBars.map((bar) => (
          <div key={bar.label} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="relative w-full h-full flex items-end justify-center gap-1">
              <div
                className="w-1/2 rounded-t-md"
                style={{ height: `${bar.current}%`, background: "var(--color-border)" }}
              />
              <div
                className="w-1/2 rounded-t-md"
                style={{ height: `${bar.optimized}%`, backgroundImage: "var(--economia-gradient-primary)" }}
              />
            </div>
            <span className="text-[0.6rem] text-muted-foreground leading-tight text-center">{bar.label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-accent text-accent-foreground px-3.5 py-2.5 text-xs font-medium">
        <TrendingUp className="size-3.5 shrink-0" aria-hidden="true" />
        Investindo essa economia a 8% a.a., você chega a R$ 19.500 em 5 anos
      </div>

      <div
        className="absolute -top-3 -right-3 size-10 rounded-2xl flex items-center justify-center economia-glow"
        style={{ backgroundImage: "var(--economia-gradient-amber)" }}
        aria-hidden="true"
      >
        <Sparkles className="size-5 text-white" />
      </div>
    </div>
  )
}
