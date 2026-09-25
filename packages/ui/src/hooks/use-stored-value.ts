"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Evento disparado no `window` para sincronizar instâncias na mesma aba (o `storage` nativo só dispara em OUTRAS abas). */
const CHANGE_EVENT = "nico:stored-value-change";

/**
 * Fallback quando `localStorage` lança (modo privado, bloqueado). Vive só durante a sessão da página,
 * em escopo de módulo para que todas as instâncias enxerguem o mesmo valor.
 */
const memoryStore = new Map<string, string>();

function readValue(key: string): string | null {
  try {
    const stored = window.localStorage.getItem(key);
    if (stored !== null) return stored;
  } catch {
    // storage indisponível: cai para a memória
  }
  return memoryStore.get(key) ?? null;
}

function writeValue(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
    memoryStore.delete(key);
  } catch {
    memoryStore.set(key, value);
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { key } }));
}

/** No servidor não há storage; `null` faz o export estático renderizar o padrão e o cliente reaplicar o salvo após hidratar. */
function getServerSnapshot(): null {
  return null;
}

/**
 * Valor de string persistido em `localStorage` e sincronizado entre instâncias e abas.
 *
 * Retorna `null` no servidor e na primeira renderização de hidratação.
 *
 * Semântica de prioridade entre `localStorage` e o fallback em memória:
 * - um valor presente no `localStorage` tem prioridade sobre o valor em memória;
 * - uma escrita bem-sucedida no `localStorage` remove a entrada em memória daquela chave;
 * - se o storage lança (modo privado, bloqueado, cota), o valor vive apenas em memória
 *   durante a sessão da página.
 *
 * @example
 * const [tab, setTab] = useStoredValue("nico:install-tab");
 * // tab === null até existir um valor salvo
 * setTab("manual");
 */
export function useStoredValue(key: string): readonly [string | null, (value: string) => void] {
  // Estável por chave: trocar a identidade de subscribe a cada render faria o React reassinar sem necessidade.
  const subscribe = useCallback(
    (onChange: () => void) => {
      const handleCustom = (e: Event) => {
        if ((e as CustomEvent<{ key: string }>).detail?.key === key) onChange();
      };
      // key === null no evento nativo significa `localStorage.clear()`.
      const handleStorage = (e: StorageEvent) => {
        if (e.key === null || e.key === key) onChange();
      };
      window.addEventListener(CHANGE_EVENT, handleCustom);
      window.addEventListener("storage", handleStorage);
      return () => {
        window.removeEventListener(CHANGE_EVENT, handleCustom);
        window.removeEventListener("storage", handleStorage);
      };
    },
    [key],
  );

  // Retorna string|null (primitivo), então a comparação por valor do React evita loops de re-render.
  const getSnapshot = useCallback(() => readValue(key), [key]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setValue = useCallback((next: string) => writeValue(key, next), [key]);

  return [value, setValue] as const;
}
