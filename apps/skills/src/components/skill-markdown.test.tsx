import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { SkillMarkdown } from "./skill-markdown";

// Sem harness de componente neste app (ver apps/skills/package.json, script "test"):
// renderizamos a HTML estático e fazemos asserções sobre o markup resultante, no mesmo padrão de
// `skill-badges.test.tsx`/`skill-links.test.tsx`.

const SAMPLE_MARKDOWN = `# Título

- item um
- item dois

\`\`\`ts
const x = 1;
\`\`\`
`;

test("SkillMarkdown: renderiza título, lista e bloco de código", () => {
  const html = renderToStaticMarkup(<SkillMarkdown content={SAMPLE_MARKDOWN} />);
  assert.match(html, /<h1>Título<\/h1>/);
  assert.match(html, /<li>item um<\/li>/);
  assert.match(html, /<li>item dois<\/li>/);
  assert.match(html, /<pre><code class="hljs language-ts">/);
  assert.match(html, /const/);
});

test("SkillMarkdown: envolve o HTML em div.skill-markdown", () => {
  const html = renderToStaticMarkup(<SkillMarkdown content="texto simples" />);
  assert.match(html, /^<div class="skill-markdown">/);
  assert.match(html, /texto simples/);
});

test("SkillMarkdown: sanitiza markdown com script embutido", () => {
  const html = renderToStaticMarkup(
    <SkillMarkdown content={'texto <script>alert(1)</script> normal'} />,
  );
  assert.doesNotMatch(html, /<script>/);
});
