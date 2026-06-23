import { HeartPulse, MapPin, Phone, Mail, Clock, MessageCircle, Linkedin, Instagram, Facebook } from "lucide-react"
import { NAV_LINKS } from "../_lib/data"

const socials = [
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "Facebook", icon: Facebook, href: "#" },
  { label: "LinkedIn", icon: Linkedin, href: "#" },
]

export function ClinicaFooter() {
  return (
    <footer className="px-6 py-16 border-t border-border bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <p className="flex items-center gap-2.5 font-bold text-foreground text-lg mb-3">
              <span
                className="inline-flex items-center justify-center size-8 rounded-lg text-white"
                style={{ backgroundImage: "var(--clin-gradient-primary)" }}
                aria-hidden="true"
              >
                <HeartPulse className="size-4" />
              </span>
              Clínica Vitalis
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Consultas, exames e acompanhamento médico com profissionais qualificados, em um ambiente moderno e
              humanizado.
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
              <li>
                <a href="#equipe" className="hover:text-foreground transition-colors">
                  Equipe
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Contato</p>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <a href="#agendamento" className="hover:text-foreground transition-colors">
                  Agendar Consulta
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
              Fale com a Clínica
            </p>
            <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground mb-5">
              <li className="flex items-start gap-2">
                <MapPin className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
                Av. Higienópolis, 980 — Higienópolis, São Paulo - SP
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                <a href="tel:+551130408877" className="hover:text-foreground transition-colors">
                  (11) 3040-8877
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
                <a
                  href="https://wa.me/5511988884455"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  (11) 98888-4455
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                <a href="mailto:contato@clinicavitalis.com.br" className="hover:text-foreground transition-colors">
                  contato@clinicavitalis.com.br
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="size-4 shrink-0" aria-hidden="true" />
                Seg. a sáb., 7h às 20h
              </li>
            </ul>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex items-center justify-center size-9 rounded-full clin-glass text-muted-foreground hover:text-[var(--color-primary)] transition-colors"
                >
                  <social.icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} Clínica Vitalis. Todos os direitos reservados.
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
