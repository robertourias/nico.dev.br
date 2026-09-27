import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        /** Fundo accent neutro. Para rótulos sem conotação semântica. */
        default: "bg-accent text-accent-foreground",
        /** Fundo verde suave. Para estados positivos, aprovados ou ativos. */
        success: "bg-badge-success-bg text-success",
        /** Fundo vermelho suave. Para erros, falhas ou itens críticos. */
        destructive: "bg-badge-destructive-bg text-badge-destructive-fg",
        /** Fundo amarelo suave. Para avisos ou atenção requerida. */
        warning: "bg-badge-warning-bg text-badge-warning-fg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Estilo semântico do badge. Escolha a variante que reflete o significado do rótulo. */
  variant?: "default" | "success" | "destructive" | "warning";
  /** Renderiza o filho como elemento raiz via Radix Slot. */
  asChild?: boolean;
}

/**
 * Rótulo compacto para classificar ou identificar itens com significado semântico.
 * Use para status, categorias, contagens ou tags. Quatro variantes: `default`,
 * `success`, `destructive` e `warning`.
 *
 * @example
 * ```tsx
 * <Badge>Novo</Badge>
 * <Badge variant="success">Aprovado</Badge>
 * <Badge variant="destructive">Erro</Badge>
 * <Badge variant="warning">Pendente</Badge>
 * ```
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";
    return (
      <Comp
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
