// Núcleo do registry: lê skills/packs de uma raiz de conteúdo, valida e devolve o Registry.
// Função pura (só lê disco): escrita, process.exit e argv ficam no CLI (TASK04).
import { readdir, readFile, stat } from 'node:fs/promises';

import matter from 'gray-matter';
import { parse as parseYaml } from 'yaml';
import type { z } from 'zod';

import { installCommandTemplates, repoConfig } from '../../catalog.config';
import { formatFieldPath, packSchema, skillFrontmatterSchema } from './schema';
import type {
  BuildResult,
  PackDefinition,
  RegistryError,
  RegistryPack,
  RegistrySkill,
} from './types';

const SKILL_FILE = 'SKILL.md';
const FRONTMATTER_START = /^﻿?---\r?\n/;

// Comparação por code unit (não localeCompare) para a ordem não depender do locale da máquina.
function compareStrings(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function toErrors(file: string, error: z.ZodError): RegistryError[] {
  return error.issues.map((issue) => ({
    file,
    field: formatFieldPath(issue.path),
    message: issue.message,
  }));
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function isDirectory(path: string): Promise<boolean> {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
}

// Diretório ausente é tolerado (raiz vazia = registry válido); a raiz em si é checada antes.
async function listDir(path: string) {
  try {
    return await readdir(path, { withFileTypes: true });
  } catch {
    return [];
  }
}

// Caminhos relativos à pasta da skill, sempre com `/` (o registry é publicado, não depende do SO).
async function listFilesRecursive(dir: string, prefix = ''): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const relative = `${prefix}${entry.name}`;
      return entry.isDirectory()
        ? listFilesRecursive(`${dir}/${entry.name}`, `${relative}/`)
        : [relative];
    }),
  );
  return nested.flat().sort(compareStrings);
}

// Retorna erros em vez de lançar: o build coleta todos antes de falhar.
async function loadSkill(
  root: string,
  slug: string,
): Promise<{ skill: RegistrySkill; hidden: boolean } | { errors: RegistryError[] }> {
  const dirRel = `${repoConfig.skillsDir}/${slug}`;
  const fileRel = `${dirRel}/${SKILL_FILE}`;

  let raw: string;
  try {
    raw = await readFile(`${root}/${fileRel}`, 'utf8');
  } catch {
    return { errors: [{ file: dirRel, field: SKILL_FILE, message: `pasta sem ${SKILL_FILE}` }] };
  }

  // gray-matter devolve data vazio sem erro quando não há frontmatter; precisamos distinguir.
  if (!FRONTMATTER_START.test(raw)) {
    return {
      errors: [
        {
          file: fileRel,
          field: 'frontmatter',
          message: 'frontmatter ausente (esperado bloco --- no topo)',
        },
      ],
    };
  }

  let data: unknown;
  let content: string;
  try {
    const parsed = matter(raw);
    data = parsed.data;
    content = parsed.content;
  } catch (error) {
    return {
      errors: [
        { file: fileRel, field: 'frontmatter', message: `YAML malformado: ${errorMessage(error)}` },
      ],
    };
  }

  const result = skillFrontmatterSchema.safeParse(data);
  if (!result.success) return { errors: toErrors(fileRel, result.error) };

  const { name, description, metadata } = result.data;
  if (name !== slug) {
    return {
      errors: [
        {
          file: fileRel,
          field: 'name',
          message: `name "${name}" difere do nome da pasta "${slug}"`,
        },
      ],
    };
  }

  return {
    hidden: metadata.visibility === 'hidden',
    skill: {
      slug,
      title: metadata.title,
      description,
      category: metadata.category,
      tags: metadata.tags,
      agents: metadata.agents,
      version: metadata.version,
      status: metadata.status,
      language: metadata.language,
      visibility: 'public',
      updated: metadata.updated,
      files: await listFilesRecursive(`${root}/${dirRel}`),
      content: content.trim(),
      installCommands: {
        repository: installCommandTemplates.repository,
        skill: installCommandTemplates.skill(slug),
        manual: installCommandTemplates.manual(slug),
      },
      githubUrl: `${repoConfig.githubUrl}/tree/main/${repoConfig.skillsDir}/${slug}`,
    },
  };
}

async function loadPack(
  root: string,
  fileName: string,
): Promise<{ pack: PackDefinition } | { errors: RegistryError[] }> {
  const file = `${repoConfig.packsDir}/${fileName}`;

  let data: unknown;
  try {
    data = parseYaml(await readFile(`${root}/${file}`, 'utf8'));
  } catch (error) {
    return { errors: [{ file, field: '', message: `YAML malformado: ${errorMessage(error)}` }] };
  }

  const result = packSchema.safeParse(data);
  return result.success ? { pack: result.data } : { errors: toErrors(file, result.error) };
}

/**
 * Lê `<root>/skills/<slug>/SKILL.md` e `<root>/packs/<id>.yaml`, valida tudo e coleta TODOS os erros.
 * Ordem dos erros (determinística): skills por nome de pasta, depois packs por nome de arquivo.
 */
export async function buildRegistry(root: string): Promise<BuildResult> {
  if (!(await isDirectory(root))) {
    return {
      ok: false,
      errors: [
        {
          file: '.',
          field: 'root',
          message: `raiz de conteúdo inexistente ou não é um diretório: ${root}`,
        },
      ],
    };
  }

  const errors: RegistryError[] = [];

  const skillDirs = (await listDir(`${root}/${repoConfig.skillsDir}`))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort(compareStrings);

  const publicSkills: RegistrySkill[] = [];
  const hiddenSlugs = new Set<string>();
  // Skills inválidas já têm erro próprio; um pack que as cita não deve gerar erro em cascata.
  const invalidSlugs = new Set<string>();

  for (const slug of skillDirs) {
    const result = await loadSkill(root, slug);
    if ('errors' in result) {
      errors.push(...result.errors);
      invalidSlugs.add(slug);
    } else if (result.hidden) {
      // Validada, mas nunca entra na saída (FR-009).
      hiddenSlugs.add(slug);
    } else {
      publicSkills.push(result.skill);
    }
  }

  const publicSlugs = new Set(publicSkills.map((skill) => skill.slug));

  const packFiles = (await listDir(`${root}/${repoConfig.packsDir}`))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.yaml'))
    .map((entry) => entry.name)
    .sort(compareStrings);

  const packs: RegistryPack[] = [];
  const packFileById = new Map<string, string>();

  for (const fileName of packFiles) {
    const file = `${repoConfig.packsDir}/${fileName}`;
    const result = await loadPack(root, fileName);
    if ('errors' in result) {
      errors.push(...result.errors);
      continue;
    }
    const { pack } = result;
    let packOk = true;

    const expectedId = fileName.replace(/\.yaml$/, '');
    if (pack.id !== expectedId) {
      packOk = false;
      errors.push({
        file,
        field: 'id',
        message: `id "${pack.id}" difere do nome do arquivo "${expectedId}"`,
      });
    }

    // Duplicidade é checada mesmo com id != arquivo, e reportada no arquivo que aparece depois
    // (ordem alfabética), citando o primeiro. O primeiro dono do id vale mesmo se inválido.
    const firstFile = packFileById.get(pack.id);
    if (firstFile === undefined) {
      packFileById.set(pack.id, file);
    } else {
      packOk = false;
      errors.push({
        file,
        field: 'id',
        message: `id "${pack.id}" duplicado (já usado em ${firstFile})`,
      });
    }

    pack.skills.forEach((slug, index) => {
      if (publicSlugs.has(slug) || invalidSlugs.has(slug)) return;
      packOk = false;
      errors.push({
        file,
        field: `skills[${index}]`,
        message: hiddenSlugs.has(slug)
          ? `skill "${slug}" está oculta (visibility: hidden); packs só podem citar skills públicas`
          : `skill "${slug}" não existe entre as skills públicas`,
      });
    });

    if (packOk) {
      packs.push({
        id: pack.id,
        title: pack.title,
        description: pack.description,
        skills: pack.skills,
        installCommands: { repository: installCommandTemplates.repository },
      });
    }
  }

  if (errors.length > 0) return { ok: false, errors };

  publicSkills.sort(
    (a, b) => compareStrings(b.updated, a.updated) || compareStrings(a.slug, b.slug),
  );
  packs.sort((a, b) => compareStrings(a.id, b.id));

  return {
    ok: true,
    registry: {
      schemaVersion: 1,
      counts: { skills: publicSkills.length, packs: packs.length },
      // ISO YYYY-MM-DD ordena lexicograficamente; após o sort desc o primeiro é o maior.
      lastUpdated: publicSkills[0]?.updated ?? null,
      skills: publicSkills,
      packs,
    },
  };
}
