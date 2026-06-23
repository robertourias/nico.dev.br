import { Scale, MapPin, Phone, Mail, Clock, Linkedin, Instagram } from "lucide-react"
import { NAV_LINKS, PRACTICE_AREAS } from "../_lib/data"

const socials = [
  { label: "LinkedIn", icon: Linkedin, href: "#" },
  { label: "Instagram", icon: Instagram, href: "#" },
]

export function AdvocaciaFooter() {
  return (
    <footer className="px-6 py-16 border-t border-border bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <p className="flex items-center gap-2.5 font-bold text-foreground adv-font-serif text-lg mb-3">
              <span
                className="inline-flex items-center justify-center size-8 rounded-lg text-white"
                style={{ backgroundImage: "var(--adv-gradient-primary)" }}
                aria-hidden="true"
              >
                <Scale className="size-4" />
              </span>
              Lemos <span style={{ color: "var(--adv-gold)" }}>&amp;</span> Bastos
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Assessoria jurídica estratégica para pessoas físicas, empresas e profissionais liberais, com
              atendimento humanizado e foco em resultado.
            </p>
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
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Áreas de Atuação
            </p>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {PRACTICE_AREAS.slice(0, 5).map((area) => (
                <li key={area.title}>
                  <a href="#areas" className="hover:text-foreground transition-colors">
                    {area.title}
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
                Av. Paulista, 1374 — Bela Vista, São Paulo - SP
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                <a href="tel:+551140028922" className="hover:text-foreground transition-colors">
                  (11) 4002-8922
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                <a href="mailto:contato@lemosbastos.adv.br" className="hover:text-foreground transition-colors">
                  contato@lemosbastos.adv.br
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="size-4 shrink-0" aria-hidden="true" />
                Seg. a sex., 9h às 19h
              </li>
            </ul>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex items-center justify-center size-9 rounded-full adv-glass text-muted-foreground hover:text-[var(--adv-gold)] transition-colors"
                >
                  <social.icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} Lemos &amp; Bastos Advogados. Todos os direitos reservados.
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
