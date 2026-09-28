import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { renderSkillMarkdown } from './markdown';

describe('renderSkillMarkdown', () => {
  it('converte títulos, listas e parágrafos nas tags certas', () => {
    const html = renderSkillMarkdown('# Título\n\n## Subtítulo\n\nUm parágrafo.\n\n- item a\n- item b\n');
    assert.match(html, /<h1>Título<\/h1>/);
    assert.match(html, /<h2>Subtítulo<\/h2>/);
    assert.match(html, /<p>Um parágrafo\.<\/p>/);
    assert.match(html, /<ul>\s*<li>item a<\/li>\s*<li>item b<\/li>\s*<\/ul>/);
  });

  it('tabela GFM vira <table>', () => {
    const html = renderSkillMarkdown('| a | b |\n| - | - |\n| 1 | 2 |\n');
    assert.match(html, /<table>/);
    assert.match(html, /<thead>/);
    assert.match(html, /<tbody>/);
    assert.match(html, /<td>1<\/td>/);
  });

  it('lista de tarefas GFM vira checkbox desabilitado', () => {
    const html = renderSkillMarkdown('- [x] feito\n- [ ] pendente\n');
    assert.match(html, /<input[^>]*type="checkbox"[^>]*checked/);
    assert.match(html, /<input[^>]*type="checkbox"[^>]*disabled/);
  });

  it('checkbox da lista de tarefas ganha aria-label com o texto do item (achado do axe-core, regra "label")', () => {
    const html = renderSkillMarkdown('- [x] Item concluído\n- [ ] Item pendente\n');
    assert.match(html, /<input type="checkbox" checked disabled aria-label="Item concluído">/);
    assert.match(html, /<input type="checkbox" disabled aria-label="Item pendente">/);
  });

  it('bloco de código com linguagem ganha classe language-ts e hljs, com spans hljs- sobrevivendo ao sanitize', () => {
    const html = renderSkillMarkdown('```ts\nconst x: number = 1;\n```\n');
    assert.match(html, /<code class="hljs language-ts">/);
    // Prova de que o highlight sobrevive ao rehype-sanitize: pelo menos um span com classe hljs-*.
    assert.match(html, /<span class="hljs-[\w-]+">/);
  });

  describe('segurança: markdown malicioso não produz saída executável', () => {
    it('remove <script>', () => {
      const html = renderSkillMarkdown('<script>alert(1)</script>\n\nTexto normal.');
      assert.doesNotMatch(html, /<script/i);
      assert.doesNotMatch(html, /alert\(1\)/);
    });

    it('remove onerror de <img>', () => {
      const html = renderSkillMarkdown('<img src=x onerror=alert(1)>');
      assert.doesNotMatch(html, /onerror/i);
    });

    it('remove href javascript: de links', () => {
      const html = renderSkillMarkdown('[link](javascript:alert(1))');
      assert.doesNotMatch(html, /href="javascript:/i);
    });
  });

  it('não lança para markdown vazio', () => {
    assert.doesNotThrow(() => renderSkillMarkdown(''));
    assert.equal(renderSkillMarkdown(''), '');
  });

  it('não lança para markdown só texto simples', () => {
    assert.doesNotThrow(() => renderSkillMarkdown('apenas um texto simples, sem blocos especiais'));
    assert.match(renderSkillMarkdown('apenas um texto simples'), /<p>apenas um texto simples<\/p>/);
  });
});
