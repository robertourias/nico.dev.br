import { Instagram, Youtube, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react"
import { ShareButtons } from "./ShareButtons"
import { EVENT_NAME, EVENT_VENUE, CONTACT_EMAIL, CONTACT_PHONE, formatEventDateLabel } from "../_lib/event"

const socials = [
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "YouTube", icon: Youtube, href: "#" },
  { label: "LinkedIn", icon: Linkedin, href: "#" },
  { label: "X (Twitter)", icon: Twitter, href: "#" },
]

export function EventFooter() {
  return (
    <footer className="relative px-6 py-12 border-t border-[var(--nexus-border)] bg-[var(--nexus-bg)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-10 mb-10">
          <div>
            <p className="font-bold text-[var(--nexus-fg)] mb-3">{EVENT_NAME}</p>
            <p className="text-sm text-[var(--nexus-fg-muted)] leading-relaxed">
              O encontro de profissionais e especialistas do mercado — palestras, workshops e networking de alto
              nível.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--nexus-fg-faint)] mb-3">
              Informações do evento
            </p>
            <ul className="flex flex-col gap-2 text-sm text-[var(--nexus-fg-muted)]">
              <li className="flex items-start gap-2">
                <MapPin className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
                {EVENT_VENUE}
              </li>
              <li>{formatEventDateLabel()}</li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--nexus-fg-faint)] mb-3">Contato</p>
            <ul className="flex flex-col gap-2 text-sm text-[var(--nexus-fg-muted)]">
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-[var(--nexus-fg)] transition-colors">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                {CONTACT_PHONE}
              </li>
            </ul>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--nexus-fg-faint)] mt-5 mb-2">
              Compartilhe
            </p>
            <ShareButtons />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-[var(--nexus-border)]">
          <p className="text-xs text-[var(--nexus-fg-faint)] text-center sm:text-left">
            © {new Date().getFullYear()} {EVENT_NAME}. Todos os direitos reservados.
            <span className="before:content-['_·_']">
              <a href="#" className="hover:text-[var(--nexus-fg-muted)] transition-colors">
                Política de Privacidade
              </a>
            </span>
            <span className="before:content-['_·_']">
              <a href="#" className="hover:text-[var(--nexus-fg-muted)] transition-colors">
                Termos de Uso
              </a>
            </span>
          </p>

          <div className="flex items-center gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="inline-flex items-center justify-center size-9 rounded-full nexus-glass text-[var(--nexus-fg-muted)] hover:text-[var(--nexus-purple)] transition-colors"
              >
                <social.icon className="size-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
