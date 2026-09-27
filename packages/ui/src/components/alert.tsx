import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Info, CircleCheck, CircleAlert, TriangleAlert } from "lucide-react";
import { cn } from "../lib/utils";

const alertVariants = cva(
  "flex gap-3 rounded-lg border p-4 text-sm",
  {
    variants: {
      variant: {
        /** Fundo accent neutro com ícone de informação. Para mensagens informativas gerais. */
        default: "bg-accent border-border text-accent-foreground dark:border-accent-foreground/50",
        /** Fundo verde suave com ícone de check. Para confirmações e operações bem-sucedidas. */
        success: "bg-badge-success-bg border-success text-success dark:border-success/50",
        /** Fundo vermelho suave com ícone de alerta. Para erros e falhas críticas. */
        destructive: "bg-badge-destructive-bg border-destructive text-badge-destructive-fg dark:border-destructive/50",
        /** Fundo amarelo suave com ícone de triângulo. Para avisos que requerem atenção. */
        warning: "bg-badge-warning-bg border-warning text-badge-warning-fg dark:border-warning/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const alertIconMap = {
  default: Info,
  success: CircleCheck,
  destructive: CircleAlert,
  warning: TriangleAlert,
} as const;

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  /**
   * Tom semântico do alerta. Determina cor de fundo, borda e ícone automaticamente.
   * - `"default"` — informação neutra
   * - `"success"` — operação concluída com sucesso
   * - `"destructive"` — erro ou falha crítica
   * - `"warning"` — atenção requerida antes de continuar
   */
  variant?: "default" | "success" | "destructive" | "warning";
}

/**
 * Mensagem de feedback contextual com ícone automático baseado na variante.
 * Compose com `AlertTitle` e `AlertDescription` para estrutura semântica completa.
 * Possui `role="alert"` embutido para leitores de tela.
 *
 * @example
 * ```tsx
 * <Alert variant="success">
 *   <AlertTitle>Salvo!</AlertTitle>
 *   <AlertDescription>Suas alterações foram salvas com sucesso.</AlertDescription>
 * </Alert>
 *
 * <Alert variant="destructive">
 *   <AlertTitle>Erro</AlertTitle>
 *   <AlertDescription>Não foi possível conectar ao servidor.</AlertDescription>
 * </Alert>
 * ```
 */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const Icon = alertIconMap[variant ?? "default"];
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        <Icon className="mt-0.5 h-[18px] w-[18px] shrink-0" />
        <div className="flex-1 space-y-1">{children}</div>
      </div>
    );
  }
);
Alert.displayName = "Alert";

/** Título em negrito dentro do Alert. */
const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

/** Texto descritivo complementar ao AlertTitle. */
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-[13px] leading-relaxed opacity-90", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription, alertVariants };
