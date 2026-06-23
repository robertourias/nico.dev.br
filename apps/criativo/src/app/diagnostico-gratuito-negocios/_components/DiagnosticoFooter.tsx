import { Instagram, Linkedin, Mail, MessageCircle, ClipboardCheck } from "lucide-react"

const socials = [
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "LinkedIn", icon: Linkedin, href: "#" },
]

export function DiagnosticoFooter() {
  return (
    <footer className="px-6 py-12 border-t border-border bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-10 mb-10">
          <div>
            <p className="flex items-center gap-2 font-bold text-foreground mb-3">
              <span
                className="inline-flex items-center justify-center size-8 rounded-lg text-white"
                style={{ backgroundImage: "var(--diag-gradient-primary)" }}
                aria-hidden="true"
              >
                <ClipboardCheck className="size-4" />
              </span>
              Diagnóstico de Negócios
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Diagnóstico gratuito que identifica gargalos e oportunidades de crescimento para o seu negócio.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Contato</p>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                <a href="mailto:contato@nico.dev.br" className="hover:text-foreground transition-colors">
                  contato@nico.dev.br
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
                WhatsApp
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Redes sociais</p>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex items-center justify-center size-9 rounded-full diag-glass text-muted-foreground hover:text-primary transition-colors"
                >
                  <social.icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} Diagnóstico de Negócios. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
