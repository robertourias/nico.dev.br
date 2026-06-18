"use client"

import { useId, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react"
import { joinWaitlist } from "../_actions/subscribe"

const formSchema = z.object({
  name: z.string().min(2, "Informe seu nome."),
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
})

type FormValues = z.infer<typeof formSchema>

interface WaitlistFormProps {
  submitLabel?: string
  className?: string
}

// Formulário com identidade própria desta landing — inputs e botão são
// marcação custom (não os componentes de @nico.dev/ui), conforme exigência
// de identidade visual exclusiva do briefing. Usa react-hook-form + zod
// (bibliotecas, não "design system") e uma server action stub, no mesmo
// padrão das demais landings do app.
export function WaitlistForm({ submitLabel = "Quero Acesso Antecipado", className }: WaitlistFormProps) {
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
    defaultValues: { name: "", email: "" },
  })

  async function onSubmit(values: FormValues) {
    const result = await joinWaitlist(values)

    if (result.status === "success") {
      setSubmitted(true)
      reset()
      return
    }

    setError("email", { type: "server", message: result.message })
  }

  if (submitted) {
    return (
      <div
        className={`apice-glass apice-glow rounded-2xl p-6 flex items-start gap-3 text-left w-full max-w-md ${className ?? ""}`}
        role="status"
      >
        <CheckCircle2 className="size-6 text-[var(--apice-neon)] shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="font-semibold text-[var(--apice-fg)]">Cadastro confirmado!</p>
          <p className="text-sm text-[var(--apice-fg-muted)] mt-1">
            Você garantiu sua vaga na lista de espera. Avisaremos por e-mail em primeira mão sobre o
            lançamento e a condição exclusiva de pré-venda.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={`flex flex-col gap-3 w-full max-w-md ${className ?? ""}`}
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-name`} className="sr-only">
          Seu nome
        </label>
        <input
          id={`${id}-name`}
          autoComplete="name"
          placeholder="Seu nome"
          disabled={isSubmitting}
          aria-invalid={!!errors.name}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-[var(--apice-fg)] placeholder:text-[var(--apice-fg-faint)] outline-none transition-colors focus:border-[var(--apice-purple)] focus:bg-white/[0.07]"
          {...register("name")}
        />
        {errors.name && <p className="text-xs text-[var(--apice-rose)]">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-email`} className="sr-only">
          Seu e-mail
        </label>
        <input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
          disabled={isSubmitting}
          aria-invalid={!!errors.email}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-[var(--apice-fg)] placeholder:text-[var(--apice-fg-faint)] outline-none transition-colors focus:border-[var(--apice-purple)] focus:bg-white/[0.07]"
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-[var(--apice-rose)]">{errors.email.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
        style={{ backgroundImage: "var(--apice-gradient-primary)" }}
      >
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <ArrowRight className="size-4" aria-hidden="true" />
        )}
        {isSubmitting ? "Enviando..." : submitLabel}
      </button>
    </form>
  )
}
