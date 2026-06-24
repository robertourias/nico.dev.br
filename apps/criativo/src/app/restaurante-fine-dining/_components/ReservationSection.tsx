import { SmartReservation } from "./SmartReservation"
import { Reveal } from "./Reveal"

// "Reserva Inteligente" — substitui o formulário simples por uma experiência
// dividida em etapas (pessoas, data, horário, ocasião, preferências, dados de
// contato) com resumo visual antes da confirmação.
export function ReservationSection() {
  return (
    <section id="reservas" className="px-6 py-24 scroll-mt-20" aria-labelledby="reservas-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--color-primary)" }}>
            Reserva Inteligente
          </p>
          <h2 id="reservas-title" className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Reserve Sua Mesa
          </h2>
          <p className="text-muted-foreground">
            Em poucos passos, monte a experiência ideal para a sua noite — e receba um resumo antes de confirmar.
          </p>
        </Reveal>

        <SmartReservation />
      </div>
    </section>
  )
}
