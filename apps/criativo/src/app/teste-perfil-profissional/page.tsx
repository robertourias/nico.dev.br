import type { Metadata } from "next"
import "./theme.css"
import { LandingHeader } from "./_components/LandingHeader"
import { Hero } from "./_components/Hero"
import { BenefitsSection } from "./_components/BenefitsSection"
import { HowItWorks } from "./_components/HowItWorks"
import { ProfileShowcase } from "./_components/ProfileShowcase"
import { ResultPreview } from "./_components/ResultPreview"
import { Testimonials } from "./_components/Testimonials"
import { StatsSection } from "./_components/StatsSection"
import { FinalCta } from "./_components/FinalCta"
import { FaqAccordion } from "./_components/FaqAccordion"
import { LandingFooter } from "./_components/LandingFooter"

export const metadata: Metadata = {
  title: "Teste de Perfil Profissional — Descubra seu potencial de carreira",
  description:
    "Responda um questionário inteligente e receba uma análise personalizada com pontos fortes, áreas de desenvolvimento e recomendações de carreira.",
}

// Página fora do route group `(site)`: header e footer próprios, tema
// escopado (`theme-perfil`) independente do restante do app "criativo", para
// manter o foco total na conversão.
export default function TestePerfilProfissionalPage() {
  return (
    <div className="theme-perfil min-h-screen bg-background text-foreground">
      <LandingHeader />
      <main>
        <Hero />
        <BenefitsSection />
        <HowItWorks />
        <ProfileShowcase />
        <ResultPreview />
        <StatsSection />
        <Testimonials />
        <FinalCta />
        <FaqAccordion />
      </main>
      <LandingFooter />
    </div>
  )
}
