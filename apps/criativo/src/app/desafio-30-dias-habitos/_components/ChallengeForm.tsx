"use client"

import { useId, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button, FormGroup, Input, Checkbox, Label, Alert, AlertDescription } from "@nico.dev/ui"
import { subscribeToChallenge } from "../_actions/subscribe"

const formSchema = z.object({
  name: z.string().min(2, "Informe seu nome."),
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
  consent: z.boolean().refine((v) => v === true, {
    message: "É necessário concordar para participar do desafio.",
  }),
})

type FormValues = z.infer<typeof formSchema>

interface ChallengeFormProps {
  /** Texto do botão de envio. Varia entre as seções onde o formulário aparece. */
  submitLabel?: string
  className?: string
}

export function ChallengeForm({ submitLabel = "Quero Participar Gratuitamente", className }: ChallengeFormProps) {
  const id = useId()
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", consent: false },
  })

  async function onSubmit(values: FormValues) {
    const result = await subscribeToChallenge(values)

    if (result.status === "success") {
      setSubmitted(true)
      reset()
      return
    }

    setError("email", { type: "server", message: result.message })
  }

  if (submitted) {
    return (
      <Alert variant="success" className={`w-full max-w-md text-left ${className ?? ""}`}>
        <AlertDescription>
          Cadastro confirmado! Seu primeiro desafio chega no seu e-mail em breve.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={`flex flex-col gap-3 w-full max-w-md ${className ?? ""}`}
    >
      <FormGroup label="Seu nome" htmlFor={`${id}-name`} error={errors.name?.message}>
        <Input
          id={`${id}-name`}
          autoComplete="name"
          placeholder="Como podemos te chamar?"
          variant={errors.name ? "error" : "default"}
          disabled={isSubmitting}
          {...register("name")}
        />
      </FormGroup>

      <FormGroup label="Seu melhor e-mail" htmlFor={`${id}-email`} error={errors.email?.message}>
        <Input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          variant={errors.email ? "error" : "default"}
          disabled={isSubmitting}
          {...register("email")}
        />
      </FormGroup>

      <Controller
        control={control}
        name="consent"
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-start gap-2">
              <Checkbox
                id={`${id}-consent`}
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isSubmitting}
                className="mt-0.5"
              />
              <Label htmlFor={`${id}-consent`} className="text-xs font-normal text-muted-foreground leading-snug">
                Concordo em receber comunicações relacionadas ao desafio.
              </Label>
            </div>
            {errors.consent && (
              <p className="text-xs text-destructive">{errors.consent.message}</p>
            )}
          </div>
        )}
      />

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Enviando..." : submitLabel}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Sem spam. Cancele quando quiser.
      </p>
    </form>
  )
}
