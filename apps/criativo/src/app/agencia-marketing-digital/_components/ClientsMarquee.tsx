import { Reveal } from "./Reveal"
import { CLIENT_LOGOS } from "../_lib/data"

// Sem logos reais — wordmarks fictícios estilizados, mesma decisão adotada
// nas demais landings do app para não usar marcas/imagens de terceiros. O
// loop infinito é puramente CSS (`.agencia-marquee-track`), duplicando a
// lista uma vez para criar a transição contínua sem salto perceptível.
export function ClientsMarquee() {
  const loopedLogos = [...CLIENT_LOGOS, ...CLIENT_LOGOS]

  return (
    <section className="relative px-6 py-14 md:py-16 border-y border-border bg-[var(--color-surface)] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Empresas e marcas que confiam na Lumen Digital
          </p>
        </Reveal>

        <div
          className="agencia-marquee-viewport relative overflow-hidden"
          style={{
            WebkitMaskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
            maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="agencia-marquee-track">
            {loopedLogos.map((logo, index) => (
              <div
                key={`${logo}-${index}`}
                className="flex items-center justify-center shrink-0 px-8"
                aria-hidden={index >= CLIENT_LOGOS.length}
              >
                <span className="text-lg font-bold text-muted-foreground/70 hover:text-foreground transition-colors whitespace-nowrap">
                  {logo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
