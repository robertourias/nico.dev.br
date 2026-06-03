import { getTranslations, setRequestLocale } from "next-intl/server"
import { SiteHeader } from "../../components/SiteHeader"
import Footer from "../../components/Footer"
import { curriculumData } from "../../data/curriculum"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "resume" })
  return { title: t("metaTitle"), description: t("metaDesc") }
}

export default async function CurriculoPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("resume")
  const cvT = await getTranslations("cv")
  const cv = curriculumData

  const summary = cvT.raw("summary") as string[]
  const differentials = cvT.raw("differentials") as string[]
  const skillGroupLabels = cvT.raw("skillGroupLabels") as string[]
  const experienceRoles = cvT.raw("experienceRoles") as string[]
  const experienceBullets = cvT.raw("experienceBullets") as string[][]
  const educationDegrees = cvT.raw("educationDegrees") as string[]

  const experiences = cv.experiences.map((exp, i) => ({
    ...exp,
    role: experienceRoles[i] ?? exp.role,
    bullets: experienceBullets[i] ?? exp.bullets,
  }))

  const skillGroups = cv.skillGroups.map((group, i) => ({
    ...group,
    label: skillGroupLabels[i] ?? group.label,
  }))

  return (
    <main>
      <SiteHeader />

      <div className="pt-28 pb-20 px-6 md:px-8 bg-surface min-h-screen">
        <div className="max-w-4xl mx-auto space-y-16">

          {/* ── Cabeçalho ── */}
          <header
            id="curriculo-header"
            className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 pb-10 border-b border-outline-variant/30"
          >
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-on-surface mb-2">
                {cv.name}
              </h1>
              <p className="text-primary font-semibold text-lg mb-6">{cvT("title")}</p>

              <ul className="space-y-2 text-sm text-on-surface-variant">
                <li className="flex items-center gap-3">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {cv.location}
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <a href={`mailto:${cv.email}`} className="hover:text-primary transition-colors">
                    {cv.email}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  {cv.phone}
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 md:items-end">
              <a
                href="/Curriculo-Fullstack.pdf"
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
                aria-label={t("ariaDownload")}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                {t("downloadPdf")}
              </a>

              <div className="flex gap-3">
                <a href={cv.linkedin} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors"
                  aria-label={t("ariaLinkedIn")}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  LinkedIn
                </a>
                <a href={cv.github} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors"
                  aria-label={t("ariaGitHub")}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.201-6.086 8.201-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </header>

          {/* ── Resumo Profissional ── */}
          <section id="curriculo-resumo" aria-labelledby="resumo-title">
            <h2 id="resumo-title" className="font-display text-xs tracking-[0.2em] text-primary uppercase mb-6">
              {t("sectionSummary")}
            </h2>
            <div className="space-y-3">
              {summary.map((paragraph, i) => (
                <p key={i} className="text-on-surface-variant leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </section>

          {/* ── Habilidades Técnicas ── */}
          <section id="curriculo-habilidades" aria-labelledby="habilidades-title">
            <h2 id="habilidades-title" className="font-display text-xs tracking-[0.2em] text-primary uppercase mb-6">
              {t("sectionSkills")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {skillGroups.map((group) => (
                <div key={group.label} className="bg-surface-container rounded-xl p-5">
                  <h3 className="font-display font-semibold text-sm text-on-surface mb-4">{group.label}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span key={skill} className="px-2.5 py-1 bg-surface-container-high text-on-surface-variant text-xs rounded-md font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Diferenciais ── */}
          <section id="curriculo-diferenciais" aria-labelledby="diferenciais-title">
            <h2 id="diferenciais-title" className="font-display text-xs tracking-[0.2em] text-primary uppercase mb-6">
              {t("sectionDifferentials")}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {differentials.map((item) => (
                <li key={item} className="flex items-start gap-3 bg-surface-container rounded-xl p-4">
                  <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-sm text-on-surface-variant leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ── Experiência Profissional ── */}
          <section id="curriculo-experiencia" aria-labelledby="experiencia-title">
            <h2 id="experiencia-title" className="font-display text-xs tracking-[0.2em] text-primary uppercase mb-8">
              {t("sectionExperience")}
            </h2>
            <ol className="space-y-8">
              {experiences.map((exp, i) => (
                <li key={i} className="relative pl-5 border-l border-outline-variant/40 pb-2">
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary/30 border-2 border-primary" />
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-3">
                    <div>
                      <h3 className="font-display font-bold text-on-surface">{exp.company}</h3>
                      <p className="text-primary text-sm font-medium">{exp.role}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-on-surface-variant">{exp.period}</p>
                      <p className="text-xs text-outline">{exp.duration}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {exp.bullets.map((bullet, j) => (
                      <li key={j} className="text-sm text-on-surface-variant flex items-center gap-2">
                        <span className="text-outline shrink-0">·</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </section>

          {/* ── Formação ── */}
          <section id="curriculo-formacao" aria-labelledby="formacao-title">
            <h2 id="formacao-title" className="font-display text-xs tracking-[0.2em] text-primary uppercase mb-6">
              {t("sectionEducation")}
            </h2>
            <div className="space-y-4">
              {cv.educationList.map((edu, i) => (
                <div key={i} className="bg-surface-container rounded-xl p-6">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="font-display font-bold text-on-surface">
                      {educationDegrees[i] ?? edu.degree}
                    </h3>
                    {edu.status === "in_progress" && (
                      <span className="shrink-0 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold rounded-full uppercase tracking-wider">
                        {t("educationInProgress")}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-on-surface-variant">{edu.institution}</p>
                  <p className="text-xs text-outline mt-1">
                    {edu.status === "in_progress" && edu.expectedCompletion
                      ? t("educationExpected", { date: edu.expectedCompletion })
                      : edu.period}
                  </p>
                  {edu.highlights && edu.highlights.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider mb-3">
                        {t("educationHighlights")}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {edu.highlights.map((h) => (
                          <span key={h} className="px-2.5 py-1 bg-surface-container-high text-on-surface-variant text-xs rounded-md font-medium">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Referências LinkedIn ── */}
          <section id="curriculo-referencias" aria-labelledby="referencias-title">
            <h2 id="referencias-title" className="font-display text-xs tracking-[0.2em] text-primary uppercase mb-6">
              {t("sectionReferences")}
            </h2>
            <div className="bg-surface-container rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-display font-semibold text-on-surface mb-1">{t("referencesTitle")}</p>
                <p className="text-sm text-on-surface-variant">{t("referencesDesc")}</p>
              </div>
              <a
                href="https://www.linkedin.com/in/robertourias/details/recommendations/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-outline-variant text-on-surface text-sm font-semibold rounded-full hover:bg-surface-container-high transition-colors shrink-0"
                aria-label={t("ariaReferences")}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                {t("referencesBtn")}
              </a>
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </main>
  )
}
