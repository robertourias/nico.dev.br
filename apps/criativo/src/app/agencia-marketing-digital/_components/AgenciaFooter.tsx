import { Zap, Mail, Phone, MessageCircle, Linkedin, Instagram, Youtube } from "lucide-react"
import { NAV_LINKS, SERVICES } from "../_lib/data"

const socials = [
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "LinkedIn", icon: Linkedin, href: "#" },
  { label: "YouTube", icon: Youtube, href: "#" },
]

export function AgenciaFooter() {
  return (
    <footer className="px-6 py-16 border-t border-border bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <p className="flex items-center gap-2 font-bold text-foreground mb-3">
              <span
                className="inline-flex items-center justify-center size-8 rounded-lg text-white"
                style={{ backgroundImage: "var(--agencia-gradient-primary)" }}
                aria-hidden="true"
              >
                <Zap className="size-4" />
              </span>
              Lumen<span className="text-primary">Digital</span>
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Marketing digital orientado por dados para aumentar vendas, gerar leads e acelerar o crescimento da
              sua empresa.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Navegação</p>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Serviços</p>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {SERVICES.slice(0, 5).map((service) => (
                <li key={service.title}>
                  <a href="#servicos" className="hover:text-foreground transition-colors">
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Contato</p>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground mb-5">
              <li className="flex items-center gap-2">
                <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
                <a href="#" className="hover:text-foreground transition-colors">
                  WhatsApp Comercial
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                <a href="mailto:contato@lumendigital.com.br" className="hover:text-foreground transition-colors">
                  contato@lumendigital.com.br
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                <a href="tel:+5511999999999" className="hover:text-foreground transition-colors">
                  (11) 99999-9999
                </a>
              </li>
            </ul>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex items-center justify-center size-9 rounded-full agencia-glass text-muted-foreground hover:text-primary transition-colors"
                >
                  <social.icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} Lumen Digital. Todos os direitos reservados.
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
