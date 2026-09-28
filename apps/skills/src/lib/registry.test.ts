import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { after, before, describe, it } from 'node:test';

import { skillsShConfig } from '../../catalog.config';
import { DEFAULT_REGISTRY_PATH, REGISTRY_COMMAND, getSkill, getSkillSlugs, loadRegistry } from './registry';

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
        category: 'documentation',
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

describe('getSkill / getSkillSlugs', () => {
  // getSkill/getSkillSlugs não recebem path (contrato da spec): sempre leem DEFAULT_REGISTRY_PATH.
  // Guardamos o conteúdo atual (gerado, ignorado pelo git) e restauramos no `after` para não
  // vazar estado para outros arquivos de teste que também leem esse mesmo caminho.
  const hadOriginal = existsSync(DEFAULT_REGISTRY_PATH);
  const original = hadOriginal ? readFileSync(DEFAULT_REGISTRY_PATH, 'utf8') : null;

  // Desvio da spec: o exemplo usa o slug "mermaid-diagrams", mas a fixture local não tem essa
  // skill. Usamos slugs próprios ("alpha"/"beta") só para este teste de getSkill/getSkillSlugs.
  const detailFixture = {
    schemaVersion: 1,
    counts: { skills: 2, packs: 0 },
    lastUpdated: '2026-09-20',
    installCommands: { repository: REPO },
    skills: [
      {
        slug: 'alpha',
        title: 'Alpha',
        description: 'Descrição da skill alpha para teste de detalhe.',
        category: 'documentation',
        tags: ['a'],
        agents: ['claude-code'],
        version: '1.2.0',
        status: 'stable',
        language: 'pt-BR',
        visibility: 'public',
        updated: '2026-09-20',
        files: ['SKILL.md', 'references/c4.md', 'references/notes.md'],
        content: 'CONTEUDO-ALPHA',
        installCommands: {
          repository: REPO,
          skill: `${REPO} --skill alpha`,
          manual: 'git clone x alpha',
        },
        githubUrl: 'https://github.com/robertourias/skills/tree/main/skills/alpha',
      },
      {
        slug: 'beta',
        title: 'Beta',
        description: 'Descrição da skill beta para teste de detalhe.',
        category: 'design',
        tags: [],
        agents: ['claude-code'],
        version: '0.1.0',
        status: 'draft',
        language: 'pt-BR',
        visibility: 'public',
        updated: '2026-09-19',
        files: ['SKILL.md'],
        content: 'CONTEUDO-BETA',
        installCommands: {
          repository: REPO,
          skill: `${REPO} --skill beta`,
          manual: 'git clone x beta',
        },
        githubUrl: 'https://github.com/robertourias/skills/tree/main/skills/beta',
      },
    ],
    packs: [],
  };

  before(() => {
    mkdirSync(dirname(DEFAULT_REGISTRY_PATH), { recursive: true });
    writeFileSync(DEFAULT_REGISTRY_PATH, JSON.stringify(detailFixture));
  });

  after(() => {
    if (original !== null) writeFileSync(DEFAULT_REGISTRY_PATH, original);
    else rmSync(DEFAULT_REGISTRY_PATH, { force: true });
  });

  it('retorna content/files/installCommands completos e skillsShUrl derivado', () => {
    const detail = getSkill('alpha');
    assert.ok(detail);
    assert.equal(detail?.content, 'CONTEUDO-ALPHA');
    assert.deepEqual(detail?.files, ['SKILL.md', 'references/c4.md', 'references/notes.md']);
    assert.deepEqual(detail?.installCommands, {
      repository: REPO,
      skill: `${REPO} --skill alpha`,
      manual: 'git clone x alpha',
    });
    assert.equal(detail?.skillsShUrl, skillsShConfig.skillUrl('alpha'));
    assert.equal(
      detail?.githubUrl,
      'https://github.com/robertourias/skills/tree/main/skills/alpha',
    );
  });

  it('retorna undefined para slug inexistente', () => {
    assert.equal(getSkill('slug-que-nao-existe'), undefined);
  });

  it('getSkillSlugs retorna só skills públicas, sem duplicatas', () => {
    assert.deepEqual(getSkillSlugs(), ['alpha', 'beta']);
  });
});
