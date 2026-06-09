"use client";

import { useTranslations, useLocale } from "next-intl";
import { Header, NavLink, ThemeToggle } from "@nico.dev/ui";
import LocaleSwitcher from "./LocaleSwitcher";

export function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale();

  const navLinks = [
    { href: "/#about", label: t("about"), external: false },
    { href: "/#skills", label: t("skills"), external: false },
    { href: "/#projects", label: t("projects"), external: false },
    { href: "/#contact", label: t("contact"), external: false },
    { href: `/${locale}/curriculo`, label: t("resume"), external: false },
    { href: process.env.NEXT_PUBLIC_BLOG_URL ?? "https://blog.nico.dev.br/", label: t("blog"), external: true },
  ];

  return (
    <Header scrollAware>
      <Header.Logo href={`/${locale}/`} label="Roberto Nicoletti" />
      <Header.Nav className="mr-0">
        {navLinks.map((link) => (
          <NavLink key={link.href} href={link.href} external={link.external}>
            {link.label}
          </NavLink>
        ))}
      </Header.Nav>
      <Header.Actions>
        <LocaleSwitcher />
        <ThemeToggle />
      </Header.Actions>
      <Header.Menu side="right">
        {navLinks.map((link) => (
          <NavLink key={link.href} href={link.href} external={link.external}>
            {link.label}
          </NavLink>
        ))}
      </Header.Menu>
    </Header>
  );
}
