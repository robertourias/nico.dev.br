import { ExternalLink, ImageOff } from "lucide-react";
import { repoConfig, skillsShConfig } from "../../catalog.config";

// Mesmo padrão de foco visível de `skill-links.tsx`.
const LINK_CLASSNAME =
  "inline-flex items-center gap-1.5 text-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

type PathItem = {
  label: string;
  description: string;
  href?: string;
  linkLabel?: string;
  /** O que a captura real vai mostrar quando existir (FR-004/FR-004a). */
  screenshotLabel: string;
};

const PATHS: PathItem[] = [
  {
    label: "Link direto",
    description: 'Abra a página de qualquer skill neste catálogo e clique em "Ver no skills.sh".',
    // Sem link próprio: a URL é por skill e já existe em /s/[slug] (TASK07, `SkillLinks`).
    screenshotLabel:
      'a página de uma skill deste catálogo com o link "Ver no skills.sh" em destaque',
  },
  {
    label: "Buscar pelo nome",
    description: "No skills.sh, use a busca do diretório e digite o nome da skill ou uma das tags.",
    href: skillsShConfig.baseUrl,
    linkLabel: "Abrir skills.sh",
    screenshotLabel: "a home do skills.sh com a busca preenchida com o nome de uma skill",
  },
  {
    label: "Navegar pelo repositório",
    description: `Abra a página do repositório ${repoConfig.slug} no skills.sh e veja todas as skills publicadas ali.`,
    href: skillsShConfig.repoUrl,
    linkLabel: "Abrir repositório no skills.sh",
    screenshotLabel: `a página do repositório ${repoConfig.slug} no skills.sh listando as skills`,
  },
];

/**
 * Caixa de captura de tela ainda não capturada (FR-004): nunca um `<img>` quebrado.
 * `role="img"` + `aria-label` mantêm o placeholder anunciado para leitor de tela
 * enquanto não existe imagem real (FR-004a) — trocar pelo `<img>` de verdade quando
 * a skill já estiver indexada no skills.sh e a captura tiver sido feita.
 */
function ScreenshotPlaceholder({ screenshotLabel }: { screenshotLabel: string }) {
  return (
    <div
      role="img"
      aria-label={`Captura de tela em breve: ${screenshotLabel}.`}
      className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-lg border border-border bg-surface-raised"
    >
      <ImageOff aria-hidden="true" className="size-6 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">Captura em breve</span>
    </div>
  );
}

/**
 * Bloco "Encontre no skills.sh" da home (TASK08): explica a demora de indexação
 * (skills.sh só lista uma skill depois de instalada ao menos uma vez) e ensina os
 * três caminhos para achar uma skill deste catálogo por lá. Componente de
 * apresentação puro — Server Component, sem props (lê `catalog.config.ts` direto,
 * mesmo padrão de `src/app/page.tsx`).
 */
export function SkillsShBlock() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Encontre no skills.sh</h2>
        <p className="text-sm text-muted-foreground">
          As skills deste catálogo também aparecem no diretório do{" "}
          <a
            href={skillsShConfig.baseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            skills.sh
          </a>{" "}
          — mas só depois de instaladas ao menos uma vez (o diretório é alimentado por telemetria
          anônima da CLI). Acabou de instalar? Pode levar um tempo até aparecer por lá.
        </p>
      </div>

      <ol className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PATHS.map((path) => (
          <li key={path.label} className="flex flex-col gap-2">
            <ScreenshotPlaceholder screenshotLabel={path.screenshotLabel} />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">{path.label}</span>
              <p className="text-sm text-muted-foreground">{path.description}</p>
              {path.href && (
                <a href={path.href} target="_blank" rel="noopener noreferrer" className={LINK_CLASSNAME}>
                  <ExternalLink aria-hidden="true" className="size-4" />
                  {path.linkLabel}
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
