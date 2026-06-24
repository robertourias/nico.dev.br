import { CalendarDays, Users, ArrowRight, UtensilsCrossed, GraduationCap } from "lucide-react"
import { EVENTS, TASTING_MENUS, WORKSHOPS } from "../_lib/data"
import { Reveal } from "./Reveal"

const PRICE_FORMATTER = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

// Reúne "Eventos Gastronômicos" (visual de ingresso premium) e a página de
// Experiências (menus degustação, workshops e jantares exclusivos).
export function EventsExperiences() {
  return (
    <section id="experiencias" className="px-6 py-24 scroll-mt-20 bg-[var(--color-surface)]" aria-labelledby="experiencias-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--color-primary)" }}>
            Eventos Gastronômicos
          </p>
          <h2 id="experiencias-title" className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Experiências Exclusivas
          </h2>
          <p className="text-muted-foreground">
            Edições limitadas, menus degustação e workshops para quem quer viver a gastronomia além da mesa.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-6 mb-20">
          {EVENTS.map((event, index) => (
            <Reveal key={event.id} delayMs={index * 100}>
              <div className="rest-ticket rest-card-hover rounded-2xl p-7 flex gap-5">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-1.5 rest-font-serif">{event.title}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-3">
                    <CalendarDays className="size-3.5" aria-hidden="true" />
                    {event.date}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{event.description}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Users className="size-3.5" aria-hidden="true" />
                    {event.seatsLeft} lugares disponíveis
                  </p>
                </div>
                <div className="rest-ticket-stub flex flex-col items-center justify-center pl-5 gap-2 shrink-0 w-24 text-center">
                  <p className="text-xs text-muted-foreground">a partir de</p>
                  <p className="text-lg font-semibold rest-font-serif" style={{ color: "var(--color-primary)" }}>
                    {PRICE_FORMATTER.format(event.price)}
                  </p>
                  <a
                    href="#reservas"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:text-[var(--color-primary)] transition-colors"
                  >
                    Garantir <ArrowRight className="size-3" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10">
          <Reveal variant="slide-right">
            <h3 className="text-xl font-semibold text-foreground mb-5 rest-font-serif flex items-center gap-2">
              <UtensilsCrossed className="size-5" style={{ color: "var(--color-primary)" }} aria-hidden="true" />
              Menus Degustação
            </h3>
            <div className="flex flex-col gap-4">
              {TASTING_MENUS.map((menu) => (
                <div key={menu.name} className="rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6 rest-card-hover">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <p className="font-semibold text-foreground rest-font-serif">{menu.name}</p>
                      <p className="text-xs text-muted-foreground">{menu.courses} tempos</p>
                    </div>
                    <p className="text-base font-semibold whitespace-nowrap" style={{ color: "var(--color-primary)" }}>
                      {PRICE_FORMATTER.format(menu.price)}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{menu.description}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal variant="slide-left">
            <h3 className="text-xl font-semibold text-foreground mb-5 rest-font-serif flex items-center gap-2">
              <GraduationCap className="size-5" style={{ color: "var(--color-primary)" }} aria-hidden="true" />
              Workshops Culinários
            </h3>
            <div className="flex flex-col gap-4">
              {WORKSHOPS.map((workshop) => (
                <div key={workshop.name} className="rounded-2xl rest-glass p-6">
                  <p className="font-semibold text-foreground mb-1">{workshop.name}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">{workshop.description}</p>
                  <p className="text-xs text-muted-foreground">{workshop.duration}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
