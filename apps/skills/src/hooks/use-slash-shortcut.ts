import { useEffect } from "react";
import type { RefObject } from "react";

const EDITABLE_SELECTOR = "input, textarea, [contenteditable]";

/**
 * Foca `ref` ao pressionar "/" fora de um campo editável (FR-007).
 *
 * Hook puro de UI, sem dependência de dados do registry — reutilizável por
 * qualquer input de busca da aplicação. Não interfere quando o foco já está
 * em input/textarea/[contenteditable]: "/" continua sendo digitado normalmente.
 */
export function useSlashShortcut(ref: RefObject<HTMLInputElement | null>): void {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      const active = document.activeElement;
      const isEditableFocused = active !== null && active.matches(EDITABLE_SELECTOR);
      if (isEditableFocused) {
        return;
      }

      event.preventDefault();
      ref.current?.focus();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [ref]);
}
