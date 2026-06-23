import type { Metadata } from "next"
import "./theme.css"
import { DiagnosticoHeader } from "./_components/DiagnosticoHeader"
import { Hero } from "./_components/Hero"
import { BenefitsSection } from "./_components/BenefitsSection"
import { HowItWorksSection } from "./_components/HowItWorksSection"
import { QuizSection } from "./_components/QuizSection"
import { SocialProofSection } from "./_components/SocialProofSection"
import { FaqSection } from "./_components/FaqSection"
import { DiagnosticoFooter } from "./_components/DiagnosticoFooter"

export const metadata: Metadata = {
  title: "Diagnóstico Gratuito de Negócios | Descubra os gargalos do seu crescimento",
  description:
    "Responda um questionário rápido e receba gratuitamente um diagnóstico com pontos fortes, oportunidades de melhoria e recomendações estratégicas para o seu negócio.",
}

// Página fora do route group `(site)`: header e footer próprios, tema
// escopado (`theme-diagnostico`) — identidade SaaS B2B / consultoria
// estratégica, distinta das demais landings do app "criativo".
export default function DiagnosticoGratuitoNegociosPage() {
  return (
    <div className="theme-diagnostico min-h-screen bg-background text-foreground">
      <DiagnosticoHeader />
      <main>
        <Hero />
        <BenefitsSection />
        <HowItWorksSection />
        <QuizSection />
        <SocialProofSection />
        <FaqSection />
      </main>
      <DiagnosticoFooter />
    </div>
  )
}
