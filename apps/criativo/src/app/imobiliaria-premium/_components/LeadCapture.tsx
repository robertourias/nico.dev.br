"use client"

import { useId, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ChevronDown, Loader2, Send, CheckCircle2, Sparkles } from "lucide-react"
import { Button, FormGroup, Input, Alert, AlertDescription } from "@nico.dev/ui"
import { submitLead } from "../_actions/submitLead"
import { MAIN_INTEREST_OPTIONS } from "../_lib/data"
import { Reveal } from "./Reveal"

const formSchema = z.object({
  nome: z.string().min(2, "Informe seu nome."),
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
  whatsapp: z.string().min(8, "Informe um WhatsApp válido."),
  interesse: z.string().min(1, "Selecione seu interesse principal."),
})

type FormValues = z.infer<typeof formSchema>

export function LeadCapture() {
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
    defaultValues: { nome: "", email: "", whatsapp: "", interesse: "" },
  })

  async function onSubmit(values: FormValues) {
    const result = await submitLead({ ...values, origem: "captura-final" })

    if (result.status === "success") {
      setSubmitted(true)
      reset()
      return
    }

    setError("email", { type: "server", message: result.message })
  }

  return (
    <section id="leads" className="px-6 py-20 md:py-28">
      <div className="max-w-5xl mx-auto">
        <Reveal
          className="relative overflow-hidden rounded-3xl border border-border imob-glow px-6 py-12 md:px-14 md:py-16"
          style={{ backgroundImage: "var(--imob-gradient-soft)" }}
        >
          <div className="absolute inset-0 imob-grid-bg opacity-40" aria-hidden="true" />
          <div className="relative grid lg:grid-cols-[1fr_1.05fr] gap-10 items-center">
            <div>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold mb-5"
                style={{ backgroundImage: "var(--imob-gradient-sand)", color: "var(--color-foreground)" }}
              >
                <Sparkles className="size-3.5" aria-hidden="true" />
                Acesso antecipado
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Receba novas oportunidades antes do mercado
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Cadastre-se e seja avisado em primeira mão sobre lançamentos, oportunidades de investimento e imóveis
                que combinam com o seu perfil — antes de chegarem aos portais.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-[var(--color-surface-raised)] p-6 md:p-8">
              {submitted ? (
                <Alert variant="success" className="text-left">
                  <AlertDescription className="flex items-start gap-2">
                    <CheckCircle2 className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
                    Cadastro recebido! Você passará a receber novas oportunidades compatíveis com seu interesse em
                    primeira mão.
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
                  <FormGroup label="Nome" htmlFor={`${id}-nome`} error={errors.nome?.message}>
                    <Input
                      id={`${id}-nome`}
                      autoComplete="name"
                      placeholder="Seu nome completo"
                      variant={errors.nome ? "error" : "default"}
                      disabled={isSubmitting}
                      data-lpignore="true"
                      data-1p-ignore="true"
                      data-form-type="other"
                      {...register("nome")}
                    />
                  </FormGroup>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormGroup label="E-mail" htmlFor={`${id}-email`} error={errors.email?.message}>
                      <Input
                        id={`${id}-email`}
                        type="email"
                        autoComplete="email"
                        placeholder="voce@email.com"
                        variant={errors.email ? "error" : "default"}
                        disabled={isSubmitting}
                        data-lpignore="true"
                        data-1p-ignore="true"
                        data-form-type="other"
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
                        data-lpignore="true"
                        data-1p-ignore="true"
                        data-form-type="other"
                        {...register("whatsapp")}
                      />
                    </FormGroup>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`${id}-interesse`} className="text-sm font-medium text-foreground">
                      Interesse principal
                    </label>
                    <div className="relative">
                      <select
                        id={`${id}-interesse`}
                        defaultValue=""
                        disabled={isSubmitting}
                        className="w-full appearance-none rounded-xl border border-input bg-[var(--color-surface-raised)] px-4 py-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                        {...register("interesse")}
                      >
                        <option value="" disabled>
                          Selecione
                        </option>
                        {MAIN_INTEREST_OPTIONS.map((option) => (
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
                    {errors.interesse && <p className="text-xs text-destructive">{errors.interesse.message}</p>}
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
                        Quero receber novidades
                      </span>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Seus dados estão protegidos e tratados em conformidade com a LGPD.
                  </p>
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
