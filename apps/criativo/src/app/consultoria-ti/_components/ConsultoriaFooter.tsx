"use client"

import { useId, useState } from "react"
import { Cpu, Mail, MessageCircle, Linkedin, Instagram, Github, Send } from "lucide-react"
import { NAV_LINKS, SERVICES } from "../_lib/data"

const socials = [
  { label: "LinkedIn", icon: Linkedin, href: "#" },
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "GitHub", icon: Github, href: "#" },
]

export function ConsultoriaFooter() {
  const id = useId()
  const [submitted, setSubmitted] = useState(false)

  return (
    <footer className="px-6 py-16 border-t border-border bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <p className="flex items-center gap-2 font-bold text-foreground mb-3">
              <span
                className="inline-flex items-center justify-center size-8 rounded-lg text-white"
                style={{ backgroundImage: "var(--consult-gradient-primary)" }}
                aria-hidden="true"
              >
                <Cpu className="size-4" />
              </span>
              Vertex<span className="text-primary">IT</span>
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Consultoria de TI especializada em transformação digital, desenvolvimento de software, cloud e
              inteligência artificial.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Menu</p>
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
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                <a href="mailto:contato@vertexit.com.br" className="hover:text-foreground transition-colors">
                  contato@vertexit.com.br
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
                WhatsApp Comercial
              </li>
            </ul>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex items-center justify-center size-9 rounded-full consult-glass text-muted-foreground hover:text-primary transition-colors"
                >
                  <social.icon className="size-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="consult-glass rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-foreground text-sm">Newsletter técnica</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Conteúdo sobre cloud, arquitetura e IA direto no seu e-mail.
            </p>
          </div>
          {submitted ? (
            <p className="text-sm font-medium text-secondary">Inscrição confirmada!</p>
          ) : (
            <form
              className="flex w-full sm:w-auto gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                setSubmitted(true)
              }}
            >
              <label htmlFor={`${id}-newsletter`} className="sr-only">
                Seu e-mail
              </label>
              <input
                id={`${id}-newsletter`}
                type="email"
                required
                placeholder="voce@empresa.com"
                className="flex-1 sm:w-56 rounded-xl border border-input bg-[var(--color-surface-raised)] px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                aria-label="Inscrever-se na newsletter"
                className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-white"
                style={{ backgroundImage: "var(--consult-gradient-primary)" }}
              >
                <Send className="size-4" aria-hidden="true" />
              </button>
            </form>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} VertexIT Consultoria. Todos os direitos reservados.
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
