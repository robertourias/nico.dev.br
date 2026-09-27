import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';

import { REGISTRY_COMMAND, loadRegistry } from './registry';

// Fixture própria: public/registry.json é gerado e ignorado pelo git, pode estar desatualizado.
const REPO = 'npx skills add robertourias/skills';
const fixture = {
  schemaVersion: 1,
  counts: { skills: 1, packs: 0 },
  lastUpdated: '2026-09-20',
  installCommands: { repository: REPO },
  skills: [
    {
      slug: 'alpha-skill',
      title: 'Alpha Skill',
      description: 'Descrição da skill de teste.',
      category: 'documentation',
      tags: ['a', 'b'],
      agents: ['claude-code'],
      version: '1.0.0',
      status: 'beta',
      language: 'pt-BR',
      visibility: 'public',
      updated: '2026-09-20',
      files: ['SKILL.md'],
      content: 'CONTEUDO-PESADO',
      installCommands: {
        repository: REPO,
        skill: `${REPO} --skill alpha-skill`,
        manual: 'git clone x',
      },
      githubUrl: 'https://github.com/robertourias/skills/tree/main/skills/alpha-skill',
    },
  ],
  packs: [],
};

let dir: string;
before(async () => {
  dir = await mkdtemp(join(tmpdir(), 'registry-lib-'));
  await writeFile(join(dir, 'registry.json'), JSON.stringify(fixture));
});
after(() => rm(dir, { recursive: true, force: true }));

describe('loadRegistry', () => {
  it('mapeia para SkillListItem sem content/files e expõe metadados', () => {
    const data = loadRegistry(join(dir, 'registry.json'));
    assert.deepEqual(data.items, [
      {
        slug: 'alpha-skill',
        title: 'Alpha Skill',
        description: 'Descrição da skill de teste.',
        tags: ['a', 'b'],
        status: 'beta',
        updated: '2026-09-20',
        command: `${REPO} --skill alpha-skill`,
      },
    ]);
    assert.deepEqual(data.counts, { skills: 1, packs: 0 });
    assert.equal(data.lastUpdated, '2026-09-20');
    assert.equal(data.installCommands.repository, REPO);
    const json = JSON.stringify(data.items);
    assert.ok(!json.includes('content'));
    assert.ok(!json.includes('files'));
    assert.ok(!json.includes('CONTEUDO-PESADO'));
  });

  it('erro claro citando o comando registry quando o arquivo falta', () => {
    assert.throws(
      () => loadRegistry(join(dir, 'nao-existe.json')),
      (err: Error) => {
        assert.ok(err.message.includes('pnpm --filter @nico.dev/skills registry'));
        assert.ok(err.message.includes(REGISTRY_COMMAND));
        return true;
      },
    );
  });

  it('rejeita registry inválido (ex.: sem installCommands)', () => {
    const { installCommands: _omit, ...invalid } = fixture;
    void _omit;
    return writeFile(join(dir, 'bad.json'), JSON.stringify(invalid)).then(() =>
      assert.throws(() => loadRegistry(join(dir, 'bad.json'))),
    );
  });
});
