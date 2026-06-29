"use client"

import { useMemo, useState } from "react"
import {
  Search,
  MapPin,
  Wallet,
  ChevronDown,
  Heart,
  Share2,
  Check,
  SearchX,
  X,
} from "lucide-react"
import {
  JOBS,
  SENIORITY_OPTIONS,
  MODALITY_OPTIONS,
  CONTRACT_OPTIONS,
  type Job,
  type Modality,
  type ContractType,
  type Seniority,
} from "../_lib/data"
import { Reveal } from "./Reveal"

const STACK_OPTIONS = Array.from(new Set(JOBS.flatMap((job) => job.stack))).sort()

// Centerpiece interativo: busca de vagas mockada com filtros funcionais
// (cargo/empresa, stack, senioridade, modalidade e tipo de contratação),
// favoritar e "aplicar" (simulado em memória, sem backend) — demonstra a
// experiência de busca unificada descrita no briefing.
export function JobSearchSection() {
  const [query, setQuery] = useState("")
  const [stack, setStack] = useState("")
  const [seniority, setSeniority] = useState<Seniority | "">("")
  const [modality, setModality] = useState<Modality | "">("")
  const [contractType, setContractType] = useState<ContractType | "">("")
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [appliedIds, setAppliedIds] = useState<string[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return JOBS.filter((job) => {
      if (normalizedQuery) {
        const haystack = `${job.title} ${job.company}`.toLowerCase()
        if (!haystack.includes(normalizedQuery)) return false
      }
      if (stack && !job.stack.includes(stack)) return false
      if (seniority && job.seniority !== seniority) return false
      if (modality && job.modality !== modality) return false
      if (contractType && job.contractType !== contractType) return false
      return true
    })
  }, [query, stack, seniority, modality, contractType])

  const hasActiveFilters = Boolean(query || stack || seniority || modality || contractType)

  function clearAll() {
    setQuery("")
    setStack("")
    setSeniority("")
    setModality("")
    setContractType("")
  }

  function toggleSaved(id: string) {
    setSavedIds((current) => (current.includes(id) ? current.filter((i) => i !== id) : [...current, id]))
  }

  function applyTo(id: string) {
    setAppliedIds((current) => (current.includes(id) ? current : [...current, id]))
  }

  return (
    <section id="vagas" className="relative px-6 py-20 md:py-28 bg-[var(--devpath-bg-soft)]" aria-labelledby="jobs-title">
      <div className="max-w-6xl mx-auto">
        <Reveal className="max-w-2xl mb-10">
          <p className="devpath-mono text-xs text-[var(--devpath-green)] mb-3">// busca_de_vagas</p>
          <h2 id="jobs-title" className="text-3xl md:text-4xl font-bold text-[var(--devpath-fg)] mb-3">
            Vagas de tecnologia, agregadas de uma vez
          </h2>
          <p className="text-[var(--devpath-fg-muted)]">
            Combine cargo, stack, senioridade, modelo de trabalho e tipo de contratação para encontrar exatamente a
            vaga certa — sem precisar abrir dez abas diferentes.
          </p>
        </Reveal>

        <Reveal className="rounded-2xl border border-[var(--devpath-border)] bg-[var(--devpath-bg-raised)] p-5 mb-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="flex flex-col gap-1.5 lg:col-span-2">
              <label className="text-xs font-medium text-[var(--devpath-fg-muted)]" htmlFor="job-query">
                Cargo ou empresa
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--devpath-fg-faint)] pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="job-query"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ex: Frontend, Nimbus Tech..."
                  className="w-full rounded-xl border border-[var(--devpath-border)] bg-[var(--devpath-bg)] pl-9 pr-3.5 py-2.5 text-sm text-[var(--devpath-fg)] placeholder:text-[var(--devpath-fg-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--devpath-green)] transition-colors"
                />
              </div>
            </div>

            <FilterSelect
              label="Stack"
              value={stack}
              onChange={setStack}
              options={[{ value: "", label: "Qualquer stack" }, ...STACK_OPTIONS.map((s) => ({ value: s, label: s }))]}
            />
            <FilterSelect
              label="Senioridade"
              value={seniority}
              onChange={(v) => setSeniority(v as Seniority | "")}
              options={[
                { value: "", label: "Qualquer senioridade" },
                ...SENIORITY_OPTIONS.map((s) => ({ value: s, label: s })),
              ]}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[var(--devpath-fg-muted)] mr-1">Modelo:</span>
            <Chip active={modality === ""} onClick={() => setModality("")} label="Qualquer" />
            {MODALITY_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                active={modality === option.value}
                onClick={() => setModality(option.value)}
                label={option.label}
              />
            ))}

            <span className="text-xs font-medium text-[var(--devpath-fg-muted)] ml-3 mr-1">Contratação:</span>
            <Chip active={contractType === ""} onClick={() => setContractType("")} label="Qualquer" />
            {CONTRACT_OPTIONS.map((option) => (
              <Chip key={option} active={contractType === option} onClick={() => setContractType(option)} label={option} />
            ))}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[var(--devpath-green)] hover:underline"
              >
                <X className="size-3.5" aria-hidden="true" />
                Limpar filtros
              </button>
            )}
          </div>
        </Reveal>

        <p className="text-sm text-[var(--devpath-fg-muted)] mb-6">
          {filtered.length} {filtered.length === 1 ? "vaga encontrada" : "vagas encontradas"}
        </p>

        {filtered.length === 0 ? (
          <Reveal className="rounded-2xl border border-dashed border-[var(--devpath-border)] p-12 text-center">
            <SearchX className="size-8 mx-auto mb-3 text-[var(--devpath-fg-faint)]" aria-hidden="true" />
            <p className="font-semibold text-[var(--devpath-fg)] mb-1">Nenhuma vaga encontrada</p>
            <p className="text-sm text-[var(--devpath-fg-muted)] mb-4">Ajuste os filtros para ver mais opções.</p>
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-semibold text-[#04140e]"
              style={{ backgroundImage: "var(--devpath-gradient-primary)" }}
            >
              Limpar filtros
            </button>
          </Reveal>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((job, index) => (
              <Reveal key={job.id} delayMs={Math.min(index, 4) * 60}>
                <JobCard
                  job={job}
                  saved={savedIds.includes(job.id)}
                  applied={appliedIds.includes(job.id)}
                  expanded={expandedId === job.id}
                  onToggleSave={() => toggleSaved(job.id)}
                  onApply={() => applyTo(job.id)}
                  onToggleExpand={() => setExpandedId((current) => (current === job.id ? null : job.id))}
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active}
      className="rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors"
      style={
        active
          ? {
              borderColor: "var(--devpath-green)",
              background: "rgba(52,211,153,0.14)",
              color: "var(--devpath-green)",
            }
          : {
              borderColor: "var(--devpath-border)",
              color: "var(--devpath-fg-muted)",
            }
      }
    >
      {label}
    </button>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[var(--devpath-fg-muted)]">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-xl border border-[var(--devpath-border)] bg-[var(--devpath-bg)] px-3.5 py-2.5 pr-9 text-sm text-[var(--devpath-fg)] focus:outline-none focus:ring-2 focus:ring-[var(--devpath-green)] transition-colors"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[var(--devpath-fg-faint)] pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

interface JobCardProps {
  job: Job
  saved: boolean
  applied: boolean
  expanded: boolean
  onToggleSave: () => void
  onApply: () => void
  onToggleExpand: () => void
}

function JobCard({ job, saved, applied, expanded, onToggleSave, onApply, onToggleExpand }: JobCardProps) {
  return (
    <div className="devpath-card-hover rounded-2xl border border-[var(--devpath-border)] bg-[var(--devpath-bg-raised)] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3.5">
          <span
            className="inline-flex items-center justify-center size-11 rounded-xl text-sm font-bold text-[#04140e] shrink-0"
            style={{ background: job.companyColor }}
            aria-hidden="true"
          >
            {job.companyInitials}
          </span>
          <div>
            <h3 className="font-semibold text-[var(--devpath-fg)]">{job.title}</h3>
            <p className="text-sm text-[var(--devpath-fg-muted)]">
              {job.company} · {job.seniority} · {job.contractType}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSave}
            aria-pressed={saved}
            aria-label={saved ? "Remover dos favoritos" : "Salvar vaga"}
            className="inline-flex items-center justify-center size-9 rounded-lg border border-[var(--devpath-border)] text-[var(--devpath-fg-muted)] hover:text-[var(--devpath-rose)] transition-colors"
          >
            <Heart className={`size-4 ${saved ? "fill-[var(--devpath-rose)] text-[var(--devpath-rose)]" : ""}`} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Compartilhar vaga"
            className="inline-flex items-center justify-center size-9 rounded-lg border border-[var(--devpath-border)] text-[var(--devpath-fg-muted)] hover:text-[var(--devpath-cyan)] transition-colors"
          >
            <Share2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--devpath-fg-muted)] mb-4">
        <span className="flex items-center gap-1.5">
          <Wallet className="size-4" aria-hidden="true" />
          {job.salaryLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="size-4" aria-hidden="true" />
          {job.location} · {job.modality === "remoto" ? "Remoto" : job.modality === "hibrido" ? "Híbrido" : "Presencial"}
        </span>
        <span className="text-[var(--devpath-fg-faint)]">{job.postedLabel}</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.stack.map((tech) => (
          <span
            key={tech}
            className="devpath-mono rounded-md border border-[var(--devpath-border)] px-2 py-1 text-[0.7rem] text-[var(--devpath-fg-muted)]"
          >
            {tech}
          </span>
        ))}
      </div>

      {expanded && (
        <div className="rounded-xl bg-[var(--devpath-bg)] border border-[var(--devpath-border)] p-4 mb-4 text-sm">
          <p className="text-[var(--devpath-fg-muted)] mb-3">
            Vaga {job.seniority.toLowerCase()} de {job.title.toLowerCase()} na {job.company}, modelo{" "}
            {job.modality === "remoto" ? "remoto" : job.modality === "hibrido" ? "híbrido" : "presencial"}, contratação{" "}
            {job.contractType}. Agregada via {job.source} — confira a descrição completa, requisitos e diferenciais na
            página da vaga.
          </p>
          <p className="text-xs font-medium text-[var(--devpath-fg-faint)] mb-1.5">Benefícios</p>
          <div className="flex flex-wrap gap-2">
            {job.benefits.map((benefit) => (
              <span
                key={benefit}
                className="rounded-full bg-[rgba(52,211,153,0.1)] text-[var(--devpath-green)] px-2.5 py-1 text-xs"
              >
                {benefit}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onApply}
          disabled={applied}
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-[#04140e] disabled:opacity-70 disabled:cursor-default transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
          style={{ backgroundImage: applied ? undefined : "var(--devpath-gradient-primary)", background: applied ? "var(--devpath-bg)" : undefined, color: applied ? "var(--devpath-green)" : undefined, border: applied ? "1px solid var(--devpath-green)" : undefined }}
        >
          {applied ? (
            <>
              <Check className="size-4" aria-hidden="true" /> Candidatura enviada
            </>
          ) : (
            "Aplicar"
          )}
        </button>
        <button
          type="button"
          onClick={onToggleExpand}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--devpath-fg-muted)] hover:text-[var(--devpath-fg)] transition-colors"
        >
          {expanded ? "Ocultar detalhes" : "Ver detalhes"}
          <ChevronDown className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
