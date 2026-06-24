"use client"

import { useId, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ChevronDown, Loader2, Flame, CheckCircle2 } from "lucide-react"
import { Button, FormGroup, Input, Alert, AlertDescription } from "@nico.dev/ui"
import { submitTrialClass } from "../_actions/submitTrialClass"
import { GOAL_OPTIONS, MODALITY_OPTIONS, TIME_PREFERENCE_OPTIONS } from "../_lib/data"

const formSchema = z.object({
  nome: z.string().min(2, "Informe seu nome."),
  telefone: z.string().min(8, "Informe um telefone válido."),
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
  objetivo: z.string().min(1, "Selecione seu objetivo."),
  modalidade: z.string().min(1, "Selecione a modalidade de interesse."),
  horario: z.string().min(1, "Selecione o horário preferido."),
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

export function TrialClassForm() {
  const id = useId()
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: "", telefone: "", email: "", objetivo: "", modalidade: "", horario: "" },
  })

  const telefoneField = register("telefone")

  async function onSubmit(values: FormValues) {
    const result = await submitTrialClass(values)

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
          Recebemos sua solicitação! Em breve um consultor confirma sua aula experimental gratuita.
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

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-objetivo`} className="text-sm font-medium text-foreground">
          Objetivo
        </label>
        <div className="relative">
          <select
            id={`${id}-objetivo`}
            defaultValue=""
            disabled={isSubmitting}
            className="w-full appearance-none rounded-xl border border-input bg-[var(--color-surface-raised)] px-4 py-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            {...register("objetivo")}
          >
            <option value="" disabled>
              Selecione
            </option>
            {GOAL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
        </div>
        {errors.objetivo && <p className="text-xs text-destructive">{errors.objetivo.message}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-modalidade`} className="text-sm font-medium text-foreground">
            Modalidade de interesse
          </label>
          <div className="relative">
            <select
              id={`${id}-modalidade`}
              defaultValue=""
              disabled={isSubmitting}
              className="w-full appearance-none rounded-xl border border-input bg-[var(--color-surface-raised)] px-4 py-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              {...register("modalidade")}
            >
              <option value="" disabled>
                Selecione
              </option>
              {MODALITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
          </div>
          {errors.modalidade && <p className="text-xs text-destructive">{errors.modalidade.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-horario`} className="text-sm font-medium text-foreground">
            Horário preferido
          </label>
          <div className="relative">
            <select
              id={`${id}-horario`}
              defaultValue=""
              disabled={isSubmitting}
              className="w-full appearance-none rounded-xl border border-input bg-[var(--color-surface-raised)] px-4 py-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              {...register("horario")}
            >
              <option value="" disabled>
                Selecione
              </option>
              {TIME_PREFERENCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
          </div>
          {errors.horario && <p className="text-xs text-destructive">{errors.horario.message}</p>}
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full"
        style={{ backgroundImage: "var(--aca-gradient-primary)", borderColor: "transparent", color: "var(--color-primary-foreground)" }}
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Enviando...
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <Flame className="size-4" aria-hidden="true" />
            Quero minha aula gratuita
          </span>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Seus dados estão protegidos e tratados em conformidade com a LGPD.
      </p>
    </form>
  )
}
