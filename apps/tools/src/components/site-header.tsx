"use client";

import { usePathname } from "next/navigation";
import { Header, ThemeToggle, NavLink } from "@nico.dev/ui";

const SITES = {
  portfolio: {
    url: process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? 'https://nico.dev.br',
    label: process.env.NEXT_PUBLIC_PORTFOLIO_LABEL ?? 'Portfólio',
  },
  challenges: {
    url: process.env.NEXT_PUBLIC_CHALLENGES_URL ?? 'https://challenges.nico.dev.br',
    label: process.env.NEXT_PUBLIC_CHALLENGES_LABEL ?? 'Challenges',
  },
  blog: {
    url: process.env.NEXT_PUBLIC_BLOG_URL ?? 'https://blog.nico.dev.br',
    label: process.env.NEXT_PUBLIC_BLOG_LABEL ?? 'Blog',
  },
};

export function SiteHeader() {
  const pathname = usePathname();
  const isPomodoro = pathname?.startsWith("/pomodoro");

  return (
    <Header>
      <Header.Menu>
        <NavLink href={SITES.portfolio.url} external>{SITES.portfolio.label}</NavLink>
        <NavLink href={SITES.challenges.url} external>{SITES.challenges.label}</NavLink>
      </Header.Menu>

      {isPomodoro ? (
        <Header.Logo href="/pomodoro" label="Pomodoro" icon="/pomodoro-logo.svg" iconClassName="h-10 w-auto" />
      ) : (
        <Header.Logo href="/" label="Tools">
          Tools
        </Header.Logo>
      )}

      <Header.Nav>
        <NavLink href={SITES.portfolio.url} external>{SITES.portfolio.label}</NavLink>
        <NavLink href={SITES.challenges.url} external>{SITES.challenges.label}</NavLink>
        <NavLink href={SITES.blog.url} external>{SITES.blog.label}</NavLink>
      </Header.Nav>

      <Header.Actions>
        <ThemeToggle />
      </Header.Actions>
    </Header>
  );
}
