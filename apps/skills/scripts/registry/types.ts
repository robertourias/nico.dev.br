import type { z } from 'zod';

import type {
  packSchema,
  registryPackSchema,
  registrySchema,
  registrySkillSchema,
  skillFrontmatterSchema,
} from './schema';

export type SkillFrontmatter = z.output<typeof skillFrontmatterSchema>;
export type PackDefinition = z.output<typeof packSchema>;
export type RegistrySkill = z.output<typeof registrySkillSchema>;
export type RegistryPack = z.output<typeof registryPackSchema>;
export type Registry = z.output<typeof registrySchema>;

/** `file` relativo à raiz de conteúdo; `field` em formato Zod-path (`metadata.category`). */
export interface RegistryError {
  file: string;
  field: string;
  message: string;
}

export type BuildResult = { ok: true; registry: Registry } | { ok: false; errors: RegistryError[] };
