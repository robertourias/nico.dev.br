"use client";

import { ToggleFilter, ToggleFilterGroup } from "@nico.dev/ui";

// Tradução curta dos valores de status conhecidos. Status futuros não
// mapeados caem no fallback (o próprio valor), sem quebrar a UI.
const STATUS_LABEL: Record<string, string> = {
  stable: "Estável",
  beta: "Beta",
  draft: "Rascunho",
};

export interface FilterBarProps {
  facets: { categories: string[]; tags: string[]; statuses: string[] };
  category: string | null;
  tags: string[];
  statuses: string[];
  onCategoryChange: (category: string | null) => void;
  onTagsChange: (tags: string[]) => void;
  onStatusesChange: (statuses: string[]) => void;
}

// Alterna `value` dentro de `selected`, preservando a ordem de `order`
// (ordem de facets.tags/facets.statuses) em vez da ordem de clique.
function toggleValue(order: string[], selected: string[], value: string): string[] {
  const next = selected.includes(value)
    ? selected.filter((item) => item !== value)
    : [...selected, value];
  return order.filter((item) => next.includes(item));
}

// Puramente controlado por props: não conhece SkillListItem nem lê o
// registry — quem orquestra o estado é T4 (skill-list.tsx). ToggleFilterGroup
// (mode="multiple") não ativa múltiplos itens simultaneamente na implementação
// atual de @nico.dev/ui (achado registrado na spec, fora de escopo aqui); por
// isso tags e status usam ToggleFilter standalone controlado manualmente.
export function FilterBar({
  facets,
  category,
  tags,
  statuses,
  onCategoryChange,
  onTagsChange,
  onStatusesChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4">
      {facets.categories.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Categoria</span>
          <ToggleFilterGroup
            aria-label="Filtrar por categoria"
            value={category ?? ""}
            onValueChange={(next) => onCategoryChange(next === "" ? null : next)}
            className="flex-wrap"
          >
            <ToggleFilter value="">Todas</ToggleFilter>
            {facets.categories.map((option) => (
              <ToggleFilter key={option} value={option}>
                {option}
              </ToggleFilter>
            ))}
          </ToggleFilterGroup>
        </div>
      ) : null}

      {facets.tags.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Tags</span>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por tag">
            {facets.tags.map((tag) => (
              <ToggleFilter
                key={tag}
                active={tags.includes(tag)}
                onClick={() => onTagsChange(toggleValue(facets.tags, tags, tag))}
              >
                {tag}
              </ToggleFilter>
            ))}
          </div>
        </div>
      ) : null}

      {facets.statuses.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Status</span>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por status">
            {facets.statuses.map((status) => (
              <ToggleFilter
                key={status}
                active={statuses.includes(status)}
                onClick={() => onStatusesChange(toggleValue(facets.statuses, statuses, status))}
              >
                {STATUS_LABEL[status] ?? status}
              </ToggleFilter>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
