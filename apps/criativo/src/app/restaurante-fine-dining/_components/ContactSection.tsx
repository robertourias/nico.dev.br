import { MapPin, Clock, Phone, MessageCircle } from "lucide-react"
import { Reveal } from "./Reveal"

const ADDRESS = "Rua dos Pinheiros, 842 — Pinheiros, São Paulo - SP"
const MAPS_QUERY = encodeURIComponent(ADDRESS)
const MAPS_EMBED_URL = `https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`

const CONTACT_INFO = [
  { icon: MapPin, label: "Endereço", value: ADDRESS },
  { icon: Clock, label: "Horário", value: "Terça a sábado, 19h às 00h" },
  { icon: Phone, label: "Telefone", value: "(11) 3068-4471" },
  { icon: MessageCircle, label: "WhatsApp", value: "(11) 99876-5432" },
] as const

// Página de Contato — informações essenciais e mapa interativo estilizado
// (iframe do Google Maps, sem necessidade de chave de API, com filtro
// sépia/dourado para manter a identidade visual da marca).
export function ContactSection() {
  return (
    <section id="contato" className="px-6 py-24 scroll-mt-20 bg-[var(--color-surface)]" aria-labelledby="contato-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--color-primary)" }}>
            Contato
          </p>
          <h2 id="contato-title" className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Venha Nos Visitar
          </h2>
          <p className="text-muted-foreground">
            Estamos no coração dos Pinheiros, prontos para receber você em uma noite memorável.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          <Reveal variant="slide-right">
            <div className="rest-glass rounded-3xl p-8 md:p-10 h-full flex flex-col gap-7">
              {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <span
                    className="inline-flex items-center justify-center size-11 rounded-full shrink-0"
                    style={{ backgroundImage: "var(--rest-gradient-gold)" }}
                  >
                    <Icon className="size-5 text-[var(--color-primary-foreground)]" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{label}</p>
                    <p className="text-sm font-medium text-foreground leading-relaxed">{value}</p>
                  </div>
                </div>
              ))}

              <a
                href="#reservas"
                className="rest-cta-highlight mt-auto inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-[var(--color-primary-foreground)] self-start"
                style={{ backgroundImage: "var(--rest-gradient-gold)" }}
              >
                Reservar Minha Mesa
              </a>
            </div>
          </Reveal>

          <Reveal variant="slide-left">
            <div className="relative h-full min-h-[360px] rounded-3xl overflow-hidden border border-border">
              <iframe
                title="Localização do restaurante ÂMBAR"
                src={MAPS_EMBED_URL}
                className="rest-map-frame absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(160deg, rgba(13,13,13,0.25) 0%, transparent 40%, rgba(13,13,13,0.35) 100%)" }}
                aria-hidden="true"
              />
              <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-surface-raised)] border border-border px-4 py-2 text-xs font-medium text-foreground shadow-lg">
                <MapPin className="size-3.5" style={{ color: "var(--color-primary)" }} aria-hidden="true" />
                ÂMBAR Cozinha de Autor
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
