import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildFileTree, formatUpdated, sortSkills, type SkillListItem } from './skills';

function item(title: string, updated: string): SkillListItem {
  return {
    slug: title.toLowerCase(),
    title,
    description: 'd',
    category: 'documentation',
    tags: [],
    status: 'stable',
    updated,
    command: 'c',
  };
}

describe('sortSkills', () => {
  it('recent: updated desc, empate por título asc', () => {
    const input = [item('Beta', '2026-09-20'), item('Alfa', '2026-09-20'), item('Zeta', '2026-09-25')];
    assert.deepEqual(
      sortSkills(input, 'recent').map((i) => i.title),
      ['Zeta', 'Alfa', 'Beta'],
    );
  });

  it('alpha: título asc com acentos pt-BR', () => {
    const input = [item('Zebra', '2026-01-01'), item('Ótimo', '2026-01-01'), item('Ábaco', '2026-01-01'), item('Oba', '2026-01-01')];
    assert.deepEqual(
      sortSkills(input, 'alpha').map((i) => i.title),
      ['Ábaco', 'Oba', 'Ótimo', 'Zebra'],
    );
  });

  it('não muta a entrada', () => {
    const input = [item('B', '2026-01-01'), item('A', '2026-02-01')];
    const snapshot = [...input];
    sortSkills(input, 'alpha');
    sortSkills(input, 'recent');
    assert.deepEqual(input, snapshot);
  });
});

describe('formatUpdated', () => {
  it('não desloca o dia', () => {
    assert.equal(formatUpdated('2026-09-20'), '20 de set. de 2026');
    assert.equal(formatUpdated('2026-01-01'), '1 de jan. de 2026');
  });
});

describe('buildFileTree', () => {
  it('agrupa por pasta preservando a ordem de entrada', () => {
    const tree = buildFileTree(['SKILL.md', 'references/c4.md', 'references/notes.md']);
    assert.deepEqual(tree, [
      { name: 'SKILL.md', path: 'SKILL.md', type: 'file' },
      {
        name: 'references',
        path: 'references',
        type: 'folder',
        children: [
          { name: 'c4.md', path: 'references/c4.md', type: 'file' },
          { name: 'notes.md', path: 'references/notes.md', type: 'file' },
        ],
      },
    ]);
  });

  it('um único arquivo produz um único nó', () => {
    assert.deepEqual(buildFileTree(['SKILL.md']), [{ name: 'SKILL.md', path: 'SKILL.md', type: 'file' }]);
  });

  it('não reordena: a ordem de primeira aparição das pastas é preservada', () => {
    const tree = buildFileTree(['z/a.md', 'a/b.md', 'z/c.md']);
    assert.deepEqual(
      tree.map((node) => node.name),
      ['z', 'a'],
    );
  });
});
