import type { ComparisonRow } from "../_lib/calculations"

interface ComparisonTableProps {
  rows: ComparisonRow[]
}

// Tabela comparativa simples (sem serviço x com serviço), conforme briefing.
// Usa <table> semântica para acessibilidade, com a coluna "Com Serviço" em
// destaque (verde), reforçando visualmente o ganho.
export function ComparisonTable({ rows }: ComparisonTableProps) {
  return (
    <div className="rounded-2xl border border-border bg-[var(--color-surface-raised)] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[var(--color-surface)] text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <th scope="col" className="text-left px-5 py-3">
              Indicador
            </th>
            <th scope="col" className="text-right px-5 py-3">
              Sem Serviço
            </th>
            <th scope="col" className="text-right px-5 py-3">
              Com Serviço
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.indicador} className={i > 0 ? "border-t border-border" : ""}>
              <th scope="row" className="text-left px-5 py-3.5 font-medium text-foreground">
                {row.indicador}
              </th>
              <td className="text-right px-5 py-3.5 text-muted-foreground tabular-nums">{row.semServico}</td>
              <td className="text-right px-5 py-3.5 font-semibold tabular-nums" style={{ color: "var(--color-secondary)" }}>
                {row.comServico}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
