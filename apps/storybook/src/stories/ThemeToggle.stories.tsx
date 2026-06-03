import type { Meta, StoryObj } from "@storybook/react";
import { ThemeToggle } from "@nico.dev/ui";

const meta = {
  title: "Navigation/ThemeToggle",
  component: ThemeToggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InContext: Story = {
  render: () => (
    <div className="flex items-center gap-2 bg-background border border-border px-3 py-2 rounded-lg">
      <span className="text-sm text-muted-foreground">Tema:</span>
      <ThemeToggle />
    </div>
  ),
};
