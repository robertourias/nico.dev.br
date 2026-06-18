"use client"

import { useId, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button, FormGroup, Input, Alert, AlertDescription } from "@nico.dev/ui"
import { subscribeToNewsletter } from "../_actions/subscribe"

const formSchema = z.object({
  email: z.string().min(1, "Informe seu e-mail.").email("Informe um e-mail válido."),
})

type FormValues = z.infer<typeof formSchema>

export function NewsletterForm() {
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
    defaultValues: { email: "" },
  })

  async function onSubmit(values: FormValues) {
    const result = await subscribeToNewsletter(values)

    if (result.status === "success") {
      setSubmitted(true)
      reset()
      return
    }

    setError("email", { type: "server", message: result.message })
  }

  if (submitted) {
    return (
      <Alert variant="success" className="w-full max-w-md text-left">
        <AlertDescription>
          Inscrição confirmada! Fique de olho na sua caixa de entrada na próxima edição.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-3 w-full max-w-md"
    >
      <FormGroup
        label="Seu melhor e-mail"
        htmlFor={`${id}-email`}
        error={errors.email?.message}
      >
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

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Enviando..." : "Quero assinar gratuitamente"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Sem spam. Cancele quando quiser.
      </p>
    </form>
  )
}
