import { Clock, ShieldCheck, MessageCircle } from "lucide-react"
import { Reveal } from "./Reveal"
import { LeadForm } from "./LeadForm"

const points = [
  { icon: Clock, text: "Resposta em até 1 dia útil" },
  { icon: ShieldCheck, text: "Sem compromisso, sem custo" },
]

export function ScheduleSection() {
  return (
    <section id="agendamento" className="px-6 py-20 md:py-28 scroll-mt-20 bg-[var(--color-surface)]" aria-labelledby="schedule-title">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-12 items-start">
        <Reveal variant="slide-right">
          <h2 id="schedule-title" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Solicite sua <span style={{ color: "var(--adv-gold)" }}>consulta</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Preencha o formulário e um de nossos especialistas entrará em contato para entender seu caso e propor o
            melhor caminho jurídico.
          </p>
          <ul className="flex flex-col gap-4 mb-8">
            {points.map((point) => (
              <li key={point.text} className="flex items-center gap-3 text-sm text-foreground">
                <span
                  className="inline-flex items-center justify-center size-9 rounded-xl text-white shrink-0"
                  style={{ backgroundImage: "var(--adv-gradient-primary)" }}
                  aria-hidden="true"
                >
                  <point.icon className="size-4" />
                </span>
                {point.text}
              </li>
            ))}
          </ul>

          <a
            href="https://wa.me/5511988884455?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20consulta."
            target="_blank"
            rel="noopener noreferrer"
            className="adv-cta-highlight inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold border border-border hover:border-[var(--adv-gold)] transition-colors text-foreground"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Atendimento via WhatsApp
          </a>
        </Reveal>

        <Reveal variant="slide-left">
          <div className="adv-glass adv-glow rounded-3xl p-6 md:p-8">
            <LeadForm />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
