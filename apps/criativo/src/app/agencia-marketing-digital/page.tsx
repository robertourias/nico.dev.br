import type { Metadata } from "next"
import "./theme.css"
import { CustomCursor } from "./_components/CustomCursor"
import { AgenciaHeader } from "./_components/AgenciaHeader"
import { Hero } from "./_components/Hero"
import { ClientsMarquee } from "./_components/ClientsMarquee"
import { AboutSection } from "./_components/AboutSection"
import { ServicesSection } from "./_components/ServicesSection"
import { CasesSection } from "./_components/CasesSection"
import { ProcessTimeline } from "./_components/ProcessTimeline"
import { TestimonialsCarousel } from "./_components/TestimonialsCarousel"
import { StatsSection } from "./_components/StatsSection"
import { PricingSection } from "./_components/PricingSection"
import { ProposalFormSection } from "./_components/ProposalFormSection"
import { FaqSection } from "./_components/FaqSection"
import { CtaSection } from "./_components/CtaSection"
import { AgenciaFooter } from "./_components/AgenciaFooter"
import { StickyMobileCta } from "./_components/StickyMobileCta"

export const metadata: Metadata = {
  title: "Lumen Digital | Agência de Marketing Digital orientada por dados",
  description:
    "Transformamos estratégias em resultados reais: gestão de tráfego, SEO, redes sociais, automação, branding e desenvolvimento web para acelerar o crescimento da sua empresa.",
  openGraph: {
    title: "Lumen Digital | Agência de Marketing Digital orientada por dados",
    description:
      "Marketing digital orientado por dados para aumentar vendas, gerar leads e acelerar o crescimento da sua empresa.",
    type: "website",
  },
}

// Página fora do route group `(site)`: header e footer próprios, tema
// escopado (`theme-agencia`) — identidade "agência de marketing digital
// premium", distinta das demais landings do app "criativo". Página única
// com seções ancoradas (padrão do app). Inspirada apenas na experiência de
// navegação do briefing (template de referência externo); textos, cases e
// identidade visual são originais.
export default function AgenciaMarketingDigitalPage() {
  return (
    <div className="theme-agencia min-h-screen bg-background text-foreground">
      <CustomCursor />
      <AgenciaHeader />
      <main>
        <Hero />
        <ClientsMarquee />
        <AboutSection />
        <ServicesSection />
        <CasesSection />
        <ProcessTimeline />
        <TestimonialsCarousel />
        <StatsSection />
        <PricingSection />
        <ProposalFormSection />
        <FaqSection />
        <CtaSection />
      </main>
      <AgenciaFooter />
      <StickyMobileCta />
    </div>
  )
}
