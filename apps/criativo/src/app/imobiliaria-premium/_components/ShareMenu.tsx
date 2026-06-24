"use client"

import { useState } from "react"
import { Share2, MessageCircle, Facebook, Linkedin } from "lucide-react"

interface ShareMenuProps {
  title: string
  className?: string
}

export function ShareMenu({ title, className }: ShareMenuProps) {
  const [open, setOpen] = useState(false)

  const url = typeof window !== "undefined" ? window.location.href : "https://imobiliariapremium.com.br"
  const text = encodeURIComponent(`${title} — confira este imóvel`)
  const encodedUrl = encodeURIComponent(url)

  const links = [
    { label: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${text}%20${encodedUrl}` },
    { label: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
  ]

  return (
    <div className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          setOpen((value) => !value)
        }}
        aria-label="Compartilhar imóvel"
        aria-expanded={open}
        className="imob-cta-highlight inline-flex items-center justify-center size-9 rounded-full imob-glass"
      >
        <Share2 className="size-4 text-muted-foreground" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          onClick={(event) => event.stopPropagation()}
          className="absolute right-0 top-11 z-20 flex flex-col gap-1 rounded-xl border border-border bg-[var(--color-surface-raised)] p-1.5 shadow-lg"
        >
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-[var(--color-accent)] transition-colors whitespace-nowrap"
            >
              <link.icon className="size-4" aria-hidden="true" />
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
