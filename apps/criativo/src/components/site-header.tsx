"use client";

import { Header, ThemeToggle, NavLink } from "@nico.dev/ui";

const SITES = {
  portfolio: {
    url: process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? "https://nico.dev.br",
    label: process.env.NEXT_PUBLIC_PORTFOLIO_LABEL ?? "Portfólio",
  },
  tools: {
    url: process.env.NEXT_PUBLIC_TOOLS_URL ?? "https://tools.nico.dev.br",
    label: process.env.NEXT_PUBLIC_TOOLS_LABEL ?? "Tools",
  },
  blog: {
    url: process.env.NEXT_PUBLIC_BLOG_URL ?? "https://blog.nico.dev.br",
    label: process.env.NEXT_PUBLIC_BLOG_LABEL ?? "Blog",
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

      <Header.Logo href="/" label="Criativo" icon="/logo-criativo.png" />

      <Header.Nav>
        <NavLink href={SITES.portfolio.url} external>{SITES.portfolio.label}</NavLink>
        <NavLink href={SITES.tools.url} external>{SITES.tools.label}</NavLink>
        <NavLink href={SITES.blog.url} external>{SITES.blog.label}</NavLink>
      </Header.Nav>

      <Header.Actions>
        <ThemeToggle />
      </Header.Actions>
    </Header>
  );
}
