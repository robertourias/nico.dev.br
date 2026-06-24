"use server"

import { z } from "zod"

const proposalSchema = z.object({
  nome: z.string().min(2, "Informe seu nome."),
  empresa: z.string().min(2, "Informe o nome da empresa."),
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
  whatsapp: z.string().min(8, "Informe um WhatsApp válido."),
  investimento: z.string().min(1, "Selecione uma faixa de investimento."),
  objetivo: z.string().min(10, "Descreva brevemente o objetivo da sua empresa."),
})

export type ProposalInput = z.infer<typeof proposalSchema>

export type ProposalResult = { status: "success" } | { status: "error"; message: string }

// Stub em memória de processo — esta fase do produto ainda não tem CRM
// integrado. Não persiste entre deploys/restarts.
//
// INTEGRAÇÃO FUTURA: substituir por chamada real a CRM/automação de
// marketing (HubSpot, RD Station, Pipedrive, etc.), lendo credenciais de
// variáveis de ambiente — nunca hardcoded. A assinatura desta função
// (input/output) não precisa mudar.
const mockProposals: ProposalInput[] = []

export async function submitProposal(input: ProposalInput): Promise<ProposalResult> {
  const parsed = proposalSchema.safeParse(input)

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Verifique os campos do formulário.",
    }
  }

  // Simula latência de rede de uma chamada real ao CRM.
  await new Promise((resolve) => setTimeout(resolve, 500))

  mockProposals.push(parsed.data)

  return { status: "success" }
}
