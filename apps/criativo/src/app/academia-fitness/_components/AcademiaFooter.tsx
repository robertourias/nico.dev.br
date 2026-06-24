import { Dumbbell, MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Facebook, Youtube } from "lucide-react"
import { NAV_LINKS } from "../_lib/data"

const socials = [
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "Facebook", icon: Facebook, href: "#" },
  { label: "YouTube", icon: Youtube, href: "#" },
]

export function AcademiaFooter() {
  return (
    <footer className="px-6 py-16 border-t border-border bg-[var(--color-background)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <p className="flex items-center gap-2.5 font-bold text-foreground text-lg mb-3" style={{ fontFamily: "var(--font-display)" }}>
              <span
                className="inline-flex items-center justify-center size-8 rounded-lg text-[var(--color-primary-foreground)]"
                style={{ backgroundImage: "var(--aca-gradient-primary)" }}
                aria-hidden="true"
              >
                <Dumbbell className="size-4" />
              </span>
              VIGOR
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Academia de musculação e fitness de alta performance, com estrutura completa, professores
              especializados e foco total no seu resultado.
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
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Comece agora</p>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <a href="#aula-experimental" className="hover:text-foreground transition-colors">
                  Aula Experimental
                </a>
              </li>
              <li>
                <a href="#matricula" className="hover:text-foreground transition-colors">
                  Matrícula Online
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-foreground transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Fale com a VIGOR
            </p>
            <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground mb-5">
              <li className="flex items-start gap-2">
                <MapPin className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
                Av. Faria Lima, 2230 — Itaim Bibi, São Paulo - SP
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                <a href="tel:+551130405566" className="hover:text-foreground transition-colors">
                  (11) 3040-5566
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
                <a
                  href="https://wa.me/5511988887766"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  (11) 98888-7766
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                <a href="mailto:contato@vigorfitness.com.br" className="hover:text-foreground transition-colors">
                  contato@vigorfitness.com.br
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Seg. a sáb., 6h às 23h
                  <br />
                  Domingos, 8h às 14h
                </span>
              </li>
            </ul>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex items-center justify-center size-9 rounded-full aca-glass text-muted-foreground hover:text-[var(--color-primary)] transition-colors"
                >
                  <social.icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} VIGOR Fitness Club. Todos os direitos reservados.
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
