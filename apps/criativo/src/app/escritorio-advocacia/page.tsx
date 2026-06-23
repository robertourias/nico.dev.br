import type { Metadata } from "next"
import { Playfair_Display } from "next/font/google"
import "./theme.css"
import { AdvocaciaHeader } from "./_components/AdvocaciaHeader"
import { Hero } from "./_components/Hero"
import { DifferentialsSection } from "./_components/DifferentialsSection"
import { PracticeAreasSection } from "./_components/PracticeAreasSection"
import { AboutSection } from "./_components/AboutSection"
import { TeamSection } from "./_components/TeamSection"
import { BlogSection } from "./_components/BlogSection"
import { ProcessTimeline } from "./_components/ProcessTimeline"
import { TestimonialsCarousel } from "./_components/TestimonialsCarousel"
import { FaqSection } from "./_components/FaqSection"
import { ScheduleSection } from "./_components/ScheduleSection"
import { CtaSection } from "./_components/CtaSection"
import { AdvocaciaFooter } from "./_components/AdvocaciaFooter"

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: "Lemos & Bastos Advogados | Assessoria Jurídica Estratégica",
  description:
    "Escritório de advocacia especializado em direito civil, empresarial, trabalhista, tributário, imobiliário, família, previdenciário e do consumidor. Agende uma consulta.",
  openGraph: {
    title: "Lemos & Bastos Advogados | Assessoria Jurídica Estratégica",
    description:
      "Atuação especializada com atendimento humanizado e soluções jurídicas personalizadas para pessoas físicas e empresas.",
    type: "website",
  },
}

// Schema.org LegalService — reforça a relevância semântica da página para
// buscadores e assistentes de busca local (Google Business / rich results).
const legalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "Lemos & Bastos Advogados",
  description:
    "Escritório de advocacia especializado em direito civil, empresarial, trabalhista, tributário, imobiliário, família, previdenciário e do consumidor.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Paulista, 1374",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  telephone: "+55-11-4002-8922",
  email: "contato@lemosbastos.adv.br",
  openingHours: "Mo-Fr 09:00-19:00",
  areaServed: "BR",
  priceRange: "$$",
}

// Página fora do route group `(site)`: header e footer próprios, tema
// escopado (`theme-advocacia`) — identidade "advocacia institucional
// premium", navy/grafite/dourado, distinta das demais landings do app
// "criativo". Página única com seções ancoradas (padrão do app).
export default function EscritorioAdvocaciaPage() {
  return (
    <div className={`${playfair.variable} theme-advocacia min-h-screen bg-background text-foreground`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(legalServiceSchema) }}
      />
      <AdvocaciaHeader />
      <main>
        <Hero />
        <DifferentialsSection />
        <PracticeAreasSection />
        <AboutSection />
        <TeamSection />
        <ProcessTimeline />
        <TestimonialsCarousel />
        <BlogSection />
        <FaqSection />
        <ScheduleSection />
        <CtaSection />
      </main>
      <AdvocaciaFooter />
    </div>
  )
}
