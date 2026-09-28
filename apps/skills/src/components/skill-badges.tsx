import { Badge } from "@nico.dev/ui";

// Tipos de props definidos localmente (não importados de `../lib/skills`) porque
// `SkillDetail` está sendo criado em paralelo por outro agente nesta mesma onda;
// isso evita bloqueio e conflito de import (ver spec da tarefa T3).
export type SkillBadgesProps = {
  category: string;
  status: string;
  version: string;
};

// Mesma tradução/variante já usada na lista da home (`skill-list.tsx`), mas aqui
// com rótulo traduzido em vez do status cru — exigência explícita da spec FR-009.
const STATUS_CONFIG: Record<string, { label: string; variant: "success" | "warning" | "default" }> = {
  stable: { label: "Estável", variant: "success" },
  beta: { label: "Beta", variant: "warning" },
  draft: { label: "Rascunho", variant: "default" },
};

/** Capitaliza só a primeira letra — valores de `CATEGORIES` já são palavras em inglês minúsculas. */
function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Badges de metadados de uma skill (categoria, status, versão) para a página de detalhe.
 * Componente de apresentação puro — Server Component (sem estado/interatividade).
 */
export function SkillBadges({ category, status, version }: SkillBadgesProps) {
  const statusConfig = STATUS_CONFIG[status] ?? { label: status, variant: "default" as const };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default">{capitalize(category)}</Badge>
      <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
      <Badge variant="default">{`v${version}`}</Badge>
    </div>
  );
}
