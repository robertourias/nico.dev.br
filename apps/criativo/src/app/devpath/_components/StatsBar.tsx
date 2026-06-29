import { Reveal } from "./Reveal"
import { AnimatedCounter } from "./AnimatedCounter"
import { COMPANIES, JOB_BOARD_SOURCES } from "../_lib/data"

// Estatísticas ilustrativas de exemplo (copy fixa, não representam
// telemetria real) + faixa de "empresas contratando" com marquee infinito em
// CSS puro, reforçando a ideia de agregação de múltiplas fontes de vagas.
const STATS = [
  { value: 18400, suffix: "", label: "vagas agregadas" },
  { value: 320, prefix: "+", suffix: "", label: "empresas parceiras" },
  { value: 92000, prefix: "+", suffix: "", label: "profissionais cadastrados" },
  { value: 14, suffix: "", label: "plataformas de vagas integradas" },
]

export function StatsBar() {
  const marqueeItems = [...COMPANIES, ...COMPANIES]

  return (
    <section className="relative px-6 py-14 md:py-16" aria-label="Estatísticas do portal">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="devpath-glass rounded-3xl grid grid-cols-2 md:grid-cols-4 gap-8 px-8 py-10 mb-12">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold devpath-gradient-text mb-1">
                  <AnimatedCounter value={s.value} prefix={s.prefix ?? ""} suffix={s.suffix} />
                </p>
                <p className="text-sm text-[var(--devpath-fg-muted)]">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delayMs={80}>
          <p className="text-center text-xs uppercase tracking-[0.2em] text-[var(--devpath-fg-faint)] mb-5">
            Empresas contratando agora pelo DevPath
          </p>
          <div className="relative overflow-hidden devpath-scroll">
            <div className="devpath-marquee-track gap-10 py-2">
              {marqueeItems.map((company, i) => (
                <span
                  key={`${company.id}-${i}`}
                  className="devpath-logo-chip flex items-center gap-2 shrink-0 px-2"
                >
                  <span
                    className="inline-flex items-center justify-center size-7 rounded-md text-xs font-bold text-[#04140e]"
                    style={{ background: company.color }}
                    aria-hidden="true"
                  >
                    {company.initials}
                  </span>
                  <span className="text-sm font-medium text-[var(--devpath-fg-muted)] whitespace-nowrap">
                    {company.name}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <p className="text-center text-xs text-[var(--devpath-fg-faint)] mt-6 max-w-2xl mx-auto">
          Agregação ilustrativa de fontes como {JOB_BOARD_SOURCES.slice(0, 6).join(", ")} e outras{" "}
          {JOB_BOARD_SOURCES.length - 6}+ plataformas, sempre respeitando os termos de uso de cada uma.
        </p>
      </div>
    </section>
  )
}
