import { MapPin, Navigation } from "lucide-react"
import { Reveal } from "./Reveal"
import { EVENT_VENUE, EVENT_FORMAT } from "../_lib/event"

// Mockup de mapa em CSS puro (grid de pontos + pin), sem embed real do Google
// Maps — evita carregar um iframe externo e API key só para um endereço
// fictício. O botão "Como chegar" aponta para uma busca real no Google Maps
// com o nome do local, então a funcionalidade é genuína mesmo com o
// endereço sendo ilustrativo.
export function LocationMap() {
  const mapsQuery = encodeURIComponent(EVENT_VENUE)

  return (
    <section className="relative px-6 py-20 md:py-24 bg-[var(--nexus-bg-soft)]" aria-labelledby="location-title">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        <Reveal variant="slide-right">
          <div
            className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[var(--nexus-border)]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, var(--nexus-border) 1px, transparent 0)",
              backgroundSize: "18px 18px",
              backgroundColor: "var(--nexus-bg)",
            }}
            aria-hidden="true"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="inline-flex items-center justify-center size-14 rounded-full nexus-glow-cta"
                style={{ backgroundImage: "var(--nexus-gradient-cta)" }}
              >
                <MapPin className="size-7 text-white" />
              </span>
            </div>
            <div
              className="absolute -bottom-10 -right-10 size-40 rounded-full opacity-20 blur-3xl"
              style={{ background: "var(--nexus-purple)" }}
            />
          </div>
        </Reveal>

        <Reveal variant="slide-left">
          <h2 id="location-title" className="text-3xl md:text-4xl font-bold mb-4 text-[var(--nexus-fg)]">
            Onde vai <span className="nexus-gradient-text">acontecer</span>
          </h2>
          <p className="text-[var(--nexus-fg-muted)] text-lg mb-6">
            {EVENT_FORMAT}. Quem optar pela transmissão online recebe o link de acesso por e-mail antes do
            evento.
          </p>

          <div className="nexus-glass rounded-2xl p-5 flex items-start gap-3 mb-6">
            <MapPin className="size-5 text-[var(--nexus-purple)] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold text-[var(--nexus-fg)]">{EVENT_VENUE}</p>
              <p className="text-sm text-[var(--nexus-fg-muted)]">Estacionamento e acesso facilitado para PCD.</p>
            </div>
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.03]"
            style={{ backgroundImage: "var(--nexus-gradient-primary)" }}
          >
            <Navigation className="size-4" aria-hidden="true" />
            Como chegar
          </a>
        </Reveal>
      </div>
    </section>
  )
}
