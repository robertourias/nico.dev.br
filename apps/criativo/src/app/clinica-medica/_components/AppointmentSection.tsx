import { Clock, ShieldCheck, MessageCircle } from "lucide-react"
import { Reveal } from "./Reveal"
import { AppointmentForm } from "./AppointmentForm"

const points = [
  { icon: Clock, text: "Resposta em até 1 dia útil" },
  { icon: ShieldCheck, text: "Sem compromisso, sem custo" },
]

export function AppointmentSection() {
  return (
    <section id="agendamento" className="px-6 py-20 md:py-28 scroll-mt-20" aria-labelledby="appointment-title">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-12 items-start">
        <Reveal variant="slide-right">
          <h2 id="appointment-title" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Solicite seu <span className="text-[var(--color-primary)]">agendamento</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Preencha o formulário com a especialidade, o médico e o horário de sua preferência. Nossa equipe
            confirma a disponibilidade e retorna o contato.
          </p>
          <ul className="flex flex-col gap-4 mb-8">
            {points.map((point) => (
              <li key={point.text} className="flex items-center gap-3 text-sm text-foreground">
                <span
                  className="inline-flex items-center justify-center size-9 rounded-xl text-white shrink-0"
                  style={{ backgroundImage: "var(--clin-gradient-primary)" }}
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
            className="clin-cta-highlight inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold border border-border hover:border-[var(--color-primary)] transition-colors text-foreground"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Atendimento via WhatsApp
          </a>
        </Reveal>

        <Reveal variant="slide-left">
          <div className="clin-glass clin-glow rounded-3xl p-6 md:p-8">
            <AppointmentForm />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
