import { Instagram, Youtube, Linkedin, Twitter } from "lucide-react"

const socials = [
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "YouTube", icon: Youtube, href: "#" },
  { label: "LinkedIn", icon: Linkedin, href: "#" },
  { label: "X (Twitter)", icon: Twitter, href: "#" },
]

export function LandingFooter() {
  return (
    <footer className="relative px-6 py-10 border-t border-white/10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-xs text-[var(--apice-fg-faint)] text-center sm:text-left">
          © {new Date().getFullYear()} Método Ápice. Todos os direitos reservados.
          <br className="sm:hidden" />
          <span className="sm:before:content-['_·_']">
            <a href="#" className="hover:text-[var(--apice-fg-muted)] transition-colors">
              Termos de Uso
            </a>
          </span>
          <span className="before:content-['_·_']">
            <a href="#" className="hover:text-[var(--apice-fg-muted)] transition-colors">
              Política de Privacidade
            </a>
          </span>
        </p>

        <div className="flex items-center gap-3">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              className="inline-flex items-center justify-center size-9 rounded-full apice-glass text-[var(--apice-fg-muted)] hover:text-[var(--apice-violet)] transition-colors"
            >
              <social.icon className="size-4" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
