import { Code2, Cloud, Network, RefreshCw, Users, Bot, Check } from "lucide-react"
import { Reveal } from "./Reveal"
import { SERVICES, type Service } from "../_lib/data"

const ICONS: Record<Service["icon"], typeof Code2> = {
  code: Code2,
  cloud: Cloud,
  network: Network,
  refresh: RefreshCw,
  users: Users,
  bot: Bot,
}

export function ServicesSection() {
  return (
    <section id="servicos" className="px-6 py-20 md:py-28 scroll-mt-20" aria-labelledby="services-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14 max-w-2xl mx-auto">
          <h2 id="services-title" className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            Soluções completas em <span className="consult-gradient-text">tecnologia</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Do diagnóstico à operação contínua, cobrimos cada etapa da sua jornada de transformação digital.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service, index) => {
            const Icon = ICONS[service.icon]
            return (
              <Reveal key={service.title} delayMs={index * 60}>
                <div className="consult-card-hover h-full rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6">
                  <span
                    className="inline-flex items-center justify-center size-11 rounded-xl mb-4 text-white"
                    style={{ backgroundImage: "var(--consult-gradient-primary)" }}
                    aria-hidden="true"
                  >
                    <Icon className="size-5" />
                  </span>
                  <p className="font-semibold text-foreground mb-1.5">{service.title}</p>
                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                  <ul className="flex flex-col gap-1.5">
                    {service.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="size-3.5 text-secondary shrink-0" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
