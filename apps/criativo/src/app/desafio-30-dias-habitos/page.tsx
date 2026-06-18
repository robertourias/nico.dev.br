import type { Metadata } from "next"
import "./theme.css"
import { LandingHeader } from "./_components/LandingHeader"
import { Hero } from "./_components/Hero"
import { HowItWorks } from "./_components/HowItWorks"
import { DevelopmentAreas } from "./_components/DevelopmentAreas"
import { ChallengeExamples } from "./_components/ChallengeExamples"
import { ProgramBenefits } from "./_components/ProgramBenefits"
import { Testimonials } from "./_components/Testimonials"
import { Guarantee } from "./_components/Guarantee"
import { FinalCta } from "./_components/FinalCta"
import { StickyMobileCta } from "./_components/StickyMobileCta"
import { LandingFooter } from "./_components/LandingFooter"

export const metadata: Metadata = {
  title: "Desafio 30 Dias de Hábitos | Transforme sua Rotina",
  description:
    "Receba gratuitamente desafios diários por e-mail durante 30 dias e desenvolva hábitos que transformam sua produtividade, disciplina e qualidade de vida.",
}

// Página fora do route group `(site)`: header/footer próprios e tema escopado
// (`theme-habitos30`), independente do restante do app "criativo" e da
// landing "newsletter-premium". `StickyMobileCta` fica fora do fluxo
// principal (fixed, lg:hidden) e aponta para `#inscricao` na FinalCta.
export default function DesafioTrintaDiasHabitosPage() {
  return (
    <div className="theme-habitos30 min-h-screen bg-background text-foreground">
      <LandingHeader />
      <main>
        <Hero />
        <HowItWorks />
        <DevelopmentAreas />
        <ChallengeExamples />
        <ProgramBenefits />
        <Testimonials />
        <Guarantee />
        <FinalCta />
      </main>
      <LandingFooter />
      <StickyMobileCta />
    </div>
  )
}
