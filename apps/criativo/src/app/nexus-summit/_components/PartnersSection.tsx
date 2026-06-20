import { Reveal } from "./Reveal"

// Sem logos reais — wordmarks fictícios estilizados, mesma decisão de não
// usar marcas/imagens de terceiros adotada nas demais landings do app. O
// efeito grayscale → color é puramente CSS (`.nexus-logo-card`).
const partners = [
  { name: "Lumen Tech", category: "Tecnologia" },
  { name: "Orbita Labs", category: "Startup" },
  { name: "Crescer.io", category: "Startup" },
  { name: "Grupo Vértice", category: "Parceiro institucional" },
  { name: "Nimbus Cloud", category: "Tecnologia" },
  { name: "Studio Prisma", category: "Startup" },
  { name: "Faro Tech", category: "Tecnologia" },
  { name: "Plano B Consultoria", category: "Parceiro institucional" },
  { name: "Vetor Digital", category: "Tecnologia" },
  { name: "Horizonte Capital", category: "Parceiro institucional" },
]

export function PartnersSection() {
  return (
    <section className="relative px-6 py-20 md:py-24 bg-[var(--nexus-bg-soft)]" aria-labelledby="partners-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <h2 id="partners-title" className="text-3xl md:text-4xl font-bold mb-4 text-[var(--nexus-fg)]">
            Empresas que <span className="nexus-gradient-text">estarão presentes</span>
          </h2>
          <p className="text-[var(--nexus-fg-muted)] text-lg">
            Startups, empresas de tecnologia e parceiros institucionais já confirmados.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {partners.map((partner, i) => (
            <Reveal key={partner.name} variant="fade-up" delayMs={(i % 5) * 60}>
              <div
                className="nexus-logo-card flex flex-col items-center justify-center gap-1 rounded-2xl border border-[var(--nexus-border)] bg-white px-4 py-6 text-center h-full"
                title={partner.category}
              >
                <span className="font-bold text-[var(--nexus-fg)] text-sm">{partner.name}</span>
                <span className="text-[0.65rem] uppercase tracking-wide text-[var(--nexus-fg-faint)]">
                  {partner.category}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
