import type { Metadata } from "next"
import "./theme.css"
import { LandingHeader } from "./_components/LandingHeader"
import { Hero } from "./_components/Hero"
import { ValueProps } from "./_components/ValueProps"
import { AudienceSection } from "./_components/AudienceSection"
import { FaqSection } from "./_components/FaqSection"
import { FinalCta } from "./_components/FinalCta"
import { LandingFooter } from "./_components/LandingFooter"

export const metadata: Metadata = {
  title: "Newsletter Premium — IA, tecnologia e produtividade",
  description:
    "Toda semana, uma curadoria direta ao ponto sobre IA, tecnologia e produtividade. Gratuito, sem enrolação, cancele quando quiser.",
}

// Esta página vive fora do route group `(site)`: tem header e footer
// próprios e um tema escopado (`theme-newsletter-premium`), independente do
// restante do app "criativo", para manter o foco total na conversão.
export default function LandingNewsletterPremiumPage() {
  return (
    <div className="theme-newsletter-premium min-h-screen bg-background text-foreground">
      <LandingHeader />
      <main>
        <Hero />
        <ValueProps />
        <AudienceSection />
        <FaqSection />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  )
}
