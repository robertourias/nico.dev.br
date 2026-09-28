// Somente servidor: lê public/registry.json via fs no build.
// `import "server-only"` não é usado: o pacote não é dependência do app (nem resolvível sem
// instalar) e este módulo precisa rodar sob node --test. Usar `fs` já impede o bundle de cliente.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { skillsShConfig } from '../../catalog.config';
import { registrySchema } from '../../scripts/registry/schema';
import type { Registry } from '../../scripts/registry/types';
import type { SkillDetail, SkillListItem } from './skills';

export interface RegistryData {
  items: SkillListItem[];
  counts: { skills: number; packs: number };
  lastUpdated: string | null;
  installCommands: { repository: string };
}

export const REGISTRY_COMMAND = 'pnpm --filter @nico.dev/skills registry';

export const DEFAULT_REGISTRY_PATH = join(process.cwd(), 'public', 'registry.json');

/** Lê e valida o registry.json uma única vez; `loadRegistry`/`loadSkillDetails` derivam daqui. */
function parseRegistryFile(path: string): Registry {
  if (!existsSync(path)) {
    throw new Error(
      `registry.json não encontrado em ${path}. Gere-o com: ${REGISTRY_COMMAND}`,
    );
  }
  return registrySchema.parse(JSON.parse(readFileSync(path, 'utf8')));
}

/** Lógica pura com caminho injetável (testável). */
export function loadRegistry(path: string): RegistryData {
  const registry = parseRegistryFile(path);
  // Mapeamento explícito: content/files nunca chegam ao cliente.
  const items = registry.skills.map(
    (skill): SkillListItem => ({
      slug: skill.slug,
      title: skill.title,
      description: skill.description,
      category: skill.category,
      tags: skill.tags,
      status: skill.status,
      updated: skill.updated,
      command: skill.installCommands.skill,
    }),
  );
  return {
    items,
    counts: registry.counts,
    lastUpdated: registry.lastUpdated,
    installCommands: registry.installCommands,
  };
}

export function getRegistry(): RegistryData {
  return loadRegistry(DEFAULT_REGISTRY_PATH);
}

/** Projeção completa (para a página de detalhe), a partir do mesmo `Registry` já validado. */
function loadSkillDetails(path: string): SkillDetail[] {
  const registry = parseRegistryFile(path);
  return registry.skills.map(
    (skill): SkillDetail => ({
      slug: skill.slug,
      title: skill.title,
      description: skill.description,
      category: skill.category,
      tags: skill.tags,
      status: skill.status,
      version: skill.version,
      updated: skill.updated,
      files: skill.files,
      content: skill.content,
      installCommands: skill.installCommands,
      githubUrl: skill.githubUrl,
      // Não persistido no registry.json: derivado do slug a cada leitura.
      skillsShUrl: skillsShConfig.skillUrl(skill.slug),
    }),
  );
}

export function getSkill(slug: string): SkillDetail | undefined {
  return loadSkillDetails(DEFAULT_REGISTRY_PATH).find((skill) => skill.slug === slug);
}

/** Slugs de todas as skills públicas, para `generateStaticParams`. */
export function getSkillSlugs(): string[] {
  // O registry só contém skills públicas (hidden é filtrada no build), mas o Set blinda contra
  // duplicatas caso essa invariante mude no futuro.
  return [...new Set(loadSkillDetails(DEFAULT_REGISTRY_PATH).map((skill) => skill.slug))];
}
