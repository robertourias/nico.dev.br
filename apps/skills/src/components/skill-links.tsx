import { ExternalLink, Github } from "lucide-react";

// Tipos de props definidos localmente (não importados de `../lib/skills`) pelo
// mesmo motivo de `skill-badges.tsx`: `SkillDetail` está em construção em paralelo.
export type SkillLinksProps = {
  githubUrl: string;
  skillsShUrl: string;
};

// Padrão de foco visível já usado em `skill-list.tsx` para links.
const LINK_CLASSNAME =
  "inline-flex items-center gap-1.5 text-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * Links externos de uma skill (repositório no GitHub e página no skills.sh) para a
 * página de detalhe. Componente de apresentação puro — Server Component.
 */
export function SkillLinks({ githubUrl, skillsShUrl }: SkillLinksProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-4">
        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={LINK_CLASSNAME}>
          <Github aria-hidden="true" className="size-4" />
          Ver no GitHub
        </a>
        <a href={skillsShUrl} target="_blank" rel="noopener noreferrer" className={LINK_CLASSNAME}>
          <ExternalLink aria-hidden="true" className="size-4" />
          Ver no skills.sh
        </a>
      </div>
      <p className="text-xs text-muted-foreground">
        Skills só aparecem no skills.sh depois de instaladas ao menos uma vez.
      </p>
    </div>
  );
}
