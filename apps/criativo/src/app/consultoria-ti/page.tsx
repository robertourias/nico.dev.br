import type { Metadata } from "next"
import "./theme.css"
import { ConsultoriaHeader } from "./_components/ConsultoriaHeader"
import { Hero } from "./_components/Hero"
import { ServicesSection } from "./_components/ServicesSection"
import { ProcessTimeline } from "./_components/ProcessTimeline"
import { CasesSection } from "./_components/CasesSection"
import { StatsSection } from "./_components/StatsSection"
import { TestimonialsCarousel } from "./_components/TestimonialsCarousel"
import { DifferentialsSection } from "./_components/DifferentialsSection"
import { BlogSection } from "./_components/BlogSection"
import { MaturityCalculator } from "./_components/MaturityCalculator"
import { CtaSection } from "./_components/CtaSection"
import { LeadFormSection } from "./_components/LeadFormSection"
import { FaqSection } from "./_components/FaqSection"
import { ConsultoriaFooter } from "./_components/ConsultoriaFooter"

export const metadata: Metadata = {
  title: "VertexIT Consultoria de TI | Transformação Digital, Software e Cloud",
  description:
    "Consultoria especializada em desenvolvimento de software, arquitetura de sistemas, cloud computing, modernização, outsourcing e IA. Solicite um diagnóstico gratuito.",
  openGraph: {
    title: "VertexIT Consultoria de TI | Transformação Digital, Software e Cloud",
    description:
      "Consultoria especializada em desenvolvimento de software, arquitetura de sistemas, cloud computing, modernização, outsourcing e IA.",
    type: "website",
  },
}

// Página fora do route group `(site)`: header e footer próprios, tema
// escopado (`theme-consultoria`) — identidade "tech corporate premium",
// distinta das demais landings do app "criativo". Página única com seções
// ancoradas (padrão do app), incluindo a Calculadora de Maturidade
// Tecnológica como diferencial interativo de portfólio.
export default function ConsultoriaTiPage() {
  return (
    <div className="theme-consultoria min-h-screen bg-background text-foreground">
      <ConsultoriaHeader />
      <main>
        <Hero />
        <ServicesSection />
        <ProcessTimeline />
        <CasesSection />
        <StatsSection />
        <TestimonialsCarousel />
        <DifferentialsSection />
        <BlogSection />
        <MaturityCalculator />
        <CtaSection />
        <LeadFormSection />
        <FaqSection />
      </main>
      <ConsultoriaFooter />
    </div>
  )
}
