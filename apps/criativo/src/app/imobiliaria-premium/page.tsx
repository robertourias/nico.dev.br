import type { Metadata } from "next"
import { Playfair_Display } from "next/font/google"
import "./theme.css"
import { ImobHeader } from "./_components/ImobHeader"
import { Hero } from "./_components/Hero"
import { LifestyleSection } from "./_components/LifestyleSection"
import { RegionsSection } from "./_components/RegionsSection"
import { FeaturedProperties } from "./_components/FeaturedProperties"
import { SimulatorSection } from "./_components/SimulatorSection"
import { ProcessTimeline } from "./_components/ProcessTimeline"
import { VirtualTour } from "./_components/VirtualTour"
import { MarketIndicators } from "./_components/MarketIndicators"
import { Testimonials } from "./_components/Testimonials"
import { OwnerCta } from "./_components/OwnerCta"
import { BlogSection } from "./_components/BlogSection"
import { LeadCapture } from "./_components/LeadCapture"
import { ImobFooter } from "./_components/ImobFooter"

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: "Altana Imóveis | Encontre o espaço ideal para sua próxima história",
  description:
    "Imobiliária premium com curadoria por estilo de vida, simulador de perfil, tour virtual 360° e indicadores de mercado em tempo real. Vida urbana, família, investimento, alto padrão e comercial.",
  openGraph: {
    title: "Altana Imóveis | Encontre o espaço ideal para sua próxima história",
    description:
      "Curadoria imobiliária premium por estilo de vida e região, com simulador de perfil e tour virtual 360°.",
    type: "website",
  },
}

// Schema.org RealEstateAgent — reforça relevância semântica para buscadores
// e assistentes de busca local.
const realEstateAgentSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Altana Imóveis",
  description:
    "Imobiliária premium especializada em curadoria por estilo de vida, investimento e alto padrão, com consultoria especializada e tour virtual 360°.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Brigadeiro Faria Lima, 2300",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  telephone: "+55-11-3045-6789",
  email: "contato@altanaimoveis.com.br",
  openingHours: "Mo-Fr 09:00-19:00, Sa 09:00-14:00",
  areaServed: "BR",
  priceRange: "$$$",
}

// Página fora do route group `(site)`: header e footer próprios, tema
// escopado (`theme-imob`) — identidade "imobiliária premium / revista de
// arquitetura", distinta das demais landings do app "criativo". Página
// única com seções ancoradas (padrão do app). Imóveis usam fotos reais do
// Unsplash (ver Property.image em _lib/data.ts), com PropertyVisual caindo
// para gradiente + ícone apenas onde não há foto associada.
export default function ImobiliariaPremiumPage() {
  return (
    <div className={`${playfair.variable} theme-imob min-h-screen bg-background text-foreground`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateAgentSchema) }}
      />
      <ImobHeader />
      <main>
        <Hero />
        <LifestyleSection />
        <RegionsSection />
        <FeaturedProperties />
        <SimulatorSection />
        <ProcessTimeline />
        <VirtualTour />
        <MarketIndicators />
        <Testimonials />
        <OwnerCta />
        <BlogSection />
        <LeadCapture />
      </main>
      <ImobFooter />
    </div>
  )
}
