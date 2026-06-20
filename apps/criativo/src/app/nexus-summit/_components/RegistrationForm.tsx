"use client"

import { useEffect, useId, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react"
import { registerForEvent } from "../_actions/register"
import { SELECTED_PLAN_STORAGE_KEY, PLAN_LABELS } from "../_lib/plan"

const formSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo."),
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
  phone: z.string().min(8, "Informe um telefone válido com DDD."),
  company: z.string().min(2, "Informe sua empresa."),
  role: z.string().min(2, "Informe seu cargo."),
  plan: z.enum(["standard", "premium", "vip"]),
  lgpdConsent: z.boolean().refine((v) => v === true, {
    message: "É necessário aceitar os termos de tratamento de dados (LGPD) para continuar.",
  }),
})

type FormValues = z.infer<typeof formSchema>

const inputClass =
  "w-full rounded-xl bg-white border border-[var(--nexus-border)] px-4 py-3 text-sm text-[var(--nexus-fg)] placeholder:text-[var(--nexus-fg-faint)] outline-none transition-colors focus:border-[var(--nexus-purple)]"

// Formulário com identidade própria desta landing (inputs custom, não os
// componentes de @nico.dev/ui), mesmo padrão de `WaitlistForm.tsx` em
// `pre-venda-metodo-apice`. O campo `plan` é pré-selecionado a partir do
// localStorage gravado por `PricingSection` (simulação leve de "compra de
// ingresso" sem dados de pagamento reais).
export function RegistrationForm() {
  const id = useId()
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      role: "",
      plan: "standard",
      lgpdConsent: false,
    },
  })

  const selectedPlan = watch("plan")

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(SELECTED_PLAN_STORAGE_KEY)
      if (stored === "standard" || stored === "premium" || stored === "vip") {
        setValue("plan", stored)
      }
    } catch {
      // Ambiente sem localStorage — mantém o padrão "standard".
    }
  }, [setValue])

  async function onSubmit(values: FormValues) {
    const result = await registerForEvent(values)

    if (result.status === "success") {
      setSubmitted(true)
      reset()
      return
    }

    setError("email", { type: "server", message: result.message })
  }

  if (submitted) {
    return (
      <div className="nexus-glass nexus-glow rounded-2xl p-6 flex items-start gap-3 text-left w-full max-w-lg" role="status">
        <CheckCircle2 className="size-6 text-[var(--nexus-emerald)] shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="font-semibold text-[var(--nexus-fg)]">Inscrição confirmada!</p>
          <p className="text-sm text-[var(--nexus-fg-muted)] mt-1">
            Você garantiu sua vaga no NEXUS Summit. Enviamos os detalhes de credenciamento e a programação
            completa para o seu e-mail.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 w-full max-w-lg">
      <span className="self-start inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-[var(--nexus-purple)] bg-[var(--nexus-purple)]/10">
        Plano selecionado: {PLAN_LABELS[selectedPlan]}
      </span>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-name`} className="text-xs font-medium text-[var(--nexus-fg-muted)]">
            Nome completo
          </label>
          <input
            id={`${id}-name`}
            autoComplete="name"
            placeholder="Seu nome completo"
            disabled={isSubmitting}
            aria-invalid={!!errors.name}
            className={inputClass}
            {...register("name")}
          />
          {errors.name && <p className="text-xs text-[var(--nexus-rose)]">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-email`} className="text-xs font-medium text-[var(--nexus-fg-muted)]">
            E-mail
          </label>
          <input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            disabled={isSubmitting}
            aria-invalid={!!errors.email}
            className={inputClass}
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-[var(--nexus-rose)]">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-phone`} className="text-xs font-medium text-[var(--nexus-fg-muted)]">
            Telefone
          </label>
          <input
            id={`${id}-phone`}
            type="tel"
            autoComplete="tel"
            placeholder="(11) 98765-4321"
            disabled={isSubmitting}
            aria-invalid={!!errors.phone}
            className={inputClass}
            {...register("phone")}
          />
          {errors.phone && <p className="text-xs text-[var(--nexus-rose)]">{errors.phone.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-company`} className="text-xs font-medium text-[var(--nexus-fg-muted)]">
            Empresa
          </label>
          <input
            id={`${id}-company`}
            autoComplete="organization"
            placeholder="Sua empresa"
            disabled={isSubmitting}
            aria-invalid={!!errors.company}
            className={inputClass}
            {...register("company")}
          />
          {errors.company && <p className="text-xs text-[var(--nexus-rose)]">{errors.company.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor={`${id}-role`} className="text-xs font-medium text-[var(--nexus-fg-muted)]">
            Cargo
          </label>
          <input
            id={`${id}-role`}
            autoComplete="organization-title"
            placeholder="Seu cargo"
            disabled={isSubmitting}
            aria-invalid={!!errors.role}
            className={inputClass}
            {...register("role")}
          />
          {errors.role && <p className="text-xs text-[var(--nexus-rose)]">{errors.role.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-[var(--nexus-fg-muted)]">Plano de interesse</span>
        <div className="grid grid-cols-3 gap-2">
          {(["standard", "premium", "vip"] as const).map((plan) => (
            <label
              key={plan}
              className={`cursor-pointer text-center rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                selectedPlan === plan
                  ? "border-[var(--nexus-purple)] text-[var(--nexus-purple)] bg-[var(--nexus-purple)]/5"
                  : "border-[var(--nexus-border)] text-[var(--nexus-fg-muted)]"
              }`}
            >
              <input type="radio" value={plan} className="sr-only" {...register("plan")} />
              {PLAN_LABELS[plan]}
            </label>
          ))}
        </div>
      </div>

      <Controller
        control={control}
        name="lgpdConsent"
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                disabled={isSubmitting}
                className="mt-0.5 size-4 accent-[var(--nexus-purple)]"
              />
              <span className="text-xs text-[var(--nexus-fg-muted)] leading-snug">
                Concordo com o tratamento dos meus dados pessoais conforme a LGPD, para fins de organização do
                evento e envio de comunicações relacionadas.
              </span>
            </label>
            {errors.lgpdConsent && <p className="text-xs text-[var(--nexus-rose)]">{errors.lgpdConsent.message}</p>}
          </div>
        )}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
        style={{ backgroundImage: "var(--nexus-gradient-cta)" }}
      >
        {isSubmitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <ArrowRight className="size-4" aria-hidden="true" />}
        {isSubmitting ? "Enviando..." : "Confirmar Inscrição"}
      </button>
    </form>
  )
}
