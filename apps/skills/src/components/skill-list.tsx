"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge, CopyButton, ToggleFilter, ToggleFilterGroup } from "@nico.dev/ui";
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
  const sorted = useMemo(() => sortSkills(items, sort), [items, sort]);

  if (items.length === 0) {
    return <p className="text-muted-foreground">Nenhuma skill publicada ainda.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <ToggleFilterGroup
        aria-label="Ordenar skills"
        value={sort}
        // Em modo single, clicar no item ativo emite "": ignoramos para manter a ordenação.
        onValueChange={(next) => {
          if (next === "recent" || next === "alpha") setSort(next);
        }}
        className="self-start"
      >
        <ToggleFilter value="recent">Mais recentes</ToggleFilter>
        <ToggleFilter value="alpha">A–Z</ToggleFilter>
      </ToggleFilterGroup>

      <ol className="divide-y divide-border rounded-lg border border-border bg-card text-card-foreground">
        {sorted.map((item, index) => {
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
    </div>
  );
}
