import Link from "next/link"
import { Terminal, Github, Linkedin, Twitter } from "lucide-react"

// Rodapé com mapa de seções (âncoras desta landing) e exemplos de URLs de
// SEO programático citadas no briefing — meramente ilustrativas, sem rotas
// reais nesta página de showcase.
const SITEMAP_COLUMNS = [
  {
    title: "Produto",
    links: [
      { label: "Busca de vagas", href: "#vagas" },
      { label: "Salários", href: "#salarios" },
      { label: "Roadmaps", href: "#roadmaps" },
      { label: "Assistente de IA", href: "#assistente" },
    ],
  },
  {
    title: "Carreiras",
    links: [
      { label: "/carreiras/frontend", href: "#comparador" },
      { label: "/carreiras/devops", href: "#comparador" },
      { label: "/roadmap/backend", href: "#roadmaps" },
      { label: "/trilhas/cloud", href: "#roadmaps" },
    ],
  },
  {
    title: "Empresas",
    links: [
      { label: "/empresas/nimbus-tech", href: "#empresas" },
      { label: "/empresas/orbita-cloud", href: "#empresas" },
      { label: "Anunciar vaga", href: "#planos" },
    ],
  },
]

export function DevpathFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative px-6 pt-16 pb-10 border-t border-[var(--devpath-border)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="#top" className="flex items-center gap-2 font-bold text-[var(--devpath-fg)] mb-4">
              <span
                className="inline-flex items-center justify-center size-8 rounded-lg shrink-0 text-[#04140e]"
                style={{ backgroundImage: "var(--devpath-gradient-primary)" }}
                aria-hidden="true"
              >
                <Terminal className="size-4.5" />
              </span>
              <span className="devpath-mono text-base">
                dev<span className="devpath-gradient-text">path</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--devpath-fg-muted)] max-w-xs">
              Seu centro de carreira em tecnologia: vagas, salários, roadmaps e evolução profissional em um só lugar.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <SocialIcon icon={<Github className="size-4" aria-hidden="true" />} label="GitHub" />
              <SocialIcon icon={<Linkedin className="size-4" aria-hidden="true" />} label="LinkedIn" />
              <SocialIcon icon={<Twitter className="size-4" aria-hidden="true" />} label="X (Twitter)" />
            </div>
          </div>

          {SITEMAP_COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-semibold text-[var(--devpath-fg)] mb-4">{column.title}</p>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="devpath-mono text-xs text-[var(--devpath-fg-muted)] hover:text-[var(--devpath-green)] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--devpath-border)] text-xs text-[var(--devpath-fg-faint)]">
          <p>© {year} DevPath. Página de demonstração — Roberto Nicoletti.</p>
          <Link href="/" className="hover:text-[var(--devpath-green)] transition-colors">
            ← Voltar para criativo.nico.dev
          </Link>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="inline-flex items-center justify-center size-8 rounded-lg border border-[var(--devpath-border)] text-[var(--devpath-fg-muted)] hover:text-[var(--devpath-green)] hover:border-[var(--devpath-green)]/40 transition-colors"
    >
      {icon}
    </a>
  )
}
