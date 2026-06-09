"use client";

import { useTranslations, useLocale } from "next-intl";

const TOOLS_BASE = process.env.NEXT_PUBLIC_TOOLS_URL ?? "https://tools.nico.dev.br";

const TOOLS = [
  { slug: "pomodoro", name: "Pomodoro" },
  { slug: "juros-compostos", name: "Juros Compostos" },
  { slug: "clt-pj", name: "CLT vs PJ" },
  { slug: "conversor-moedas", name: "Conversor de Moedas" },
  { slug: "leitor-documentos", name: "Leitor de Documentos" },
  { slug: "mercado", name: "Mercado Financeiro" },
  { slug: "debug-code", name: "Debug Code" },
  { slug: "analisador-texto", name: "Analisador de Texto" },
  { slug: "gerador-paleta", name: "Paleta de Cores" },
] as const;

const linkClass =
  "text-primary hover:text-primary transition-colors opacity-80 hover:opacity-100";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: "/#about", label: tNav("about") },
    { href: "/#skills", label: tNav("skills") },
    { href: "/#projects", label: tNav("projects") },
    { href: "/#contact", label: tNav("contact") },
    { href: `/${locale}/curriculo`, label: tNav("resume") },
    {
      href: process.env.NEXT_PUBLIC_BLOG_URL ?? "https://blog.nico.dev.br/",
      label: tNav("blog"),
      external: true,
    },
  ];

  return (
    <footer
      className="bg-surface-container-low w-full pt-12 pb-8 px-6 md:px-8"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto font-body text-sm tracking-wide">
        {/* Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10 pb-10 border-b border-primary/20">
          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
              {t("sectionNav")}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={linkClass}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools — spans 2 columns */}
          <div className="sm:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
              {t("sectionTools")}
            </h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {TOOLS.map((tool) => (
                <li key={tool.slug}>
                  <a
                    href={`${TOOLS_BASE}/${tool.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {tool.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="https://metronomo.nico.dev.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Metrônomo
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
              {t("sectionSocial")}
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href="https://github.com/robertourias"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/robertourias/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 text-center text-primary opacity-70">
          {t("rights", { year: currentYear })}
        </div>
      </div>
    </footer>
  );
}
