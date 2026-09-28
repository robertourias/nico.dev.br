"use client";

import { forwardRef } from "react";
import { Search } from "lucide-react";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

// Componente controlado e desacoplado de dados: T4 decide o que fazer com o
// texto digitado (filterSkills fica em src/lib/search.ts). forwardRef expõe o
// elemento <input> para o hook useSlashShortcut (T2) e para T4 focar após "Limpar".
export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(function SearchBar(
  { value, onChange },
  ref,
) {
  return (
    <div className="relative">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Buscar skills"
        placeholder="Buscar por nome, descrição ou tag…"
        className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm text-card-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
});
