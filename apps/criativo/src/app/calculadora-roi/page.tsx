import type { Metadata } from "next"
import "./theme.css"
import { LandingHeader } from "./_components/LandingHeader"
import { Hero } from "./_components/Hero"
import { RoiCalculator } from "./_components/RoiCalculator"
import { EducationalSection } from "./_components/EducationalSection"
import { SocialProofSection } from "./_components/SocialProofSection"
import { FinalCta } from "./_components/FinalCta"
import { LandingFooter } from "./_components/LandingFooter"

export const metadata: Metadata = {
  title: "Calculadora de ROI — Simule o retorno do seu investimento",
  description:
    "Simule em segundos o retorno financeiro de contratar um serviço ou solução: receita adicional, economia gerada, lucro, ROI e prazo de payback, com gráfico comparativo e exemplos prontos.",
}

// Página fora do route group `(site)`: header e footer próprios, tema
// escopado (`theme-roi`) independente do restante do app "criativo", para
// manter o foco total na calculadora. Todo o cálculo é local — sem backend.
export default function CalculadoraRoiPage() {
  return (
    <div className="theme-roi min-h-screen bg-background text-foreground">
      <LandingHeader />
      <main>
        <Hero />
        <RoiCalculator />
        <EducationalSection />
        <SocialProofSection />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  )
}
