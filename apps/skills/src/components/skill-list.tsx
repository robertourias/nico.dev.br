"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Badge, Button, CopyButton, ToggleFilter, ToggleFilterGroup } from "@nico.dev/ui";
import { FilterBar } from "./filter-bar";
import { SearchBar } from "./search-bar";
import { useSlashShortcut } from "../hooks/use-slash-shortcut";
import { filterSkills, getFacets } from "../lib/search";
import { formatUpdated, sortSkills } from "../lib/skills";
import type { SkillListItem, SkillSort } from "../lib/skills";

const MAX_TAGS = 3;

const STATUS_VARIANT: Record<string, "success" | "warning" | "default"> = {
  stable: "success",
  beta: "warning",
  draft: "default",
};

export interface SkillListProps {
  items: SkillListItem[];
}

export function SkillList({ items }: SkillListProps) {
  const [sort, setSort] = useState<SkillSort>("recent");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  useSlashShortcut(searchInputRef);

  const facets = useMemo(() => getFacets(items), [items]);

  const isSearching = query.trim() !== "";
  const filtered = useMemo(
    () => filterSkills(items, { query, category, tags, statuses }),
    [items, query, category, tags, statuses],
  );
  // Busca ativa preserva a ordem de relevância do Fuse (FR-003); sortSkills só
  // se aplica quando não há busca em andamento.
  const visible = useMemo(
    () => (isSearching ? filtered : sortSkills(filtered, sort)),
    [filtered, isSearching, sort],
  );

  const hasActiveFilters =
    query !== "" || category !== null || tags.length > 0 || statuses.length > 0;

  function clearFilters() {
    setQuery("");
    setCategory(null);
    setTags([]);
    setStatuses([]);
    searchInputRef.current?.focus();
  }

  if (items.length === 0) {
    return <p className="text-muted-foreground">Nenhuma skill publicada ainda.</p>;
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <div className="flex flex-col gap-3">
        <SearchBar ref={searchInputRef} value={query} onChange={setQuery} />
        <FilterBar
          facets={facets}
          category={category}
          tags={tags}
          statuses={statuses}
          onCategoryChange={setCategory}
          onTagsChange={setTags}
          onStatusesChange={setStatuses}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* A ordenação por recente/A-Z só se aplica sem busca ativa (FR-003): com
            busca, a relevância do Fuse prevalece. Em vez de esconder o controle
            (o que faria o layout "pular"), ele fica desabilitado e com opacidade
            reduzida enquanto `isSearching` for true — decisão mais simples do
            que reordenar o resultado da busca ou remover o grupo do DOM. */}
        <ToggleFilterGroup
          aria-label="Ordenar skills"
          value={sort}
          // Em modo single, clicar no item ativo emite "": ignoramos para manter a ordenação.
          onValueChange={(next) => {
            if (isSearching) return;
            if (next === "recent" || next === "alpha") setSort(next);
          }}
          className={isSearching ? "self-start opacity-50" : "self-start"}
        >
          <ToggleFilter value="recent" disabled={isSearching}>
            Mais recentes
          </ToggleFilter>
          <ToggleFilter value="alpha" disabled={isSearching}>
            A–Z
          </ToggleFilter>
        </ToggleFilterGroup>

        {hasActiveFilters ? (
          <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
            Limpar
          </Button>
        ) : null}
      </div>

      <p aria-live="polite" className="text-sm text-muted-foreground">
        {visible.length} de {items.length} skills
      </p>

      {visible.length === 0 ? (
        <div className="flex flex-col items-start gap-3">
          <p className="text-muted-foreground">Nenhuma skill encontrada.</p>
          <Button type="button" variant="outline" size="sm" onClick={clearFilters}>
            Limpar filtros
          </Button>
        </div>
      ) : (
        <ol className="divide-y divide-border rounded-lg border border-border bg-card text-card-foreground">
          {visible.map((item, index) => {
            const visibleTags = item.tags.slice(0, MAX_TAGS);
            const extraTags = item.tags.length - visibleTags.length;

            return (
              <li key={item.slug} className="group flex items-start gap-3 px-3 py-3 sm:px-4">
                <span
                  aria-hidden="true"
                  className="w-6 shrink-0 pt-0.5 text-right text-sm tabular-nums text-muted-foreground"
                >
                  {index + 1}
                </span>

                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                    <Link
                      href={`/s/${item.slug}/`}
                      className="min-w-0 break-words font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {item.title}
                    </Link>
                    <Badge variant={STATUS_VARIANT[item.status] ?? "default"}>{item.status}</Badge>
                  </div>
                  <p className="line-clamp-1 text-sm text-muted-foreground">{item.description}</p>
                  <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                    {visibleTags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                    {extraTags > 0 ? (
                      <span className="text-xs text-muted-foreground">+{extraTags}</span>
                    ) : null}
                    <time dateTime={item.updated} className="text-xs tabular-nums text-muted-foreground">
                      {formatUpdated(item.updated)}
                    </time>
                  </div>
                </div>

                <CopyButton
                  value={item.command}
                  label={`Copiar comando de instalação de ${item.title}`}
                  className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
                />
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
