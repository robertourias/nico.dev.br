"use client"

import { useId, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ChevronDown, Loader2, Send, CheckCircle2 } from "lucide-react"
import { Button, FormGroup, Input, Alert, AlertDescription } from "@nico.dev/ui"
import { submitProposal } from "../_actions/submitProposal"

const INVESTIMENTO_OPTIONS = [
  { value: "ate-2k", label: "Até R$ 2.000/mês" },
  { value: "2k-5k", label: "R$ 2.000 a R$ 5.000/mês" },
  { value: "5k-15k", label: "R$ 5.000 a R$ 15.000/mês" },
  { value: "15k+", label: "Mais de R$ 15.000/mês" },
] as const

const formSchema = z.object({
  nome: z.string().min(2, "Informe seu nome."),
  empresa: z.string().min(2, "Informe o nome da empresa."),
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
  whatsapp: z.string().min(8, "Informe um WhatsApp válido."),
  investimento: z.string().min(1, "Selecione uma opção."),
  objetivo: z.string().min(10, "Descreva brevemente o objetivo da sua empresa."),
})

type FormValues = z.infer<typeof formSchema>

export function ProposalForm() {
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
    defaultValues: { nome: "", empresa: "", email: "", whatsapp: "", investimento: "", objetivo: "" },
  })

  async function onSubmit(values: FormValues) {
    const result = await submitProposal(values)

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
          Recebemos seus dados! Nossa equipe vai entrar em contato em breve com sua proposta personalizada.
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

        <FormGroup label="Empresa" htmlFor={`${id}-empresa`} error={errors.empresa?.message}>
          <Input
            id={`${id}-empresa`}
            autoComplete="organization"
            placeholder="Nome da empresa"
            variant={errors.empresa ? "error" : "default"}
            disabled={isSubmitting}
            {...register("empresa")}
          />
        </FormGroup>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormGroup label="E-mail" htmlFor={`${id}-email`} error={errors.email?.message}>
          <Input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            placeholder="voce@empresa.com"
            variant={errors.email ? "error" : "default"}
            disabled={isSubmitting}
            {...register("email")}
          />
        </FormGroup>

        <FormGroup label="WhatsApp" htmlFor={`${id}-whatsapp`} error={errors.whatsapp?.message}>
          <Input
            id={`${id}-whatsapp`}
            type="tel"
            autoComplete="tel"
            placeholder="(11) 99999-9999"
            variant={errors.whatsapp ? "error" : "default"}
            disabled={isSubmitting}
            {...register("whatsapp")}
          />
        </FormGroup>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-investimento`} className="text-sm font-medium text-foreground">
          Investimento mensal estimado
        </label>
        <div className="relative">
          <select
            id={`${id}-investimento`}
            defaultValue=""
            disabled={isSubmitting}
            className="w-full appearance-none rounded-xl border border-input bg-[var(--color-surface-raised)] px-4 py-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            {...register("investimento")}
          >
            <option value="" disabled>
              Selecione
            </option>
            {INVESTIMENTO_OPTIONS.map((option) => (
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
        {errors.investimento && <p className="text-xs text-destructive">{errors.investimento.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-objetivo`} className="text-sm font-medium text-foreground">
          Objetivo principal
        </label>
        <textarea
          id={`${id}-objetivo`}
          rows={4}
          placeholder="Conte brevemente o que você quer alcançar com marketing digital..."
          disabled={isSubmitting}
          className="w-full rounded-xl border border-input bg-[var(--color-surface-raised)] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          {...register("objetivo")}
        />
        {errors.objetivo && <p className="text-xs text-destructive">{errors.objetivo.message}</p>}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Enviando...
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            <Send className="size-4" aria-hidden="true" />
            Solicitar Proposta
          </span>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Seus dados estão seguros e não serão compartilhados com terceiros.
      </p>
    </form>
  )
}
