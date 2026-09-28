// Pipeline unified -> HTML sanitizado, síncrono e sem DOM (testável com node --test).
//
// Por que unified direto para HTML em vez de <ReactMarkdown>: a página de detalhe é um Server
// Component 100% estático (ver docs/context/decisions.md, seção "Skills Catalog"). Gerar a string
// HTML no build permite testar a sanitização com node --test e evita enviar um parser de Markdown
// para o bundle do cliente.
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import type { Options as SanitizeSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import type { Element, Root, Text } from 'hast';

/**
 * `remark-gfm` transforma `- [x] Item` num `<li class="task-list-item"><input type="checkbox"
 * checked disabled> Item</li>`: o texto fica solto, como irmão do `<input>`, sem `<label>` nem
 * `aria-label` — leitor de tela anuncia só "checkbox, marcado", sem o texto do item (achado real
 * do axe-core, regra `label`, na verificação em navegador da TASK07). Este plugin roda ANTES do
 * sanitize e copia o texto do `<li>` (menos o próprio checkbox) para `aria-label` do `<input>`, já
 * que o schema de sanitização (abaixo) não altera estrutura, só filtra o que já existe.
 */
function rehypeLabelTaskListCheckboxes() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'li') return;
      const checkbox = node.children.find(
        (child): child is Element =>
          child.type === 'element' &&
          child.tagName === 'input' &&
          child.properties?.type === 'checkbox',
      );
      if (!checkbox) return;
      const label = node.children
        .filter((child) => child !== checkbox)
        .map((child) => textOf(child))
        .join('')
        .trim();
      if (label) checkbox.properties.ariaLabel = label;
    });
  };
}

function textOf(node: Element | Text | Root['children'][number]): string {
  if (node.type === 'text') return node.value;
  if (node.type === 'element') return node.children.map(textOf).join('');
  return '';
}

// `rehype-highlight` marca o <code> destacado com `hljs` (fixo) + `language-xxx` (a linguagem
// declarada no bloco) e envolve os tokens em <span class="hljs-xxx">. O `defaultSchema` do
// rehype-sanitize já libera `className` em `code` casando com `/^language-./`, mas não conhece
// `hljs` nem nenhuma classe de `span` — sem esta extensão, rehype-sanitize removeria os atributos
// que dão cor ao código (fonte: Context7 /rehypejs/rehype-sanitize, exemplos "Enable Syntax
// Highlighting with Rehype Highlight" e "Configure Sanitize Schema for Math Classes").
//
// Importante: `code` NÃO herda `defaultSchema.attributes.code` por spread — a validação de
// hast-util-sanitize usa a PRIMEIRA definição de `className` que encontrar no array (ver
// `findDefinition` em hast-util-sanitize); se a entrada padrão (`['className', /^language-./]`)
// vier antes da nossa, `hljs` nunca seria considerado. Por isso redeclaramos a entrada inteira
// (repetindo o regex `/^language-./`, "allowed by default" segundo a doc) em vez de anexar à lista
// existente. `span` não tem entrada padrão para `className`, então uma única entrada nova basta.
// `input[type=checkbox][checked][disabled]` das listas de tarefa já é liberado pelo `defaultSchema`
// (via `attributes['*']`, que inclui `checked`, e `attributes.input`, que exige `disabled`/`type`) —
// só `ariaLabel` (o rótulo que `rehypeLabelTaskListCheckboxes` adiciona acima) precisa de entrada
// própria, porque nenhum atributo `aria-*` está no allowlist padrão.
const schema: SanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [['className', /^language-./, 'hljs']],
    span: [['className', /^hljs-./]],
    input: [...(defaultSchema.attributes?.input ?? []), 'ariaLabel'],
  },
};

/**
 * Converte Markdown (GFM: tabelas, listas de tarefa) em HTML sanitizado, com highlight de blocos
 * de código. Pura e síncrona (`processSync`): sem I/O, roda em build (Server Component) e em
 * `node --test` sem DOM.
 *
 * Ordem dos plugins importa: `rehype-highlight` roda ANTES de `rehype-sanitize` porque o
 * sanitizador precisa ver as classes `language-*`/`hljs`/`hljs-*` já inseridas pelo highlight para
 * decidir o que manter (ver `schema` acima); rodar na ordem inversa faria o sanitize remover as
 * classes antes de elas existirem.
 */
export function renderSkillMarkdown(markdown: string): string {
  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeLabelTaskListCheckboxes)
    // Sem opções: `detect` é `false` por padrão no rehype-highlight 7.x, então só blocos com
    // linguagem explícita (```ts) são destacados — nada de adivinhação de linguagem em texto puro.
    .use(rehypeHighlight)
    .use(rehypeSanitize, schema)
    .use(rehypeStringify)
    .processSync(markdown);

  return String(file);
}
