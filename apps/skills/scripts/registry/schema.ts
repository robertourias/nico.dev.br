// Schemas Zod do registry (frontmatter da skill, pack e saída). Sem imports de
// next/react: roda via tsx fora do Next. Enums vêm da config para não divergirem.
import { z } from 'zod';

import { AGENTS, CATEGORIES, STATUSES } from '../../catalog.config';

const KEBAB_CASE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * gray-matter (js-yaml) converte `updated: 2026-09-20` sem aspas em Date à meia-noite UTC.
 * Usar getters locais deslocaria o dia em fusos negativos, então serializamos em UTC.
 * Date inválida passa adiante como string para falhar na validação com mensagem clara.
 */
export function normalizeDate(value: unknown): unknown {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? 'Invalid Date' : value.toISOString().slice(0, 10);
  }
  return value;
}

/** `mermaid-diagrams` → `Mermaid Diagrams` (título padrão quando `metadata.title` é omitido). */
export function toTitleCase(slug: string): string {
  return slug
    .split('-')
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** Caminho Zod → `field` do RegistryError (`metadata.tags[2]`, `skills[0]`). */
export function formatFieldPath(path: readonly PropertyKey[]): string {
  return path.reduce<string>((acc, segment) => {
    if (typeof segment === 'number') return `${acc}[${segment}]`;
    const key = String(segment);
    return acc === '' ? key : `${acc}.${key}`;
  }, '');
}

// Regex sozinho aceitaria 2026-13-40; o round-trip por Date pega mês/dia inexistentes (ex.: 02-30).
function isRealCalendarDate(value: string): boolean {
  const match = ISO_DATE.exec(value);
  if (!match) return false;
  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

const kebabCase = z.string().regex(KEBAB_CASE, 'deve estar em kebab-case');

const isoDate = z.preprocess(
  normalizeDate,
  // Um único refine (sem regex separado) para não emitir dois issues no mesmo campo.
  z.string().refine(isRealCalendarDate, 'esperado data ISO válida no formato YYYY-MM-DD'),
);

// z.object descarta chaves desconhecidas: outros agentes podem adicionar campos sem quebrar o build.
const metadataSchema = z.object({
  title: z.string().min(1).optional(),
  category: z.enum(CATEGORIES),
  tags: z.array(kebabCase).max(8).default([]),
  agents: z.array(z.enum(AGENTS)).default(['claude-code']),
  version: z.string().regex(SEMVER, 'esperado semver MAJOR.MINOR.PATCH'),
  status: z.enum(STATUSES),
  visibility: z.enum(['public', 'hidden']).default('public'),
  updated: isoDate,
  language: z.string().min(1).default('pt-BR'),
});

// O título padrão depende de `name`, por isso é resolvido após a validação dos dois campos.
export const skillFrontmatterSchema = z
  .object({
    name: kebabCase,
    description: z.string().min(20).max(1024),
    metadata: metadataSchema,
  })
  .transform((data) => ({
    ...data,
    metadata: { ...data.metadata, title: data.metadata.title ?? toTitleCase(data.name) },
  }));

export const packSchema = z.object({
  id: kebabCase,
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  skills: z
    .array(kebabCase)
    .min(1)
    .superRefine((slugs, ctx) => {
      const seen = new Set<string>();
      slugs.forEach((slug, index) => {
        if (seen.has(slug)) {
          // Aponta o índice duplicado (skills[2]) em vez do array inteiro.
          ctx.addIssue({ code: 'custom', path: [index], message: `skill "${slug}" duplicada` });
        }
        seen.add(slug);
      });
    }),
});

// Contrato publicado em /registry.json; os tipos exportados em types.ts derivam daqui.
export const registrySkillSchema = z.object({
  slug: kebabCase,
  title: z.string(),
  description: z.string(),
  category: z.enum(CATEGORIES),
  tags: z.array(z.string()),
  agents: z.array(z.enum(AGENTS)),
  version: z.string(),
  status: z.enum(STATUSES),
  language: z.string(),
  visibility: z.literal('public'),
  updated: z.string(),
  files: z.array(z.string()),
  content: z.string(),
  installCommands: z.object({ repository: z.string(), skill: z.string(), manual: z.string() }),
  githubUrl: z.string(),
});

export const registryPackSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  skills: z.array(z.string()),
  installCommands: z.object({ repository: z.string() }),
});

export const registrySchema = z.object({
  schemaVersion: z.literal(1),
  counts: z.object({ skills: z.number().int(), packs: z.number().int() }),
  lastUpdated: z.string().nullable(),
  skills: z.array(registrySkillSchema),
  packs: z.array(registryPackSchema),
});
