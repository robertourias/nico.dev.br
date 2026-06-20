"use client"

import { useState } from "react"
import { Linkedin, Send, Link2, Check } from "lucide-react"

// Compartilhamento real (não simulado): monta as URLs de share a partir da
// página atual em tempo de execução (`window.location.href`), por isso é
// client component. "Copiar link" usa a Clipboard API com fallback visual de
// confirmação por 2s.
export function ShareButtons({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false)

  function getShareUrl() {
    return typeof window !== "undefined" ? window.location.href : ""
  }

  const shareText = "Vou participar do NEXUS Summit — o encontro de profissionais e especialistas do mercado."

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(getShareUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard indisponível (ex.: contexto não seguro) — sem feedback extra.
    }
  }

  const links = [
    {
      label: "WhatsApp",
      icon: Send,
      href: () => `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${getShareUrl()}`)}`,
    },
    {
      label: "LinkedIn",
      icon: Linkedin,
      href: () => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`,
    },
  ]

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      {links.map((link) => (
        <a
          key={link.label}
          href="#"
          onClick={(e) => {
            e.preventDefault()
            window.open(link.href(), "_blank", "noopener,noreferrer")
          }}
          aria-label={`Compartilhar no ${link.label}`}
          className="inline-flex items-center justify-center size-9 rounded-full nexus-glass text-[var(--nexus-fg-muted)] hover:text-[var(--nexus-purple)] transition-colors"
        >
          <link.icon className="size-4" aria-hidden="true" />
        </a>
      ))}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copiar link do evento"
        className="inline-flex items-center justify-center size-9 rounded-full nexus-glass text-[var(--nexus-fg-muted)] hover:text-[var(--nexus-purple)] transition-colors"
      >
        {copied ? <Check className="size-4 text-[var(--nexus-emerald)]" aria-hidden="true" /> : <Link2 className="size-4" aria-hidden="true" />}
      </button>
    </div>
  )
}
