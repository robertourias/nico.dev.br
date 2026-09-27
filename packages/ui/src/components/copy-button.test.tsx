import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CopyButton } from "./copy-button";

function setup(clipboard: unknown | null = { writeText: vi.fn().mockResolvedValue(undefined) }) {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  Object.defineProperty(navigator, "clipboard", { value: clipboard, configurable: true });
  return { user, writeText: (clipboard as { writeText?: ReturnType<typeof vi.fn> } | undefined)?.writeText };
}

const getButton = (name = "Copiar comando de instalação") => screen.getByRole("button", { name });

describe("CopyButton", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
  });

  it("tem aria-label padrão e type=button", () => {
    setup();
    render(<CopyButton value="x" />);
    expect(getButton()).toHaveAttribute("type", "button");
  });

  it("aceita label customizado como aria-label", () => {
    setup();
    render(<CopyButton value="x" label="Copiar skill" />);
    expect(getButton("Copiar skill")).toBeInTheDocument();
  });

  it("tem região role=status vazia inicialmente, sr-only", () => {
    setup();
    render(<CopyButton value="x" />);
    const status = screen.getByRole("status");
    expect(status).toHaveClass("sr-only");
    expect(status).toBeEmptyDOMElement();
  });

  it("copia o valor exato e anuncia Copiado!", async () => {
    const { user, writeText } = setup();
    render(<CopyButton value="  npx skills add x " />);
    await user.click(getButton());
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith("  npx skills add x ");
    expect(screen.getByRole("status")).toHaveTextContent("Copiado!");
  });

  it("usa copiedLabel customizado", async () => {
    const { user } = setup();
    render(<CopyButton value="x" copiedLabel="Pronto" />);
    await user.click(getButton());
    expect(screen.getByRole("status")).toHaveTextContent("Pronto");
  });

  it("o anúncio some após 2000 ms", async () => {
    const { user } = setup();
    render(<CopyButton value="x" />);
    await user.click(getButton());
    act(() => {
      vi.advanceTimersByTime(1900);
    });
    expect(screen.getByRole("status")).toHaveTextContent("Copiado!");
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("segundo clique reinicia o contador", async () => {
    const { user } = setup();
    render(<CopyButton value="x" />);
    await user.click(getButton());
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    await user.click(getButton());
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.getByRole("status")).toHaveTextContent("Copiado!");
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("clipboard ausente: falha silenciosa, sem anúncio", async () => {
    setup(null);
    render(<CopyButton value="x" />);
    // fireEvent: o user-event reinstala o próprio stub de clipboard a cada interação.
    await act(async () => {
      fireEvent.click(getButton());
    });
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("writeText rejeitado: falha silenciosa, sem anúncio", async () => {
    const { user } = setup({ writeText: vi.fn().mockRejectedValue(new Error("NotAllowedError")) });
    render(<CopyButton value="x" />);
    await user.click(getButton());
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("repassa className e props de button, mantendo foco visível", () => {
    setup();
    render(<CopyButton value="x" className="opacity-0" disabled data-testid="cb" />);
    const button = getButton();
    expect(button).toHaveClass("opacity-0", "focus-visible:ring-2");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("data-testid", "cb");
  });

  it("recebe foco por teclado e copia com Enter", async () => {
    const { user, writeText } = setup();
    render(<CopyButton value="x" />);
    await user.tab();
    expect(getButton()).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(writeText).toHaveBeenCalledTimes(1);
  });

  it("desmontar depois de copiar não gera aviso", async () => {
    const { user } = setup();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { unmount } = render(<CopyButton value="x" />);
    await user.click(getButton());
    unmount();
    expect(vi.getTimerCount()).toBe(0);
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
