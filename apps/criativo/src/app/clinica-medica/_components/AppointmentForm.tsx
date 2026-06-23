"use client"

import { useId, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ChevronDown, Loader2, CalendarCheck, CheckCircle2 } from "lucide-react"
import { Button, FormGroup, Input, Alert, AlertDescription } from "@nico.dev/ui"
import { submitAppointment } from "../_actions/submitAppointment"
import { SPECIALTY_OPTIONS, DOCTOR_OPTIONS, TIME_SLOT_OPTIONS, INSURANCE_OPTIONS } from "../_lib/data"

const formSchema = z.object({
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

type FormValues = z.infer<typeof formSchema>

// Máscara progressiva de telefone BR: (11) 91234-5678 / (11) 1234-5678.
function formatPhoneBR(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11)
  if (digits.length === 0) return ""
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function AppointmentForm() {
  const id = useId()
  const [submitted, setSubmitted] = useState(false)
  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), [])

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      telefone: "",
      email: "",
      especialidade: "",
      medico: "",
      dataDesejada: "",
      horarioDesejado: "",
      convenio: "",
      observacoes: "",
    },
  })

  const telefoneField = register("telefone")

  async function onSubmit(values: FormValues) {
    const result = await submitAppointment(values)

    if (result.status === "success") {
      setSubmitted(true)
      reset()
      return
    }

    setError("email", { type: "server", message: result.message })
  }

  if (submitted) {
    return (
      <Alert variant="success" className="text-left">
        <AlertDescription className="flex items-start gap-2">
          <CheckCircle2 className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
          Sua solicitação foi enviada. Nossa equipe entrará em contato para confirmação.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <FormGroup label="Nome" htmlFor={`${id}-nome`} error={errors.nome?.message}>
          <Input
            id={`${id}-nome`}
            autoComplete="name"
            placeholder="Seu nome completo"
            variant={errors.nome ? "error" : "default"}
            disabled={isSubmitting}
            {...register("nome")}
          />
        </FormGroup>

        <FormGroup label="Telefone" htmlFor={`${id}-telefone`} error={errors.telefone?.message}>
          <Input
            id={`${id}-telefone`}
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="(11) 99999-9999"
            variant={errors.telefone ? "error" : "default"}
            disabled={isSubmitting}
            {...telefoneField}
            onChange={(event) => {
              event.target.value = formatPhoneBR(event.target.value)
              telefoneField.onChange(event)
            }}
          />
        </FormGroup>
      </div>

      <FormGroup label="E-mail" htmlFor={`${id}-email`} error={errors.email?.message}>
        <Input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          placeholder="voce@email.com"
          variant={errors.email ? "error" : "default"}
          disabled={isSubmitting}
          {...register("email")}
        />
      </FormGroup>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-especialidade`} className="text-sm font-medium text-foreground">
            Especialidade
          </label>
          <div className="relative">
            <select
              id={`${id}-especialidade`}
              defaultValue=""
              disabled={isSubmitting}
              className="w-full appearance-none rounded-xl border border-input bg-[var(--color-surface-raised)] px-4 py-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              {...register("especialidade")}
            >
              <option value="" disabled>
                Selecione
              </option>
              {SPECIALTY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
          </div>
          {errors.especialidade && <p className="text-xs text-destructive">{errors.especialidade.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-medico`} className="text-sm font-medium text-foreground">
            Médico
          </label>
          <div className="relative">
            <select
              id={`${id}-medico`}
              defaultValue=""
              disabled={isSubmitting}
              className="w-full appearance-none rounded-xl border border-input bg-[var(--color-surface-raised)] px-4 py-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              {...register("medico")}
            >
              <option value="" disabled>
                Selecione
              </option>
              {DOCTOR_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
          </div>
          {errors.medico && <p className="text-xs text-destructive">{errors.medico.message}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormGroup label="Data desejada" htmlFor={`${id}-data`} error={errors.dataDesejada?.message}>
          <Input
            id={`${id}-data`}
            type="date"
            min={todayIso}
            variant={errors.dataDesejada ? "error" : "default"}
            disabled={isSubmitting}
            {...register("dataDesejada")}
          />
        </FormGroup>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-horario`} className="text-sm font-medium text-foreground">
            Horário desejado
          </label>
          <div className="relative">
            <select
              id={`${id}-horario`}
              defaultValue=""
              disabled={isSubmitting}
              className="w-full appearance-none rounded-xl border border-input bg-[var(--color-surface-raised)] px-4 py-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              {...register("horarioDesejado")}
            >
              <option value="" disabled>
                Selecione
              </option>
              {TIME_SLOT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
          </div>
          {errors.horarioDesejado && <p className="text-xs text-destructive">{errors.horarioDesejado.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-convenio`} className="text-sm font-medium text-foreground">
          Convênio
        </label>
        <div className="relative">
          <select
            id={`${id}-convenio`}
            defaultValue=""
            disabled={isSubmitting}
            className="w-full appearance-none rounded-xl border border-input bg-[var(--color-surface-raised)] px-4 py-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            {...register("convenio")}
          >
            <option value="" disabled>
              Selecione
            </option>
            {INSURANCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
        </div>
        {errors.convenio && <p className="text-xs text-destructive">{errors.convenio.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-observacoes`} className="text-sm font-medium text-foreground">
          Observações <span className="text-muted-foreground font-normal">(opcional)</span>
        </label>
        <textarea
          id={`${id}-observacoes`}
          rows={3}
          placeholder="Conte algo relevante para o seu atendimento, se desejar..."
          disabled={isSubmitting}
          className="w-full rounded-xl border border-input bg-[var(--color-surface-raised)] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          {...register("observacoes")}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full"
        style={{ backgroundImage: "var(--clin-gradient-green)", borderColor: "transparent" }}
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Enviando...
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <CalendarCheck className="size-4" aria-hidden="true" />
            Solicitar Agendamento
          </span>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Seus dados estão protegidos e tratados em conformidade com a LGPD.
      </p>
    </form>
  )
}
