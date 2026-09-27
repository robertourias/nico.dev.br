// Somente servidor: lê public/registry.json via fs no build.
// `import "server-only"` não é usado: o pacote não é dependência do app (nem resolvível sem
// instalar) e este módulo precisa rodar sob node --test. Usar `fs` já impede o bundle de cliente.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { registrySchema } from '../../scripts/registry/schema';
import type { SkillListItem } from './skills';

export interface RegistryData {
  items: SkillListItem[];
  counts: { skills: number; packs: number };
  lastUpdated: string | null;
  installCommands: { repository: string };
}

export const REGISTRY_COMMAND = 'pnpm --filter @nico.dev/skills registry';

export const DEFAULT_REGISTRY_PATH = join(process.cwd(), 'public', 'registry.json');

/** Lógica pura com caminho injetável (testável). */
export function loadRegistry(path: string): RegistryData {
  if (!existsSync(path)) {
    throw new Error(
      `registry.json não encontrado em ${path}. Gere-o com: ${REGISTRY_COMMAND}`,
    );
  }
  const registry = registrySchema.parse(JSON.parse(readFileSync(path, 'utf8')));
  // Mapeamento explícito: content/files nunca chegam ao cliente.
  const items = registry.skills.map(
    (skill): SkillListItem => ({
      slug: skill.slug,
      title: skill.title,
      description: skill.description,
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
