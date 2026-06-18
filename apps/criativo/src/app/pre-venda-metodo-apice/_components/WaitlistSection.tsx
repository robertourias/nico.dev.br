import { Reveal } from "./Reveal"
import { WaitlistForm } from "./WaitlistForm"

export function WaitlistSection() {
  return (
    <section
      id="lista-de-espera"
      className="relative px-6 py-20 md:py-28 bg-[var(--apice-bg-raised)] scroll-mt-20"
      aria-labelledby="waitlist-title"
    >
      <div className="max-w-xl mx-auto text-center">
        <Reveal variant="scale-in">
          <h2 id="waitlist-title" className="text-3xl md:text-4xl font-bold mb-4">
            Entre para a <span className="apice-gradient-text">lista de espera</span>
          </h2>
          <p className="text-[var(--apice-fg-muted)] text-lg mb-9">
            Deixe seu nome e e-mail para garantir a condição de pré-venda e ser avisado em primeira mão
            sobre o lançamento do Método Ápice.
          </p>

          <div className="flex justify-center">
            <WaitlistForm submitLabel="Quero Entrar na Lista de Espera" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
