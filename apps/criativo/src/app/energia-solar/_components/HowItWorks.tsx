"use client"

import { useEffect, useRef, useState } from "react"
import { Search, FileSpreadsheet, Wrench, Gauge, type LucideIcon } from "lucide-react"
import { PROCESS_STEPS } from "../_lib/data"
import { Reveal } from "./Reveal"

const STEP_ICONS: Record<string, LucideIcon> = {
  descoberta: Search,
  projeto: FileSpreadsheet,
  instalacao: Wrench,
  monitoramento: Gauge,
}

// Timeline horizontal (em vez dos tradicionais "3 passos em cards"),
// conforme briefing. A linha de conexão é "construída" via CSS
// (`solar-timeline-fill`, width 0% → 100%) ao entrar em viewport, e cada
// marcador/ícone tem sua própria pequena animação de entrada (scale + fade).
export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="como-funciona" className="px-6 py-16 md:py-24 scroll-mt-20" aria-labelledby="how-it-works-title">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-14">
          <p className="text-sm font-semibold mb-2" style={{ color: "var(--solar-blue-light)" }}>
            Como funciona
          </p>
          <h2 id="how-it-works-title" className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Do diagnóstico à <span className="solar-gradient-text">energia limpa em casa</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Um processo simples, acompanhado de ponta a ponta pela nossa equipe.
          </p>
        </Reveal>

        <div ref={ref} className="relative">
          <div className="hidden md:block absolute top-7 left-7 right-7 solar-timeline-track">
            <div className="solar-timeline-fill" data-visible={visible} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {PROCESS_STEPS.map((step, index) => {
              const Icon = STEP_ICONS[step.key] ?? Search
              return (
                <div key={step.key} className="flex flex-col items-center text-center gap-3">
                  <span
                    className="solar-timeline-dot relative z-10 inline-flex items-center justify-center size-14 rounded-2xl text-white solar-glow shrink-0"
                    data-visible={visible}
                    style={{
                      backgroundImage: "var(--solar-gradient-primary)",
                      transitionDelay: `${index * 0.12}s`,
                    }}
                  >
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <p className="font-semibold text-foreground">{step.title}</p>
                  <p className="text-sm text-muted-foreground max-w-[15rem]">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
