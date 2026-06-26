import type { Metadata } from "next"
import "./theme.css"
import { LandingHeader } from "./_components/LandingHeader"
import { Hero } from "./_components/Hero"
import { StatsBar } from "./_components/StatsBar"
import { HowItWorks } from "./_components/HowItWorks"
import { SimulatorSection } from "./_components/SimulatorSection"
import { EnergyFlow } from "./_components/EnergyFlow"
import { ComparisonSection } from "./_components/ComparisonSection"
import { ProjectGallery } from "./_components/ProjectGallery"
import { BenefitsOrbit } from "./_components/BenefitsOrbit"
import { EnvironmentalImpact } from "./_components/EnvironmentalImpact"
import { FaqSection } from "./_components/FaqSection"
import { FinalCta } from "./_components/FinalCta"
import { LandingFooter } from "./_components/LandingFooter"

export const metadata: Metadata = {
  title: "Energia Solar — Transforme a luz do sol em economia todos os meses",
  description:
    "Simule em tempo real quanto você pode economizar com energia solar: dimensionamento do sistema, redução na conta, retorno do investimento e impacto ambiental — tudo personalizado para sua casa.",
}

// Página fora do route group `(site)`: header e footer próprios, tema
// escopado (`theme-solar`) e independente das demais landings do app
// "criativo". Landing nova, criada do zero (sem reaproveitar layout de
// campanhas anteriores), com identidade visual e cálculo próprios.
export default function EnergiaSolarPage() {
  return (
    <div className="theme-solar min-h-screen bg-background text-foreground">
      <LandingHeader />
      <main>
        <Hero />
        <StatsBar />
        <HowItWorks />
        <SimulatorSection />
        <EnergyFlow />
        <ComparisonSection />
        <ProjectGallery />
        <BenefitsOrbit />
        <EnvironmentalImpact />
        <FaqSection />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  )
}
