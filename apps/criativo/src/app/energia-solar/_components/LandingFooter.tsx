import Link from "next/link"
import { Sun, Instagram, Linkedin, Facebook, ShieldCheck, Award } from "lucide-react"

const AREAS = ["Sudeste", "Sul", "Nordeste", "Centro-Oeste", "Norte"]

const QUICK_LINKS = [
  { href: "#simulador", label: "Simulador" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#projetos", label: "Projetos" },
  { href: "#faq", label: "Perguntas frequentes" },
]

export function LandingFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="px-6 py-14 border-t border-border solar-no-print" style={{ background: "var(--color-surface)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span
                className="inline-flex items-center justify-center size-9 rounded-xl text-white"
                style={{ backgroundImage: "var(--solar-gradient-primary)" }}
                aria-hidden="true"
              >
                <Sun className="size-4.5" />
              </span>
              <span className="font-bold text-foreground">Heliom Energia Solar</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Sua casa produzindo energia. Projetos personalizados de energia solar fotovoltaica em todo o Brasil.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-[var(--solar-blue-light)] transition-colors">
                <Instagram className="size-4.5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-[var(--solar-blue-light)] transition-colors">
                <Linkedin className="size-4.5" />
              </a>
              <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-[var(--solar-blue-light)] transition-colors">
                <Facebook className="size-4.5" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Links rápidos</p>
            <nav className="flex flex-col gap-2">
              {QUICK_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-[var(--solar-blue-light)] transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Áreas atendidas</p>
            <ul className="flex flex-col gap-2">
              {AREAS.map((area) => (
                <li key={area} className="text-sm text-muted-foreground">
                  {area}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Contato</p>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
              <li>0800 770 1234</li>
              <li>contato@heliomenergia.com.br</li>
            </ul>
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <ShieldCheck className="size-3.5" style={{ color: "var(--solar-green)" }} aria-hidden="true" />
                Instalação certificada INMETRO
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Award className="size-3.5" style={{ color: "var(--solar-green)" }} aria-hidden="true" />
                Engenheiros credenciados CREA
              </span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {year} Heliom Energia Solar — Roberto Nicoletti</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-[var(--solar-blue-light)] transition-colors">
              Política de Privacidade
            </Link>
            <Link href="#" className="hover:text-[var(--solar-blue-light)] transition-colors">
              Termos de Uso
            </Link>
            <Link href="/" className="hover:text-[var(--solar-blue-light)] transition-colors">
              ← Voltar para criativo.nico.dev
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
