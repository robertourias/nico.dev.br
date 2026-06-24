import type { Metadata } from "next"
import { Bebas_Neue, Montserrat } from "next/font/google"
import "./theme.css"
import { AcademiaHeader } from "./_components/AcademiaHeader"
import { Hero } from "./_components/Hero"
import { DifferentialsSection } from "./_components/DifferentialsSection"
import { StructureSection } from "./_components/StructureSection"
import { ModalitiesSection } from "./_components/ModalitiesSection"
import { PlansSection } from "./_components/PlansSection"
import { ScheduleSection } from "./_components/ScheduleSection"
import { TeachersCarousel } from "./_components/TeachersCarousel"
import { TestimonialsCarousel } from "./_components/TestimonialsCarousel"
import { ResultsSection } from "./_components/ResultsSection"
import { TrialClassSection } from "./_components/TrialClassSection"
import { EnrollmentSection } from "./_components/EnrollmentSection"
import { FaqSection } from "./_components/FaqSection"
import { CtaSection } from "./_components/CtaSection"
import { AcademiaFooter } from "./_components/AcademiaFooter"
import { MODALITIES } from "./_lib/data"

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
})

const montserrat = Montserrat({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "VIGOR Fitness Club | Academia de Musculação e Fitness em São Paulo",
  description:
    "Academia premium de musculação, treinamento funcional, spinning, pilates, cross training e personal trainer. Equipamentos modernos, professores especializados e matrícula online.",
  keywords: [
    "academia",
    "musculação",
    "fitness",
    "personal trainer",
    "treino funcional",
    "academia em São Paulo",
    "cross training",
    "spinning",
    "pilates",
  ],
  openGraph: {
    title: "VIGOR Fitness Club | Transforme Seu Corpo. Evolua Sua Performance.",
    description:
      "Treinos personalizados, equipamentos modernos e profissionais qualificados. Agende sua aula experimental gratuita ou matricule-se online.",
    type: "website",
    locale: "pt_BR",
  },
}

// Schema.org HealthClub (subtipo de LocalBusiness/SportsActivityLocation) —
// reforça relevância semântica para busca local (Google Business / rich
// results) e assistentes de busca, alinhado ao SEO local pedido na spec
// ("Academia em [Cidade]").
const healthClubSchema = {
  "@context": "https://schema.org",
  "@type": "HealthClub",
  name: "VIGOR Fitness Club",
  description:
    "Academia de musculação e fitness com estrutura completa, equipamentos modernos e professores especializados.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Faria Lima, 2230",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  telephone: "+55-11-3040-5566",
  email: "contato@vigorfitness.com.br",
  openingHours: ["Mo-Sa 06:00-23:00", "Su 08:00-14:00"],
  areaServed: "BR",
  amenityFeature: MODALITIES.map((m) => ({ "@type": "LocationFeatureSpecification", name: m.title })),
  priceRange: "$$",
}

// Página fora do route group `(site)`: header e footer próprios, tema
// escopado (`theme-academia`) — identidade "academia premium de alta
// performance" inspirada no estilo Bio Ritmo (preto, branco e verde neon),
// distinta visualmente das demais landings do app (que usam paletas claras
// ou serifadas). Página única com seções ancoradas (padrão do app).
export default function AcademiaFitnessPage() {
  return (
    <div
      id="topo"
      className={`${bebasNeue.variable} ${montserrat.variable} theme-academia min-h-screen bg-background text-foreground`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(healthClubSchema) }}
      />
      <AcademiaHeader />
      <main>
        <Hero />
        <DifferentialsSection />
        <StructureSection />
        <ModalitiesSection />
        <PlansSection />
        <ScheduleSection />
        <TeachersCarousel />
        <TestimonialsCarousel />
        <ResultsSection />
        <TrialClassSection />
        <EnrollmentSection />
        <FaqSection />
        <CtaSection />
      </main>
      <AcademiaFooter />
    </div>
  )
}
