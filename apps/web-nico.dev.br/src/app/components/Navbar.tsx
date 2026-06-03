"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { useTheme } from "./ThemeProvider";
import LocaleSwitcher from "./LocaleSwitcher";

export default function Navbar() {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = theme === "dark";
  const pathname = usePathname(); // pathname sem prefixo de locale (ex: "/curriculo")
  const locale = useLocale();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useTranslations("nav");

  const isHome = pathname === "/" || pathname === "";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#hero", label: t("home") },
    { href: "#about", label: t("about") },
    { href: "#skills", label: t("skills") },
    { href: "#projects", label: t("projects") },
    { href: "#contact", label: t("contact") },
    { href: `/${locale}/curriculo`, label: t("resume") },
    { href: "https://blog.nico.dev.br/", label: t("blog"), external: true },
  ];

  // Âncoras fora da home precisam voltar para /{locale}/#section
  const getHref = (href: string) => {
    if (!href.startsWith("#")) return href;
    if (isHome) return href;
    return `/${locale}/${href}`; // ex: /en/#hero
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMobileMenuOpen(false);
    if (!href.startsWith("#")) return;
    if (!isHome) return; // deixa navegação nativa para /{locale}/#section
    e.preventDefault();
    const element = document.getElementById(href.slice(1));
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 font-display tracking-tight ${isScrolled ? "bg-surface/70 backdrop-blur-xl py-4" : "bg-transparent py-6"}`}
      role="navigation"
      aria-label={t("ariaLabel")}
    >
      <div className="flex justify-between items-center px-6 md:px-8 max-w-7xl mx-auto">
        <a
          href={`/${locale}/`}
          className="text-xl font-bold tracking-tighter text-on-surface hover:text-primary transition-colors"
          aria-label={t("ariaHome")}
        >
          Roberto Nicoletti
        </a>

        <div className="hidden md:flex flex-1 justify-center items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={getHref(link.href)}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-on-surface-variant hover:text-on-surface transition-colors text-sm"
              {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <LocaleSwitcher />

          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 text-on-surface hover:bg-surface-container-high transition-all duration-300 rounded-lg cursor-pointer"
              aria-label={t("ariaTheme")}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          )}

          <button
            className="md:hidden p-2 text-on-surface"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={t("ariaMobileOpen")}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-surface-container-highest backdrop-blur-xl py-4 px-6" role="menu" aria-label={t("ariaMobileMenu")}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={getHref(link.href)}
              className="block py-3 text-on-surface-variant hover:text-on-surface transition-colors"
              onClick={(e) => handleNavClick(e, link.href)}
              role="menuitem"
              {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-outline-variant/20 mt-2">
            <LocaleSwitcher />
          </div>
        </div>
      )}
    </nav>
  );
}
