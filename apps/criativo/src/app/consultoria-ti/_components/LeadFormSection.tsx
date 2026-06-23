import { Clock, ShieldCheck, FileSearch } from "lucide-react"
import { Reveal } from "./Reveal"
import { LeadForm } from "./LeadForm"

const points = [
  { icon: Clock, text: "Resposta em até 1 dia útil" },
  { icon: FileSearch, text: "Diagnóstico técnico personalizado" },
  { icon: ShieldCheck, text: "Sem compromisso, sem custo" },
]

export function LeadFormSection() {
  return (
    <section id="diagnostico" className="px-6 py-20 md:py-28 scroll-mt-20 bg-[var(--color-surface)]" aria-labelledby="lead-title">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-12 items-start">
        <Reveal variant="slide-right">
          <h2 id="lead-title" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Solicite seu <span className="consult-gradient-text">diagnóstico gratuito</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Preencha o formulário e um especialista entrará em contato para entender seu cenário e propor o melhor
            caminho de evolução tecnológica.
          </p>
          <ul className="flex flex-col gap-4">
            {points.map((point) => (
              <li key={point.text} className="flex items-center gap-3 text-sm text-foreground">
                <span
                  className="inline-flex items-center justify-center size-9 rounded-xl text-white shrink-0"
                  style={{ backgroundImage: "var(--consult-gradient-primary)" }}
                  aria-hidden="true"
                >
                  <point.icon className="size-4" />
                </span>
                {point.text}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal variant="slide-left">
          <div className="consult-glass rounded-3xl p-6 md:p-8">
            <LeadForm />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
