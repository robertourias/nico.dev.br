"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "../hooks/use-copy-to-clipboard";
import { cn } from "../lib/utils";

export type CopyButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick"> & {
  /** Texto copiado, exatamente como recebido. */
  value: string;
  /** Rótulo acessível do botão (`aria-label`). */
  label?: string;
  /** Texto anunciado por leitores de tela após a cópia. */
  copiedLabel?: string;
};

/**
 * Botão só com ícone que copia `value` para a área de transferência. O ícone vira `Check`
 * por 2 s e o resultado é anunciado em uma região `role="status"` (sr-only). Falhas
 * (Clipboard API ausente ou rejeitada) são silenciosas: nada é lançado.
 *
 * @example
 * ```tsx
 * <CopyButton value="npx skills add robertourias/skills --skill code-review" />
 * ```
 */
const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    { value, label = "Copiar comando de instalação", copiedLabel = "Copiado!", className, type = "button", ...props },
    ref
  ) => {
    const { status, copy } = useCopyToClipboard();

    return (
      <>
        <button
          ref={ref}
          type={type}
          aria-label={label}
          className={cn(
            "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className
          )}
          {...props}
          onClick={() => {
            void copy(value);
          }}
        >
          {status === "copied" ? (
            <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-foreground" />
          ) : (
            <Copy aria-hidden="true" className="h-4 w-4 shrink-0" />
          )}
        </button>
        <span role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {status === "copied" ? copiedLabel : ""}
        </span>
      </>
    );
  }
);
CopyButton.displayName = "CopyButton";

export { CopyButton };
