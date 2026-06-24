import { Clock, ShieldCheck, FileSearch } from "lucide-react"
import { Reveal } from "./Reveal"
import { ProposalForm } from "./ProposalForm"

const points = [
  { icon: Clock, text: "Resposta em até 1 dia útil" },
  { icon: FileSearch, text: "Proposta personalizada para o seu negócio" },
  { icon: ShieldCheck, text: "Sem compromisso, sem custo" },
]

export function ProposalFormSection() {
  return (
    <section id="proposta" className="px-6 py-20 md:py-28 scroll-mt-20" aria-labelledby="proposal-title">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-12 items-start">
        <Reveal variant="slide-right">
          <h2 id="proposal-title" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Solicite sua <span className="agencia-gradient-text">proposta personalizada</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Preencha o formulário e um especialista entrará em contato para entender seu cenário e propor a melhor
            estratégia de crescimento.
          </p>
          <ul className="flex flex-col gap-4">
            {points.map((point) => (
              <li key={point.text} className="flex items-center gap-3 text-sm text-foreground">
                <span
                  className="inline-flex items-center justify-center size-9 rounded-xl text-white shrink-0"
                  style={{ backgroundImage: "var(--agencia-gradient-primary)" }}
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
          <div className="agencia-glass rounded-3xl p-6 md:p-8">
            <ProposalForm />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
