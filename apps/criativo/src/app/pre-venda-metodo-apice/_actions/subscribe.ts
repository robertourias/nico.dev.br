"use server"

import { z } from "zod"

const waitlistSchema = z.object({
  name: z.string().min(2, "Informe seu nome."),
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
})

export type WaitlistInput = z.infer<typeof waitlistSchema>

export type WaitlistResult =
  | { status: "success" }
  | { status: "error"; message: string }

// Stub em memória de processo — mesma estratégia usada nas demais landings do
// app "criativo" (ver desafio-30-dias-habitos e landing-newsletter-premium):
// não há ESP configurado ainda, então o cadastro só vive durante a vida do
// processo do servidor. Não persiste entre deploys/restarts.
//
// INTEGRAÇÃO FUTURA: substituir por chamada real a um ESP (Mailchimp,
// ConvertKit, Brevo, ActiveCampaign) ou API própria, lendo a API key de uma
// variável de ambiente. A assinatura desta função não precisa mudar.
const mockWaitlist = new Set<string>()

export async function joinWaitlist(input: WaitlistInput): Promise<WaitlistResult> {
  const parsed = waitlistSchema.safeParse(input)

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Verifique os dados informados.",
    }
  }

  const email = parsed.data.email.trim().toLowerCase()

  // Simula latência de rede de uma chamada real ao ESP.
  await new Promise((resolve) => setTimeout(resolve, 450))

  mockWaitlist.add(email)

  return { status: "success" }
}
