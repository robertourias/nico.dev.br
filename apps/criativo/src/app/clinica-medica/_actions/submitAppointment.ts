"use server"

import { z } from "zod"

const appointmentSchema = z.object({
  nome: z.string().min(2, "Informe seu nome."),
  telefone: z.string().min(8, "Informe um telefone válido."),
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
  especialidade: z.string().min(1, "Selecione a especialidade."),
  medico: z.string().min(1, "Selecione o médico."),
  dataDesejada: z.string().min(1, "Selecione a data desejada."),
  horarioDesejado: z.string().min(1, "Selecione o horário desejado."),
  convenio: z.string().min(1, "Selecione o convênio."),
  observacoes: z.string().optional(),
})

export type AppointmentInput = z.infer<typeof appointmentSchema>

export type AppointmentResult = { status: "success" } | { status: "error"; message: string }

// Stub em memória de processo — esta fase do produto ainda não tem CRM
// médico integrado. Não persiste entre deploys/restarts.
//
// INTEGRAÇÃO FUTURA: substituir por chamada real a um sistema de gestão
// clínica (CRM médico), Google Calendar e disparo de WhatsApp, lendo
// credenciais de variáveis de ambiente — nunca hardcoded. A assinatura desta
// função (input/output) não precisa mudar.
const mockAppointments: AppointmentInput[] = []

export async function submitAppointment(input: AppointmentInput): Promise<AppointmentResult> {
  const parsed = appointmentSchema.safeParse(input)

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Verifique os campos do formulário.",
    }
  }

  // Simula latência de rede de uma chamada real ao sistema de agendamento.
  await new Promise((resolve) => setTimeout(resolve, 600))

  mockAppointments.push(parsed.data)

  return { status: "success" }
}
