"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Tempo padrão, em ms, em que o estado `copied`/`fallback` permanece antes de voltar a `idle`. */
const DEFAULT_RESET_MS = 2000;

export type CopyStatus = "idle" | "copied" | "fallback";

export type UseCopyToClipboardOptions = {
  /** Tempo, em ms, até o status voltar a `idle`. Padrão: 2000. */
  resetMs?: number;
  /** Chamado quando a Clipboard API está ausente ou falha (ex.: para selecionar o texto). */
  onFallback?: () => void;
};

/**
 * Copia texto com `navigator.clipboard.writeText`. Nunca lança: se a API estiver ausente
 * ou rejeitar, o status vira `fallback` e `onFallback` é chamado. O status volta a `idle`
 * após `resetMs`; copiar de novo reinicia o contador; o timer é limpo ao desmontar.
 * `copy` resolve com o resultado (`copied` ou `fallback`).
 */
export function useCopyToClipboard(opts: UseCopyToClipboardOptions = {}): {
  status: CopyStatus;
  copy: (text: string) => Promise<"copied" | "fallback">;
} {
  const { resetMs = DEFAULT_RESET_MS } = opts;
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const onFallbackRef = useRef(opts.onFallback);

  useEffect(() => {
    onFallbackRef.current = opts.onFallback;
  });

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimer();
    };
  }, [clearTimer]);

  const show = useCallback(
    (next: "copied" | "fallback") => {
      if (!mountedRef.current) return;
      clearTimer();
      setStatus(next);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        setStatus("idle");
      }, resetMs);
    },
    [clearTimer, resetMs]
  );

  const copy = useCallback(
    async (text: string) => {
      let copied = false;
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          copied = true;
        }
      } catch {
        copied = false;
      }

      if (copied) {
        show("copied");
        return "copied" as const;
      }

      try {
        onFallbackRef.current?.();
      } catch {
        // O fallback do consumidor não pode quebrar a cópia.
      }
      show("fallback");
      return "fallback" as const;
    },
    [show]
  );

  return { status, copy };
}
