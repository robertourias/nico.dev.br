import { setRequestLocale } from "next-intl/server"
import { SiteHeader } from "../components/SiteHeader"
import Hero from "../components/Hero"
import About from "../components/About"
import Skills from "../components/Skills"
import FeaturedProjects from "../components/FeaturedProjects"
import Contact from "../components/Contact"
import Footer from "../components/Footer"

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <main>
      <SiteHeader />
      <Hero />
      <About />
      <Skills />
      <FeaturedProjects />
      <Contact />
      <Footer />
    </main>
  )
}
