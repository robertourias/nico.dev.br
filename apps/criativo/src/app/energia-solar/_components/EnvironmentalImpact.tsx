import { TreeDeciduous, Leaf } from "lucide-react"
import { calculateSimulation, DEFAULT_INPUTS } from "../_lib/calculations"
import { AnimatedCounter } from "./AnimatedCounter"
import { Reveal } from "./Reveal"

// Seção de impacto ambiental — ilustrativa e independente do estado do
// simulador (seção própria, sem acoplamento entre client components
// distantes na árvore). Usa os parâmetros padrão do simulador como exemplo
// realista de uma residência média, em vez de um número arbitrário.
const EXAMPLE = calculateSimulation(DEFAULT_INPUTS)
const TREE_COUNT = Math.min(24, Math.max(6, EXAMPLE.treesEquivalent))

export function EnvironmentalImpact() {
  return (
    <section
      className="px-6 py-16 md:py-24 scroll-mt-20 relative overflow-hidden"
      style={{ backgroundImage: "var(--solar-gradient-soft)" }}
      aria-labelledby="environment-title"
    >
      <div className="max-w-4xl mx-auto text-center relative">
        <Reveal>
          <p className="text-sm font-semibold mb-2" style={{ color: "var(--solar-green)" }}>
            Impacto ambiental
          </p>
          <h2 id="environment-title" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            O equivalente a plantar uma{" "}
            <span style={{ color: "var(--solar-green)" }}>pequena floresta</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-10">
            Uma residência média com energia solar evita o lançamento de gases de efeito estufa na atmosfera todos os
            anos — veja o equivalente em árvores plantadas.
          </p>
        </Reveal>

        <Reveal variant="scale-in" className="mb-10">
          <div className="inline-flex flex-col items-center gap-2 solar-glow-green rounded-2xl px-10 py-8 bg-[var(--color-surface-raised)] border border-border">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Leaf className="size-3.5" style={{ color: "var(--solar-green)" }} aria-hidden="true" />
              CO₂ evitado por ano
            </div>
            <p className="text-4xl md:text-5xl font-bold tabular-nums" style={{ color: "var(--solar-green)" }}>
              <AnimatedCounter value={EXAMPLE.annualCo2KgAvoided} decimals={0} suffix=" kg" />
            </p>
            <p className="text-sm text-muted-foreground">
              equivalente a <AnimatedCounter value={EXAMPLE.treesEquivalent} className="font-semibold text-foreground" />{" "}
              árvores adultas por ano
            </p>
          </div>
        </Reveal>

        <Reveal className="flex flex-wrap items-end justify-center gap-2">
          {Array.from({ length: TREE_COUNT }).map((_, i) => (
            <TreeDeciduous
              key={i}
              className="size-7 md:size-8 solar-fade-up"
              style={{ color: "var(--solar-green)", animationDelay: `${i * 0.05}s` }}
              aria-hidden="true"
            />
          ))}
        </Reveal>
      </div>
    </section>
  )
}
