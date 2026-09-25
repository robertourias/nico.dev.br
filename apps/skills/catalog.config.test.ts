import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { AGENTS, CATEGORIES, STATUSES, installCommandTemplates, skillsShConfig } from './catalog.config';

const KEBAB_CASE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

describe('skillsShConfig.skillUrl', () => {
  it('monta a URL do skills.sh para o slug', () => {
    assert.equal(
      skillsShConfig.skillUrl('mermaid-diagrams'),
      'https://www.skills.sh/robertourias/skills/mermaid-diagrams',
    );
  });
});

describe('installCommandTemplates', () => {
  it('repository', () => {
    assert.equal(installCommandTemplates.repository, 'npx skills add robertourias/skills');
  });

  it('skill(slug)', () => {
    assert.equal(
      installCommandTemplates.skill('mermaid-diagrams'),
      'npx skills add robertourias/skills --skill mermaid-diagrams',
    );
  });

  it('manual(slug)', () => {
    assert.equal(
      installCommandTemplates.manual('mermaid-diagrams'),
      'git clone https://github.com/robertourias/skills && cp -r skills/skills/mermaid-diagrams ~/.claude/skills/',
    );
  });
});

describe('tuplas do catálogo', () => {
  const tuples = { CATEGORIES, AGENTS, STATUSES } as const;

  for (const [name, values] of Object.entries(tuples)) {
    it(`${name} não tem duplicatas`, () => {
      assert.equal(new Set(values).size, values.length);
    });

    it(`${name} está em kebab-case`, () => {
      for (const value of values) {
        assert.match(value, KEBAB_CASE, `${name}: "${value}" não é kebab-case`);
      }
    });
  }
});
