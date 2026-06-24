"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, BadgeCheck, Instagram } from "lucide-react"
import { Reveal } from "./Reveal"
import { TEACHERS } from "../_lib/data"

function getVisibleCount() {
  if (typeof window === "undefined") return 1
  if (window.innerWidth >= 1024) return 3
  if (window.innerWidth >= 640) return 2
  return 1
}

export function TeachersCarousel() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(3)
  const timeoutRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const update = () => setVisible(getVisibleCount())
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const maxIndex = Math.max(TEACHERS.length - visible, 0)

  const goTo = useCallback(
    (i: number) => {
      setIndex(Math.min(Math.max(i, 0), maxIndex))
    },
    [maxIndex]
  )

  useEffect(() => {
    timeoutRef.current = setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1))
    }, 5500)
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current)
    }
  }, [maxIndex])

  return (
    <section id="professores" className="px-6 py-20 md:py-28 scroll-mt-20 bg-[var(--color-surface)]" aria-labelledby="teachers-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-14 max-w-2xl mx-auto">
          <h2 id="teachers-title" className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Nossos <span className="aca-highlight">Professores</span>
          </h2>
          <p className="text-muted-foreground text-lg aca-heading-alt">
            Profissionais certificados, prontos para acompanhar sua evolução de perto.
          </p>
        </Reveal>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="aca-carousel-track"
              style={{ transform: `translateX(-${index * (100 / visible)}%)` }}
            >
              {TEACHERS.map((teacher) => (
                <div key={teacher.name} className="shrink-0 px-2.5" style={{ width: `${100 / visible}%` }}>
                  <div className="aca-card-hover h-full rounded-2xl border border-border bg-[var(--color-surface-raised)] p-7 flex flex-col items-center text-center">
                    <span
                      className="inline-flex items-center justify-center size-20 rounded-full text-2xl font-bold text-[var(--color-primary-foreground)] mb-4"
                      style={{ backgroundImage: "var(--aca-gradient-primary)" }}
                      aria-hidden="true"
                    >
                      {teacher.initials}
                    </span>
                    <p className="font-bold text-foreground aca-heading-alt text-lg">{teacher.name}</p>
                    <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wide mb-3">
                      {teacher.specialty}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{teacher.bio}</p>

                    <div className="flex flex-col gap-1.5 mb-4 w-full">
                      {teacher.certifications.map((cert) => (
                        <span key={cert} className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                          <BadgeCheck className="size-3.5 shrink-0 text-[var(--color-secondary)]" aria-hidden="true" />
                          {cert}
                        </span>
                      ))}
                    </div>

                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      aria-label={`Instagram de ${teacher.name}`}
                      className="inline-flex items-center justify-center size-9 rounded-full border border-border text-muted-foreground hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
                    >
                      <Instagram className="size-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {maxIndex > 0 && (
            <>
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                disabled={index === 0}
                aria-label="Professor anterior"
                className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 items-center justify-center size-10 rounded-full aca-glass text-foreground hover:text-[var(--color-primary)] transition-colors disabled:opacity-30"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                disabled={index === maxIndex}
                aria-label="Próximo professor"
                className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 items-center justify-center size-10 rounded-full aca-glass text-foreground hover:text-[var(--color-primary)] transition-colors disabled:opacity-30"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
