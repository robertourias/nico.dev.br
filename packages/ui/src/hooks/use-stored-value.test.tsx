import { act, renderHook } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useStoredValue } from "./use-stored-value";

// Chaves únicas por teste: o fallback em memória é estado de módulo e não é reiniciado entre testes.
let seq = 0;
const uniqueKey = () => `test:stored-value:${++seq}`;

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useStoredValue", () => {
  it("lê um valor existente", () => {
    const key = uniqueKey();
    window.localStorage.setItem(key, "manual");
    const { result } = renderHook(() => useStoredValue(key));
    expect(result.current[0]).toBe("manual");
  });

  it("retorna null quando não há valor", () => {
    const { result } = renderHook(() => useStoredValue(uniqueKey()));
    expect(result.current[0]).toBeNull();
  });

  it("set grava no localStorage e atualiza o valor", () => {
    const key = uniqueKey();
    const { result } = renderHook(() => useStoredValue(key));
    act(() => result.current[1]("skill"));
    expect(result.current[0]).toBe("skill");
    expect(window.localStorage.getItem(key)).toBe("skill");
  });

  it("sincroniza duas instâncias com a mesma chave na mesma página", () => {
    const key = uniqueKey();
    const a = renderHook(() => useStoredValue(key));
    const b = renderHook(() => useStoredValue(key));
    act(() => a.result.current[1]("repository"));
    expect(a.result.current[0]).toBe("repository");
    expect(b.result.current[0]).toBe("repository");
  });

  it("não afeta instâncias de outra chave", () => {
    const a = renderHook(() => useStoredValue(uniqueKey()));
    const b = renderHook(() => useStoredValue(uniqueKey()));
    act(() => a.result.current[1]("x"));
    expect(b.result.current[0]).toBeNull();
  });

  it("atualiza com o evento storage de outra aba", () => {
    const key = uniqueKey();
    const { result } = renderHook(() => useStoredValue(key));
    act(() => {
      window.localStorage.setItem(key, "manual");
      window.dispatchEvent(new StorageEvent("storage", { key, newValue: "manual" }));
    });
    expect(result.current[0]).toBe("manual");
  });

  it("atualiza quando o storage é limpo em outra aba (key null)", () => {
    const key = uniqueKey();
    window.localStorage.setItem(key, "manual");
    const { result } = renderHook(() => useStoredValue(key));
    expect(result.current[0]).toBe("manual");
    act(() => {
      window.localStorage.clear();
      window.dispatchEvent(new StorageEvent("storage", { key: null }));
    });
    expect(result.current[0]).toBeNull();
  });

  it("ignora evento storage de outra chave", () => {
    const key = uniqueKey();
    const { result } = renderHook(() => useStoredValue(key));
    act(() => {
      window.localStorage.setItem(key, "manual");
      window.dispatchEvent(new StorageEvent("storage", { key: "outra-chave" }));
    });
    expect(result.current[0]).toBeNull();
  });

  it("mantém o valor em memória quando getItem e setItem lançam", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const key = uniqueKey();
    const a = renderHook(() => useStoredValue(key));
    const b = renderHook(() => useStoredValue(key));
    expect(a.result.current[0]).toBeNull();
    expect(() => act(() => a.result.current[1]("manual"))).not.toThrow();
    expect(a.result.current[0]).toBe("manual");
    expect(b.result.current[0]).toBe("manual");
  });

  it("mantém o valor em memória quando só setItem lança", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    const key = uniqueKey();
    const { result } = renderHook(() => useStoredValue(key));
    act(() => result.current[1]("skill"));
    expect(result.current[0]).toBe("skill");
  });

  it("snapshot de servidor é null e não toca em localStorage", () => {
    const key = uniqueKey();
    window.localStorage.setItem(key, "manual");
    const getItem = vi.spyOn(Storage.prototype, "getItem");
    function Probe() {
      const [value] = useStoredValue(key);
      return <span>{value === null ? "null" : value}</span>;
    }
    const html = renderToString(<Probe />);
    expect(html).toContain("null");
    expect(html).not.toContain("manual");
    expect(getItem).not.toHaveBeenCalled();
  });

  it("remove os mesmos listeners que adicionou ao desmontar", () => {
    const add = vi.spyOn(window, "addEventListener");
    const remove = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useStoredValue(uniqueKey()));

    const added = add.mock.calls.filter(([type]) => type === "storage" || String(type).startsWith("nico:"));
    expect(added.map(([type]) => type)).toContain("storage");
    expect(added).toHaveLength(2);

    unmount();

    for (const [type, handler] of added) {
      expect(remove).toHaveBeenCalledWith(type, handler);
    }
  });
});
