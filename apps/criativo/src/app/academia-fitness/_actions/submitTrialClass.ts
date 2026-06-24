"use server"

import { z } from "zod"

const trialClassSchema = z.object({
  nome: z.string().min(2, "Informe seu nome."),
  telefone: z.string().min(8, "Informe um telefone válido."),
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
  objetivo: z.string().min(1, "Selecione seu objetivo."),
  modalidade: z.string().min(1, "Selecione a modalidade de interesse."),
  horario: z.string().min(1, "Selecione o horário preferido."),
})

export type TrialClassInput = z.infer<typeof trialClassSchema>

export type TrialClassResult = { status: "success" } | { status: "error"; message: string }

// Stub em memória de processo — esta fase do produto ainda não tem CRM de
// captação integrado. Não persiste entre deploys/restarts.
//
// INTEGRAÇÃO FUTURA: substituir por chamada real a um CRM de academias
// (lead -> consultor), disparo de WhatsApp e calendário de aulas
// experimentais, lendo credenciais de variáveis de ambiente — nunca
// hardcoded. A assinatura desta função (input/output) não precisa mudar.
const mockTrialRequests: TrialClassInput[] = []

export async function submitTrialClass(input: TrialClassInput): Promise<TrialClassResult> {
  const parsed = trialClassSchema.safeParse(input)

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Verifique os campos do formulário.",
    }
  }

  // Simula latência de rede de uma chamada real ao sistema de captação.
  await new Promise((resolve) => setTimeout(resolve, 600))

  mockTrialRequests.push(parsed.data)

  return { status: "success" }
}
