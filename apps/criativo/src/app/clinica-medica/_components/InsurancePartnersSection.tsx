import { ShieldCheck } from "lucide-react"
import { Reveal } from "./Reveal"
import { INSURANCE_PARTNERS } from "../_lib/data"

export function InsurancePartnersSection() {
  return (
    <section id="convenios" className="px-6 py-20 md:py-24 scroll-mt-20 bg-[var(--color-surface)]" aria-labelledby="insurance-title">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <h2 id="insurance-title" className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Convênios <span className="text-[var(--color-primary)]">Aceitos</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Atendemos os principais planos de saúde, além de consultas particulares.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {INSURANCE_PARTNERS.map((partner, index) => (
            <Reveal key={partner.name} delayMs={index * 60}>
              <div className="clin-insurance-card flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-[var(--color-surface-raised)] px-4 py-7 text-center h-full">
                <ShieldCheck className="size-5 text-[var(--color-primary)]" aria-hidden="true" />
                <span className="font-semibold text-foreground text-sm">{partner.name}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Não encontrou seu convênio?{" "}
          <a href="#agendamento" className="font-medium text-[var(--color-primary)] hover:underline">
            Fale com a nossa equipe
          </a>
          .
        </p>
      </div>
    </section>
  )
}
