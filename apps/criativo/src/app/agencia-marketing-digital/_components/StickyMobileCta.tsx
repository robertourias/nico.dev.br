// Barra fixa apenas em telas pequenas (`lg:hidden`) — garante que o CTA
// principal continue sempre visível na navegação mobile, conforme briefing,
// mesmo com o header de rolagem. Em telas maiores o CTA já está no header.
export function StickyMobileCta() {
  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border agencia-glass px-4 py-3">
      <a
        href="#proposta"
        className="flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white"
        style={{ backgroundImage: "var(--agencia-gradient-primary)" }}
      >
        Solicitar Proposta
      </a>
    </div>
  )
}
