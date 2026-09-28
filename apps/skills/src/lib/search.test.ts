import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { CATEGORIES, STATUSES } from '../../catalog.config';
import { filterSkills, getFacets, type SkillFilterCriteria } from './search';
import type { SkillListItem } from './skills';

function item(overrides: Partial<SkillListItem> & { slug: string }): SkillListItem {
  return {
    title: overrides.slug,
    description: 'Descrição padrão de teste.',
    category: 'documentation',
    tags: [],
    status: 'stable',
    updated: '2026-09-20',
    command: 'npx skills add x --skill ' + overrides.slug,
    ...overrides,
  };
}

const ALL_CRITERIA: SkillFilterCriteria = { query: '', category: null, tags: [], statuses: [] };

const FIXTURE: SkillListItem[] = [
  item({
    slug: 'mermaid-diagrams',
    title: 'Mermaid Diagrams',
    description: 'Gera diagramas Mermaid a partir de texto.',
    category: 'documentation',
    tags: ['diagramas', 'mermaid'],
    status: 'stable',
  }),
  item({
    slug: 'commit-helper',
    title: 'Commit Helper',
    description: 'Escreve mensagens de commit convencionais.',
    category: 'engineering',
    tags: ['git', 'commit'],
    status: 'beta',
  }),
  item({
    slug: 'brand-guidelines',
    title: 'Brand Guidelines',
    description: 'Aplica guidelines de marca em conteúdo escrito.',
    category: 'design',
    tags: ['marca', 'design'],
    status: 'draft',
  }),
];

describe('filterSkills', () => {
  it('busca vazia retorna todos, respeitando a ordem original', () => {
    const result = filterSkills(FIXTURE, ALL_CRITERIA);
    assert.deepEqual(
      result.map((i) => i.slug),
      ['mermaid-diagrams', 'commit-helper', 'brand-guidelines'],
    );
  });

  it('busca vazia + outro filtro ainda restringe pelo outro filtro', () => {
    const result = filterSkills(FIXTURE, { ...ALL_CRITERIA, category: 'engineering' });
    assert.deepEqual(
      result.map((i) => i.slug),
      ['commit-helper'],
    );
  });

  it('busca por termo presente na description', () => {
    const result = filterSkills(FIXTURE, { ...ALL_CRITERIA, query: 'mensagens de commit' });
    assert.ok(result.some((i) => i.slug === 'commit-helper'));
  });

  it('busca por tag', () => {
    const result = filterSkills(FIXTURE, { ...ALL_CRITERIA, query: 'diagramas' });
    assert.ok(result.some((i) => i.slug === 'mermaid-diagrams'));
  });

  it('erro de digitação leve ainda encontra o item (fuzzy match)', () => {
    const result = filterSkills(FIXTURE, { ...ALL_CRITERIA, query: 'mermaido' });
    assert.ok(
      result.some((i) => i.slug === 'mermaid-diagrams'),
      'esperava achar "mermaid-diagrams" buscando por "mermaido"',
    );
  });

  it('categoria restringe a uma única opção', () => {
    const result = filterSkills(FIXTURE, { ...ALL_CRITERIA, category: 'design' });
    assert.deepEqual(
      result.map((i) => i.slug),
      ['brand-guidelines'],
    );
  });

  it('tags: OR dentro da faceta (qualquer uma das tags selecionadas basta)', () => {
    const result = filterSkills(FIXTURE, { ...ALL_CRITERIA, tags: ['git', 'marca'] });
    assert.deepEqual(
      new Set(result.map((i) => i.slug)),
      new Set(['commit-helper', 'brand-guidelines']),
    );
  });

  it('status: OR dentro da faceta', () => {
    const result = filterSkills(FIXTURE, { ...ALL_CRITERIA, statuses: ['beta', 'draft'] });
    assert.deepEqual(
      new Set(result.map((i) => i.slug)),
      new Set(['commit-helper', 'brand-guidelines']),
    );
  });

  it('combinação categoria+tag+status+busca: AND entre facetas', () => {
    // Só "commit-helper" satisfaz simultaneamente: categoria engineering, tag "git",
    // status beta e o termo de busca "commit".
    const result = filterSkills(FIXTURE, {
      query: 'commit',
      category: 'engineering',
      tags: ['git'],
      statuses: ['beta'],
    });
    assert.deepEqual(
      result.map((i) => i.slug),
      ['commit-helper'],
    );
  });

  it('combinação que não bate em nenhuma faceta retorna vazio', () => {
    const result = filterSkills(FIXTURE, {
      query: 'commit',
      category: 'design',
      tags: [],
      statuses: [],
    });
    assert.deepEqual(result, []);
  });

  it('smoke test de desempenho: 200 itens sintéticos abaixo de 50ms', () => {
    const synthetic: SkillListItem[] = Array.from({ length: 200 }, (_, i) =>
      item({
        slug: `synthetic-skill-${i}`,
        title: `Synthetic Skill ${i}`,
        description: `Descrição sintética número ${i} para teste de desempenho.`,
        category: CATEGORIES[i % CATEGORIES.length],
        tags: [`tag-${i % 10}`],
        status: STATUSES[i % STATUSES.length],
      }),
    );

    const start = performance.now();
    filterSkills(synthetic, { query: 'sintética desempenho', category: null, tags: [], statuses: [] });
    const elapsed = performance.now() - start;

    assert.ok(elapsed < 50, `esperava < 50ms, levou ${elapsed.toFixed(2)}ms`);
  });
});

describe('getFacets', () => {
  it('retorna categorias, tags e status presentes, sem duplicatas', () => {
    const facets = getFacets(FIXTURE);
    assert.deepEqual(facets.categories, ['documentation', 'design', 'engineering']);
    assert.deepEqual(facets.statuses, ['stable', 'beta', 'draft']);
    assert.deepEqual(facets.tags, ['commit', 'design', 'diagramas', 'git', 'marca', 'mermaid']);
  });

  it('não inclui categoria/tag/status ausente do dataset', () => {
    const facets = getFacets([FIXTURE[0]]);
    assert.deepEqual(facets.categories, ['documentation']);
    assert.deepEqual(facets.statuses, ['stable']);
    assert.deepEqual(facets.tags, ['diagramas', 'mermaid']);
  });

  it('lista vazia retorna facetas vazias', () => {
    assert.deepEqual(getFacets([]), { categories: [], tags: [], statuses: [] });
  });
});
