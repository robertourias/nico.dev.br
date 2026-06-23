import { TrendingUp } from "lucide-react"
import { Reveal } from "./Reveal"
import { CASES } from "../_lib/data"

export function CasesSection() {
  return (
    <section id="cases" className="px-6 py-20 md:py-28 scroll-mt-20" aria-labelledby="cases-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14 max-w-2xl mx-auto">
          <h2 id="cases-title" className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Cases de <span className="consult-gradient-text">sucesso</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Projetos reais, com problemas concretos e resultados mensuráveis.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-6">
          {CASES.map((item, index) => (
            <Reveal key={item.name} delayMs={index * 70}>
              <div className="consult-card-hover h-full rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6 md:p-7 flex flex-col">
                <span className="inline-flex items-center self-start rounded-full bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 mb-4">
                  {item.segment}
                </span>

                <p className="text-lg font-bold text-foreground mb-4">{item.name}</p>

                <div className="flex flex-col gap-3 mb-5 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Problema</p>
                    <p className="text-foreground/90">{item.problem}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Solução</p>
                    <p className="text-foreground/90">{item.solution}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {item.results.map((result) => (
                    <div key={result} className="rounded-xl bg-[var(--color-surface-overlay)] border border-border p-3">
                      <TrendingUp className="size-3.5 text-secondary mb-1.5" aria-hidden="true" />
                      <p className="text-xs font-semibold text-foreground leading-snug">{result}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border">
                  {item.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-medium text-muted-foreground rounded-md bg-[var(--color-surface-overlay)] px-2.5 py-1"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
