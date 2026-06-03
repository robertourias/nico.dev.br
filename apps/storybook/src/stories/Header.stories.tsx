import type { Meta, StoryObj } from "@storybook/react";
import { Github, Linkedin, Twitter } from "lucide-react";
import { Header, NavLink, ThemeToggle } from "@nico.dev/ui";

// Compound components don't play well with Storybook's generic type inference
// because `children` is required. Use untyped Meta/StoryObj instead.
const meta: Meta = {
  title: "Navigation/Header",
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

// Cancela o p-6 do decorator global para mostrar o header edge-to-edge
const FullBleed = ({ children }: { children: React.ReactNode }) => (
  <div className="-m-6">{children}</div>
);

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Minimal: Story = {
  render: () => (
    <FullBleed>
      <Header>
        <Header.Logo href="/" label="tools.nico.dev" />
        <Header.Actions>
          <ThemeToggle />
        </Header.Actions>
      </Header>
    </FullBleed>
  ),
};

export const WithNav: Story = {
  name: "Com navegação",
  render: () => (
    <FullBleed>
      <Header>
        <Header.Logo href="/" label="nico.dev.br" />
        <Header.Nav>
          <NavLink href="#sobre">Sobre</NavLink>
          <NavLink href="#projetos" active>Projetos</NavLink>
          <NavLink href="https://blog.nico.dev.br" external>Blog</NavLink>
        </Header.Nav>
        <Header.Actions>
          <ThemeToggle />
        </Header.Actions>
      </Header>
    </FullBleed>
  ),
};

export const WithMenu: Story = {
  name: "Com menu mobile",
  parameters: {
    viewport: { defaultViewport: "mobile375" },
  },
  render: () => (
    <FullBleed>
      <Header>
        <Header.Menu>
          <NavLink href="#sobre">Sobre</NavLink>
          <NavLink href="#projetos">Projetos</NavLink>
          <NavLink href="https://blog.nico.dev.br" external>Blog</NavLink>
        </Header.Menu>
        <Header.Logo href="/" label="nico.dev.br" />
        <Header.Nav>
          <NavLink href="#sobre">Sobre</NavLink>
          <NavLink href="#projetos">Projetos</NavLink>
          <NavLink href="https://blog.nico.dev.br" external>Blog</NavLink>
        </Header.Nav>
        <Header.Actions>
          <ThemeToggle />
        </Header.Actions>
      </Header>
    </FullBleed>
  ),
};

export const WithSocialLinks: Story = {
  name: "Com social links (estilo blog)",
  render: () => (
    <FullBleed>
      <Header>
        <Header.Menu>
          <NavLink href="https://nico.dev.br" external>nico.dev.br</NavLink>
          <NavLink href="https://tools.nico.dev.br" external>tools</NavLink>
        </Header.Menu>
        <Header.Logo href="/" label="blog.nico.dev.br" />
        <Header.Nav>
          <NavLink href="https://nico.dev.br" external>nico.dev.br</NavLink>
          <NavLink href="https://tools.nico.dev.br" external>tools</NavLink>
        </Header.Nav>
        <Header.Actions>
          <a
            href="https://github.com/rnicoletti"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Github size={18} />
          </a>
          <a
            href="https://linkedin.com/in/rnicoletti"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="https://twitter.com/rnicoletti"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Twitter size={18} />
          </a>
          <div className="w-px h-4 mx-1 bg-border shrink-0" />
          <ThemeToggle />
        </Header.Actions>
      </Header>
    </FullBleed>
  ),
};

export const ScrollAware: Story = {
  name: "Scroll-aware (fixo + transparente)",
  render: () => (
    <FullBleed>
      <Header scrollAware>
        <Header.Logo href="/" label="Roberto Nicoletti" />
        <Header.Nav>
          <NavLink href="#sobre">Sobre</NavLink>
          <NavLink href="#projetos">Projetos</NavLink>
          <NavLink href="#contato">Contato</NavLink>
          <NavLink href="https://blog.nico.dev.br" external>Blog</NavLink>
        </Header.Nav>
        <Header.Actions>
          <ThemeToggle />
        </Header.Actions>
        <Header.Menu>
          <NavLink href="#sobre">Sobre</NavLink>
          <NavLink href="#projetos">Projetos</NavLink>
          <NavLink href="#contato">Contato</NavLink>
          <NavLink href="https://blog.nico.dev.br" external>Blog</NavLink>
        </Header.Menu>
      </Header>
      <div className="h-[200vh] bg-gradient-to-b from-background to-muted flex items-start justify-center pt-24">
        <p className="text-muted-foreground text-sm">← Role para ver o header mudar</p>
      </div>
    </FullBleed>
  ),
};
