import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./theme.css"
import { DevpathHeader } from "./_components/DevpathHeader"
import { Hero } from "./_components/Hero"
import { StatsBar } from "./_components/StatsBar"
import { FeaturesGrid } from "./_components/FeaturesGrid"
import { JobSearchSection } from "./_components/JobSearchSection"
import { RoadmapExplorer } from "./_components/RoadmapExplorer"
import { SalarySection } from "./_components/SalarySection"
import { CompaniesSection } from "./_components/CompaniesSection"
import { CareerComparator } from "./_components/CareerComparator"
import { AiAssistantPreview } from "./_components/AiAssistantPreview"
import { GamificationSection } from "./_components/GamificationSection"
import { TestimonialsSection } from "./_components/TestimonialsSection"
import { PlansSection } from "./_components/PlansSection"
import { NewsletterSection } from "./_components/NewsletterSection"
import { FaqSection } from "./_components/FaqSection"
import { FinalCta } from "./_components/FinalCta"
import { DevpathFooter } from "./_components/DevpathFooter"

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-devpath-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "DevPath — Vagas, salários e roadmaps para sua carreira em tecnologia",
  description:
    "Encontre vagas de tecnologia agregadas de várias plataformas, compare salários por cargo e senioridade, siga roadmaps interativos por área e tire dúvidas de carreira com o assistente de IA.",
  openGraph: {
    title: "DevPath — Sua carreira em tecnologia, em um só lugar",
    description:
      "Busca de vagas, pesquisa salarial, roadmaps interativos, comparador de carreiras e assistente de IA para profissionais de tecnologia.",
    type: "website",
  },
}

// Página fora do route group `(site)`: header e footer próprios, tema
// escopado (`theme-devpath`) — identidade "dev tool" escura (grafite + verde
// menta), distinta das demais landings do app "criativo". Três módulos têm
// lógica real e interativa (busca de vagas mock, roadmap explorer e
// assistente de IA preview); os demais módulos do briefing original (perfil,
// alertas, biblioteca tech etc.) aparecem como cards ilustrativos na
// FeaturesGrid, sem implementação funcional própria nesta landing de
// showcase de produto.
export default function DevpathPage() {
  return (
    <div className={`${jetbrainsMono.variable} theme-devpath min-h-screen bg-[var(--devpath-bg)] text-[var(--devpath-fg)]`}>
      <DevpathHeader />
      <main>
        <Hero />
        <StatsBar />
        <FeaturesGrid />
        <JobSearchSection />
        <RoadmapExplorer />
        <SalarySection />
        <CompaniesSection />
        <CareerComparator />
        <AiAssistantPreview />
        <GamificationSection />
        <TestimonialsSection />
        <PlansSection />
        <NewsletterSection />
        <FaqSection />
        <FinalCta />
      </main>
      <DevpathFooter />
    </div>
  )
}
