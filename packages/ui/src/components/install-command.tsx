"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "../lib/utils";

/** Tempo, em ms, em que o rótulo de confirmação fica visível. */
const FEEDBACK_DURATION_MS = 2000;

export type InstallCommandProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onCopy"> & {
  /** Comando exibido e copiado, exatamente como recebido (sem trim). */
  command: string;
  /** Prefixo decorativo, não selecionável e oculto de leitores de tela. */
  prompt?: string;
  /** Rótulo exibido e anunciado após a cópia bem-sucedida. */
  copiedLabel?: string;
  /** Rótulo exibido e anunciado quando a cópia automática falha. */
  fallbackLabel?: string;
  /** Chamado após a tentativa de cópia com o resultado. */
  onCopy?: (status: "copied" | "fallback") => void;
};

/**
 * Caixa monoespaçada com um comando de instalação. Com o mouse, clicar em qualquer ponto
 * da caixa copia o comando exato (exceto ao selecionar texto por arraste no comando).
 * O `<code>` é focável (`tabIndex=0`) para rolar comandos longos com as setas; o `<button>`
 * é o acionador de cópia por teclado e leitor de tela (Enter/Espaço). Se a Clipboard API
 * estiver ausente ou falhar, o texto do comando é selecionado para cópia manual. O resultado
 * é anunciado em uma região `role="status"`.
 *
 * @example
 * ```tsx
 * <InstallCommand
 *   command="npx skills add robertourias/skills"
 *   onCopy={(status) => console.log(status)}
 * />
 * ```
 */
const InstallCommand = React.forwardRef<HTMLDivElement, InstallCommandProps>(
  (
    {
      command,
      prompt = "$",
      copiedLabel = "Copiado!",
      fallbackLabel = "Selecione e copie: Ctrl+C",
      onCopy,
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    const codeId = React.useId();
    const codeRef = React.useRef<HTMLElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const mountedRef = React.useRef(true);
    const [status, setStatus] = React.useState<"copied" | "fallback" | null>(null);

    const clearTimer = () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    React.useEffect(() => {
      mountedRef.current = true;
      return () => {
        mountedRef.current = false;
        clearTimer();
      };
    }, []);

    const show = (next: "copied" | "fallback") => {
      if (!mountedRef.current) return;
      clearTimer();
      setStatus(next);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        setStatus(null);
      }, FEEDBACK_DURATION_MS);
    };

    const copy = async () => {
      let copied = false;
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(command);
          copied = true;
        }
      } catch {
        copied = false;
      }

      if (copied) {
        show("copied");
        onCopy?.("copied");
        return;
      }

      try {
        const selection = window.getSelection();
        if (selection && codeRef.current) selection.selectAllChildren(codeRef.current);
      } catch {
        // Seleção indisponível: o rótulo de fallback ainda é exibido.
      }
      show("fallback");
      onCopy?.("fallback");
    };

    // Único handler de cópia: o clique no botão borbulha até aqui, então não há cópia dupla.
    const handleBoxClick = (event: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;

      const onButton = buttonRef.current?.contains(event.target as Node) ?? false;
      if (!onButton && (window.getSelection()?.toString() ?? "") !== "") return;

      void copy();
    };

    const label = status === "copied" ? copiedLabel : status === "fallback" ? fallbackLabel : "";

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full cursor-pointer items-center gap-3 rounded-lg border border-border bg-surface-raised px-4 py-3 text-sm text-foreground transition-colors",
          className
        )}
        onClick={handleBoxClick}
        {...props}
      >
        <span aria-hidden="true" className="select-none text-muted-foreground">
          {prompt}
        </span>
        <code
          id={codeId}
          ref={codeRef}
          tabIndex={0}
          className="min-w-0 flex-1 cursor-text overflow-x-auto whitespace-nowrap rounded-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [scrollbar-color:var(--color-border)_transparent] [scrollbar-width:thin]"
        >
          {command}
        </code>
        <button
          ref={buttonRef}
          type="button"
          aria-label="Copiar comando de instalação"
          aria-describedby={codeId}
          className="flex shrink-0 items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {label && (
            <span aria-hidden="true" className="text-xs text-muted-foreground">
              {label}
            </span>
          )}
          {status === "copied" ? (
            <Check aria-hidden="true" className="h-4 w-4 shrink-0" />
          ) : (
            <Copy aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
        </button>
        <span role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {label}
        </span>
      </div>
    );
  }
);
InstallCommand.displayName = "InstallCommand";

export { InstallCommand };
