import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { formatUpdated, sortSkills, type SkillListItem } from './skills';

function item(title: string, updated: string): SkillListItem {
  return { slug: title.toLowerCase(), title, description: 'd', tags: [], status: 'stable', updated, command: 'c' };
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
