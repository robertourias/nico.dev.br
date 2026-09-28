import type { Metadata } from "next";
import { InstallCommandTabs, Badge } from "@nico.dev/ui";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileTree } from "../../../components/file-tree";
import { SkillBadges } from "../../../components/skill-badges";
import { SkillLinks } from "../../../components/skill-links";
import { SkillMarkdown } from "../../../components/skill-markdown";
import { getSkill, getSkillSlugs } from "../../../lib/registry";
import { buildFileTree, formatUpdated } from "../../../lib/skills";

// Next 16 passa `params` como Promise em pages/generateMetadata (confirmado em
// `apps/web-nico.dev.br/src/app/[locale]/page.tsx`), diferente de versões anteriores do
// framework onde `params` era um objeto síncrono — por isso o `await` abaixo, tanto aqui
// quanto em `generateMetadata`.
type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Gera só as rotas de skills públicas conhecidas em build; `dynamicParams = false` garante que
 * nenhum slug fora desta lista gere página nem tenha fallback em runtime (o site é 100% estático,
 * ver `next.config.ts`: `output: "export"`). */
export function generateStaticParams() {
  return getSkillSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const skill = getSkill(slug);

  // `generateStaticParams` já restringe as rotas geradas às skills existentes, mas o guard
  // continua necessário: metadata é resolvida por slug de novo, sem reaproveitar o resultado
  // do Page, e o TypeScript não sabe que os dois sempre concordam.
  if (!skill) {
    return {};
  }

  return {
    title: `${skill.title} · Nico Skills`,
    description: skill.description,
  };
}

export default async function SkillDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const skill = getSkill(slug);

  if (!skill) {
    notFound();
  }

  const installTabs = [
    { id: "skill", label: "Esta skill", command: skill.installCommands.skill },
    { id: "repository", label: "Repositório", command: skill.installCommands.repository },
    { id: "manual", label: "Manual", command: skill.installCommands.manual },
  ];

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12">
      <Link
        href="/"
        className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        ← Todas as skills
      </Link>

      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold">{skill.title}</h1>
        <SkillBadges category={skill.category} status={skill.status} version={skill.version} />
      </div>

      <p className="text-muted-foreground">{skill.description}</p>

      <InstallCommandTabs
        className="w-full"
        tabs={installTabs}
        defaultTabId="skill"
      />

      <div className="flex flex-wrap items-center gap-2">
        {skill.tags.map((tag) => (
          <Badge key={tag} variant="default">
            {tag}
          </Badge>
        ))}
        <span className="text-xs text-muted-foreground">
          Atualizado em {formatUpdated(skill.updated)}
        </span>
      </div>

      <SkillLinks githubUrl={skill.githubUrl} skillsShUrl={skill.skillsShUrl} />

      <SkillMarkdown content={skill.content} />

      <FileTree nodes={buildFileTree(skill.files)} />
    </main>
  );
}
