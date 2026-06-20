import Image from "next/image"
import { type Project } from "../data/projects"

interface ProjectCardProps {
  project: Project
  sizes?: string
  isCarousel?: boolean
}

export default function ProjectCard({
  project,
  sizes = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw",
  isCarousel = false,
}: ProjectCardProps) {
  const stopProp = isCarousel ? (e: React.MouseEvent) => e.stopPropagation() : undefined

  return (
    <article className="group bg-surface-container hover:bg-surface-container-high transition-all duration-300 rounded-xl overflow-hidden">
      <div className="aspect-video relative overflow-hidden bg-surface-container-low">
        <Image
          src={project.image}
          alt={project.title}
          fill
          draggable={!isCarousel}
          sizes={sizes}
          className={`object-cover transition-transform duration-500 ${isCarousel ? "pointer-events-none" : "group-hover:scale-105"}`}
        />
      </div>
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {Array.isArray(project.category) ? (
            project.category.map((cat) => (
              <span
                key={cat}
                className="px-2 py-0.5 bg-surface-container-highest text-[10px] text-on-surface-variant rounded-sm font-label uppercase tracking-widest"
              >
                {cat}
              </span>
            ))
          ) : typeof project.category === "string" ? (
            <span className="px-2 py-0.5 bg-surface-container-highest text-[10px] text-on-surface-variant rounded-sm font-label uppercase tracking-widest">
              {project.category}
            </span>
          ) : null}
        </div>
        <h3 className="font-display text-xl font-bold text-on-surface mb-4 hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
          {project.description}
        </p>
        <div className="flex gap-4 items-center">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-container flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors"
              aria-label={`Ver demonstração do projeto ${project.title}`}
              onClick={stopProp}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Visualizar
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-outline hover:text-on-surface flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors"
              aria-label={`Ver código fonte do projeto ${project.title}`}
              onClick={stopProp}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.201-6.086 8.201-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Repo
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
