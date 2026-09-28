import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { SkillLinks } from "./skill-links";

// Sem harness de componente neste app: verificação via HTML renderizado estaticamente.

test("SkillLinks: 2 links externos com target/rel corretos", () => {
  const html = renderToStaticMarkup(
    <SkillLinks githubUrl="https://github.com/org/repo" skillsShUrl="https://skills.sh/org/repo" />,
  );
  const targetBlankCount = (html.match(/target="_blank"/g) ?? []).length;
  const relCount = (html.match(/rel="noopener noreferrer"/g) ?? []).length;
  assert.equal(targetBlankCount, 2);
  assert.equal(relCount, 2);
  assert.match(html, /href="https:\/\/github\.com\/org\/repo"/);
  assert.match(html, /href="https:\/\/skills\.sh\/org\/repo"/);
});

test("SkillLinks: textos visíveis e nota sobre skills.sh presentes", () => {
  const html = renderToStaticMarkup(
    <SkillLinks githubUrl="https://github.com/org/repo" skillsShUrl="https://skills.sh/org/repo" />,
  );
  assert.match(html, /Ver no GitHub/);
  assert.match(html, /Ver no skills\.sh/);
  assert.match(html, /Skills só aparecem no skills\.sh depois de instaladas ao menos uma vez\./);
});
