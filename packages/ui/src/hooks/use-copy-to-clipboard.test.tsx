import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCopyToClipboard } from "./use-copy-to-clipboard";

function stubClipboard(value: unknown) {
  Object.defineProperty(navigator, "clipboard", { value, configurable: true });
}

describe("useCopyToClipboard", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    stubClipboard(undefined);
  });

  it("começa em idle", () => {
    const { result } = renderHook(() => useCopyToClipboard());
    expect(result.current.status).toBe("idle");
  });

  it("copia o valor exato e vira copied", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubClipboard({ writeText });
    const { result } = renderHook(() => useCopyToClipboard());
    let returned: string | undefined;
    await act(async () => {
      returned = await result.current.copy("  npx x  ");
    });
    expect(writeText).toHaveBeenCalledWith("  npx x  ");
    expect(result.current.status).toBe("copied");
    expect(returned).toBe("copied");
  });

  it("volta a idle após 2000 ms", async () => {
    stubClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
    const { result } = renderHook(() => useCopyToClipboard());
    await act(async () => {
      await result.current.copy("x");
    });
    act(() => {
      vi.advanceTimersByTime(1900);
    });
    expect(result.current.status).toBe("copied");
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.status).toBe("idle");
  });

  it("respeita resetMs customizado", async () => {
    stubClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
    const { result } = renderHook(() => useCopyToClipboard({ resetMs: 500 }));
    await act(async () => {
      await result.current.copy("x");
    });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.status).toBe("idle");
  });

  it("copiar de novo reinicia o contador", async () => {
    stubClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
    const { result } = renderHook(() => useCopyToClipboard());
    await act(async () => {
      await result.current.copy("x");
    });
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    await act(async () => {
      await result.current.copy("x");
    });
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(result.current.status).toBe("copied");
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.status).toBe("idle");
  });

  it("clipboard ausente: fallback, chama onFallback, sem erro", async () => {
    stubClipboard(undefined);
    const onFallback = vi.fn();
    const { result } = renderHook(() => useCopyToClipboard({ onFallback }));
    await act(async () => {
      await expect(result.current.copy("x")).resolves.toBe("fallback");
    });
    expect(onFallback).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe("fallback");
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.status).toBe("idle");
  });

  it("writeText rejeitado: fallback, sem erro", async () => {
    stubClipboard({ writeText: vi.fn().mockRejectedValue(new Error("NotAllowedError")) });
    const onFallback = vi.fn();
    const { result } = renderHook(() => useCopyToClipboard({ onFallback }));
    await act(async () => {
      await result.current.copy("x");
    });
    expect(onFallback).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe("fallback");
  });

  it("onFallback que lança não quebra a cópia", async () => {
    stubClipboard(undefined);
    const { result } = renderHook(() =>
      useCopyToClipboard({
        onFallback: () => {
          throw new Error("boom");
        },
      })
    );
    await act(async () => {
      await result.current.copy("x");
    });
    expect(result.current.status).toBe("fallback");
  });

  it("desmontar limpa o timer sem aviso", async () => {
    stubClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { result, unmount } = renderHook(() => useCopyToClipboard());
    await act(async () => {
      await result.current.copy("x");
    });
    unmount();
    expect(vi.getTimerCount()).toBe(0);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
