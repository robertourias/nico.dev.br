"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import { type Project } from "../data/projects"
import ProjectCard from "./ProjectCard"

interface ProjectsFilterProps {
  projects: Project[]
}

export default function ProjectsFilter({ projects }: ProjectsFilterProps) {
  const t = useTranslations("projects")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Extract unique categories from projects list
  const categories = useMemo(() => {
    const list: string[] = []
    projects.forEach((p) => {
      if (Array.isArray(p.category)) {
        p.category.forEach((c) => {
          if (typeof c === "string") {
            list.push(c.trim())
          }
        })
      } else if (typeof p.category === "string") {
        list.push((p.category as string).trim())
      }
    })
    return Array.from(new Set(list)).filter(Boolean).sort()
  }, [projects])

  // Filter projects based on search query and selected category
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      let matchesCategory = true
      if (selectedCategory) {
        if (Array.isArray(project.category)) {
          matchesCategory = project.category.some(
            (c) => typeof c === "string" && c.trim() === selectedCategory.trim()
          )
        } else if (typeof project.category === "string") {
          matchesCategory = (project.category as string).trim() === selectedCategory.trim()
        } else {
          matchesCategory = false
        }
      }

      const matchesSearch = searchQuery
        ? project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true
      return matchesCategory && matchesSearch
    })
  }, [projects, selectedCategory, searchQuery])

  const handleClearFilters = () => {
    setSelectedCategory(null)
    setSearchQuery("")
  }

  return (
    <div className="space-y-10">
      {/* Search and Filters Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-outline-variant/20">
        {/* Search Input */}
        <div className="w-full md:max-w-md relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors duration-200">
            <svg
              className="w-5 h-5 text-on-surface-variant/60 group-focus-within:text-primary transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full bg-surface-container-low hover:bg-surface-container transition-colors duration-300 border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-on-surface-variant/50 rounded-xl pl-12 pr-10 py-3 text-sm focus:outline-none shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-3 flex items-center text-on-surface-variant/60 hover:text-on-surface transition-colors"
              aria-label="Limpar pesquisa"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Categories Badges */}
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${
              selectedCategory === null
                ? "bg-primary text-on-primary border-primary shadow-md shadow-primary/20 scale-[1.02]"
                : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface border-outline-variant/30"
            }`}
          >
            {t("allCategories")}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${
                selectedCategory === category
                  ? "bg-primary text-on-primary border-primary shadow-md shadow-primary/20 scale-[1.02]"
                  : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface border-outline-variant/30"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of projects */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-surface-container-low rounded-2xl border border-outline-variant/20">
          <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant/40 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="font-display text-lg font-bold text-on-surface mb-2">
            {t("noProjectsFound")}
          </h3>
          <p className="text-on-surface-variant text-sm max-w-xs mb-6">
            Tente mudar a categoria selecionada ou limpe a busca por texto.
          </p>
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center px-4 py-2 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container font-bold text-xs uppercase tracking-widest rounded-xl transition-colors shadow-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 15H19" />
            </svg>
            {t("clearFilters")}
          </button>
        </div>
      )}
    </div>
  )
}
