import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InstallCommand } from "./install-command";

const COMMAND = "npx skills add robertourias/skills  --all ";

function setup() {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
  return { user, writeText };
}

const visibleLabel = (text: string) =>
  screen.queryAllByText(text).filter((el) => el.getAttribute("role") !== "status");

const getButton = () => screen.getByRole("button", { name: "Copiar comando de instalação" });
const getCode = (text: string) => screen.getByText(text, { normalizer: (s) => s });

describe("InstallCommand", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    window.getSelection()?.removeAllRanges();
  });

  it("renderiza o prefixo $ e o comando exato", () => {
    render(<InstallCommand command={COMMAND} />);
    const code = getCode(COMMAND);
    expect(code.tagName).toBe("CODE");
    expect(code.textContent).toBe(COMMAND);
    const prompt = screen.getByText("$");
    expect(prompt).toHaveAttribute("aria-hidden", "true");
    expect(prompt).toHaveClass("select-none");
  });

  it("clicar na caixa copia o comando exato e chama onCopy('copied')", async () => {
    const { user, writeText } = setup();
    const onCopy = vi.fn();
    const { container } = render(<InstallCommand command={COMMAND} onCopy={onCopy} />);
    await user.click(container.firstElementChild as HTMLElement);
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith(COMMAND);
    expect(onCopy).toHaveBeenCalledWith("copied");
  });

  it("clicar no $ ou no code copia", async () => {
    const { user, writeText } = setup();
    render(<InstallCommand command="x" />);
    await user.click(screen.getByText("$"));
    expect(writeText).toHaveBeenCalledTimes(1);
    await user.click(getCode("x"));
    expect(writeText).toHaveBeenCalledTimes(2);
  });

  it("clicar com texto selecionado no code NÃO copia", async () => {
    const { writeText } = setup();
    render(<InstallCommand command="npx foo" />);
    const code = getCode("npx foo");
    window.getSelection()?.selectAllChildren(code);
    expect(window.getSelection()?.toString()).toBe("npx foo");
    // click() direto, sem mousedown, para não colapsar a seleção (simula o fim de um arraste)
    await act(async () => {
      code.click();
    });
    expect(writeText).not.toHaveBeenCalled();
    expect(visibleLabel("Copiado!")).toHaveLength(0);
  });

  it("clicar no botão copia mesmo com texto selecionado", async () => {
    const { writeText } = setup();
    render(<InstallCommand command="npx foo" />);
    window.getSelection()?.selectAllChildren(getCode("npx foo"));
    await act(async () => {
      getButton().click();
    });
    expect(writeText).toHaveBeenCalledTimes(1);
  });

  it("chama também o onClick do usuário", async () => {
    const { user } = setup();
    const onClick = vi.fn();
    render(<InstallCommand command="x" onClick={onClick} />);
    await user.click(getButton());
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("clique no botão copia uma única vez (sem cópia dupla por bubbling)", async () => {
    const { user, writeText } = setup();
    render(<InstallCommand command="x" />);
    await user.click(getButton());
    expect(writeText).toHaveBeenCalledTimes(1);
  });

  it("mostra Copiado! e some após 2000 ms", async () => {
    const { user } = setup();
    render(<InstallCommand command="x" />);
    expect(visibleLabel("Copiado!")).toHaveLength(0);
    await user.click(getButton());
    expect(visibleLabel("Copiado!")).toHaveLength(1);
    act(() => {
      vi.advanceTimersByTime(1900);
    });
    expect(visibleLabel("Copiado!")).toHaveLength(1);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(visibleLabel("Copiado!")).toHaveLength(0);
  });

  it("segundo clique reinicia o contador", async () => {
    const { user } = setup();
    render(<InstallCommand command="x" />);
    await user.click(getButton());
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    await user.click(getButton());
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(visibleLabel("Copiado!")).toHaveLength(1);
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(visibleLabel("Copiado!")).toHaveLength(0);
  });

  it("região role=status está sempre no DOM, recebe o texto e é esvaziada", async () => {
    const { user } = setup();
    render(<InstallCommand command="x" copiedLabel="Pronto" />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveAttribute("aria-atomic", "true");
    expect(status).toHaveClass("sr-only");
    expect(status).toBeEmptyDOMElement();
    await user.click(getButton());
    expect(status).toHaveTextContent("Pronto");
    act(() => {
      vi.advanceTimersByTime(2100);
    });
    expect(status).toBeEmptyDOMElement();
  });

  it("code é focável e não tem aria-label (o nome vem do texto do comando)", () => {
    render(<InstallCommand command="npx foo" />);
    const code = getCode("npx foo");
    expect(code).toHaveAttribute("tabindex", "0");
    // aria-label aqui esconderia o comando: o aria-describedby do botão herdaria só o rótulo.
    expect(code).not.toHaveAttribute("aria-label");
  });

  it("botão tem aria-label, type=button e aria-describedby apontando para o code", () => {
    render(<InstallCommand command="npx foo" />);
    const button = getButton();
    const code = getCode("npx foo");
    expect(button).toHaveAttribute("type", "button");
    expect(code.id).not.toBe("");
    expect(button).toHaveAttribute("aria-describedby", code.id);
    expect(button).toHaveAccessibleDescription("npx foo");
  });

  it("ordem de Tab: code depois botão", async () => {
    const { user } = setup();
    render(<InstallCommand command="npx foo" />);
    await user.tab();
    expect(getCode("npx foo")).toHaveFocus();
    await user.tab();
    expect(getButton()).toHaveFocus();
  });

  it("botão copia com Enter e com Espaço, uma vez por acionamento", async () => {
    const { user, writeText } = setup();
    render(<InstallCommand command="x" />);
    await user.tab();
    await user.tab();
    expect(getButton()).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(writeText).toHaveBeenCalledTimes(1);
    await user.keyboard(" ");
    expect(writeText).toHaveBeenCalledTimes(2);
  });

  it("Enter e Espaço no code não copiam", async () => {
    const { user, writeText } = setup();
    render(<InstallCommand command="x" />);
    await user.tab();
    expect(getCode("x")).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(writeText).not.toHaveBeenCalled();
  });

  it("writeText rejeitando: seleciona o code, mostra fallbackLabel e chama onCopy('fallback')", async () => {
    const { user, writeText } = setup();
    writeText.mockRejectedValue(new Error("negado"));
    const onCopy = vi.fn();
    render(<InstallCommand command="npx foo" onCopy={onCopy} />);
    await user.click(getButton());
    expect(window.getSelection()?.toString()).toBe("npx foo");
    expect(screen.getByRole("status")).toHaveTextContent("Selecione e copie: Ctrl+C");
    expect(visibleLabel("Selecione e copie: Ctrl+C")).toHaveLength(1);
    expect(onCopy).toHaveBeenCalledWith("fallback");
    expect(onCopy).not.toHaveBeenCalledWith("copied");
  });

  it("navigator.clipboard ausente: usa o fallback sem lançar", async () => {
    const { user } = setup();
    Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
    const onCopy = vi.fn();
    render(<InstallCommand command="npx foo" fallbackLabel="Copie à mão" onCopy={onCopy} />);
    await user.click(getButton());
    expect(window.getSelection()?.toString()).toBe("npx foo");
    expect(screen.getByRole("status")).toHaveTextContent("Copie à mão");
    expect(onCopy).toHaveBeenCalledWith("fallback");
  });

  it("desmontar durante o timer não gera aviso nem erro", async () => {
    const { user } = setup();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { unmount } = render(<InstallCommand command="x" />);
    await user.click(getButton());
    unmount();
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(vi.getTimerCount()).toBe(0);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("encaminha ref e atributos de div para o root", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<InstallCommand ref={ref} command="x" data-testid="root" />);
    expect(ref.current).toBe(screen.getByTestId("root"));
    expect(ref.current?.tagName).toBe("DIV");
  });

  it("comando longo: sem quebra de linha e com rolagem horizontal", () => {
    render(<InstallCommand command={"npx ".repeat(80)} />);
    const code = screen.getByText(/npx/);
    expect(code).toHaveClass("whitespace-nowrap", "overflow-x-auto", "min-w-0", "font-mono");
  });

  it("usa tokens semânticos e foco visível no code e no botão", () => {
    const { container } = render(<InstallCommand command="x" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass("bg-surface-raised", "border", "border-border", "text-foreground", "cursor-pointer");
    for (const el of [getCode("x"), getButton()]) {
      expect(el).toHaveClass("focus-visible:ring-2", "focus-visible:ring-ring");
    }
    expect(root.outerHTML).not.toMatch(/#[0-9a-fA-F]{3,8}/);
  });
});
