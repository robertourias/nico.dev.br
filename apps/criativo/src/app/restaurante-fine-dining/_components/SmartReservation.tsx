"use client"

import { useId, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Users,
  CalendarDays,
  Clock,
  Heart,
  Briefcase,
  Cake,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CalendarCheck,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react"
import { Button, FormGroup, Input, Alert, AlertDescription } from "@nico.dev/ui"
import { submitReservation } from "../_actions/submitReservation"
import {
  PARTY_SIZE_OPTIONS,
  TIME_SLOT_OPTIONS,
  OCCASION_OPTIONS,
  SEATING_OPTIONS,
  type OccasionIcon,
} from "../_lib/data"
import { Reveal } from "./Reveal"

const OCCASION_ICONS: Record<OccasionIcon, LucideIcon> = {
  heart: Heart,
  briefcase: Briefcase,
  cake: Cake,
  users: Users,
}

const formSchema = z.object({
  partySize: z.string().min(1, "Selecione a quantidade de pessoas."),
  date: z.string().min(1, "Selecione a data."),
  time: z.string().min(1, "Selecione o horário."),
  occasion: z.string().min(1, "Selecione a ocasião."),
  seatingPreferences: z.array(z.string()),
  nome: z.string().min(2, "Informe seu nome."),
  telefone: z.string().min(8, "Informe um telefone válido."),
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
  observacoes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

const STEPS: { title: string; fields: (keyof FormValues)[] }[] = [
  { title: "Sua reserva", fields: ["partySize", "date", "time"] },
  { title: "Personalize", fields: ["occasion"] },
  { title: "Seus dados", fields: ["nome", "telefone", "email"] },
  { title: "Resumo", fields: [] },
]

export function SmartReservation() {
  const id = useId()
  const [step, setStep] = useState(0)
  const [confirmation, setConfirmation] = useState<string | null>(null)
  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), [])

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partySize: "",
      date: "",
      time: "",
      occasion: "",
      seatingPreferences: [],
      nome: "",
      telefone: "",
      email: "",
      observacoes: "",
    },
  })

  const values = watch()
  const isLastStep = step === STEPS.length - 1
  const progressPercent = ((step + 1) / STEPS.length) * 100

  async function goNext() {
    const fields = STEPS[step].fields
    const valid = fields.length === 0 || (await trigger(fields))
    if (valid) setStep((current) => Math.min(current + 1, STEPS.length - 1))
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0))
  }

  function toggleSeating(value: string) {
    const current = values.seatingPreferences ?? []
    setValue(
      "seatingPreferences",
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    )
  }

  async function onSubmit(formValues: FormValues) {
    const result = await submitReservation(formValues)
    if (result.status === "success") {
      setConfirmation(result.confirmationCode)
    }
  }

  if (confirmation) {
    return (
      <div className="rest-glass rounded-3xl p-8 md:p-10 text-center max-w-lg mx-auto">
        <span
          className="inline-flex items-center justify-center size-16 rounded-full text-[var(--color-primary-foreground)] mb-5"
          style={{ backgroundImage: "var(--rest-gradient-gold)" }}
        >
          <CheckCircle2 className="size-8" aria-hidden="true" />
        </span>
        <h3 className="text-2xl font-semibold text-foreground mb-2 rest-font-serif">Reserva confirmada</h3>
        <p className="text-muted-foreground mb-1">
          Sua mesa para {values.partySize} foi reservada em {values.date} às {values.time}.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Código de confirmação: <span className="font-semibold text-foreground">{confirmation}</span>
        </p>
        <p className="text-xs text-muted-foreground">Enviamos os detalhes para {values.email}.</p>
      </div>
    )
  }

  return (
    <div className="rest-glass rounded-3xl p-6 md:p-10 max-w-2xl mx-auto">
      <div className="mb-9">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-3">
          {STEPS.map((s, index) => (
            <span key={s.title} data-state={index === step ? "active" : index < step ? "done" : "pending"} className="rest-step-dot text-center flex-1">
              {s.title}
            </span>
          ))}
        </div>
        <div className="rest-step-line h-1.5 rounded-full" style={{ "--rest-step-progress": progressPercent / 100 } as React.CSSProperties} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {step === 0 && (
          <Reveal key="step-0" className="rest-step-panel flex flex-col gap-7">
            <div>
              <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Users className="size-4" style={{ color: "var(--color-primary)" }} aria-hidden="true" />
                Quantidade de pessoas
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PARTY_SIZE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setValue("partySize", option.value)}
                    data-active={values.partySize === option.value}
                    className="rest-filter-chip rounded-xl border border-border px-3 py-3 text-sm font-medium text-foreground"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {errors.partySize && <p className="text-xs text-destructive mt-2">{errors.partySize.message}</p>}
            </div>

            <FormGroup label="Data desejada" htmlFor={`${id}-date`} error={errors.date?.message}>
              <div className="relative">
                <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
                <Input
                  id={`${id}-date`}
                  type="date"
                  min={todayIso}
                  variant={errors.date ? "error" : "default"}
                  className="pl-10"
                  {...register("date")}
                />
              </div>
            </FormGroup>

            <div>
              <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Clock className="size-4" style={{ color: "var(--color-primary)" }} aria-hidden="true" />
                Horário
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {TIME_SLOT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setValue("time", option.value)}
                    data-active={values.time === option.value}
                    className="rest-filter-chip rounded-xl border border-border px-2 py-2.5 text-sm font-medium text-foreground"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {errors.time && <p className="text-xs text-destructive mt-2">{errors.time.message}</p>}
            </div>
          </Reveal>
        )}

        {step === 1 && (
          <Reveal key="step-1" className="rest-step-panel flex flex-col gap-7">
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Qual é a ocasião?</p>
              <div className="grid grid-cols-2 gap-3">
                {OCCASION_OPTIONS.map((option) => {
                  const Icon = OCCASION_ICONS[option.icon]
                  const isActive = values.occasion === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setValue("occasion", option.value)}
                      data-active={isActive}
                      className="rest-filter-chip flex flex-col items-center gap-2 rounded-xl border border-border px-4 py-5 text-center"
                    >
                      <Icon className="size-5" style={{ color: isActive ? "var(--color-primary)" : undefined }} aria-hidden="true" />
                      <span className="text-sm font-medium text-foreground">{option.label}</span>
                    </button>
                  )
                })}
              </div>
              {errors.occasion && <p className="text-xs text-destructive mt-2">{errors.occasion.message}</p>}
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-3">Preferências (opcional)</p>
              <div className="flex flex-wrap gap-2.5">
                {SEATING_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleSeating(option.value)}
                    data-active={(values.seatingPreferences ?? []).includes(option.value)}
                    className="rest-filter-chip rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {step === 2 && (
          <Reveal key="step-2" className="rest-step-panel flex flex-col gap-4">
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
                  autoComplete="tel"
                  placeholder="(11) 99999-9999"
                  variant={errors.telefone ? "error" : "default"}
                  disabled={isSubmitting}
                  {...register("telefone")}
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
              <label htmlFor={`${id}-observacoes`} className="text-sm font-medium text-foreground">
                Observações <span className="text-muted-foreground font-normal">(opcional)</span>
              </label>
              <textarea
                id={`${id}-observacoes`}
                rows={3}
                placeholder="Alguma restrição alimentar ou pedido especial?"
                disabled={isSubmitting}
                className="w-full rounded-xl border border-input bg-[var(--color-surface-raised)] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                {...register("observacoes")}
              />
            </div>
          </Reveal>
        )}

        {step === 3 && (
          <Reveal key="step-3" className="rest-step-panel flex flex-col gap-5">
            <p className="text-sm font-medium text-foreground">Resumo da sua reserva</p>
            <dl className="rounded-2xl border border-border bg-[var(--color-surface-raised)] divide-y divide-border">
              {[
                ["Pessoas", values.partySize],
                ["Data", values.date],
                ["Horário", values.time],
                ["Ocasião", OCCASION_OPTIONS.find((o) => o.value === values.occasion)?.label ?? "—"],
                [
                  "Preferências",
                  (values.seatingPreferences ?? []).length > 0
                    ? values.seatingPreferences!
                        .map((value) => SEATING_OPTIONS.find((o) => o.value === value)?.label)
                        .filter(Boolean)
                        .join(", ")
                    : "Sem preferências",
                ],
                ["Nome", values.nome],
                ["Telefone", values.telefone],
                ["E-mail", values.email],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 px-5 py-3">
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
                  <dd className="text-sm font-medium text-foreground text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}

        {(errors.partySize || errors.date || errors.time || errors.occasion) && step === 3 && (
          <Alert variant="error" className="mt-4">
            <AlertDescription>Revise as etapas anteriores antes de confirmar.</AlertDescription>
          </Alert>
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
                  Confirmando...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <CalendarCheck className="size-4" aria-hidden="true" />
                  Confirmar Reserva
                </span>
              )}
            </Button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="rest-cta-highlight inline-flex items-center gap-1.5 rounded-full px-6 py-3 text-sm font-semibold text-[var(--color-primary-foreground)]"
              style={{ backgroundImage: "var(--rest-gradient-gold)" }}
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
