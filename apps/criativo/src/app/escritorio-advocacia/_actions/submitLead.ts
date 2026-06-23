"use server"

import { z } from "zod"

const leadSchema = z.object({
  nome: z.string().min(2, "Informe seu nome."),
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
  telefone: z.string().min(8, "Informe um telefone válido."),
  areaInteresse: z.string().min(1, "Selecione a área de interesse."),
  descricaoCaso: z.string().min(10, "Descreva brevemente o seu caso."),
  melhorHorario: z.string().min(1, "Selecione o melhor horário para contato."),
})

export type LeadInput = z.infer<typeof leadSchema>

export type LeadResult = { status: "success" } | { status: "error"; message: string }

// Stub em memória de processo — esta fase do produto ainda não tem CRM
// integrado. Não persiste entre deploys/restarts.
//
// INTEGRAÇÃO FUTURA: substituir por chamada real a CRM jurídico ou
// automação de marketing, lendo credenciais de variáveis de ambiente —
// nunca hardcoded. A assinatura desta função (input/output) não precisa
// mudar.
const mockLeads: LeadInput[] = []

export async function submitLead(input: LeadInput): Promise<LeadResult> {
  const parsed = leadSchema.safeParse(input)

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Verifique os campos do formulário.",
    }
  }

  // Simula latência de rede de uma chamada real ao CRM.
  await new Promise((resolve) => setTimeout(resolve, 600))

  mockLeads.push(parsed.data)

  return { status: "success" }
}
