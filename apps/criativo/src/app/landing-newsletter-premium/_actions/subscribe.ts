"use server"

import { z } from "zod"

const subscribeSchema = z.object({
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
})

export type SubscribeInput = z.infer<typeof subscribeSchema>

export type SubscribeResult =
  | { status: "success" }
  | { status: "error"; message: string }

// Stub em memória de processo — válido apenas para esta fase do produto
// (sem ESP configurado ainda). Não persiste entre deploys/restarts.
//
// INTEGRAÇÃO FUTURA: substituir o bloco abaixo por uma chamada real a um
// Email Service Provider (Resend, ConvertKit, Beehiiv, etc.), lendo a API
// key de uma variável de ambiente — nunca hardcoded. A assinatura desta
// função (input/output) não precisa mudar.
const mockSubscribers = new Set<string>()

export async function subscribeToNewsletter(input: SubscribeInput): Promise<SubscribeResult> {
  const parsed = subscribeSchema.safeParse(input)

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Informe um e-mail válido.",
    }
  }

  const email = parsed.data.email.trim().toLowerCase()

  // Simula latência de rede de uma chamada real ao ESP.
  await new Promise((resolve) => setTimeout(resolve, 400))

  mockSubscribers.add(email)

  return { status: "success" }
}
