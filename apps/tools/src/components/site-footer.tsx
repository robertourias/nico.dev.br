"use client";

const TOOLS_BASE = "";

const UTILIDADES = [
  { slug: "pomodoro", name: "Pomodoro" },
  { slug: "juros-compostos", name: "Juros Compostos" },
  { slug: "clt-pj", name: "CLT vs PJ" },
  { slug: "conversor-moedas", name: "Conversor de Moedas" },
  { slug: "leitor-documentos", name: "Leitor de Documentos" },
  { slug: "mercado", name: "Mercado Financeiro" },
] as const;

const FERRAMENTAS_DEV = [
  { slug: "debug-code", name: "Debug Code" },
  { slug: "analisador-texto", name: "Analisador de Texto" },
  { slug: "gerador-paleta", name: "Paleta de Cores" },
] as const;

const SITES = {
  portfolio: process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? "https://nico.dev.br",
  blog: process.env.NEXT_PUBLIC_BLOG_URL ?? "https://blog.nico.dev.br",
  challenges:
    process.env.NEXT_PUBLIC_CHALLENGES_URL ?? "https://challenges.nico.dev.br",
};

const linkClass =
  "text-muted-foreground hover:text-foreground transition-colors opacity-80 hover:opacity-100 text-sm";

const headingClass =
  "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto border-t border-border bg-surface px-6 md:px-8 pt-12 pb-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 pb-10 border-b border-border">
          {/* Utilidades */}
          <div>
            <h3 className={headingClass}>Utilidades</h3>
            <ul className="flex flex-col gap-2.5">
              {UTILIDADES.map((tool) => (
                <li key={tool.slug}>
                  <a href={`${TOOLS_BASE}/${tool.slug}`} className={linkClass}>
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

          {/* Ferramentas para devs */}
          <div>
            <h3 className={headingClass}>Para devs</h3>
            <ul className="flex flex-col gap-2.5">
              {FERRAMENTAS_DEV.map((tool) => (
                <li key={tool.slug}>
                  <a href={`${TOOLS_BASE}/${tool.slug}`} className={linkClass}>
                    {tool.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Pomodoro placeholder to keep grid balance on mobile */}
          <div className="hidden sm:block" />

          {/* Links externos */}
          <div>
            <h3 className={headingClass}>Outros sites</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href={SITES.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Portfólio
                </a>
              </li>
              <li>
                <a
                  href={SITES.blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href={SITES.challenges}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Challenges
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 text-center text-xs text-muted-foreground opacity-70">
          © {year} Roberto Nicoletti · tools.nico.dev.br
        </div>
      </div>
    </footer>
  );
}
