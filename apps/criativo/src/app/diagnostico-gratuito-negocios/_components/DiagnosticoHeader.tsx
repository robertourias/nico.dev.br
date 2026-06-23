import { ClipboardCheck } from "lucide-react"

export function DiagnosticoHeader() {
  return (
    <header className="sticky top-0 z-30 px-6 py-4 diag-glass">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <a href="#topo" className="flex items-center gap-2 font-bold text-foreground">
          <span
            className="inline-flex items-center justify-center size-9 rounded-xl text-white"
            style={{ backgroundImage: "var(--diag-gradient-primary)" }}
            aria-hidden="true"
          >
            <ClipboardCheck className="size-4.5" />
          </span>
          Diagnóstico de Negócios
        </a>

        <a
          href="#diagnostico"
          className="hidden sm:inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundImage: "var(--diag-gradient-primary)" }}
        >
          Iniciar Diagnóstico
        </a>
      </div>
    </header>
  )
}
