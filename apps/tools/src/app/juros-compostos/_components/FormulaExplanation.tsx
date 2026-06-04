export function FormulaExplanation() {
  return (
    <div className="rounded-lg border border-border bg-muted/30 px-5 py-4 space-y-3 text-sm">
      <h3 className="font-semibold text-foreground">Como o cálculo funciona</h3>

      <p className="text-muted-foreground">
        Juros compostos fazem o dinheiro crescer sobre o montante acumulado — ou seja, você ganha juros sobre os juros anteriores.
      </p>

      <div className="space-y-2">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Modo valor fixo</p>
          <code className="block bg-background border border-border rounded px-3 py-2 font-mono text-xs text-foreground">
            M = PV × (1 + i)^n
          </code>
          <p className="text-xs text-muted-foreground mt-1">
            PV = capital inicial · i = taxa mensal · n = número de meses
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Modo com aportes mensais</p>
          <code className="block bg-background border border-border rounded px-3 py-2 font-mono text-xs text-foreground">
            M = PV × (1 + i)^n + PMT × ((1 + i)^n − 1) / i
          </code>
          <p className="text-xs text-muted-foreground mt-1">
            PMT = aporte mensal · os demais são os mesmos de cima
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Taxa anual é convertida para mensal equivalente via{" "}
        <code className="bg-background border border-border rounded px-1 py-0.5 font-mono">
          i = (1 + r)^(1/12) − 1
        </code>
        , não por divisão simples.
      </p>
    </div>
  )
}
