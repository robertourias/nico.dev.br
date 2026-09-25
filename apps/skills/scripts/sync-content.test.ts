import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { after, describe, it } from 'node:test';

import { SyncError, syncContent } from './sync-content';

const tmpDirs: string[] = [];
async function makeTmp(prefix: string): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), prefix));
  tmpDirs.push(dir);
  return dir;
}
after(async () => {
  await Promise.all(
    tmpDirs.map((d) => rm(d, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })),
  );
});

function git(cwd: string, ...args: string[]): string {
  return execFileSync(
    'git',
    ['-c', 'user.name=Teste', '-c', 'user.email=teste@example.com', ...args],
    { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  ).trim();
}

async function write(path: string, content: string): Promise<void> {
  await mkdir(join(path, '..'), { recursive: true });
  await writeFile(path, content);
}

// Repo git temporário no layout do repo de skills, mais um diretório extra que não deve ser copiado.
async function makeRepo(files: Record<string, string>): Promise<{ dir: string; url: string }> {
  const dir = await makeTmp('skills-src-');
  git(dir, 'init', '--quiet', '-b', 'main');
  for (const [rel, content] of Object.entries(files)) await write(join(dir, rel), content);
  git(dir, 'add', '-A');
  git(dir, 'commit', '--quiet', '-m', 'init');
  // file:// força o clone "de verdade" (sem cópia direta de objetos), como no GitHub.
  return { dir, url: pathToFileURL(dir).href };
}

async function makeContent(): Promise<string> {
  const dir = await makeTmp('skills-content-');
  await write(join(dir, 'skills', '.gitkeep'), '');
  await write(join(dir, 'packs', '.gitkeep'), '');
  return dir;
}

const baseFiles = {
  'skills/alpha/SKILL.md': '---\nname: alpha\n---\nalpha',
  'skills/alpha/references/r.md': 'ref',
  'skills/beta/SKILL.md': '---\nname: beta\n---\nbeta',
  'packs/p.yaml': 'id: p\n',
  'apps/web/index.ts': 'nao copiar',
  'catalog.config.ts': 'nao copiar',
};

describe('syncContent', () => {
  it('copia só skills/ e packs/ e informa contagem e sha', async () => {
    const repo = await makeRepo(baseFiles);
    const contentDir = await makeContent();
    const result = await syncContent({ env: { SKILLS_REPO_URL: repo.url }, contentDir });

    assert.equal(result.skipped, false);
    if (result.skipped) return;
    assert.equal(result.skills, 2);
    assert.equal(result.packs, 1);
    assert.equal(result.sha, git(repo.dir, 'rev-parse', '--short', 'HEAD'));
    assert.deepEqual((await readdir(contentDir)).sort(), ['packs', 'skills']);
    assert.equal(
      await readFile(join(contentDir, 'skills/alpha/references/r.md'), 'utf8'),
      'ref',
    );
    assert.ok(existsSync(join(contentDir, 'packs/p.yaml')));
  });

  it('segunda execução substitui o conteúdo antigo, sem resíduo, e preserva .gitkeep', async () => {
    const repo = await makeRepo(baseFiles);
    const contentDir = await makeContent();
    await write(join(contentDir, 'skills/velha/SKILL.md'), 'resíduo');
    await write(join(contentDir, 'packs/velho.yaml'), 'resíduo');

    await syncContent({ env: { SKILLS_REPO_URL: repo.url }, contentDir });
    assert.ok(!existsSync(join(contentDir, 'skills/velha')));
    assert.ok(!existsSync(join(contentDir, 'packs/velho.yaml')));

    // O repo remove `beta` e troca o pack; o segundo sync não pode acumular.
    git(repo.dir, 'rm', '-r', '--quiet', 'skills/beta', 'packs/p.yaml');
    await write(join(repo.dir, 'packs/q.yaml'), 'id: q\n');
    git(repo.dir, 'add', '-A');
    git(repo.dir, 'commit', '--quiet', '-m', 'muda');

    const result = await syncContent({ env: { SKILLS_REPO_URL: repo.url }, contentDir });
    assert.ok(!result.skipped && result.skills === 1 && result.packs === 1);
    assert.deepEqual((await readdir(join(contentDir, 'skills'))).sort(), ['.gitkeep', 'alpha']);
    assert.deepEqual((await readdir(join(contentDir, 'packs'))).sort(), ['.gitkeep', 'q.yaml']);
  });

  it('SKILLS_REF aponta para outra branch', async () => {
    const repo = await makeRepo(baseFiles);
    git(repo.dir, 'checkout', '--quiet', '-b', 'feat/x');
    await write(join(repo.dir, 'skills/gama/SKILL.md'), 'gama');
    git(repo.dir, 'add', '-A');
    git(repo.dir, 'commit', '--quiet', '-m', 'gama');
    git(repo.dir, 'checkout', '--quiet', 'main');

    const contentDir = await makeContent();
    const result = await syncContent({
      env: { SKILLS_REPO_URL: repo.url, SKILLS_REF: 'feat/x' },
      contentDir,
    });
    assert.ok(!result.skipped && result.skills === 3);
  });

  it('SKILLS_REF aceita SHA', async () => {
    const repo = await makeRepo(baseFiles);
    const sha = git(repo.dir, 'rev-parse', 'HEAD');
    await write(join(repo.dir, 'skills/gama/SKILL.md'), 'gama');
    git(repo.dir, 'add', '-A');
    git(repo.dir, 'commit', '--quiet', '-m', 'gama');

    const contentDir = await makeContent();
    const result = await syncContent({
      env: { SKILLS_REPO_URL: repo.url, SKILLS_REF: sha },
      contentDir,
    });
    assert.ok(!result.skipped && result.skills === 2);
  });

  it('com SKILLS_ROOT definida não toca em content/', async () => {
    const contentDir = await makeContent();
    await write(join(contentDir, 'skills/intacta/SKILL.md'), 'x');
    const result = await syncContent({
      env: { SKILLS_ROOT: '/qualquer', SKILLS_REPO_URL: 'file:///nao-existe' },
      contentDir,
    });
    assert.deepEqual(result, { skipped: true, root: '/qualquer' });
    assert.ok(existsSync(join(contentDir, 'skills/intacta/SKILL.md')));
  });

  it('falha (SyncError) com git ausente', async () => {
    const contentDir = await makeContent();
    await assert.rejects(
      syncContent({ env: {}, contentDir, gitCommand: 'git-que-nao-existe-xyz' }),
      (error: unknown) => error instanceof SyncError && /git não encontrado/.test(error.message),
    );
  });

  it('falha (SyncError) com clone inválido', async () => {
    const contentDir = await makeContent();
    const missing = pathToFileURL(join(await makeTmp('skills-vazio-'), 'nao-existe')).href;
    await assert.rejects(
      syncContent({ env: { SKILLS_REPO_URL: missing }, contentDir }),
      (error: unknown) => error instanceof SyncError && /falha ao clonar/.test(error.message),
    );
  });

  it('falha (SyncError) quando o repo não tem skills/', async () => {
    const repo = await makeRepo({ 'packs/p.yaml': 'id: p\n' });
    const contentDir = await makeContent();
    await write(join(contentDir, 'packs/antigo.yaml'), 'x');
    await assert.rejects(
      syncContent({ env: { SKILLS_REPO_URL: repo.url }, contentDir }),
      (error: unknown) => error instanceof SyncError && /não tem a pasta skills\//.test(error.message),
    );
    // Falha antes de tocar em content/.
    assert.ok(existsSync(join(contentDir, 'packs/antigo.yaml')));
  });
});

describe('sync-content CLI', () => {
  it('sai com 1 e mensagem clara quando o clone falha', async () => {
    const missing = pathToFileURL(join(await makeTmp('skills-vazio-'), 'nao-existe')).href;
    const script = join(import.meta.dirname, 'sync-content.ts');
    const { status, stderr } = spawnSync(process.execPath, ['--import', 'tsx', script], {
      encoding: 'utf8',
      env: { ...process.env, SKILLS_ROOT: '', SKILLS_REPO_URL: missing },
    });
    assert.equal(status, 1);
    assert.match(stderr, /sync-content: falha ao clonar/);
  });
});
