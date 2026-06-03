"use client";

import { Github, Linkedin } from "lucide-react";
import { Header, ThemeToggle, NavLink } from "@nico.dev/ui";

const SOCIAL = {
  github: 'https://github.com/robertourias',
  linkedin: 'https://linkedin.com/in/robertourias',
};

const SITES = {
  portfolio: {
    url: process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? 'https://nico.dev.br',
    label: process.env.NEXT_PUBLIC_PORTFOLIO_LABEL ?? 'Portfólio',
  },
  tools: {
    url: process.env.NEXT_PUBLIC_TOOLS_URL ?? 'https://tools.nico.dev.br',
    label: process.env.NEXT_PUBLIC_TOOLS_LABEL ?? 'Tools',
  },
  blog: {
    url: process.env.NEXT_PUBLIC_BLOG_URL ?? 'https://blog.nico.dev.br',
    label: process.env.NEXT_PUBLIC_BLOG_LABEL ?? 'Blog',
  },
};

export function SiteHeader() {
  return (
    <Header scrollAware>
      <Header.Menu>
        <NavLink href={SITES.portfolio.url} external>{SITES.portfolio.label}</NavLink>
        <NavLink href={SITES.tools.url} external>{SITES.tools.label}</NavLink>
        <NavLink href={SITES.blog.url} external>{SITES.blog.label}</NavLink>
      </Header.Menu>

      <Header.Logo href="/" label="Challenges" />

      <Header.Nav>
        <NavLink href={SITES.portfolio.url} external>{SITES.portfolio.label}</NavLink>
        <NavLink href={SITES.tools.url} external>{SITES.tools.label}</NavLink>
        <NavLink href={SITES.blog.url} external>{SITES.blog.label}</NavLink>
      </Header.Nav>

      <Header.Actions>
        <a
          href={SOCIAL.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Github size={18} />
        </a>
        <a
          href={SOCIAL.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Linkedin size={18} />
        </a>
        <div className="w-px h-4 mx-1 bg-border shrink-0" />
        <ThemeToggle />
      </Header.Actions>
    </Header>
  );
}
