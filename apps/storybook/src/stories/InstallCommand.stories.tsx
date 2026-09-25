import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { InstallCommand, InstallCommandTabs } from "@nico.dev/ui";

const REPO_COMMAND = "npx skills add robertourias/skills";
const SKILL_COMMAND = "npx skills add robertourias/skills --skill code-review";
const MANUAL_COMMAND = "git clone https://github.com/robertourias/skills.git ~/.claude/skills";
const LONG_COMMAND =
  "npx skills add robertourias/skills --skill code-review --skill frontend-design --skill turborepo --agent claude-code --global --yes";

/**
 * Substitui `navigator.clipboard` durante a story para o resultado ser
 * determinístico, independente de contexto seguro ou permissão do navegador.
 * Devolve a função que restaura o valor original.
 */
function stubClipboard(value: Partial<Clipboard> | undefined): () => void {
  const original = Object.getOwnPropertyDescriptor(navigator, "clipboard");
  Object.defineProperty(navigator, "clipboard", { configurable: true, value });
  return () => {
    if (original) Object.defineProperty(navigator, "clipboard", original);
    else delete (navigator as { clipboard?: unknown }).clipboard;
  };
}

const meta = {
  title: "UI/InstallCommand",
  component: InstallCommand,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: { command: REPO_COMMAND },
} satisfies Meta<typeof InstallCommand>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="max-w-xl">
      <InstallCommand {...args} />
    </div>
  ),
};

/** Comando maior que a caixa: não quebra linha e rola na horizontal dentro do `<code>`. */
export const LongCommand: Story = {
  args: { command: LONG_COMMAND },
  render: (args) => (
    <div className="w-80 max-w-full">
      <InstallCommand {...args} />
    </div>
  ),
};

/**
 * Clica no botão com `navigator.clipboard` simulado (sucesso) e confirma
 * "Copiado!". O rótulo some sozinho após 2 s.
 */
export const Copied: Story = {
  render: (args) => (
    <div className="max-w-xl">
      <InstallCommand {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const restore = stubClipboard({ writeText: () => Promise.resolve() });
    try {
      const canvas = within(canvasElement);
      canvas.getByRole("button", { name: "Copiar comando de instalação" }).click();
      await expect(await canvas.findByText("Copiado!", { selector: "span[aria-hidden]" })).toBeVisible();
    } finally {
      restore();
    }
  },
};

/**
 * Clipboard indisponível (contexto inseguro): o texto do comando é selecionado
 * e aparece "Selecione e copie: Ctrl+C".
 */
export const ClipboardFallback: Story = {
  render: (args) => (
    <div className="max-w-xl">
      <InstallCommand {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const restore = stubClipboard(undefined);
    try {
      const canvas = within(canvasElement);
      canvas.getByRole("button", { name: "Copiar comando de instalação" }).click();
      await expect(
        await canvas.findByText("Selecione e copie: Ctrl+C", { selector: "span[aria-hidden]" })
      ).toBeVisible();
    } finally {
      restore();
    }
  },
};

/** `writeText` rejeitando (permissão negada): mesmo fallback de seleção. */
export const ClipboardRejected: Story = {
  render: (args) => (
    <div className="max-w-xl">
      <InstallCommand {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const restore = stubClipboard({ writeText: () => Promise.reject(new Error("NotAllowedError")) });
    try {
      const canvas = within(canvasElement);
      canvas.getByRole("button", { name: "Copiar comando de instalação" }).click();
      await expect(
        await canvas.findByText("Selecione e copie: Ctrl+C", { selector: "span[aria-hidden]" })
      ).toBeVisible();
    } finally {
      restore();
    }
  },
};

/** Três abas. A aba escolhida é persistida em `localStorage` (chave própria desta story). */
export const TabsThree: StoryObj<typeof InstallCommandTabs> = {
  name: "Tabs / 3 abas",
  render: () => (
    <div className="max-w-xl">
      <InstallCommandTabs
        storageKey="storybook:install-tab:three"
        defaultTabId="skill"
        tabs={[
          { id: "skill", label: "Esta skill", command: SKILL_COMMAND },
          { id: "repository", label: "Repositório", command: REPO_COMMAND },
          { id: "manual", label: "Manual", command: MANUAL_COMMAND },
        ]}
      />
    </div>
  ),
};

/** Uma aba só: a lista de abas não é renderizada (hero da home, páginas de pack). */
export const TabsSingle: StoryObj<typeof InstallCommandTabs> = {
  name: "Tabs / 1 aba",
  render: () => (
    <div className="max-w-xl">
      <InstallCommandTabs
        storageKey="storybook:install-tab:single"
        tabs={[{ id: "repository", label: "Repositório", command: REPO_COMMAND }]}
      />
    </div>
  ),
};

/** `note={false}` remove a nota de telemetria. */
export const TabsWithoutNote: StoryObj<typeof InstallCommandTabs> = {
  name: "Tabs / sem nota",
  render: () => (
    <div className="max-w-xl">
      <InstallCommandTabs
        storageKey="storybook:install-tab:no-note"
        note={false}
        variant="underline"
        tabs={[
          { id: "repository", label: "Repositório", command: REPO_COMMAND },
          { id: "manual", label: "Manual", command: MANUAL_COMMAND },
        ]}
      />
    </div>
  ),
};
