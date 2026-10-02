"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export default function Contact() {
  const t = useTranslations("contact");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const schema = z.object({
    name: z.string().min(1, t("validationName")),
    email: z.string().email(t("validationEmail")),
    phone: z.string().min(14, t("validationPhone")),
    message: z.string().min(1, t("validationMessage")),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitStatus("idle");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error();

      setSubmitStatus("success");
      reset();
    } catch {
      setSubmitStatus("error");
    }
  };

  const inputClass =
    "w-full bg-surface-container-high border-none rounded-sm px-4 py-3 focus:ring-1 focus:ring-primary text-on-surface placeholder:text-outline/30 outline-none transition-colors disabled:opacity-50";

  return (
    <section id="contact" className="py-20 md:py-24 px-6 md:px-8 bg-surface-container-lowest" aria-labelledby="contact-title">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
          <div className="md:col-span-6 space-y-10 md:space-y-12">
            <div>
              <h2 id="contact-title" className="font-display text-sm tracking-[0.2em] text-primary uppercase mb-4">
                {t("tag")}
              </h2>
              <h3 className="font-display text-3xl md:text-5xl font-bold text-on-surface">
                {t("title")}
              </h3>
            </div>

            <nav aria-label="Redes sociais">
              <ul className="space-y-6">
                <li>
                  <a
                    className="flex items-center gap-6 group"
                    href="https://www.linkedin.com/in/robertourias/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("ariaLinkedIn")}
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-surface-container rounded-lg group-hover:bg-primary transition-colors">
                      <svg className="w-5 h-5 text-on-surface group-hover:text-on-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-[10px] text-outline uppercase tracking-widest">LinkedIn</div>
                      <div className="text-on-surface font-semibold">/in/robertourias</div>
                    </div>
                  </a>
                </li>

                <li>
                  <a
                    className="flex items-center gap-6 group"
                    href="https://wa.me/5511980927661"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("ariaWhatsApp")}
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-surface-container rounded-lg group-hover:bg-primary transition-colors">
                      <svg className="w-5 h-5 text-on-surface group-hover:text-on-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-[10px] text-outline uppercase tracking-widest">WhatsApp</div>
                      <div className="text-on-surface font-semibold">+55 11 98092-7661</div>
                    </div>
                  </a>
                </li>

                <li>
                  <a
                    className="flex items-center gap-6 group"
                    href="https://github.com/robertourias"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("ariaGitHub")}
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-surface-container rounded-lg group-hover:bg-primary transition-colors">
                      <svg className="w-5 h-5 text-on-surface group-hover:text-on-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.201-6.086 8.201-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-[10px] text-outline uppercase tracking-widest">GitHub</div>
                      <div className="text-on-surface font-semibold">@robertourias</div>
                    </div>
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="md:col-span-6 bg-surface-container-low p-8 md:p-10 rounded-2xl">
            <h4 className="font-display text-xl font-bold mb-8">{t("formTitle")}</h4>

            {submitStatus === "success" && (
              <div role="alert" className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
                {t("success")}
              </div>
            )}

            {submitStatus === "error" && (
              <div role="alert" className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {t("error")}
              </div>
            )}

            <form className="space-y-6" aria-label={t("ariaForm")} onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-outline">
                    {t("labelName")} <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="name"
                    className={inputClass}
                    placeholder={t("placeholderName")}
                    type="text"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    disabled={isSubmitting}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-xs text-red-400">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-outline">
                    {t("labelEmail")} <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="email"
                    className={inputClass}
                    placeholder={t("placeholderEmail")}
                    type="email"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    disabled={isSubmitting}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-xs text-red-400">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-widest text-outline">
                    {t("labelPhone")} <span aria-hidden="true">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field }) => (
                      <input
                        {...field}
                        id="phone"
                        className={inputClass}
                        placeholder={t("placeholderPhone")}
                        type="tel"
                        autoComplete="tel"
                        inputMode="numeric"
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? "phone-error" : undefined}
                        disabled={isSubmitting}
                        onChange={(e) => field.onChange(formatPhone(e.target.value))}
                      />
                    )}
                  />
                  {errors.phone && (
                    <p id="phone-error" className="text-xs text-red-400">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-outline">
                  {t("labelMessage")} <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="message"
                  className={`${inputClass} resize-none`}
                  placeholder={t("placeholderMessage")}
                  rows={4}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  disabled={isSubmitting}
                  {...register("message")}
                />
                {errors.message && (
                  <p id="message-error" className="text-xs text-red-400">{errors.message.message}</p>
                )}
              </div>

              <button
                className="w-full py-4 bg-primary text-on-primary font-bold tracking-widest uppercase text-xs rounded-full hover:bg-primary-container transition-colors shadow-[0_20px_40px_rgba(0,218,243,0.08)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t("submitting")}
                  </>
                ) : (
                  t("submit")
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
