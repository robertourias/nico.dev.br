import { Button } from "@nico.dev/ui"

// Barra fixa apenas em telas pequenas (`lg:hidden`) — em telas maiores o
// formulário já está visível no Hero/CTA final, então a barra seria
// redundante. O link `#inscricao` usa o `scroll-behavior: smooth` global
// definido em `packages/ui/tokens.css`, sem necessidade de JS adicional.
export function StickyMobileCta() {
  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur px-4 py-3">
      <Button asChild size="lg" className="w-full">
        <a href="#inscricao">Quero Participar Gratuitamente</a>
      </Button>
    </div>
  )
}
