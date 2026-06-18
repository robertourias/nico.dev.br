import type { Metadata } from "next"
import "./theme.css"
import { LaunchHeader } from "./_components/LaunchHeader"
import { Hero } from "./_components/Hero"
import { BenefitsSection } from "./_components/BenefitsSection"
import { DeliverablesSection } from "./_components/DeliverablesSection"
import { TransformationSection } from "./_components/TransformationSection"
import { TestimonialsCarousel } from "./_components/TestimonialsCarousel"
import { ScarcitySection } from "./_components/ScarcitySection"
import { WaitlistSection } from "./_components/WaitlistSection"
import { FaqAccordion } from "./_components/FaqAccordion"
import { FinalCta } from "./_components/FinalCta"
import { LandingFooter } from "./_components/LandingFooter"

export const metadata: Metadata = {
  title: "Método Ápice — Pré-venda Exclusiva | Lista de Espera",
  description:
    "Entre para a lista de espera do Método Ápice, o programa de alta performance em pré-venda exclusiva. Vagas limitadas e condição especial de lançamento.",
}

// Página fora do route group `(site)`: header próprio e minimalista, tema
// escopado (`theme-apice`) com identidade visual exclusiva — por exigência
// explícita do briefing, esta landing não usa os componentes nem os tokens
// do design system padrão do app "criativo" (ver theme.css para detalhes).
export default function PreVendaMetodoApicePage() {
  return (
    <div className="theme-apice min-h-screen bg-[var(--apice-bg)] text-[var(--apice-fg)]">
      <LaunchHeader />
      <main>
        <Hero />
        <BenefitsSection />
        <DeliverablesSection />
        <TransformationSection />
        <TestimonialsCarousel />
        <ScarcitySection />
        <WaitlistSection />
        <FaqAccordion />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  )
}
