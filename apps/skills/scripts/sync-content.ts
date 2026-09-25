// Sync do conteúdo do catálogo: clone raso do repo `robertourias/skills` e cópia de
// `skills/` e `packs/` para `content/` (lido pelo registry). Só node:child_process + node:fs.
// Uso: `tsx scripts/sync-content.ts`. Env: SKILLS_REF (padrão "main"), SKILLS_ROOT (no-op),
// SKILLS_REPO_URL (override, usado só em teste).
import { execFileSync } from 'node:child_process';
import { cp, mkdtemp, readdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { repoConfig } from '../catalog.config';

const APP_DIR = resolve(fileURLToPath(import.meta.url), '../..');
export const DEFAULT_CONTENT_DIR = resolve(APP_DIR, 'content');
export const DEFAULT_REF = 'main';
const KEEP = '.gitkeep';

export class SyncError extends Error {}

export type SyncResult =
  | { skipped: true; root: string }
  | { skipped: false; repo: string; sha: string; skills: number; packs: number };

export interface SyncOptions {
  env?: Record<string, string | undefined>;
  contentDir?: string;
  // Binário do git; sobrescrito só em teste (simula git ausente).
  gitCommand?: string;
}

function git(cmd: string, args: string[], cwd?: string): string {
  return execFileSync(cmd, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function gitStderr(error: unknown): string {
  const e = error as { stderr?: Buffer | string; message?: string };
  const stderr = e.stderr?.toString().trim();
  return stderr || (e.message ?? String(error));
}

function assertGitAvailable(cmd: string): void {
  try {
    git(cmd, ['--version']);
  } catch {
    throw new SyncError('git não encontrado no PATH: o sync precisa dele para clonar o repo de skills.');
  }
}

// Branch/tag entram por `--branch`; SHA (que o clone não aceita) cai no fetch da ref.
function cloneRepo(cmd: string, url: string, ref: string, dest: string): void {
  try {
    git(cmd, ['clone', '--depth', '1', '--branch', ref, url, dest]);
    return;
  } catch (cloneError) {
    try {
      git(cmd, ['init', '--quiet', dest]);
      git(cmd, ['remote', 'add', 'origin', url], dest);
      git(cmd, ['fetch', '--depth', '1', 'origin', ref], dest);
      git(cmd, ['checkout', '--quiet', 'FETCH_HEAD'], dest);
    } catch {
      throw new SyncError(`falha ao clonar ${url}@${ref}: ${gitStderr(cloneError)}`);
    }
  }
}

async function isDirectory(path: string): Promise<boolean> {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
}

// Esvazia a pasta preservando o `.gitkeep` versionado; cria a pasta se não existir.
async function clearDir(dir: string): Promise<void> {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  await Promise.all(
    entries
      .filter((entry) => entry.name !== KEEP)
      .map((entry) =>
        rm(join(dir, entry.name), { recursive: true, force: true, maxRetries: 5, retryDelay: 100 }),
      ),
  );
}

async function replaceDir(from: string | null, to: string): Promise<void> {
  await clearDir(to);
  if (from) {
    await cp(from, to, { recursive: true });
  }
}

async function countSkills(dir: string): Promise<number> {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  return entries.filter((entry) => entry.isDirectory()).length;
}

async function countPacks(dir: string): Promise<number> {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  return entries.filter((entry) => entry.isFile() && /\.ya?ml$/.test(entry.name)).length;
}

export async function syncContent(options: SyncOptions = {}): Promise<SyncResult> {
  const env = options.env ?? process.env;
  const contentDir = options.contentDir ?? DEFAULT_CONTENT_DIR;

  if (env.SKILLS_ROOT) {
    return { skipped: true, root: env.SKILLS_ROOT };
  }

  const url = env.SKILLS_REPO_URL || repoConfig.githubUrl;
  const ref = env.SKILLS_REF || DEFAULT_REF;

  const cmd = options.gitCommand ?? 'git';
  assertGitAvailable(cmd);

  const tmp = await mkdtemp(join(tmpdir(), 'skills-sync-'));
  try {
    const clone = join(tmp, 'repo');
    cloneRepo(cmd, url, ref, clone);

    const skillsSrc = join(clone, repoConfig.skillsDir);
    const packsSrc = join(clone, repoConfig.packsDir);
    if (!(await isDirectory(skillsSrc))) {
      throw new SyncError(`o repo ${url}@${ref} não tem a pasta ${repoConfig.skillsDir}/.`);
    }

    const sha = git(cmd, ['rev-parse', '--short', 'HEAD'], clone);

    await replaceDir(skillsSrc, join(contentDir, repoConfig.skillsDir));
    await replaceDir((await isDirectory(packsSrc)) ? packsSrc : null, join(contentDir, repoConfig.packsDir));

    return {
      skipped: false,
      repo: url === repoConfig.githubUrl ? repoConfig.slug : url,
      sha,
      skills: await countSkills(join(contentDir, repoConfig.skillsDir)),
      packs: await countPacks(join(contentDir, repoConfig.packsDir)),
    };
  } finally {
    // O .git clonado tem arquivos somente-leitura no Windows: force + retries.
    await rm(tmp, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  }
}

export async function main(): Promise<void> {
  try {
    const result = await syncContent();
    if (result.skipped) {
      process.stdout.write(`SKILLS_ROOT definida (${result.root}): raiz local, sync ignorado.
`);
      return;
    }
    process.stdout.write(
      `content sincronizado de ${result.repo}@${result.sha} (${result.skills} skills, ${result.packs} packs)
`,
    );
  } catch (error) {
    console.error(`sync-content: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}

const isDirectRun =
  process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  void main();
}
