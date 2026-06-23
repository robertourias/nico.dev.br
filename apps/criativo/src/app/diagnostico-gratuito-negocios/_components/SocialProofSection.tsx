import { Reveal } from "./Reveal"

const clients = [
  {
    name: "Cliente A",
    segment: "E-commerce de moda",
    result: "Aumento de 32% nas vendas em 4 meses",
    initials: "CA",
  },
  {
    name: "Cliente B",
    segment: "Consultoria financeira",
    result: "Fluxo de caixa estabilizado em 60 dias",
    initials: "CB",
  },
  {
    name: "Cliente C",
    segment: "Clínica de estética",
    result: "Geração de leads previsível com CRM",
    initials: "CC",
  },
]

export function SocialProofSection() {
  return (
    <section className="px-6 py-20 bg-[var(--color-surface)]" aria-labelledby="social-proof-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-12">
          <h2 id="social-proof-title" className="text-3xl md:text-4xl font-bold text-foreground">
            Empresas que já melhoraram seus <span className="diag-gradient-text">resultados</span>
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-6">
          {clients.map((client, index) => (
            <Reveal key={client.name} delayMs={index * 80}>
              <div className="diag-card-hover h-full rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6 text-center">
                <span
                  className="inline-flex items-center justify-center size-14 rounded-full text-white font-bold mb-4 mx-auto"
                  style={{ backgroundImage: "var(--diag-gradient-primary)" }}
                  aria-hidden="true"
                >
                  {client.initials}
                </span>
                <p className="font-semibold text-foreground mb-1">{client.name}</p>
                <p className="text-xs text-muted-foreground mb-3">{client.segment}</p>
                <p className="text-sm text-foreground">{client.result}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
