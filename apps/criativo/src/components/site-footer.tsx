"use client";

const SITES = {
  portfolio: process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? "https://nico.dev.br",
  tools: process.env.NEXT_PUBLIC_TOOLS_URL ?? "https://tools.nico.dev.br",
  blog: process.env.NEXT_PUBLIC_BLOG_URL ?? "https://blog.nico.dev.br",
  challenges: process.env.NEXT_PUBLIC_CHALLENGES_URL ?? "https://challenges.nico.dev.br",
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 pb-10 border-b border-border">
          <div>
            <h3 className={headingClass}>Criativo</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a href="/" className={linkClass}>Todas as páginas</a>
              </li>
              <li>
                <a href="/landing-newsletter-premium" className={linkClass}>
                  Newsletter Premium
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={headingClass}>Outros sites</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a href={SITES.portfolio} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Portfólio
                </a>
              </li>
              <li>
                <a href={SITES.tools} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Tools
                </a>
              </li>
              <li>
                <a href={SITES.blog} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Blog
                </a>
              </li>
              <li>
                <a href={SITES.challenges} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Challenges
                </a>
              </li>
            </ul>
          </div>

          <div className="hidden sm:block" />
        </div>

        <div className="pt-8 text-center text-xs text-muted-foreground opacity-70">
          © {year} Roberto Nicoletti · criativo.nico.dev.br
        </div>
      </div>
    </footer>
  );
}
