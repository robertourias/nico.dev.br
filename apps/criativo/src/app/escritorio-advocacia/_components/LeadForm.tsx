"use client"

import { useId, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ChevronDown, Loader2, CalendarCheck, CheckCircle2 } from "lucide-react"
import { Button, FormGroup, Input, Alert, AlertDescription } from "@nico.dev/ui"
import { submitLead } from "../_actions/submitLead"
import { INTEREST_AREAS, BEST_TIME_OPTIONS } from "../_lib/data"

const formSchema = z.object({
  nome: z.string().min(2, "Informe seu nome."),
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
  telefone: z.string().min(8, "Informe um telefone válido."),
  areaInteresse: z.string().min(1, "Selecione a área de interesse."),
  descricaoCaso: z.string().min(10, "Descreva brevemente o seu caso."),
  melhorHorario: z.string().min(1, "Selecione o melhor horário para contato."),
})

type FormValues = z.infer<typeof formSchema>

export function LeadForm() {
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
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      areaInteresse: "",
      descricaoCaso: "",
      melhorHorario: "",
    },
  })

  async function onSubmit(values: FormValues) {
    const result = await submitLead(values)

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
          Recebemos sua solicitação! Nossa equipe entrará em contato em breve para confirmar o agendamento da sua
          consulta.
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
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormGroup label="Telefone" htmlFor={`${id}-telefone`} error={errors.telefone?.message}>
          <Input
            id={`${id}-telefone`}
            type="tel"
            autoComplete="tel"
            placeholder="(11) 99999-9999"
            variant={errors.telefone ? "error" : "default"}
            disabled={isSubmitting}
            {...register("telefone")}
          />
        </FormGroup>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-area`} className="text-sm font-medium text-foreground">
            Área de interesse
          </label>
          <div className="relative">
            <select
              id={`${id}-area`}
              defaultValue=""
              disabled={isSubmitting}
              className="w-full appearance-none rounded-xl border border-input bg-[var(--color-surface-raised)] px-4 py-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              {...register("areaInteresse")}
            >
              <option value="" disabled>
                Selecione
              </option>
              {INTEREST_AREAS.map((option) => (
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
          {errors.areaInteresse && <p className="text-xs text-destructive">{errors.areaInteresse.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-horario`} className="text-sm font-medium text-foreground">
          Melhor horário para contato
        </label>
        <div className="relative">
          <select
            id={`${id}-horario`}
            defaultValue=""
            disabled={isSubmitting}
            className="w-full appearance-none rounded-xl border border-input bg-[var(--color-surface-raised)] px-4 py-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            {...register("melhorHorario")}
          >
            <option value="" disabled>
              Selecione
            </option>
            {BEST_TIME_OPTIONS.map((option) => (
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
        {errors.melhorHorario && <p className="text-xs text-destructive">{errors.melhorHorario.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-descricao`} className="text-sm font-medium text-foreground">
          Descrição do caso
        </label>
        <textarea
          id={`${id}-descricao`}
          rows={4}
          placeholder="Conte brevemente sobre o seu caso..."
          disabled={isSubmitting}
          className="w-full rounded-xl border border-input bg-[var(--color-surface-raised)] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          {...register("descricaoCaso")}
        />
        {errors.descricaoCaso && <p className="text-xs text-destructive">{errors.descricaoCaso.message}</p>}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Enviando...
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <CalendarCheck className="size-4" aria-hidden="true" />
            Solicitar Consulta
          </span>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Seus dados estão protegidos e tratados em conformidade com a LGPD.
      </p>
    </form>
  )
}
