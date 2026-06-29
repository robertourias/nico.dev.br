import { Mail } from "lucide-react"
import { Reveal } from "./Reveal"
import { NewsletterForm } from "./NewsletterForm"

export function NewsletterSection() {
  return (
    <section className="relative px-6 py-20 md:py-24" aria-labelledby="newsletter-title">
      <div className="max-w-4xl mx-auto">
        <Reveal className="devpath-glass rounded-3xl px-8 py-12 md:px-14 md:py-14 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex-1 text-center lg:text-left">
            <span
              className="inline-flex items-center justify-center size-11 rounded-xl text-[#04140e] mb-5"
              style={{ backgroundImage: "var(--devpath-gradient-primary)" }}
              aria-hidden="true"
            >
              <Mail className="size-5" />
            </span>
            <h2 id="newsletter-title" className="text-2xl md:text-3xl font-bold text-[var(--devpath-fg)] mb-3">
              Tendências de carreira, direto no seu e-mail
            </h2>
            <p className="text-[var(--devpath-fg-muted)]">
              Toda semana: as vagas mais relevantes, mudanças salariais e tecnologias em alta.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end w-full lg:w-auto">
            <NewsletterForm />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
