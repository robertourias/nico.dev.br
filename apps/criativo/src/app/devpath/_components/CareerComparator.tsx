import { CAREER_COMPARISONS } from "../_lib/data"
import { Reveal } from "./Reveal"

function DotScale({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`${value} de ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className="size-2 rounded-full"
          style={{ background: i < value ? "var(--devpath-green)" : "var(--devpath-border-strong)" }}
        />
      ))}
    </div>
  )
}

// Tabela comparativa de carreiras — visão lado a lado de salário médio,
// vagas abertas, dificuldade, concorrência, crescimento e tempo de entrada
// por área, ilustrativa, conforme módulo "Comparador de carreiras" do briefing.
export function CareerComparator() {
  return (
    <section id="comparador" className="relative px-6 py-20 md:py-28" aria-labelledby="comparator-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="max-w-2xl mb-10">
          <p className="devpath-mono text-xs text-[var(--devpath-green)] mb-3">// comparador_de_carreiras</p>
          <h2 id="comparator-title" className="text-3xl md:text-4xl font-bold text-[var(--devpath-fg)] mb-3">
            Qual área de tecnologia combina com você?
          </h2>
          <p className="text-[var(--devpath-fg-muted)]">
            Compare salário médio, vagas abertas, dificuldade de entrada e potencial de crescimento entre as
            principais áreas.
          </p>
        </Reveal>

        <Reveal>
          <div className="devpath-scroll overflow-x-auto rounded-2xl border border-[var(--devpath-border)]">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="bg-[var(--devpath-bg-raised)] text-left text-[var(--devpath-fg-muted)]">
                  <th className="px-5 py-3.5 font-medium">Área</th>
                  <th className="px-5 py-3.5 font-medium">Salário médio</th>
                  <th className="px-5 py-3.5 font-medium">Vagas abertas</th>
                  <th className="px-5 py-3.5 font-medium">Dificuldade</th>
                  <th className="px-5 py-3.5 font-medium">Concorrência</th>
                  <th className="px-5 py-3.5 font-medium">Crescimento</th>
                  <th className="px-5 py-3.5 font-medium">Tempo de entrada</th>
                </tr>
              </thead>
              <tbody>
                {CAREER_COMPARISONS.map((area) => (
                  <tr key={area.key} className="border-t border-[var(--devpath-border)] bg-[var(--devpath-bg-raised)]/40">
                    <td className="px-5 py-4 font-medium text-[var(--devpath-fg)]">
                      <span className="mr-2" aria-hidden="true">{area.icon}</span>
                      {area.title}
                    </td>
                    <td className="px-5 py-4 text-[var(--devpath-fg)]">{area.avgSalaryLabel}</td>
                    <td className="px-5 py-4 text-[var(--devpath-fg-muted)]">{area.openJobsLabel}</td>
                    <td className="px-5 py-4"><DotScale value={area.difficulty} /></td>
                    <td className="px-5 py-4"><DotScale value={area.competition} /></td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[rgba(52,211,153,0.1)] text-[var(--devpath-green)] px-2.5 py-1 text-xs font-medium">
                        {area.growthLabel}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[var(--devpath-fg-muted)]">{area.timeToEntryLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <p className="text-xs text-[var(--devpath-fg-faint)] mt-4">
          Dados ilustrativos de exemplo, com base em médias de mercado agregadas por área.
        </p>
      </div>
    </section>
  )
}
