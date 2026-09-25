import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InstallCommandTabs, type InstallCommandTab } from "./install-command-tabs";

const KEY = "nico:install-tab";
const TABS: InstallCommandTab[] = [
  { id: "repository", label: "Repositório", command: "npx skills add robertourias/skills" },
  { id: "skill", label: "Esta skill", command: "npx skills add robertourias/skills --skill x" },
  { id: "manual", label: "Manual", command: "cp -r skills/x ~/.claude/skills/x " },
];

describe("InstallCommandTabs", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  const command = (text: string) => screen.getByText(text, { normalizer: (s) => s });

  it("renderiza 3 abas e o comando da aba padrão", () => {
    render(<InstallCommandTabs tabs={TABS} />);
    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(screen.getByRole("tab", { name: "Repositório" })).toHaveAttribute("aria-selected", "true");
    expect(command(TABS[0].command).tagName).toBe("CODE");
    expect(screen.queryByText(TABS[1].command)).toBeNull();
  });

  it("respeita defaultTabId e cai na primeira aba se for inválido", () => {
    const { unmount } = render(<InstallCommandTabs tabs={TABS} defaultTabId="manual" />);
    expect(screen.getByRole("tab", { name: "Manual" })).toHaveAttribute("aria-selected", "true");
    unmount();
    render(<InstallCommandTabs tabs={TABS} defaultTabId="nope" />);
    expect(screen.getByRole("tab", { name: "Repositório" })).toHaveAttribute("aria-selected", "true");
  });

  it("trocar de aba mostra o comando certo e grava em localStorage", async () => {
    const user = userEvent.setup();
    render(<InstallCommandTabs tabs={TABS} />);
    await user.click(screen.getByRole("tab", { name: "Manual" }));
    expect(command(TABS[2].command)).toBeInTheDocument();
    expect(screen.queryByText(TABS[0].command)).toBeNull();
    expect(window.localStorage.getItem(KEY)).toBe("manual");
  });

  it("remontar reaplica a aba salva", async () => {
    const user = userEvent.setup();
    const first = render(<InstallCommandTabs tabs={TABS} />);
    await user.click(screen.getByRole("tab", { name: "Esta skill" }));
    first.unmount();
    render(<InstallCommandTabs tabs={TABS} />);
    expect(screen.getByRole("tab", { name: "Esta skill" })).toHaveAttribute("aria-selected", "true");
  });

  it("valor salvo inexistente usa defaultTabId e não sobrescreve o salvo", () => {
    window.localStorage.setItem(KEY, "ghost");
    render(<InstallCommandTabs tabs={TABS} defaultTabId="skill" />);
    expect(screen.getByRole("tab", { name: "Esta skill" })).toHaveAttribute("aria-selected", "true");
    expect(window.localStorage.getItem(KEY)).toBe("ghost");
  });

  it("nada é escrito no storage ao montar", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    render(<InstallCommandTabs tabs={TABS} />);
    render(<InstallCommandTabs tabs={[TABS[0]]} />);
    expect(setItem).not.toHaveBeenCalled();
  });

  it("com uma única aba não renderiza a lista de abas", () => {
    render(<InstallCommandTabs tabs={[TABS[0]]} />);
    expect(screen.queryByRole("tablist")).toBeNull();
    expect(screen.queryByRole("tab")).toBeNull();
    expect(command(TABS[0].command)).toBeInTheDocument();
    expect(screen.getByText(/DISABLE_TELEMETRY=1/)).toBeInTheDocument();
  });

  it("exibe a nota de telemetria padrão com DISABLE_TELEMETRY=1 em <code>", () => {
    render(<InstallCommandTabs tabs={TABS} />);
    const code = screen.getByText("DISABLE_TELEMETRY=1");
    expect(code.tagName).toBe("CODE");
    expect(code.parentElement?.textContent).toBe(
      "Para não enviar telemetria anônima, prefixe o comando com DISABLE_TELEMETRY=1."
    );
  });

  it("note={false} remove a nota", () => {
    render(<InstallCommandTabs tabs={TABS} note={false} />);
    expect(screen.queryByText("DISABLE_TELEMETRY=1")).toBeNull();
  });

  it("note customizada substitui a padrão", () => {
    render(<InstallCommandTabs tabs={TABS} note={<span>Nota própria</span>} />);
    expect(screen.getByText("Nota própria")).toBeInTheDocument();
    expect(screen.queryByText("DISABLE_TELEMETRY=1")).toBeNull();
  });

  it("a nota fica depois do comando e não altera nem concatena o comando", () => {
    render(<InstallCommandTabs tabs={TABS} />);
    const code = command(TABS[0].command);
    expect(code.textContent).toBe(TABS[0].command);
    const note = screen.getByText("DISABLE_TELEMETRY=1").parentElement as HTMLElement;
    expect(code.compareDocumentPosition(note) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(note.contains(code)).toBe(false);
  });

  it("duas instâncias com a mesma chave trocam juntas", async () => {
    const user = userEvent.setup();
    render(
      <>
        <div data-testid="a">
          <InstallCommandTabs tabs={TABS} />
        </div>
        <div data-testid="b">
          <InstallCommandTabs tabs={TABS} />
        </div>
      </>
    );
    const tabsOfB = screen.getAllByRole("tab", { name: "Manual" })[1];
    await user.click(tabsOfB);
    for (const tab of screen.getAllByRole("tab", { name: "Manual" })) {
      expect(tab).toHaveAttribute("aria-selected", "true");
    }
  });

  it("setas do teclado movem foco e aba ativa", async () => {
    const user = userEvent.setup();
    render(<InstallCommandTabs tabs={TABS} />);
    const first = screen.getByRole("tab", { name: "Repositório" });
    await act(async () => first.focus());
    await user.keyboard("{ArrowRight}");
    const second = screen.getByRole("tab", { name: "Esta skill" });
    expect(second).toHaveFocus();
    expect(second).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{ArrowLeft}");
    expect(first).toHaveFocus();
    expect(first).toHaveAttribute("aria-selected", "true");
  });

  it("storageKey customizada isola do padrão", async () => {
    const user = userEvent.setup();
    render(
      <>
        <InstallCommandTabs tabs={TABS} storageKey="custom:tab" />
        <InstallCommandTabs tabs={TABS} />
      </>
    );
    await user.click(screen.getAllByRole("tab", { name: "Manual" })[0]);
    expect(window.localStorage.getItem("custom:tab")).toBe("manual");
    expect(window.localStorage.getItem(KEY)).toBeNull();
    expect(screen.getAllByRole("tab", { name: "Manual" })[0]).toHaveAttribute("aria-selected", "true");
    expect(screen.getAllByRole("tab", { name: "Manual" })[1]).toHaveAttribute("aria-selected", "false");
  });
});
