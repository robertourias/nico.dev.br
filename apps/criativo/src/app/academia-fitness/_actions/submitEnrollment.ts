"use server"

import { z } from "zod"

const enrollmentSchema = z.object({
  nome: z.string().min(2, "Informe seu nome completo."),
  cpf: z.string().min(11, "Informe um CPF válido."),
  telefone: z.string().min(8, "Informe um telefone válido."),
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
  plano: z.string().min(1, "Selecione o plano."),
  pagamento: z.string().min(1, "Selecione a forma de pagamento."),
})

export type EnrollmentInput = z.infer<typeof enrollmentSchema>

export type EnrollmentResult = { status: "success" } | { status: "error"; message: string }

// Stub em memória de processo — esta fase do produto ainda não tem sistema de
// gestão de academia integrado. Não persiste entre deploys/restarts.
//
// INTEGRAÇÃO FUTURA: substituir por chamada real a um sistema de gestão de
// academia (matrícula, contrato digital, gateway de pagamento), lendo
// credenciais de variáveis de ambiente — nunca hardcoded. A assinatura desta
// função (input/output) não precisa mudar.
const mockEnrollments: EnrollmentInput[] = []

export async function submitEnrollment(input: EnrollmentInput): Promise<EnrollmentResult> {
  const parsed = enrollmentSchema.safeParse(input)

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Verifique os campos do formulário.",
    }
  }

  // Simula latência de rede de uma chamada real ao sistema de matrícula.
  await new Promise((resolve) => setTimeout(resolve, 700))

  mockEnrollments.push(parsed.data)

  return { status: "success" }
}
