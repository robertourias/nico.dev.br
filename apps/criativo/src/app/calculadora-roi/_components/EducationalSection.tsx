import { Reveal } from "./Reveal"

// Explicação didática do conceito de ROI com um exemplo numérico fixo
// (conforme briefing) — ilustrativo, não derivado dos inputs do usuário, ao
// contrário dos resultados da calculadora.
export function EducationalSection() {
  return (
    <section className="relative px-6 py-16 md:py-20" aria-labelledby="educational-title">
      <div className="max-w-4xl mx-auto">
        <Reveal className="text-center mb-10">
          <h2 id="educational-title" className="text-3xl md:text-4xl font-bold mb-3">
            Como o <span className="roi-gradient-text">ROI</span> é Calculado?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            ROI significa Retorno Sobre Investimento e indica quanto dinheiro retorna para cada real
            investido.
          </p>
        </Reveal>

        <Reveal variant="scale-in">
          <div className="rounded-3xl border border-border bg-[var(--color-surface-raised)] p-6 md:p-10 grid sm:grid-cols-3 gap-6 items-center">
            <div className="text-center">
              <p className="text-xs font-medium text-muted-foreground mb-2">Investimento</p>
              <p className="text-2xl font-bold text-foreground">R$ 5.000</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-muted-foreground mb-2">Lucro Obtido</p>
              <p className="text-2xl font-bold text-foreground">R$ 15.000</p>
            </div>
            <div className="text-center sm:border-l sm:border-border sm:pl-6">
              <p className="text-xs font-medium text-muted-foreground mb-2">ROI</p>
              <p className="text-3xl font-bold roi-gradient-text">300%</p>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-5 font-mono">
            ROI = (15.000 ÷ 5.000) × 100 = <span className="font-semibold" style={{ color: "var(--color-secondary)" }}>300%</span>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
