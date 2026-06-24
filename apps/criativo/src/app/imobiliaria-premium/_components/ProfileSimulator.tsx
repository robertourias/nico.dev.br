"use client"

import { useId, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageCircle,
  CheckCircle2,
  Wallet,
  Building2,
  MapPin,
  Target,
} from "lucide-react"
import { Button, FormGroup, Input } from "@nico.dev/ui"
import { submitLead } from "../_actions/submitLead"
import { BUDGET_OPTIONS, LIFESTYLES, REGIONS, PURPOSE_OPTIONS, type RegionKey } from "../_lib/data"
import { Reveal } from "./Reveal"

const formSchema = z.object({
  budget: z.string().min(1, "Selecione uma faixa de orçamento."),
  tipo: z.string().min(1, "Selecione o tipo de imóvel."),
  regiao: z.string().min(1, "Selecione a região desejada."),
  objetivo: z.string().min(1, "Selecione o objetivo."),
  nome: z.string().min(2, "Informe seu nome."),
  whatsapp: z.string().min(8, "Informe um WhatsApp válido."),
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
})

type FormValues = z.infer<typeof formSchema>

const STEPS = ["Orçamento", "Tipo de imóvel", "Região", "Objetivo", "Seu perfil"] as const

const BUDGET_FACTOR: Record<string, number> = {
  "até-600k": 1.3,
  "600k-1.5mi": 1,
  "1.5mi-4mi": 0.6,
  "acima-4mi": 0.3,
}

function computeMatches(budget: string, regiao: RegionKey, objetivo: string) {
  const region = REGIONS.find((r) => r.key === regiao)
  let base = region ? Math.round(region.propertiesCount * 0.18) : 14
  if (objetivo === "investir") base = Math.round(base * 0.7)
  base = Math.round(base * (BUDGET_FACTOR[budget] ?? 1))
  return Math.max(4, Math.min(base, 32))
}

export function ProfileSimulator() {
  const id = useId()
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { budget: "", tipo: "", regiao: "", objetivo: "", nome: "", whatsapp: "", email: "" },
  })

  const values = watch()
  const isLastStep = step === STEPS.length - 1
  const progressPercent = ((step + 1) / STEPS.length) * 100

  const fieldsByStep: (keyof FormValues)[][] = [["budget"], ["tipo"], ["regiao"], ["objetivo"], ["nome", "whatsapp", "email"]]

  async function goNext() {
    const valid = await trigger(fieldsByStep[step])
    if (valid) setStep((current) => Math.min(current + 1, STEPS.length - 1))
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0))
  }

  async function onSubmit(formValues: FormValues) {
    const tipoLabel = LIFESTYLES.find((l) => l.key === formValues.tipo)?.title ?? formValues.tipo
    const result = await submitLead({
      nome: formValues.nome,
      email: formValues.email,
      whatsapp: formValues.whatsapp,
      interesse: `Simulador de perfil — ${tipoLabel}`,
      origem: "simulador-perfil",
    })
    if (result.status === "success") setSubmitted(true)
  }

  const matches = values.regiao && values.budget && values.objetivo ? computeMatches(values.budget, values.regiao as RegionKey, values.objetivo) : 0

  if (submitted) {
    return (
      <div className="imob-glass imob-glow rounded-3xl p-8 md:p-10 text-center max-w-lg mx-auto">
        <span
          className="inline-flex items-center justify-center size-16 rounded-full text-[var(--color-primary-foreground)] mb-5"
          style={{ backgroundImage: "var(--imob-gradient-primary)" }}
        >
          <CheckCircle2 className="size-8" aria-hidden="true" />
        </span>
        <h3 className="text-2xl font-semibold text-foreground mb-2 imob-font-serif">Recomendações a caminho</h3>
        <p className="text-muted-foreground mb-1">
          Nossa equipe vai te enviar os {matches} imóveis compatíveis pelo WhatsApp em breve.
        </p>
        <p className="text-sm text-muted-foreground">Confirmamos os detalhes também por e-mail: {values.email}.</p>
      </div>
    )
  }

  return (
    <div className="imob-glass imob-glow rounded-3xl p-6 md:p-10 max-w-2xl mx-auto">
      <div className="mb-9">
        <div className="hidden sm:flex items-center justify-between text-xs font-medium text-muted-foreground mb-3">
          {STEPS.map((title, index) => (
            <span
              key={title}
              data-state={index === step ? "active" : index < step ? "done" : "pending"}
              className="imob-step-dot text-center flex-1"
            >
              {title}
            </span>
          ))}
        </div>
        <div
          className="imob-step-line h-1.5 rounded-full"
          style={{ "--imob-step-progress": progressPercent / 100 } as React.CSSProperties}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {step === 0 && (
          <Reveal key="step-0" className="flex flex-col gap-4">
            <p className="text-sm font-medium text-foreground flex items-center gap-2">
              <Wallet className="size-4" style={{ color: "var(--imob-moss)" }} aria-hidden="true" />
              Qual é a sua faixa de orçamento?
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {BUDGET_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setValue("budget", option.value)}
                  data-active={values.budget === option.value}
                  className="imob-filter-chip rounded-xl border border-border px-3 py-3 text-sm font-medium text-foreground"
                >
                  {option.label}
                </button>
              ))}
            </div>
            {errors.budget && <p className="text-xs text-destructive">{errors.budget.message}</p>}
          </Reveal>
        )}

        {step === 1 && (
          <Reveal key="step-1" className="flex flex-col gap-4">
            <p className="text-sm font-medium text-foreground flex items-center gap-2">
              <Building2 className="size-4" style={{ color: "var(--imob-moss)" }} aria-hidden="true" />
              Que tipo de imóvel você procura?
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {LIFESTYLES.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setValue("tipo", option.key)}
                  data-active={values.tipo === option.key}
                  className="imob-filter-chip rounded-xl border border-border px-3 py-3 text-sm font-medium text-foreground text-center"
                >
                  {option.title}
                </button>
              ))}
            </div>
            {errors.tipo && <p className="text-xs text-destructive">{errors.tipo.message}</p>}
          </Reveal>
        )}

        {step === 2 && (
          <Reveal key="step-2" className="flex flex-col gap-4">
            <p className="text-sm font-medium text-foreground flex items-center gap-2">
              <MapPin className="size-4" style={{ color: "var(--imob-moss)" }} aria-hidden="true" />
              Qual região você deseja?
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {REGIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setValue("regiao", option.key)}
                  data-active={values.regiao === option.key}
                  className="imob-filter-chip rounded-xl border border-border px-3 py-3 text-sm font-medium text-foreground"
                >
                  {option.title}
                </button>
              ))}
            </div>
            {errors.regiao && <p className="text-xs text-destructive">{errors.regiao.message}</p>}
          </Reveal>
        )}

        {step === 3 && (
          <Reveal key="step-3" className="flex flex-col gap-4">
            <p className="text-sm font-medium text-foreground flex items-center gap-2">
              <Target className="size-4" style={{ color: "var(--imob-moss)" }} aria-hidden="true" />
              Qual é o seu objetivo?
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {PURPOSE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setValue("objetivo", option.value)}
                  data-active={values.objetivo === option.value}
                  className="imob-filter-chip rounded-xl border border-border px-3 py-4 text-sm font-medium text-foreground"
                >
                  {option.label}
                </button>
              ))}
            </div>
            {errors.objetivo && <p className="text-xs text-destructive">{errors.objetivo.message}</p>}
          </Reveal>
        )}

        {step === 4 && (
          <Reveal key="step-4" className="flex flex-col gap-5">
            <div className="rounded-xl p-5 text-center" style={{ backgroundImage: "var(--imob-gradient-soft)" }}>
              <p className="text-sm text-muted-foreground mb-1">Com base no seu perfil</p>
              <p className="text-3xl font-bold imob-font-serif text-foreground">
                Temos {matches || "12"} imóveis compatíveis com seu perfil
              </p>
            </div>

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
          </Reveal>
        )}

        <div className="flex items-center justify-between mt-9">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground disabled:opacity-40 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            Voltar
          </button>

          {isLastStep ? (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Enviando...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Receber recomendações por WhatsApp
                </span>
              )}
            </Button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="imob-cta-highlight inline-flex items-center gap-1.5 rounded-full px-6 py-3 text-sm font-semibold text-[var(--color-primary-foreground)]"
              style={{ backgroundImage: "var(--imob-gradient-primary)" }}
            >
              Próximo
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
