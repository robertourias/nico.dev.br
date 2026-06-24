import { ProfileSimulator } from "./ProfileSimulator"
import { Reveal } from "./Reveal"

export function SimulatorSection() {
  return (
    <section id="simulador" className="px-6 py-20 md:py-28 bg-[var(--color-surface-overlay)]">
      <div className="max-w-3xl mx-auto">
        <Reveal className="text-center max-w-xl mx-auto mb-12">
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--imob-moss)" }}>
            Simulador de perfil imobiliário
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Qual imóvel é ideal para você?</h2>
          <p className="text-muted-foreground">
            Responda 4 perguntas rápidas e descubra quantos imóveis combinam com o seu momento.
          </p>
        </Reveal>

        <ProfileSimulator />
      </div>
    </section>
  )
}
