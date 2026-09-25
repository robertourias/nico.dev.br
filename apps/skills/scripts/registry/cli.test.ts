import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { after, describe, it } from 'node:test';

import {
  APP_DIR,
  DEFAULT_ROOT,
  MAX_REGISTRY_BYTES,
  checkSize,
  formatErrors,
  resolveRoot,
  run,
  serializeRegistry,
} from './cli';

const fixtures = resolve(APP_DIR, 'scripts/__fixtures__');
const tmpDirs: string[] = [];
async function makeTmp(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'skills-cli-'));
  tmpDirs.push(dir);
  return dir;
}
after(async () => {
  await Promise.all(tmpDirs.map((d) => rm(d, { recursive: true, force: true })));
});

describe('resolveRoot', () => {
  it('usa content/ do app por padrão', () => {
    assert.equal(resolveRoot([], {}, resolve('/qualquer')), DEFAULT_ROOT);
    assert.equal(DEFAULT_ROOT, resolve(APP_DIR, 'content'));
  });
  it('SKILLS_ROOT relativo resolve pelo cwd', () => {
    assert.equal(resolveRoot([], { SKILLS_ROOT: 'a/b' }, resolve('/x')), resolve('/x', 'a/b'));
  });
  it('--root vence SKILLS_ROOT (formas separada e com =)', () => {
    assert.equal(
      resolveRoot(['--root', 'r1'], { SKILLS_ROOT: 'env' }, resolve('/x')),
      resolve('/x/r1'),
    );
    assert.equal(
      resolveRoot(['--root=r2'], { SKILLS_ROOT: 'env' }, resolve('/x')),
      resolve('/x/r2'),
    );
  });
  it('SKILLS_ROOT vazio cai no padrão', () => {
    assert.equal(resolveRoot([], { SKILLS_ROOT: '' }), DEFAULT_ROOT);
  });
  it('--root sem valor lança', () => {
    assert.throws(() => resolveRoot(['--root'], {}), /--root/);
  });
});

describe('formatErrors', () => {
  it('uma linha por erro no formato arquivo › campo: mensagem', () => {
    assert.deepEqual(
      formatErrors([
        { file: 'skills/foo/SKILL.md', field: 'metadata.category', message: 'inválido' },
        { file: 'packs/p.yaml', field: 'skills[2]', message: 'não existe' },
      ]),
      [
        'skills/foo/SKILL.md › metadata.category: inválido',
        'packs/p.yaml › skills[2]: não existe',
      ],
    );
  });
});

describe('checkSize', () => {
  it('limite é 500 KB', () => assert.equal(MAX_REGISTRY_BYTES, 512000));
  it('aceita exatamente o limite e rejeita acima, medindo bytes UTF-8', () => {
    assert.equal(checkSize('a'.repeat(10), 10), null);
    assert.match(checkSize('a'.repeat(11), 10) ?? '', /11 bytes/);
    assert.match(checkSize('é'.repeat(6), 10) ?? '', /12 bytes/);
  });
});

describe('serializeRegistry', () => {
  it('indenta com 2 espaços e termina com \\n', () => {
    const out = serializeRegistry({
      schemaVersion: 1,
      counts: { skills: 0, packs: 0 },
      lastUpdated: null,
      skills: [],
      packs: [],
    });
    assert.ok(out.startsWith('{\n  "schemaVersion": 1,'));
    assert.ok(out.endsWith('}\n'));
  });
});

describe('run', () => {
  it('escreve o registry e retorna 0 (fixture valid)', async () => {
    const outFile = join(await makeTmp(), 'public', 'registry.json');
    const result = await run(['--root', join(fixtures, 'valid')], {}, { outFile });
    assert.equal(result.exitCode, 0);
    const written = JSON.parse(await readFile(outFile, 'utf8'));
    assert.equal(written.schemaVersion, 1);
    assert.ok(written.counts.skills >= 2);
  });

  it('raiz vazia gera counts 0', async () => {
    const outFile = join(await makeTmp(), 'registry.json');
    const result = await run(['--root', join(fixtures, 'empty')], {}, { outFile });
    assert.equal(result.exitCode, 0);
    assert.deepEqual(JSON.parse(await readFile(outFile, 'utf8')).counts, { skills: 0, packs: 0 });
  });

  it('erros de validação: exit 1, linhas arquivo › campo e nada gravado', async () => {
    const outFile = join(await makeTmp(), 'registry.json');
    const result = await run([], { SKILLS_ROOT: join(fixtures, 'bad-category') }, { outFile });
    assert.equal(result.exitCode, 1);
    assert.ok(result.stderr.length >= 1);
    assert.match(result.stderr[0], /^skills\/[^ ]+\/SKILL\.md › metadata\.category: /);
    await assert.rejects(readFile(outFile, 'utf8'));
  });

  it('registry > 500 KB falha com o tamanho medido (arquivo gerado em tmp)', async () => {
    const root = await makeTmp();
    const dir = join(root, 'skills', 'big-skill');
    await mkdir(dir, { recursive: true });
    await mkdir(join(root, 'packs'), { recursive: true });
    const body = 'x'.repeat(MAX_REGISTRY_BYTES + 1024);
    await writeFile(
      join(dir, 'SKILL.md'),
      [
        '---',
        'name: big-skill',
        'description: Skill gerada só para estourar o limite de tamanho.',
        'metadata:',
        '  category: engineering',
        '  version: 1.0.0',
        '  status: stable',
        '  updated: 2026-09-20',
        '---',
        body,
        '',
      ].join('\n'),
    );
    const outFile = join(await makeTmp(), 'registry.json');
    const result = await run(['--root', root], {}, { outFile });
    assert.equal(result.exitCode, 1);
    assert.match(
      result.stderr[0],
      /registry\.json tem \d+ bytes .* acima do limite de 512000 bytes/,
    );
    await assert.rejects(readFile(outFile, 'utf8'));
  });

  it('raiz inexistente: exit 1 com erro claro', async () => {
    const result = await run(['--root', join(await makeTmp(), 'nao-existe')], {}, {});
    assert.equal(result.exitCode, 1);
    assert.match(result.stderr[0], /raiz de conteúdo inexistente/);
  });
});
