"use server"

import { z } from "zod"

const utmSchema = z
  .object({
    utm_source: z.string().optional(),
    utm_medium: z.string().optional(),
    utm_campaign: z.string().optional(),
    utm_content: z.string().optional(),
    utm_term: z.string().optional(),
  })
  .partial()
  .optional()

const leadSchema = z.object({
  nome: z.string().min(2, "Informe seu nome."),
  empresa: z.string().min(2, "Informe o nome da empresa."),
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
  whatsapp: z.string().min(8, "Informe um número de WhatsApp válido."),
  cargo: z.string().min(2, "Informe seu cargo."),
  colaboradores: z.string().min(1, "Selecione o número de colaboradores."),
  desafio: z.string().min(10, "Descreva brevemente o desafio atual."),
  utm: utmSchema,
})

export type LeadInput = z.infer<typeof leadSchema>

export type LeadResult =
  | { status: "success" }
  | { status: "error"; message: string }

// Stub em memória de processo — esta fase do produto ainda não tem CRM
// integrado. Não persiste entre deploys/restarts.
//
// INTEGRAÇÃO FUTURA: substituir por chamada real a CRM/automação de
// marketing (HubSpot, RD Station, Pipedrive, etc.), lendo credenciais de
// variáveis de ambiente — nunca hardcoded. A assinatura desta função
// (input/output) não precisa mudar.
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
  await new Promise((resolve) => setTimeout(resolve, 500))

  mockLeads.push(parsed.data)

  return { status: "success" }
}
