import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import matter from 'gray-matter';

import { AGENTS, CATEGORIES, STATUSES } from '../../catalog.config';
import {
  formatFieldPath,
  normalizeDate,
  packSchema,
  skillFrontmatterSchema,
  toTitleCase,
} from './schema';

const DESCRIPTION = 'Descrição de teste com mais de vinte caracteres.';

interface Overrides {
  root?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

// Chaves em `undefined` removem o campo, para testar ausência sem repetir o objeto inteiro.
function build({ root = {}, metadata = {} }: Overrides = {}): Record<string, unknown> {
  const merged = {
    name: 'mermaid-diagrams',
    description: DESCRIPTION,
    ...root,
    metadata: {
      category: 'documentation',
      version: '1.2.0',
      status: 'stable',
      updated: '2026-09-20',
      ...metadata,
    },
  };
  return JSON.parse(JSON.stringify(merged)) as Record<string, unknown>;
}

function issuePaths(input: unknown): string[] {
  const result = skillFrontmatterSchema.safeParse(input);
  assert.equal(result.success, false, 'esperava falha de validação');
  return result.error.issues.map((issue) => formatFieldPath(issue.path));
}

describe('skillFrontmatterSchema: casos válidos', () => {
  it('parseia frontmatter completo', () => {
    const result = skillFrontmatterSchema.safeParse(
      build({
        metadata: {
          title: 'Custom Title',
          tags: ['mermaid', 'c4'],
          agents: ['cursor', 'codex'],
          visibility: 'hidden',
          language: 'en',
        },
      }),
    );
    assert.equal(result.success, true);
    assert.deepEqual(result.data?.metadata, {
      title: 'Custom Title',
      category: 'documentation',
      tags: ['mermaid', 'c4'],
      agents: ['cursor', 'codex'],
      version: '1.2.0',
      status: 'stable',
      visibility: 'hidden',
      updated: '2026-09-20',
      language: 'en',
    });
  });

  it('parseia frontmatter mínimo e aplica defaults', () => {
    const result = skillFrontmatterSchema.safeParse(build());
    assert.equal(result.success, true);
    assert.equal(result.data?.metadata.title, 'Mermaid Diagrams');
    assert.deepEqual(result.data?.metadata.tags, []);
    assert.deepEqual(result.data?.metadata.agents, ['claude-code']);
    assert.equal(result.data?.metadata.visibility, 'public');
    assert.equal(result.data?.metadata.language, 'pt-BR');
  });

  it('aceita description nos limites 20 e 1024', () => {
    assert.equal(skillFrontmatterSchema.safeParse(build({ root: { description: 'a'.repeat(20) } })).success, true);
    assert.equal(skillFrontmatterSchema.safeParse(build({ root: { description: 'a'.repeat(1024) } })).success, true);
  });

  it('aceita 8 tags', () => {
    const tags = Array.from({ length: 8 }, (_, i) => `tag-${i}`);
    assert.equal(skillFrontmatterSchema.safeParse(build({ metadata: { tags } })).success, true);
  });
});

describe('skillFrontmatterSchema: falhas apontam o field correto', () => {
  it('sem description', () => {
    assert.deepEqual(issuePaths(build({ root: { description: undefined } })), ['description']);
  });

  it('description < 20', () => {
    assert.deepEqual(issuePaths(build({ root: { description: 'a'.repeat(19) } })), ['description']);
  });

  it('description > 1024', () => {
    assert.deepEqual(issuePaths(build({ root: { description: 'a'.repeat(1025) } })), ['description']);
  });

  it('category fora da tupla', () => {
    assert.deepEqual(issuePaths(build({ metadata: { category: 'docs' } })), ['metadata.category']);
  });

  it('sem category', () => {
    assert.deepEqual(issuePaths(build({ metadata: { category: undefined } })), ['metadata.category']);
  });

  it('version não semver', () => {
    for (const version of ['1.2', 'v1.2.3', '1.2.3-beta', '01.2.3']) {
      assert.deepEqual(issuePaths(build({ metadata: { version } })), ['metadata.version'], version);
    }
  });

  it('status inválido', () => {
    assert.deepEqual(issuePaths(build({ metadata: { status: 'released' } })), ['metadata.status']);
  });

  it('tags com 9 itens', () => {
    const tags = Array.from({ length: 9 }, (_, i) => `tag-${i}`);
    assert.deepEqual(issuePaths(build({ metadata: { tags } })), ['metadata.tags']);
  });

  it('tag fora de kebab-case aponta o índice', () => {
    assert.deepEqual(issuePaths(build({ metadata: { tags: ['ok', 'Not Kebab'] } })), ['metadata.tags[1]']);
  });

  it('updated inexistente (2026-13-40)', () => {
    assert.deepEqual(issuePaths(build({ metadata: { updated: '2026-13-40' } })), ['metadata.updated']);
  });

  it('updated em dia inexistente do mês (2026-02-30)', () => {
    assert.deepEqual(issuePaths(build({ metadata: { updated: '2026-02-30' } })), ['metadata.updated']);
  });

  it('updated em formato errado', () => {
    for (const updated of ['20/09/2026', '2026-9-2', 'ontem', 20260920]) {
      assert.deepEqual(issuePaths(build({ metadata: { updated } })), ['metadata.updated'], String(updated));
    }
  });

  it('name fora de kebab-case', () => {
    for (const name of ['Mermaid_Diagrams', 'mermaid diagrams', '-mermaid']) {
      assert.deepEqual(issuePaths(build({ root: { name } })), ['name'], name);
    }
  });

  it('agent fora da tupla aponta o índice', () => {
    assert.deepEqual(issuePaths(build({ metadata: { agents: ['claude-code', 'vim'] } })), ['metadata.agents[1]']);
  });

  it('sem metadata', () => {
    assert.deepEqual(issuePaths({ name: 'foo-bar', description: DESCRIPTION }), ['metadata']);
  });

  it('coleta todos os erros de uma vez', () => {
    const paths = issuePaths(build({ root: { description: 'curta' }, metadata: { status: 'x', version: 'y' } }));
    assert.deepEqual([...paths].sort(), ['description', 'metadata.status', 'metadata.version']);
  });
});

describe('updated como Date (YAML sem aspas)', () => {
  const markdown = (updated: string) =>
    `---\nname: mermaid-diagrams\ndescription: ${DESCRIPTION}\nmetadata:\n  category: documentation\n  version: 1.2.0\n  status: stable\n  updated: ${updated}\n---\n# Corpo\n`;

  it('gray-matter entrega Date e o schema normaliza para YYYY-MM-DD exato', () => {
    const { data } = matter(markdown('2026-09-20'));
    assert.ok(data.metadata.updated instanceof Date, 'premissa: YAML sem aspas vira Date');
    const result = skillFrontmatterSchema.safeParse(data);
    assert.equal(result.success, true);
    assert.equal(result.data?.metadata.updated, '2026-09-20');
  });

  it('não desloca o dia em bordas de mês e ano', () => {
    for (const day of ['2026-01-01', '2025-12-31', '2024-02-29']) {
      const { data } = matter(markdown(day));
      const result = skillFrontmatterSchema.safeParse(data);
      assert.equal(result.data?.metadata.updated, day);
    }
  });

  it('normalizeDate usa UTC e deixa outros valores intactos', () => {
    assert.equal(normalizeDate(new Date('2026-09-20T00:00:00Z')), '2026-09-20');
    assert.equal(normalizeDate('2026-09-20'), '2026-09-20');
    assert.equal(normalizeDate(42), 42);
    assert.equal(normalizeDate(new Date('lixo')), 'Invalid Date');
  });

  it('Date inválida falha em metadata.updated', () => {
    const input = build();
    (input.metadata as Record<string, unknown>).updated = new Date('lixo');
    assert.deepEqual(issuePaths(input), ['metadata.updated']);
  });
});

describe('chaves desconhecidas', () => {
  it('são aceitas na raiz e em metadata', () => {
    const result = skillFrontmatterSchema.safeParse(
      build({ root: { license: 'MIT', 'allowed-tools': 'Read' }, metadata: { author: 'nico' } }),
    );
    assert.equal(result.success, true);
  });
});

describe('enums vêm de catalog.config', () => {
  it('aceita cada valor das tuplas', () => {
    for (const category of CATEGORIES) {
      assert.equal(skillFrontmatterSchema.safeParse(build({ metadata: { category } })).success, true, category);
    }
    for (const status of STATUSES) {
      assert.equal(skillFrontmatterSchema.safeParse(build({ metadata: { status } })).success, true, status);
    }
    for (const agent of AGENTS) {
      assert.equal(skillFrontmatterSchema.safeParse(build({ metadata: { agents: [agent] } })).success, true, agent);
    }
  });

  it('as opções do z.enum são exatamente as tuplas da config', () => {
    const shape = skillFrontmatterSchema.def.in.shape.metadata.shape;
    assert.deepEqual(shape.category.options, [...CATEGORIES]);
    assert.deepEqual(shape.status.options, [...STATUSES]);
    assert.deepEqual(shape.agents.unwrap().element.options, [...AGENTS]);
  });
});

describe('toTitleCase', () => {
  it('converte kebab-case em title case', () => {
    assert.equal(toTitleCase('mermaid-diagrams'), 'Mermaid Diagrams');
    assert.equal(toTitleCase('a'), 'A');
    assert.equal(toTitleCase('skill-2-go'), 'Skill 2 Go');
  });
});

describe('formatFieldPath', () => {
  it('formata objetos e índices', () => {
    assert.equal(formatFieldPath(['metadata', 'tags', 2]), 'metadata.tags[2]');
    assert.equal(formatFieldPath(['skills', 0]), 'skills[0]');
    assert.equal(formatFieldPath([]), '');
  });
});

describe('packSchema', () => {
  const pack = { id: 'nico-stack', title: 'Nico Stack', description: 'Pack de teste', skills: ['a-b', 'c-d'] };

  it('aceita pack válido', () => {
    assert.equal(packSchema.safeParse(pack).success, true);
  });

  it('rejeita skills vazio', () => {
    const result = packSchema.safeParse({ ...pack, skills: [] });
    assert.equal(result.success, false);
    assert.deepEqual(result.error?.issues.map((i) => formatFieldPath(i.path)), ['skills']);
  });

  it('rejeita duplicatas apontando o índice repetido', () => {
    const result = packSchema.safeParse({ ...pack, skills: ['a-b', 'c-d', 'a-b'] });
    assert.equal(result.success, false);
    assert.deepEqual(result.error?.issues.map((i) => formatFieldPath(i.path)), ['skills[2]']);
  });

  it('rejeita id fora de kebab-case, title e description vazios', () => {
    const result = packSchema.safeParse({ ...pack, id: 'Nico Stack', title: ' ', description: '' });
    assert.equal(result.success, false);
    assert.deepEqual(
      result.error?.issues.map((i) => formatFieldPath(i.path)).sort(),
      ['description', 'id', 'title'],
    );
  });
});
