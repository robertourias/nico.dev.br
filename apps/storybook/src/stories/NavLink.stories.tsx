import type { Meta, StoryObj } from "@storybook/react";
import { NavLink } from "@nico.dev/ui";

const meta = {
  title: "Navigation/NavLink",
  component: NavLink,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    active: { control: "boolean" },
    external: { control: "boolean" },
  },
} satisfies Meta<typeof NavLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: "#",
    children: "Link",
  },
};

export const Active: Story = {
  args: {
    href: "#",
    children: "Ativo",
    active: true,
  },
};

export const External: Story = {
  args: {
    href: "https://nico.dev.br",
    children: "nico.dev.br",
    external: true,
  },
};

export const AllStates: StoryObj = {
  render: () => (
    <div className="flex items-center gap-1 bg-background p-3 rounded-lg border border-border">
      <NavLink href="#">Padrão</NavLink>
      <NavLink href="#" active>Ativo</NavLink>
      <NavLink href="https://nico.dev.br" external>Externo ↗</NavLink>
    </div>
  ),
};
