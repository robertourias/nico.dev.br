import assert from 'node:assert/strict';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { installCommandTemplates, repoConfig } from '../catalog.config';
import { buildRegistry } from './build-registry';
import type { Registry, RegistryError } from './registry/types';

const FIXTURES = join(import.meta.dirname, '__fixtures__');
const fixture = (name: string) => join(FIXTURES, name);

async function buildOk(name: string): Promise<Registry> {
  const result = await buildRegistry(fixture(name));
  assert.ok(result.ok, `esperado ok: true, erros: ${JSON.stringify(!result.ok && result.errors)}`);
  return result.registry;
}

async function buildErrors(name: string): Promise<RegistryError[]> {
  const result = await buildRegistry(fixture(name));
  assert.equal(result.ok, false);
  return result.ok ? [] : result.errors;
}

const where = ({ file, field }: RegistryError) => ({ file, field });
const SKILL_MD = 'skills/ok/SKILL.md';

describe('buildRegistry: valid/', () => {
  it('gera ok: true com contadores sem a skill hidden', async () => {
    const registry = await buildOk('valid');
    assert.equal(registry.schemaVersion, 1);
    assert.deepEqual(registry.counts, { skills: 5, packs: 1 });
    assert.equal(registry.skills.length, 5);
  });

  it('omite a skill hidden de skills, files e lastUpdated', async () => {
    const registry = await buildOk('valid');
    assert.ok(!registry.skills.some((s) => s.slug === 'draft-note'));
    assert.ok(!JSON.stringify(registry).includes('draft-note'));
    // draft-note (hidden) tem 2026-09-25, a data mais recente de propósito.
    assert.equal(registry.lastUpdated, '2026-09-20');
  });

  it('ordena por updated desc e slug asc', async () => {
    const registry = await buildOk('valid');
    assert.deepEqual(
      registry.skills.map((s) => `${s.updated} ${s.slug}`),
      [
        '2026-09-20 alpha',
        '2026-09-20 dated',
        '2026-09-10 beta',
        '2026-09-10 gamma',
        '2026-01-05 minimal',
      ],
    );
  });

  it('normaliza updated sem aspas para YYYY-MM-DD exato', async () => {
    const registry = await buildOk('valid');
    assert.equal(registry.skills.find((s) => s.slug === 'dated')?.updated, '2026-09-20');
  });

  it('content vem sem frontmatter', async () => {
    const registry = await buildOk('valid');
    const alpha = registry.skills.find((s) => s.slug === 'alpha');
    assert.equal(alpha?.content, '# alpha\n\nConteudo de teste.');
  });

  it('files é recursivo, POSIX e ordenado, incluindo SKILL.md', async () => {
    const registry = await buildOk('valid');
    assert.deepEqual(registry.skills.find((s) => s.slug === 'alpha')?.files, [
      'SKILL.md',
      'references/deep/er/nested.md',
      'references/guide.md',
    ]);
    assert.deepEqual(registry.skills.find((s) => s.slug === 'beta')?.files, ['SKILL.md']);
    for (const skill of registry.skills) assert.ok(!skill.files.some((f) => f.includes('\\')));
  });

  it('installCommands e githubUrl idênticos aos templates da config', async () => {
    const registry = await buildOk('valid');
    for (const skill of registry.skills) {
      assert.deepEqual(skill.installCommands, {
        repository: installCommandTemplates.repository,
        skill: installCommandTemplates.skill(skill.slug),
        manual: installCommandTemplates.manual(skill.slug),
      });
      assert.equal(
        skill.githubUrl,
        `${repoConfig.githubUrl}/tree/main/${repoConfig.skillsDir}/${skill.slug}`,
      );
    }
    const beta = registry.skills.find((s) => s.slug === 'beta');
    assert.equal(beta?.installCommands.skill, 'npx skills add robertourias/skills --skill beta');
    assert.equal(beta?.githubUrl, 'https://github.com/robertourias/skills/tree/main/skills/beta');
  });

  it('aplica defaults e respeita valores explícitos', async () => {
    const registry = await buildOk('valid');
    const minimal = registry.skills.find((s) => s.slug === 'minimal');
    assert.equal(minimal?.title, 'Minimal');
    assert.deepEqual(minimal?.tags, []);
    assert.deepEqual(minimal?.agents, ['claude-code']);
    assert.equal(minimal?.language, 'pt-BR');
    assert.equal(minimal?.visibility, 'public');
    const alpha = registry.skills.find((s) => s.slug === 'alpha');
    assert.equal(alpha?.title, 'Alpha Skill');
    assert.equal(alpha?.language, 'en');
  });

  it('monta o pack com slugs na ordem do YAML', async () => {
    const registry = await buildOk('valid');
    assert.deepEqual(registry.packs, [
      {
        id: 'starter',
        title: 'Starter',
        description: 'Pack de teste',
        skills: ['alpha', 'beta'],
        installCommands: { repository: installCommandTemplates.repository },
      },
    ]);
  });

  it('é determinístico: duas execuções geram JSON byte a byte igual', async () => {
    const first = JSON.stringify(await buildOk('valid'), null, 2);
    const second = JSON.stringify(await buildOk('valid'), null, 2);
    assert.equal(first, second);
  });
});

describe('buildRegistry: fixtures de falha', () => {
  it('missing-description', async () => {
    assert.deepEqual((await buildErrors('missing-description')).map(where), [
      { file: SKILL_MD, field: 'description' },
    ]);
  });

  it('bad-category', async () => {
    assert.deepEqual((await buildErrors('bad-category')).map(where), [
      { file: SKILL_MD, field: 'metadata.category' },
    ]);
  });

  it('name-mismatch', async () => {
    const errors = await buildErrors('name-mismatch');
    assert.deepEqual(errors.map(where), [{ file: SKILL_MD, field: 'name' }]);
    assert.match(errors[0].message, /other-name/);
  });

  it('no-skill-md aponta a pasta sem SKILL.md', async () => {
    assert.deepEqual((await buildErrors('no-skill-md')).map(where), [
      { file: 'skills/empty-skill', field: 'SKILL.md' },
    ]);
  });

  it('no-frontmatter', async () => {
    const errors = await buildErrors('no-frontmatter');
    assert.deepEqual(errors.map(where), [{ file: SKILL_MD, field: 'frontmatter' }]);
    assert.match(errors[0].message, /ausente/);
  });

  it('malformed-yaml', async () => {
    const errors = await buildErrors('malformed-yaml');
    assert.deepEqual(errors.map(where), [{ file: SKILL_MD, field: 'frontmatter' }]);
    assert.match(errors[0].message, /YAML malformado/);
  });

  it('pack-unknown-skill cita pack, índice e slug', async () => {
    const errors = await buildErrors('pack-unknown-skill');
    assert.deepEqual(errors.map(where), [{ file: 'packs/bundle.yaml', field: 'skills[1]' }]);
    assert.match(errors[0].message, /"ghost"/);
  });

  it('pack-hidden-skill cita pack, índice e slug', async () => {
    const errors = await buildErrors('pack-hidden-skill');
    assert.deepEqual(errors.map(where), [{ file: 'packs/bundle.yaml', field: 'skills[1]' }]);
    assert.match(errors[0].message, /"secret"/);
    assert.match(errors[0].message, /hidden/);
  });

  it('duplicate-pack-id reporta id != arquivo e duplicidade, ambos em other.yaml', async () => {
    // dup.yaml (primeiro na ordem alfabética) é válido e dono do id. other.yaml declara id "dup"
    // mas se chama "other": gera os dois erros, nessa ordem (nome do arquivo, depois duplicidade).
    const errors = await buildErrors('duplicate-pack-id');
    assert.deepEqual(errors.map(where), [
      { file: 'packs/other.yaml', field: 'id' },
      { file: 'packs/other.yaml', field: 'id' },
    ]);
    assert.match(errors[0].message, /difere do nome do arquivo "other"/);
    assert.match(errors[1].message, /duplicado/);
    assert.match(errors[1].message, /packs\/dup\.yaml/);
  });

  it('multi-error retorna todos os erros, em ordem determinística', async () => {
    const errors = await buildErrors('multi-error');
    assert.deepEqual(errors.map(where), [
      { file: 'skills/ok/SKILL.md', field: 'metadata.category' },
      { file: 'skills/second/SKILL.md', field: 'metadata.version' },
      { file: 'packs/bundle.yaml', field: 'skills[0]' },
    ]);
    assert.match(errors[2].message, /"ghost"/);
  });
});

describe('buildRegistry: raiz', () => {
  it('raiz inexistente retorna erro claro', async () => {
    const errors = await buildErrors('does-not-exist');
    assert.deepEqual(errors.map(where), [{ file: '.', field: 'root' }]);
    assert.match(errors[0].message, /inexistente/);
    assert.match(errors[0].message, /does-not-exist/);
  });

  it('empty/ retorna registry válido com counts 0 e lastUpdated null', async () => {
    assert.deepEqual(await buildOk('empty'), {
      schemaVersion: 1,
      counts: { skills: 0, packs: 0 },
      lastUpdated: null,
      skills: [],
      packs: [],
    });
  });
});
