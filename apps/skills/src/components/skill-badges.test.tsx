import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { SkillBadges } from "./skill-badges";

// Sem harness de componente neste app (ver apps/skills/package.json, script "test"):
// renderizamos a HTML estático e fazemos asserções sobre o markup resultante.

test("SkillBadges: capitaliza a categoria sem traduzir", () => {
  const html = renderToStaticMarkup(
    <SkillBadges category="design" status="stable" version="1.0.0" />,
  );
  assert.match(html, /Design/);
  assert.doesNotMatch(html, />design</);
});

test("SkillBadges: status stable -> rótulo Estável, variant success", () => {
  const html = renderToStaticMarkup(
    <SkillBadges category="engineering" status="stable" version="1.0.0" />,
  );
  assert.match(html, /Estável/);
  assert.match(html, /bg-badge-success-bg/);
});

test("SkillBadges: status beta -> rótulo Beta, variant warning", () => {
  const html = renderToStaticMarkup(
    <SkillBadges category="engineering" status="beta" version="1.0.0" />,
  );
  assert.match(html, /Beta/);
  assert.match(html, /bg-badge-warning-bg/);
});

test("SkillBadges: status draft -> rótulo Rascunho, variant default", () => {
  const html = renderToStaticMarkup(
    <SkillBadges category="engineering" status="draft" version="1.0.0" />,
  );
  assert.match(html, /Rascunho/);
  assert.match(html, /bg-accent/);
});

test("SkillBadges: versão sempre prefixada com v", () => {
  const html = renderToStaticMarkup(
    <SkillBadges category="writing" status="stable" version="2.3.1" />,
  );
  assert.match(html, />v2\.3\.1</);
});
