import { Sparkles, CheckCircle2 } from "lucide-react"

// Mockup estático de um "cartão de credencial" do evento — comunica de forma
// visual a experiência (palestra ao vivo + agenda do dia), sem depender de
// fotografia real. Mesmo padrão de mockup de `HeroIllustration.tsx` em
// `simulador-economia-domestica`.
export function EventIllustration() {
  return (
    <div className="relative nexus-glass nexus-glow rounded-3xl p-6 md:p-7 max-w-md w-full mx-auto" aria-hidden="true">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs text-[var(--nexus-fg-muted)]">Sua credencial</p>
          <p className="font-semibold text-[var(--nexus-fg)]">Acesso Geral</p>
        </div>
        <span
          className="inline-flex items-center justify-center size-10 rounded-xl"
          style={{ backgroundImage: "var(--nexus-gradient-primary)" }}
        >
          <Sparkles className="size-5 text-white" />
        </span>
      </div>

      <div
        className="rounded-2xl p-5 mb-5 text-white"
        style={{ backgroundImage: "var(--nexus-gradient-primary)" }}
      >
        <p className="text-xs uppercase tracking-wider opacity-80 mb-1">Agora ao vivo</p>
        <p className="font-semibold">Palestra Principal — Mainstage</p>
        <p className="text-xs opacity-80 mt-1">11:00 · Auditório Aurora</p>
      </div>

      <ul className="flex flex-col gap-3">
        {[
          "Credenciamento liberado",
          "Material de apoio disponível",
          "Networking lounge aberto",
        ].map((item) => (
          <li key={item} className="flex items-center gap-2.5 text-sm text-[var(--nexus-fg-muted)]">
            <CheckCircle2 className="size-4 text-[var(--nexus-emerald)] shrink-0" />
            {item}
          </li>
        ))}
      </ul>

      <div
        className="absolute -top-3 -right-3 size-10 rounded-2xl flex items-center justify-center nexus-glow-cta"
        style={{ backgroundImage: "var(--nexus-gradient-cta)" }}
      >
        <span className="text-white text-xs font-bold">+5k</span>
      </div>
    </div>
  )
}
