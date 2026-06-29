import { Briefcase, Star } from "lucide-react"
import { COMPANIES } from "../_lib/data"
import { Reveal } from "./Reveal"

// Grid ilustrativo de perfis de empresa — avaliação, stack predominante e
// faixa salarial agregada, conforme módulo "Empresas" do briefing.
export function CompaniesSection() {
  return (
    <section id="empresas" className="relative px-6 py-20 md:py-28 bg-[var(--devpath-bg-soft)]" aria-labelledby="companies-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="max-w-2xl mb-10">
          <p className="devpath-mono text-xs text-[var(--devpath-green)] mb-3">// empresas_parceiras</p>
          <h2 id="companies-title" className="text-3xl md:text-4xl font-bold text-[var(--devpath-fg)] mb-3">
            Conheça quem está contratando
          </h2>
          <p className="text-[var(--devpath-fg-muted)]">
            Perfis com stack predominante, avaliação de profissionais e faixa salarial praticada em cada empresa.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {COMPANIES.map((company, i) => (
            <Reveal key={company.id} delayMs={Math.min(i, 5) * 60}>
              <div className="devpath-card-hover rounded-2xl border border-[var(--devpath-border)] bg-[var(--devpath-bg-raised)] p-6 h-full flex flex-col">
                <div className="flex items-center gap-3.5 mb-4">
                  <span
                    className="inline-flex items-center justify-center size-11 rounded-xl text-sm font-bold text-[#04140e] shrink-0"
                    style={{ background: company.color }}
                    aria-hidden="true"
                  >
                    {company.initials}
                  </span>
                  <div>
                    <h3 className="font-semibold text-[var(--devpath-fg)]">{company.name}</h3>
                    <p className="text-sm text-[var(--devpath-fg-muted)]">{company.segment}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-[var(--devpath-fg-muted)] mb-4">
                  <span className="flex items-center gap-1.5">
                    <Star className="size-4 fill-[var(--devpath-amber)] text-[var(--devpath-amber)]" aria-hidden="true" />
                    {company.rating.toFixed(1)}
                  </span>
                  <span>{company.employeesLabel} funcionários</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {company.stack.map((tech) => (
                    <span
                      key={tech}
                      className="devpath-mono rounded-md border border-[var(--devpath-border)] px-2 py-1 text-[0.7rem] text-[var(--devpath-fg-muted)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-[var(--devpath-border)]">
                  <span className="text-sm font-medium text-[var(--devpath-fg)]">{company.salaryRangeLabel}</span>
                  <a href="#vagas" className="flex items-center gap-1.5 text-sm font-semibold text-[var(--devpath-green)] hover:underline">
                    <Briefcase className="size-3.5" aria-hidden="true" />
                    {company.openJobs} vagas
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
