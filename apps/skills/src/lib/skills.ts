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
