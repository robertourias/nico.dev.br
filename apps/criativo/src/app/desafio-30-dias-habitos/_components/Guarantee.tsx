import { ShieldCheck } from "lucide-react"

export function Guarantee() {
  return (
    <section className="px-6 py-12" aria-labelledby="guarantee-title">
      <div className="max-w-xl mx-auto flex flex-col items-center text-center gap-3">
        <div className="inline-flex items-center justify-center size-12 rounded-full bg-accent text-accent-foreground">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </div>
        <h2 id="guarantee-title" className="text-lg font-semibold text-foreground">
          Garantia
        </h2>
        <p className="text-sm text-muted-foreground">
          Sem spam. Você pode cancelar o recebimento dos e-mails a qualquer momento.
        </p>
      </div>
    </section>
  )
}
