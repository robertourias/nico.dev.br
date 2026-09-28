import { File, Folder } from "lucide-react";
import type { FileTreeNode } from "../lib/skills";

export type FileTreeProps = {
  nodes: FileTreeNode[];
};

// Indentação por nível via recursão: cada `<ul>` aninhado herda `pl-4` do nível anterior, então a
// profundidade soma naturalmente (nível 2 = pl-4 duas vezes) sem valor mágico multiplicado nem
// estilo inline.
function FileTreeList({ nodes }: { nodes: FileTreeNode[] }) {
  return (
    <ul className="flex flex-col gap-1 pl-4">
      {nodes.map((node) => (
        <li key={node.path} className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            {node.type === "folder" ? (
              <Folder aria-hidden="true" className="size-4 shrink-0" />
            ) : (
              <File aria-hidden="true" className="size-4 shrink-0" />
            )}
            {node.name}
          </span>
          {/* Pastas sempre têm >=1 filho (ver `buildFileTree` em `lib/skills.ts`), mas checamos
              `children` para satisfazer o tipo opcional sem non-null assertion. */}
          {node.type === "folder" && node.children && node.children.length > 0 ? (
            <FileTreeList nodes={node.children} />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/**
 * Árvore de arquivos de uma skill, na página de detalhe. Server Component sem interatividade:
 * nomes são texto puro, sem link individual — nenhum arquivo isolado é servido pelo site, só a
 * skill inteira linka pro GitHub (via `SkillLinks`, componente separado).
 */
export function FileTree({ nodes }: FileTreeProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold">Arquivos desta skill</h2>
      <FileTreeList nodes={nodes} />
    </div>
  );
}
