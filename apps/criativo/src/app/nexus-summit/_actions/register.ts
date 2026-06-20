"use server"

import { z } from "zod"

const registrationSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo."),
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
  phone: z.string().min(8, "Informe um telefone válido com DDD."),
  company: z.string().min(2, "Informe sua empresa."),
  role: z.string().min(2, "Informe seu cargo."),
  plan: z.enum(["standard", "premium", "vip"]),
  lgpdConsent: z.boolean().refine((v) => v === true, {
    message: "É necessário aceitar os termos de tratamento de dados (LGPD) para continuar.",
  }),
})

export type RegistrationInput = z.infer<typeof registrationSchema>

export type RegistrationResult = { status: "success" } | { status: "error"; message: string }

// Stub em memória de processo — mesma estratégia das demais landings do app
// "criativo" (ver `pre-venda-metodo-apice/_actions/subscribe.ts`): não há
// CRM/ESP configurado ainda, então a inscrição só vive durante a vida do
// processo do servidor.
//
// INTEGRAÇÃO FUTURA: substituir por chamada real a um CRM de eventos
// (RD Station, Sympla, Eventbrite) ou API própria, lendo credenciais de
// variáveis de ambiente. A assinatura desta função não precisa mudar.
const mockRegistrations = new Set<string>()

export async function registerForEvent(input: RegistrationInput): Promise<RegistrationResult> {
  const parsed = registrationSchema.safeParse(input)

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Verifique os dados informados.",
    }
  }

  const email = parsed.data.email.trim().toLowerCase()

  // Simula latência de rede de uma chamada real ao CRM.
  await new Promise((resolve) => setTimeout(resolve, 500))

  mockRegistrations.add(email)

  return { status: "success" }
}
