import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { FileTree } from "./file-tree";
import type { FileTreeNode } from "../lib/skills";

// Sem harness de componente neste app: verificação via HTML renderizado estaticamente, mesmo
// padrão de `skill-badges.test.tsx`/`skill-links.test.tsx`.

const TREE: FileTreeNode[] = [
  {
    name: "scripts",
    path: "scripts",
    type: "folder",
    children: [
      { name: "build.ts", path: "scripts/build.ts", type: "file" },
    ],
  },
  { name: "SKILL.md", path: "SKILL.md", type: "file" },
];

test("FileTree: título da seção presente", () => {
  const html = renderToStaticMarkup(<FileTree nodes={TREE} />);
  assert.match(html, /Arquivos desta skill/);
});

test("FileTree: renderiza aninhamento de 2 níveis com nomes corretos", () => {
  const html = renderToStaticMarkup(<FileTree nodes={TREE} />);
  assert.match(html, /scripts/);
  assert.match(html, /build\.ts/);
  assert.match(html, /SKILL\.md/);
  // Um <ul> para a raiz e outro aninhado dentro da pasta "scripts".
  const ulCount = (html.match(/<ul/g) ?? []).length;
  assert.equal(ulCount, 2);
});

test("FileTree: ícone de pasta difere do ícone de arquivo", () => {
  const html = renderToStaticMarkup(<FileTree nodes={TREE} />);
  // lucide-react gera <svg> com classes distintas por ícone (lucide-folder vs lucide-file);
  // checamos que os dois aparecem e não são o mesmo elemento.
  assert.match(html, /lucide-folder/);
  assert.match(html, /lucide-file\b/);
});

test("FileTree: nenhum arquivo/pasta vira link individual", () => {
  const html = renderToStaticMarkup(<FileTree nodes={TREE} />);
  assert.doesNotMatch(html, /<a /);
});
