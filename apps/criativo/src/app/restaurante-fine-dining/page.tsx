import type { Metadata } from "next"
import { Cormorant_Garamond, Manrope } from "next/font/google"
import "./theme.css"
import { RestauranteHeader } from "./_components/RestauranteHeader"
import { Hero } from "./_components/Hero"
import { FlavorJourney } from "./_components/FlavorJourney"
import { IngredientsSpotlight } from "./_components/IngredientsSpotlight"
import { ChefTable } from "./_components/ChefTable"
import { SignatureDish } from "./_components/SignatureDish"
import { Pairings } from "./_components/Pairings"
import { MenuExplorer } from "./_components/MenuExplorer"
import { ReservationSection } from "./_components/ReservationSection"
import { EventsExperiences } from "./_components/EventsExperiences"
import { ExperienceWall } from "./_components/ExperienceWall"
import { ContactSection } from "./_components/ContactSection"
import { CinematicClosing } from "./_components/CinematicClosing"
import { RestauranteFooter } from "./_components/RestauranteFooter"

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
})

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "ÂMBAR Cozinha de Autor | Gastronomia Contemporânea & Reservas",
  description:
    "Cardápio digital, menus degustação e reserva inteligente do ÂMBAR — restaurante de gastronomia de autor em São Paulo. Uma experiência sensorial que transforma refeições em lembranças.",
  openGraph: {
    title: "ÂMBAR Cozinha de Autor | Gastronomia Contemporânea & Reservas",
    description:
      "Gastronomia que transforma refeições em lembranças. Conheça o cardápio, as harmonizações exclusivas e reserve sua mesa.",
    type: "website",
  },
}

// Schema.org Restaurant — reforça relevância semântica para buscadores e
// assistentes de busca local (Google Business / rich results), seguindo o
// mesmo padrão de structured data usado nas demais landings do app.
const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "ÂMBAR Cozinha de Autor",
  description:
    "Restaurante de gastronomia contemporânea de autor, com menus degustação, harmonizações exclusivas e reserva inteligente.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua dos Pinheiros, 842",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  telephone: "+55-11-3068-4471",
  servesCuisine: ["Contemporânea", "Autoral", "Frutos do Mar"],
  priceRange: "$$$$",
  openingHours: "Tu-Sa 19:00-23:59",
  acceptsReservations: "True",
}

// Página fora do route group `(site)`: header e footer próprios, tema
// escopado (`theme-restaurante`) — identidade "fine dining contemporâneo"
// (preto profundo, dourado suave, cinza grafite, acentos oliva/cobre),
// distinta de todas as demais landings do app "criativo". Seguindo o
// padrão consolidado do portfólio, a página é única (single-page) com
// seções ancoradas (#cardapio, #reservas, #experiencias, #contato), o que
// cobre tanto as "10 seções exclusivas da Home" quanto o conteúdo das
// páginas de Cardápio, Reservas, Experiências e Contato descritas na
// especificação original.
export default function RestauranteFineDiningPage() {
  return (
    <div className={`${cormorant.variable} ${manrope.variable} theme-restaurante min-h-screen bg-background text-foreground`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
      />
      <RestauranteHeader />
      <main>
        <Hero />
        <FlavorJourney />
        <IngredientsSpotlight />
        <ChefTable />
        <SignatureDish />
        <Pairings />
        <MenuExplorer />
        <ReservationSection />
        <EventsExperiences />
        <ExperienceWall />
        <ContactSection />
        <CinematicClosing />
      </main>
      <RestauranteFooter />
    </div>
  )
}
