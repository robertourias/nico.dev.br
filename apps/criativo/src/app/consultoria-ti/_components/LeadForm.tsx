"use client"

import { useEffect, useId, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ChevronDown, Loader2, Send, CheckCircle2 } from "lucide-react"
import { Button, FormGroup, Input, Alert, AlertDescription } from "@nico.dev/ui"
import { submitLead } from "../_actions/submitLead"
import { COLABORADORES_OPTIONS } from "../_lib/data"

const formSchema = z.object({
  nome: z.string().min(2, "Informe seu nome."),
  empresa: z.string().min(2, "Informe o nome da empresa."),
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
  whatsapp: z.string().min(8, "Informe um WhatsApp válido."),
  cargo: z.string().min(2, "Informe seu cargo."),
  colaboradores: z.string().min(1, "Selecione uma opção."),
  desafio: z.string().min(10, "Descreva brevemente o desafio atual."),
})

type FormValues = z.infer<typeof formSchema>

// UTMs são lidos da query string no mount (captura de origem de campanha,
// conforme briefing) e enviados junto ao lead, sem aparecer na UI.
function readUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {}
  const params = new URLSearchParams(window.location.search)
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
  const utm: Record<string, string> = {}
  for (const key of keys) {
    const value = params.get(key)
    if (value) utm[key] = value
  }
  return utm
}

export function LeadForm() {
  const id = useId()
  const [submitted, setSubmitted] = useState(false)
  const [utm, setUtm] = useState<Record<string, string>>({})

  useEffect(() => {
    setUtm(readUtmParams())
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: "", empresa: "", email: "", whatsapp: "", cargo: "", colaboradores: "", desafio: "" },
  })

  async function onSubmit(values: FormValues) {
    const result = await submitLead({ ...values, utm })

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
          Recebemos seus dados! Nossa equipe vai entrar em contato em breve para agendar seu diagnóstico gratuito.
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

      <div className="grid sm:grid-cols-2 gap-4">
        <FormGroup label="Cargo" htmlFor={`${id}-cargo`} error={errors.cargo?.message}>
          <Input
            id={`${id}-cargo`}
            autoComplete="organization-title"
            placeholder="Ex: CTO, Gerente de TI"
            variant={errors.cargo ? "error" : "default"}
            disabled={isSubmitting}
            {...register("cargo")}
          />
        </FormGroup>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-colaboradores`} className="text-sm font-medium text-foreground">
            Número de colaboradores
          </label>
          <div className="relative">
            <select
              id={`${id}-colaboradores`}
              defaultValue=""
              disabled={isSubmitting}
              className="w-full appearance-none rounded-xl border border-input bg-[var(--color-surface-raised)] px-4 py-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              {...register("colaboradores")}
            >
              <option value="" disabled>
                Selecione
              </option>
              {COLABORADORES_OPTIONS.map((option) => (
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
          {errors.colaboradores && <p className="text-xs text-destructive">{errors.colaboradores.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-desafio`} className="text-sm font-medium text-foreground">
          Desafio atual
        </label>
        <textarea
          id={`${id}-desafio`}
          rows={4}
          placeholder="Conte brevemente qual desafio de tecnologia você quer resolver..."
          disabled={isSubmitting}
          className="w-full rounded-xl border border-input bg-[var(--color-surface-raised)] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          {...register("desafio")}
        />
        {errors.desafio && <p className="text-xs text-destructive">{errors.desafio.message}</p>}
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
            Receber Diagnóstico
          </span>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Seus dados estão seguros e não serão compartilhados com terceiros.
      </p>
    </form>
  )
}
