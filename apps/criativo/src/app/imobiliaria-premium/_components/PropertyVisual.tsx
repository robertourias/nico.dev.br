import { Building2, Home, TrendingUp, Gem, Briefcase, type LucideIcon } from "lucide-react"
import type { LifestyleKey } from "../_lib/data"

// Fallback quando não há `imageUrl` (ver _lib/data.ts para as fotos reais do
// Unsplash). Cada categoria recebe um gradiente e ícone próprios para criar
// identidade visual consistente onde a foto não se aplica.
const VISUALS: Record<LifestyleKey, { gradient: string; icon: LucideIcon }> = {
  urbana: { gradient: "linear-gradient(135deg, #1f2937 0%, #4b5d4f 100%)", icon: Building2 },
  familia: { gradient: "linear-gradient(135deg, #c9b186 0%, #e9ddc4 100%)", icon: Home },
  investimento: { gradient: "linear-gradient(135deg, #2f3c32 0%, #6b8070 100%)", icon: TrendingUp },
  "alto-padrao": { gradient: "linear-gradient(135deg, #111827 0%, #2f3c32 100%)", icon: Gem },
  comercial: { gradient: "linear-gradient(135deg, #5b6472 0%, #aab0bb 100%)", icon: Briefcase },
}

interface PropertyVisualProps {
  category: LifestyleKey
  className?: string
  iconClassName?: string
  imageUrl?: string
  imageAlt?: string
}

// Quando há `imageUrl`, renderiza a foto real (Unsplash) com um leve
// gradiente escuro na base para manter legibilidade de textos sobrepostos.
// Sem imagem, mantém o fallback original (gradiente + ícone por categoria).
export function PropertyVisual({ category, className, iconClassName, imageUrl, imageAlt }: PropertyVisualProps) {
  const visual = VISUALS[category]
  const Icon = visual.icon
  const isLight = category === "familia"

  // Quando o `className` recebido já define posicionamento (ex. "absolute
  // inset-0", padrão usado pelos chamadores para preencher um ancestral
  // relative com altura definida), não adicionamos `relative` aqui: na folha
  // de estilos gerada pelo Tailwind, `.relative` vem depois de `.absolute`,
  // então as duas classes juntas no mesmo elemento sempre resolviam para
  // `position: relative` — e a altura colapsava a 0 (o <img> absolute não
  // contribui para o fluxo do pai), deixando a foto invisível. Sem
  // "absolute" no className (ex. "h-72 md:h-96" no modal do tour virtual),
  // mantemos `relative` para que o próprio wrapper seja o contexto de
  // posicionamento dos filhos internos.
  const hasOwnPositioning = className?.includes("absolute")

  if (imageUrl) {
    return (
      <div className={`${hasOwnPositioning ? "" : "relative "}overflow-hidden ${className ?? ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={imageAlt ?? ""}
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
          aria-hidden={imageAlt ? undefined : true}
        />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "linear-gradient(180deg, rgba(17,24,39,0) 45%, rgba(17,24,39,0.55) 100%)" }}
        />
      </div>
    )
  }

  return (
    <div
      className={`${hasOwnPositioning ? "" : "relative "}flex items-center justify-center overflow-hidden ${className ?? ""}`}
      style={{ backgroundImage: visual.gradient }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <Icon
        className={iconClassName ?? "size-12"}
        style={{ color: isLight ? "rgba(17,24,39,0.35)" : "rgba(248,250,252,0.5)" }}
        strokeWidth={1.25}
      />
    </div>
  )
}
