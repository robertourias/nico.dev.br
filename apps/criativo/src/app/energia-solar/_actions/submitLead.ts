"use server"

import { z } from "zod"

const leadSchema = z.object({
  nome: z.string().optional(),
  telefone: z.string().min(8, "Informe um telefone válido com DDD."),
  email: z.string().optional(),
  cidade: z.string().optional(),
  origem: z.string().optional(),
})

export type LeadInput = z.infer<typeof leadSchema>

export type LeadResult = { status: "success" } | { status: "error"; message: string }

// Stub em memória de processo — esta fase do produto ainda não tem CRM
// integrado. Não persiste entre deploys/restarts.
//
// INTEGRAÇÃO FUTURA: substituir por chamada real a CRM de vendas e
// disparo de WhatsApp (ex. API oficial do WhatsApp Business), lendo
// credenciais de variáveis de ambiente — nunca hardcoded. A assinatura
// desta função (input/output) não precisa mudar.
const mockLeads: LeadInput[] = []

export async function submitLead(input: LeadInput): Promise<LeadResult> {
  const parsed = leadSchema.safeParse(input)

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Verifique os campos do formulário.",
    }
  }

  // Simula latência de rede de uma chamada real ao CRM/integração de WhatsApp.
  await new Promise((resolve) => setTimeout(resolve, 600))

  mockLeads.push(parsed.data)

  return { status: "success" }
}
