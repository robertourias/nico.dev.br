import { Users } from "lucide-react"

// Prova social solicitada explicitamente pelo usuário. Tratado como copy
// ilustrativa fixa, não como estatística ao vivo — evita comunicar um número
// fabricado como se fosse dado real e monitorado.
//
// INTEGRAÇÃO FUTURA: substituir o valor fixo abaixo por uma contagem real
// (ex.: derivada do Server Action de inscrição) quando houver volume de dados
// suficiente para exibir com honestidade.
export function ParticipantCounter({ className }: { className?: string }) {
  return (
    <p className={`flex items-center gap-2 text-sm text-muted-foreground ${className ?? ""}`}>
      <Users className="size-4 text-primary" aria-hidden="true" />
      Junte-se a centenas de pessoas já participando do desafio
    </p>
  )
}
