"use client"

import { useEffect, useState } from "react"
import { X, ChevronLeft, ChevronRight, MapPin, Zap, Wallet } from "lucide-react"
import { PROJECTS, type Project } from "../_lib/data"
import { formatCurrency } from "../_lib/calculations"
import { Reveal } from "./Reveal"

// Mosaico irregular (não um grid uniforme): alternando spans de coluna/linha
// por índice, conforme briefing. Cada card abre um modal com a galeria
// completa de fotos do projeto, navegável.
const MOSAIC_SPANS = [
  "sm:col-span-2 sm:row-span-2",
  "sm:col-span-1 sm:row-span-1",
  "sm:col-span-1 sm:row-span-1",
  "sm:col-span-1 sm:row-span-1",
  "sm:col-span-1 sm:row-span-2",
  "sm:col-span-2 sm:row-span-1",
]

export function ProjectGallery() {
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [photoIndex, setPhotoIndex] = useState(0)

  useEffect(() => {
    if (!activeProject) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveProject(null)
      if (e.key === "ArrowRight") setPhotoIndex((i) => (i + 1) % activeProject.gallery.length)
      if (e.key === "ArrowLeft") setPhotoIndex((i) => (i - 1 + activeProject.gallery.length) % activeProject.gallery.length)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [activeProject])

  const openProject = (project: Project) => {
    setActiveProject(project)
    setPhotoIndex(0)
  }

  return (
    <section id="projetos" className="px-6 py-16 md:py-24 scroll-mt-20" aria-labelledby="gallery-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-12">
          <p className="text-sm font-semibold mb-2" style={{ color: "var(--solar-blue-light)" }}>
            Projetos reais
          </p>
          <h2 id="gallery-title" className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Casas que já <span className="solar-gradient-text">produzem sua própria energia</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-4 auto-rows-[11rem] sm:auto-rows-[9.5rem] gap-4">
          {PROJECTS.map((project, index) => (
            <Reveal
              key={project.id}
              variant="scale-in"
              delayMs={index * 60}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer solar-card-hover ${MOSAIC_SPANS[index % MOSAIC_SPANS.length]}`}
            >
              <button
                type="button"
                onClick={() => openProject(project)}
                className="absolute inset-0 w-full h-full text-left"
                aria-label={`Ver fotos do projeto em ${project.city}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={`Instalação de energia solar em ${project.city}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="flex items-center gap-1 text-xs font-medium text-white/85 mb-1">
                    <MapPin className="size-3" aria-hidden="true" />
                    {project.city}
                  </p>
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      <Zap className="size-3" style={{ color: "var(--solar-yellow)" }} aria-hidden="true" />
                      {project.powerKwp} kWp
                    </span>
                    <span className="flex items-center gap-1">
                      <Wallet className="size-3" style={{ color: "var(--solar-green)" }} aria-hidden="true" />
                      {formatCurrency(project.monthlySavings)}/mês
                    </span>
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {activeProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Galeria do projeto em ${activeProject.city}`}
          onClick={() => setActiveProject(null)}
        >
          <div
            className="solar-modal-panel relative w-full max-w-2xl rounded-2xl bg-[var(--color-surface-raised)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveProject(null)}
              aria-label="Fechar galeria"
              className="absolute top-3 right-3 z-10 inline-flex items-center justify-center size-9 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="size-4" aria-hidden="true" />
            </button>

            <div className="relative aspect-video bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeProject.gallery[photoIndex]}
                alt={`Foto ${photoIndex + 1} do projeto em ${activeProject.city}`}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {activeProject.gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setPhotoIndex((i) => (i - 1 + activeProject.gallery.length) % activeProject.gallery.length)
                    }
                    aria-label="Foto anterior"
                    className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center size-9 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="size-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoIndex((i) => (i + 1) % activeProject.gallery.length)}
                    aria-label="Próxima foto"
                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center size-9 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="size-5" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>

            <div className="p-5 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="flex items-center gap-1 font-semibold text-foreground">
                  <MapPin className="size-4" style={{ color: "var(--solar-blue-light)" }} aria-hidden="true" />
                  {activeProject.city}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {activeProject.powerKwp} kWp instalados · {formatCurrency(activeProject.monthlySavings)} de economia/mês
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {photoIndex + 1} / {activeProject.gallery.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
