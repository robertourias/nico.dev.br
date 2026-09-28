// Tipos e funções puras da home (sem fs, sem React): rodam no Next e em node --test.

/** Projeção enxuta para o cliente: sem `content`, `files` e demais campos pesados. */
export interface SkillListItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  status: string;
  /** Data ISO `YYYY-MM-DD`. */
  updated: string;
  /** Comando de instalação da skill (`installCommands.skill`). */
  command: string;
}

/** Projeção completa para a página de detalhe: inclui `content`/`files` (nunca vão para a listagem). */
export interface SkillDetail {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  status: string;
  version: string;
  /** Data ISO `YYYY-MM-DD`. */
  updated: string;
  /** Caminhos POSIX relativos à pasta da skill, na ordem do registry. */
  files: string[];
  content: string;
  installCommands: { repository: string; skill: string; manual: string };
  githubUrl: string;
  skillsShUrl: string;
}

export interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileTreeNode[];
}

/**
 * Agrupa caminhos POSIX (`a/b.md`) em árvore, preservando a ordem de primeira aparição de cada
 * pasta/arquivo em `files` (o registry já ordena os arquivos; não reordenamos aqui). Uma pasta só
 * é criada quando um arquivo cai dentro dela, então nunca fica sem filhos.
 */
export function buildFileTree(files: readonly string[]): FileTreeNode[] {
  const roots: FileTreeNode[] = [];
  // Caminho completo da pasta -> node, para reaproveitar a mesma pasta entre arquivos diferentes.
  const folders = new Map<string, FileTreeNode & { children: FileTreeNode[] }>();

  for (const file of files) {
    const segments = file.split('/');
    let siblings: FileTreeNode[] = roots;
    let currentPath = '';

    segments.forEach((segment, index) => {
      currentPath = currentPath === '' ? segment : `${currentPath}/${segment}`;
      const isFile = index === segments.length - 1;

      if (isFile) {
        siblings.push({ name: segment, path: currentPath, type: 'file' });
        return;
      }

      const existing = folders.get(currentPath);
      const folder: FileTreeNode & { children: FileTreeNode[] } = existing ?? {
        name: segment,
        path: currentPath,
        type: 'folder',
        children: [],
      };
      if (!existing) {
        folders.set(currentPath, folder);
        siblings.push(folder);
      }
      siblings = folder.children;
    });
  }

  return roots;
}

export type SkillSort = 'recent' | 'alpha';

const collator = new Intl.Collator('pt-BR');

function byTitle(a: SkillListItem, b: SkillListItem): number {
  return collator.compare(a.title, b.title);
}

/** Ordena sem mutar a entrada. `recent`: updated desc, desempate por título asc. */
export function sortSkills(items: readonly SkillListItem[], sort: SkillSort): SkillListItem[] {
  const copy = [...items];
  if (sort === 'alpha') return copy.sort(byTitle);
  return copy.sort((a, b) => {
    if (a.updated !== b.updated) return a.updated < b.updated ? 1 : -1;
    return byTitle(a, b);
  });
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeZone: 'UTC' });

/** `2026-09-20` → `20 de set. de 2026`. UTC evita deslocar o dia em fusos negativos. */
export function formatUpdated(iso: string): string {
  return dateFormatter.format(new Date(`${iso}T00:00:00Z`));
}
