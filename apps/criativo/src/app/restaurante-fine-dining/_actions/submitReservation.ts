"use server"

import { z } from "zod"

const reservationSchema = z.object({
  partySize: z.string().min(1, "Selecione a quantidade de pessoas."),
  date: z.string().min(1, "Selecione a data."),
  time: z.string().min(1, "Selecione o horário."),
  occasion: z.string().min(1, "Selecione a ocasião."),
  seatingPreferences: z.array(z.string()).default([]),
  nome: z.string().min(2, "Informe seu nome."),
  telefone: z.string().min(8, "Informe um telefone válido."),
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
  observacoes: z.string().optional(),
})

export type ReservationInput = z.infer<typeof reservationSchema>

export type ReservationResult =
  | { status: "success"; confirmationCode: string }
  | { status: "error"; message: string }

// Stub em memória de processo — esta fase do produto ainda não tem um
// sistema de reservas integrado. Não persiste entre deploys/restarts.
//
// INTEGRAÇÃO FUTURA: substituir por chamada real a um sistema de reservas
// (ex.: OpenTable, SevenRooms) ou ao PDV do restaurante, lendo credenciais de
// variáveis de ambiente — nunca hardcoded. A assinatura desta função
// (input/output) não precisa mudar.
const mockReservations: ReservationInput[] = []

export async function submitReservation(input: ReservationInput): Promise<ReservationResult> {
  const parsed = reservationSchema.safeParse(input)

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Verifique os campos da reserva.",
    }
  }

  // Simula latência de rede de uma chamada real ao sistema de reservas.
  await new Promise((resolve) => setTimeout(resolve, 700))

  mockReservations.push(parsed.data)

  const confirmationCode = `AMB-${Math.floor(100000 + Math.random() * 900000)}`

  return { status: "success", confirmationCode }
}
