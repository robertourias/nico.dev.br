import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { CopyButton } from "@nico.dev/ui";

const SKILL_COMMAND = "npx skills add robertourias/skills --skill code-review";

/**
 * Substitui `navigator.clipboard` durante a story para o resultado ser
 * determinístico. Devolve a função que restaura o valor original.
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
  title: "UI/CopyButton",
  component: CopyButton,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: { value: SKILL_COMMAND },
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Clica com `navigator.clipboard` simulado (sucesso) e confirma o anúncio "Copiado!". */
export const Copied: Story = {
  play: async ({ canvasElement }) => {
    const restore = stubClipboard({ writeText: () => Promise.resolve() });
    try {
      const canvas = within(canvasElement);
      canvas.getByRole("button", { name: "Copiar comando de instalação" }).click();
      await expect(await canvas.findByText("Copiado!")).toBeInTheDocument();
    } finally {
      restore();
    }
  },
};

/** Clipboard indisponível: falha silenciosa, sem erro e sem anúncio de "Copiado!". */
export const Fallback: Story = {
  play: async ({ canvasElement }) => {
    const restore = stubClipboard(undefined);
    try {
      const canvas = within(canvasElement);
      canvas.getByRole("button", { name: "Copiar comando de instalação" }).click();
      await new Promise((resolve) => setTimeout(resolve, 100));
      await expect(canvas.getByRole("status")).toBeEmptyDOMElement();
    } finally {
      restore();
    }
  },
};
