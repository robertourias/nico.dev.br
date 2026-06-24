"use client"

import { useId, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Check, ChevronDown, Loader2, ShieldCheck, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react"
import { Button, FormGroup, Input, Alert, AlertDescription } from "@nico.dev/ui"
import { Reveal } from "./Reveal"
import { submitEnrollment } from "../_actions/submitEnrollment"
import { PLANS, PAYMENT_OPTIONS } from "../_lib/data"

const STEPS = ["Plano", "Dados pessoais", "Confirmação"]

const personalDataSchema = z.object({
  nome: z.string().min(2, "Informe seu nome completo."),
  cpf: z.string().min(11, "Informe um CPF válido."),
  telefone: z.string().min(8, "Informe um telefone válido."),
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
  pagamento: z.string().min(1, "Selecione a forma de pagamento."),
})

type PersonalDataValues = z.infer<typeof personalDataSchema>

function formatPhoneBR(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11)
  if (digits.length === 0) return ""
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function formatCpf(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

export function EnrollmentSection() {
  const id = useId()
  const [step, setStep] = useState(0)
  const [planName, setPlanName] = useState<string | null>(null)
  const [personalData, setPersonalData] = useState<PersonalDataValues | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PersonalDataValues>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: { nome: "", cpf: "", telefone: "", email: "", pagamento: "" },
  })

  const telefoneField = register("telefone")
  const cpfField = register("cpf")
  const selectedPlan = PLANS.find((p) => p.name === planName) ?? null

  function onChoosePlan(name: string) {
    setPlanName(name)
    setStep(1)
  }

  function onPersonalSubmit(values: PersonalDataValues) {
    setPersonalData(values)
    setStep(2)
  }

  async function onConfirm() {
    if (!personalData || !planName) return
    setConfirming(true)
    const result = await submitEnrollment({ ...personalData, plano: planName })
    setConfirming(false)
    if (result.status === "success") {
      setSubmitted(true)
    }
  }

  return (
    <section id="matricula" className="px-6 py-20 md:py-28 scroll-mt-20 bg-[var(--color-surface)]" aria-labelledby="enrollment-title">
      <div className="max-w-3xl mx-auto">
        <Reveal className="text-center mb-10 max-w-2xl mx-auto">
          <h2 id="enrollment-title" className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Matrícula <span className="aca-highlight">Online</span>
          </h2>
          <p className="text-muted-foreground text-lg aca-heading-alt">
            Garanta sua vaga em três passos simples — leva menos de 2 minutos.
          </p>
        </Reveal>

        {!submitted && (
          <Reveal delayMs={80}>
            <div className="flex items-center justify-center gap-3 mb-10">
              {STEPS.map((label, index) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-1.5">
                    <span
                      className={`inline-flex items-center justify-center size-9 rounded-full text-sm font-bold border ${
                        index <= step
                          ? "text-[var(--color-primary-foreground)] border-transparent"
                          : "text-muted-foreground border-border"
                      }`}
                      style={index <= step ? { backgroundImage: "var(--aca-gradient-primary)" } : undefined}
                    >
                      {index < step ? <Check className="size-4" /> : index + 1}
                    </span>
                    <span className={`text-[11px] font-medium ${index <= step ? "text-foreground" : "text-muted-foreground"}`}>
                      {label}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && <div className={`h-px w-10 sm:w-16 ${index < step ? "aca-step-line" : "bg-border"}`} />}
                </div>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal delayMs={120}>
          <div className="aca-glass aca-glow rounded-3xl p-6 md:p-9">
            {submitted ? (
              <Alert variant="success" className="text-left">
                <AlertDescription className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
                  Matrícula recebida! Em breve nossa equipe envia a confirmação e o contrato digital por e-mail.
                </AlertDescription>
              </Alert>
            ) : step === 0 ? (
              <div className="grid sm:grid-cols-3 gap-4">
                {PLANS.map((plan) => (
                  <button
                    key={plan.tier}
                    type="button"
                    onClick={() => onChoosePlan(plan.name)}
                    className={`aca-card-hover text-left rounded-2xl border p-5 ${
                      plan.featured ? "border-[var(--color-primary)]" : "border-border"
                    } bg-[var(--color-surface-raised)]`}
                  >
                    <p className="aca-heading-alt font-semibold text-foreground mb-1">{plan.name}</p>
                    <p className="text-2xl font-bold text-[var(--color-primary)] mb-1" style={{ fontFamily: "var(--font-display)" }}>
                      R$ {plan.price}
                    </p>
                    <p className="text-xs text-muted-foreground">{plan.priceSuffix.replace("/", "por ")}</p>
                  </button>
                ))}
              </div>
            ) : step === 1 ? (
              <form onSubmit={handleSubmit(onPersonalSubmit)} noValidate className="flex flex-col gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormGroup label="Nome completo" htmlFor={`${id}-nome`} error={errors.nome?.message}>
                    <Input
                      id={`${id}-nome`}
                      autoComplete="name"
                      placeholder="Seu nome completo"
                      variant={errors.nome ? "error" : "default"}
                      {...register("nome")}
                    />
                  </FormGroup>
                  <FormGroup label="CPF" htmlFor={`${id}-cpf`} error={errors.cpf?.message}>
                    <Input
                      id={`${id}-cpf`}
                      inputMode="numeric"
                      placeholder="000.000.000-00"
                      variant={errors.cpf ? "error" : "default"}
                      {...cpfField}
                      onChange={(event) => {
                        event.target.value = formatCpf(event.target.value)
                        cpfField.onChange(event)
                      }}
                    />
                  </FormGroup>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormGroup label="Telefone" htmlFor={`${id}-telefone`} error={errors.telefone?.message}>
                    <Input
                      id={`${id}-telefone`}
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="(11) 99999-9999"
                      variant={errors.telefone ? "error" : "default"}
                      {...telefoneField}
                      onChange={(event) => {
                        event.target.value = formatPhoneBR(event.target.value)
                        telefoneField.onChange(event)
                      }}
                    />
                  </FormGroup>
                  <FormGroup label="E-mail" htmlFor={`${id}-email`} error={errors.email?.message}>
                    <Input
                      id={`${id}-email`}
                      type="email"
                      autoComplete="email"
                      placeholder="voce@email.com"
                      variant={errors.email ? "error" : "default"}
                      {...register("email")}
                    />
                  </FormGroup>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`${id}-pagamento`} className="text-sm font-medium text-foreground">
                    Forma de pagamento
                  </label>
                  <div className="relative">
                    <select
                      id={`${id}-pagamento`}
                      defaultValue=""
                      className="w-full appearance-none rounded-xl border border-input bg-[var(--color-surface)] px-4 py-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                      {...register("pagamento")}
                    >
                      <option value="" disabled>
                        Selecione
                      </option>
                      {PAYMENT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
                  </div>
                  {errors.pagamento && <p className="text-xs text-destructive">{errors.pagamento.message}</p>}
                </div>

                <div className="flex items-center justify-between gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-foreground border border-border hover:border-[var(--color-primary)] aca-glass transition-colors"
                  >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    Voltar
                  </button>
                  <Button
                    type="submit"
                    style={{ backgroundImage: "var(--aca-gradient-primary)", borderColor: "transparent", color: "var(--color-primary-foreground)" }}
                  >
                    Continuar
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-5">
                <div className="rounded-2xl border border-border bg-[var(--color-surface-raised)] p-5">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Resumo da matrícula</p>
                  <dl className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Plano</dt>
                      <dd className="font-semibold text-foreground">{selectedPlan?.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Valor</dt>
                      <dd className="font-semibold text-[var(--color-primary)]">
                        R$ {selectedPlan?.price}
                        {selectedPlan?.priceSuffix}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Nome</dt>
                      <dd className="font-medium text-foreground">{personalData?.nome}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">E-mail</dt>
                      <dd className="font-medium text-foreground">{personalData?.email}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Pagamento</dt>
                      <dd className="font-medium text-foreground">
                        {PAYMENT_OPTIONS.find((p) => p.value === personalData?.pagamento)?.label}
                      </dd>
                    </div>
                  </dl>
                </div>

                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="size-3.5 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                  Seus dados estão protegidos e tratados em conformidade com a LGPD.
                </p>

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-foreground border border-border hover:border-[var(--color-primary)] aca-glass transition-colors"
                  >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    Voltar
                  </button>
                  <Button
                    type="button"
                    disabled={confirming}
                    onClick={onConfirm}
                    style={{ backgroundImage: "var(--aca-gradient-primary)", borderColor: "transparent", color: "var(--color-primary-foreground)" }}
                  >
                    {confirming ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                        Confirmando...
                      </span>
                    ) : (
                      "Confirmar matrícula"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
