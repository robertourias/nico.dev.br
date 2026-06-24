"use client"

import { useEffect, useRef } from "react"
import { ArrowRight, MessageCircle } from "lucide-react"
import { AnimatedCounter } from "./AnimatedCounter"
import { PropertyVisual } from "./PropertyVisual"
import type { LifestyleKey } from "../_lib/data"

// Fotos reutilizadas tematicamente a partir de PROPERTIES (ver _lib/data.ts)
// — mesma curadoria de imagens do restante da página, sem duplicar fonte.
const MOSAIC_TILES: { category: LifestyleKey; label: string; className: string; image: string }[] = [
  {
    category: "alto-padrao",
    label: "Casa moderna",
    className: "col-span-1 row-span-2",
    image: "https://images.unsplash.com/photo-1696008068310-936be0ff3a44?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "urbana",
    label: "Apartamento urbano",
    className: "col-span-1 row-span-1",
    image: "https://images.unsplash.com/photo-1768638687896-35bde623d532?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "alto-padrao",
    label: "Cobertura premium",
    className: "col-span-1 row-span-1",
    image: "https://images.unsplash.com/photo-1707905729981-c89310889b03?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "comercial",
    label: "Imóvel comercial",
    className: "col-span-2 row-span-1",
    image: "https://images.unsplash.com/photo-1746021535489-00edc5efb203?auto=format&fit=crop&w=900&q=80",
  },
]

const HERO_STATS = [
  { value: 623, suffix: "+", label: "Imóveis selecionados" },
  { value: 4, suffix: "", label: "Regiões atendidas" },
  { value: 97, suffix: "%", label: "Satisfação dos clientes" },
]

export function Hero() {
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = parallaxRef.current
    if (!node) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const offset = Math.min(window.scrollY, 600) * 0.12
        node.style.transform = `translateY(${offset}px)`
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section id="topo" className="relative px-6 pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
      <div ref={parallaxRef} className="absolute inset-0 imob-parallax">
        <div className="absolute inset-0 imob-grid-bg" aria-hidden="true" />
        <div
          className="imob-blob -top-20 -left-24 size-96"
          style={{ backgroundImage: "var(--imob-gradient-primary)" }}
          aria-hidden="true"
        />
        <div
          className="imob-blob top-40 right-0 size-80"
          style={{ backgroundImage: "var(--imob-gradient-sand)" }}
          aria-hidden="true"
        />
      </div>

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-12 items-center">
        <div className="imob-fade-up">
          <span
            className="inline-flex items-center gap-2 rounded-full imob-glass px-4 py-1.5 text-xs font-semibold mb-6"
            style={{ color: "var(--imob-moss)" }}
          >
            Encontre o espaço ideal para sua próxima história
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5 text-foreground">
            Seu próximo imóvel começa com{" "}
            <span className="imob-highlight">uma escolha inteligente</span>.
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-xl imob-fade-up-delay-1">
            Descubra casas, apartamentos e oportunidades de investimento selecionadas por especialistas.
          </p>

          <div className="flex flex-wrap items-center gap-4 imob-fade-up-delay-2">
            <a
              href="#imoveis"
              className="imob-cta-highlight inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-base font-semibold text-[var(--color-primary-foreground)] imob-glow"
              style={{ backgroundImage: "var(--imob-gradient-primary)" }}
            >
              Explorar Imóveis
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#leads"
              className="imob-cta-highlight inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-base font-semibold text-foreground border border-border hover:border-[var(--imob-moss)] transition-colors"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Falar com Consultor
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-8 mt-10 pt-8 border-t border-border imob-fade-up-delay-3">
            {HERO_STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-bold text-foreground tabular-nums imob-font-serif">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* grid-rows-3: o tile col-span-2 (largura cheia) precisa de uma 3ª
            linha própria — com grid-rows-2 ele não cabia nas 2 linhas já
            ocupadas pelos outros 3 tiles e caía numa linha implícita de
            altura 0, deixando a foto invisível. */}
        <div className="imob-fade-up-delay-1 grid grid-cols-2 grid-rows-3 gap-3 h-[420px] md:h-[480px]">
          {MOSAIC_TILES.map((tile, index) => (
            <div
              key={`${tile.category}-${index}`}
              className={`imob-mosaic-tile rounded-2xl ${tile.className}`}
            >
              <PropertyVisual
                category={tile.category}
                imageUrl={tile.image}
                className="absolute inset-0"
                iconClassName="size-10"
              />
              <div
                className="imob-mosaic-overlay absolute inset-0 opacity-70"
                style={{ backgroundImage: "linear-gradient(to top, rgba(17,24,39,0.75), transparent 60%)" }}
              />
              <p className="imob-mosaic-label absolute bottom-3 left-4 right-4 text-sm font-semibold text-[var(--color-primary-foreground)]">
                {tile.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
