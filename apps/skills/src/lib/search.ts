// Filtro de busca + facetas da home: função pura, sem window/document/DOM,
// para rodar tanto no cliente (client component) quanto em node --test.
import Fuse from 'fuse.js';

import { CATEGORIES, STATUSES } from '../../catalog.config';
import type { SkillListItem } from './skills';

export interface SkillFilterCriteria {
  /** Trim()ada ou não — a função normaliza antes de decidir se filtra por texto. */
  query: string;
  /** `null` = todas as categorias. */
  category: string | null;
  /** Vazio = sem filtro de tag. */
  tags: readonly string[];
  /** Vazio = sem filtro de status. */
  statuses: readonly string[];
}

export interface SkillFacets {
  categories: string[];
  tags: string[];
  statuses: string[];
}

// Título pesa mais que descrição e tags: um match no título é o sinal mais forte de
// relevância para quem busca no catálogo; descrição e tags empatam como sinal secundário.
const FUSE_KEYS = [
  { name: 'title', weight: 3 },
  { name: 'description', weight: 1 },
  { name: 'tags', weight: 1 },
];

// Ponto de partida ajustável: 0.3 tolera erros de digitação leves (ex.: "mermaido")
// sem devolver resultados irrelevantes. Calibrar conforme feedback de uso real.
const FUSE_THRESHOLD = 0.3;

function matchesCategory(item: SkillListItem, category: string | null): boolean {
  return category === null || item.category === category;
}

// OR dentro da faceta: basta uma das tags/status selecionados estar presente no item.
function matchesAny(itemValues: readonly string[], selected: readonly string[]): boolean {
  if (selected.length === 0) return true;
  return selected.some((value) => itemValues.includes(value));
}

/**
 * Filtra `items` por texto (fuzzy, via Fuse.js), categoria, tags e status.
 * AND entre facetas; OR dentro de tags e de status.
 * Busca vazia não reordena nem exclui por texto — a ordem original de `items` é preservada.
 * Busca não vazia usa a ordem de relevância do Fuse (quem chama decide se reordena depois).
 */
export function filterSkills(
  items: readonly SkillListItem[],
  criteria: SkillFilterCriteria,
): SkillListItem[] {
  const byFacets = items.filter(
    (item) =>
      matchesCategory(item, criteria.category) &&
      matchesAny(item.tags, criteria.tags) &&
      matchesAny([item.status], criteria.statuses),
  );

  const query = criteria.query.trim();
  if (query === '') return byFacets;

  const fuse = new Fuse(byFacets, { keys: FUSE_KEYS, threshold: FUSE_THRESHOLD });
  return fuse.search(query).map((result) => result.item);
}

/** Valores realmente presentes em `items`, sem duplicatas. */
export function getFacets(items: readonly SkillListItem[]): SkillFacets {
  const collator = new Intl.Collator('pt-BR');

  const presentCategories = new Set(items.map((item) => item.category));
  const presentStatuses = new Set(items.map((item) => item.status));
  const presentTags = new Set(items.flatMap((item) => item.tags));

  return {
    // Ordem de primeira aparição nas tuplas canônicas (CATEGORIES/STATUSES), não a ordem em `items`.
    categories: CATEGORIES.filter((category) => presentCategories.has(category)),
    statuses: STATUSES.filter((status) => presentStatuses.has(status)),
    tags: [...presentTags].sort((a, b) => collator.compare(a, b)),
  };
}
