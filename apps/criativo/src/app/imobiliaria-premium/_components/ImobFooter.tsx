import { Gem, MapPin, Phone, Mail, Clock, Instagram, Linkedin, Facebook } from "lucide-react"
import { NAV_LINKS, REGIONS } from "../_lib/data"

const socials = [
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "LinkedIn", icon: Linkedin, href: "#" },
  { label: "Facebook", icon: Facebook, href: "#" },
]

export function ImobFooter() {
  return (
    <footer className="px-6 py-16 border-t border-border bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <p className="flex items-center gap-2.5 font-bold text-foreground imob-font-serif text-lg mb-3">
              <span
                className="inline-flex items-center justify-center size-8 rounded-lg text-[var(--color-primary-foreground)]"
                style={{ backgroundImage: "var(--imob-gradient-primary)" }}
                aria-hidden="true"
              >
                <Gem className="size-4" />
              </span>
              Altana <span style={{ color: "var(--imob-sand)" }}>Imóveis</span>
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Imobiliária premium dedicada à descoberta de imóveis, geração de leads qualificados e atendimento
              consultivo de ponta a ponta.
            </p>
            <p className="text-xs text-muted-foreground mt-4">CRECI-J 34.821-J</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Menu</p>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <a href="#topo" className="hover:text-foreground transition-colors">
                  Home
                </a>
              </li>
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
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Regiões</p>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {REGIONS.map((region) => (
                <li key={region.key}>
                  <a href="#regioes" className="hover:text-foreground transition-colors">
                    {region.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Contato</p>
            <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground mb-5">
              <li className="flex items-start gap-2">
                <MapPin className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
                Av. Brigadeiro Faria Lima, 2300 — São Paulo - SP
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                <a href="tel:+551130456789" className="hover:text-foreground transition-colors">
                  (11) 3045-6789
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                <a href="mailto:contato@altanaimoveis.com.br" className="hover:text-foreground transition-colors">
                  contato@altanaimoveis.com.br
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="size-4 shrink-0" aria-hidden="true" />
                Seg. a sáb., 9h às 19h
              </li>
            </ul>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex items-center justify-center size-9 rounded-full imob-glass text-muted-foreground hover:text-[var(--imob-moss)] transition-colors"
                >
                  <social.icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} Altana Imóveis. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Termos de Uso
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              LGPD
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
