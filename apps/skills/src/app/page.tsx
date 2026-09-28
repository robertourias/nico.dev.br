import { InstallCommandTabs } from "@nico.dev/ui";
import { siteConfig } from "../../catalog.config";
import { AsciiBanner } from "../components/ascii-banner";
import { SkillList } from "../components/skill-list";
import { SkillsShBlock } from "../components/skills-sh-block";
import { Stats } from "../components/stats";
import { getRegistry } from "../lib/registry";
import { formatUpdated } from "../lib/skills";

export default function Home() {
  const { items, counts, lastUpdated, installCommands } = getRegistry();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-12">
      <section className="flex flex-col items-center gap-6 text-center">
        <AsciiBanner />
        <p className="text-muted-foreground">{siteConfig.tagline}</p>
        <InstallCommandTabs
          className="w-full text-left"
          tabs={[
            {
              id: "repository",
              label: "Repositório",
              command: installCommands.repository,
            },
          ]}
        />
      </section>

      <section aria-label="Números do catálogo">
        <Stats
          skills={counts.skills}
          packs={counts.packs}
          lastUpdated={lastUpdated ? formatUpdated(lastUpdated) : null}
        />
      </section>

      <section aria-label="Skills">
        <SkillList items={items} />
      </section>

      <section aria-label="Encontre no skills.sh">
        <SkillsShBlock />
      </section>
    </main>
  );
}
