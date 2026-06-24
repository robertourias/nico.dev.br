import { Leaf, Sprout, WheatOff, Flame, ChefHat, type LucideIcon } from "lucide-react"
import type { Dish, DishTag } from "../_lib/data"

const TAG_META: Record<DishTag, { label: string; icon: LucideIcon }> = {
  vegetariano: { label: "Vegetariano", icon: Leaf },
  vegano: { label: "Vegano", icon: Sprout },
  "sem-gluten": { label: "Sem glúten", icon: WheatOff },
  "mais-pedido": { label: "Mais pedido", icon: Flame },
  "chef-recomenda": { label: "Chef recomenda", icon: ChefHat },
}

const PRICE_FORMATTER = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export function DishCard({ dish }: { dish: Dish }) {
  return (
    <div className="rounded-2xl border border-border bg-[var(--color-surface-raised)] overflow-hidden rest-card-hover flex flex-col h-full">
      <div
        className="relative h-32 flex items-center justify-center"
        style={{ backgroundImage: "var(--rest-gradient-soft)" }}
        aria-hidden="true"
      >
        <div
          className="size-16 rounded-full"
          style={{ backgroundImage: "var(--rest-gradient-gold)", opacity: 0.9 }}
        />
        {dish.tags.includes("chef-recomenda") && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-[var(--color-surface)] border border-border px-2.5 py-1 text-[0.65rem] font-semibold" style={{ color: "var(--color-primary)" }}>
            <ChefHat className="size-3" aria-hidden="true" />
            Chef recomenda
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-base font-semibold text-foreground rest-font-serif leading-snug">{dish.name}</h3>
          <span className="text-sm font-semibold whitespace-nowrap" style={{ color: "var(--color-primary)" }}>
            {PRICE_FORMATTER.format(dish.price)}
          </span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{dish.description}</p>

        <p className="text-xs text-muted-foreground mb-4">{dish.ingredients.join(" · ")}</p>

        <div className="mt-auto flex flex-wrap gap-1.5">
          {dish.tags.map((tag) => {
            const meta = TAG_META[tag]
            const Icon = meta.icon
            return (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-[var(--color-surface-overlay)] px-2.5 py-1 text-[0.65rem] text-muted-foreground"
              >
                <Icon className="size-3" aria-hidden="true" />
                {meta.label}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
