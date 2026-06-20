import { Reveal } from "./Reveal"
import { RegistrationForm } from "./RegistrationForm"

export function RegistrationSection() {
  return (
    <section
      id="inscricao"
      className="relative px-6 py-20 md:py-28 bg-[var(--nexus-bg-soft)] scroll-mt-20"
      aria-labelledby="registration-title"
    >
      <div className="max-w-xl mx-auto text-center">
        <Reveal variant="scale-in">
          <h2 id="registration-title" className="text-3xl md:text-4xl font-bold mb-4 text-[var(--nexus-fg)]">
            Confirme sua <span className="nexus-gradient-text">inscrição</span>
          </h2>
          <p className="text-[var(--nexus-fg-muted)] text-lg mb-9">
            Preencha seus dados para garantir sua vaga no NEXUS Summit.
          </p>

          <div className="flex justify-center">
            <RegistrationForm />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
