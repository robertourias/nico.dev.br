// CLI do registry: resolve a raiz, roda buildRegistry, imprime erros e grava public/registry.json.
// A lógica fica em funções exportadas (sem process.exit) para ser testável; só `main` define o exit code.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildRegistry } from './build';
import type { Registry, RegistryError } from './types';

/** Limite de tamanho do registry.json: 500 KB (500 * 1024 bytes), requisito não funcional da spec de produto. */
export const MAX_REGISTRY_BYTES = 500 * 1024;

/** Diretório do app (apps/skills), independente do cwd. */
export const APP_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

export const DEFAULT_ROOT = resolve(APP_DIR, 'content');
export const OUTPUT_FILE = resolve(APP_DIR, 'public/registry.json');

/** Prioridade: `--root <dir>` (ou `--root=<dir>`), depois env SKILLS_ROOT, depois content/. Relativos usam o cwd. */
export function resolveRoot(
  argv: readonly string[],
  env: Record<string, string | undefined>,
  cwd: string = process.cwd(),
): string {
  let fromFlag: string | undefined;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--root' || arg.startsWith('--root=')) {
      fromFlag = arg === '--root' ? argv[i + 1] : arg.slice('--root='.length);
      if (!fromFlag) throw new Error('--root exige um diretório');
      break;
    }
  }
  const chosen = fromFlag ?? (env.SKILLS_ROOT ? env.SKILLS_ROOT : undefined);
  return chosen ? resolve(cwd, chosen) : DEFAULT_ROOT;
}

/** Uma linha por erro: `arquivo › campo: mensagem`. */
export function formatErrors(errors: readonly RegistryError[]): string[] {
  return errors.map((e) => `${e.file} › ${e.field}: ${e.message}`);
}

/** JSON indentado com 2 espaços e `\n` final. */
export function serializeRegistry(registry: Registry): string {
  return `${JSON.stringify(registry, null, 2)}\n`;
}

/** Retorna mensagem de erro se o conteúdo passar do limite (medido em bytes UTF-8), senão null. */
export function checkSize(json: string, maxBytes: number = MAX_REGISTRY_BYTES): string | null {
  const size = Buffer.byteLength(json, 'utf8');
  return size > maxBytes
    ? `registry.json tem ${size} bytes (${(size / 1024).toFixed(1)} KB), acima do limite de ${maxBytes} bytes (${maxBytes / 1024} KB)`
    : null;
}

export async function writeRegistryFile(
  json: string,
  outFile: string = OUTPUT_FILE,
): Promise<void> {
  await mkdir(dirname(outFile), { recursive: true });
  await writeFile(outFile, json, 'utf8');
}

export interface RunResult {
  exitCode: 0 | 1;
  stderr: string[];
  stdout: string[];
}

/** Executa o fluxo completo sem chamar process.exit. */
export async function run(
  argv: readonly string[],
  env: Record<string, string | undefined>,
  options: { cwd?: string; outFile?: string; maxBytes?: number } = {},
): Promise<RunResult> {
  let root: string;
  try {
    root = resolveRoot(argv, env, options.cwd);
  } catch (error) {
    return { exitCode: 1, stderr: [(error as Error).message], stdout: [] };
  }

  const result = await buildRegistry(root);
  if (!result.ok) return { exitCode: 1, stderr: formatErrors(result.errors), stdout: [] };

  const json = serializeRegistry(result.registry);
  const sizeError = checkSize(json, options.maxBytes);
  if (sizeError) return { exitCode: 1, stderr: [sizeError], stdout: [] };

  const outFile = options.outFile ?? OUTPUT_FILE;
  await writeRegistryFile(json, outFile);
  const { skills, packs } = result.registry.counts;
  return {
    exitCode: 0,
    stderr: [],
    stdout: [`registry: ${skills} skills, ${packs} packs -> ${outFile}`],
  };
}

export async function main(): Promise<void> {
  const result = await run(process.argv.slice(2), process.env);
  for (const line of result.stdout) process.stdout.write(`${line}\n`);
  for (const line of result.stderr) console.error(line);
  process.exitCode = result.exitCode;
}
