import { getTranslations, setRequestLocale } from "next-intl/server"
import { SiteHeader } from "../../components/SiteHeader"
import Footer from "../../components/Footer"
import ProjectCard from "../../components/ProjectCard"
import { projects } from "../../data/projects"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "projects" })
  return { title: t("pageMetaTitle"), description: t("pageMetaDesc") }
}

export default async function ProjetosPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("projects")

  return (
    <main>
      <SiteHeader />

      <div className="pt-28 pb-20 px-6 md:px-8 bg-surface min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-16">
            <p className="font-display text-sm tracking-[0.2em] text-primary uppercase mb-4">
              {t("tag")}
            </p>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-on-surface">
              {t("pageTitle")}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
