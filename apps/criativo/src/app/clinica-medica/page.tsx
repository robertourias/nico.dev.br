import type { Metadata } from "next"
import "./theme.css"
import { ClinicaHeader } from "./_components/ClinicaHeader"
import { Hero } from "./_components/Hero"
import { AboutSection } from "./_components/AboutSection"
import { SpecialtiesSection } from "./_components/SpecialtiesSection"
import { TeamSection } from "./_components/TeamSection"
import { DifferentialsSection } from "./_components/DifferentialsSection"
import { ProcessSection } from "./_components/ProcessSection"
import { AppointmentSection } from "./_components/AppointmentSection"
import { InsurancePartnersSection } from "./_components/InsurancePartnersSection"
import { TestimonialsCarousel } from "./_components/TestimonialsCarousel"
import { FaqSection } from "./_components/FaqSection"
import { CtaSection } from "./_components/CtaSection"
import { ClinicaFooter } from "./_components/ClinicaFooter"
import { SPECIALTIES } from "./_lib/data"

export const metadata: Metadata = {
  title: "Clínica Vitalis | Cuidando da sua saúde com excelência",
  description:
    "Clínica médica com especialidades em cardiologia, dermatologia, pediatria, ginecologia, ortopedia, endocrinologia e clínica geral. Agende sua consulta online.",
  openGraph: {
    title: "Clínica Vitalis | Cuidando da sua saúde com excelência",
    description:
      "Atendimento humanizado, estrutura moderna e equipe especializada. Agende sua consulta com poucos cliques.",
    type: "website",
  },
}

// Schema.org MedicalClinic — reforça relevância semântica para busca local
// (Google Business / rich results) e assistentes de busca.
const medicalClinicSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  name: "Clínica Vitalis",
  description:
    "Clínica médica com atendimento humanizado, oferecendo consultas, exames e acompanhamento em diversas especialidades.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Higienópolis, 980",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  telephone: "+55-11-3040-8877",
  email: "contato@clinicavitalis.com.br",
  openingHours: "Mo-Sa 07:00-20:00",
  areaServed: "BR",
  medicalSpecialty: SPECIALTIES.map((s) => s.title),
  priceRange: "$$",
}

// Página fora do route group `(site)`: header e footer próprios, tema
// escopado (`theme-clinica`) — identidade "saúde premium", azul médico +
// verde para ações positivas, distinta das demais landings do app
// "criativo". Página única com seções ancoradas (padrão do app).
export default function ClinicaMedicaPage() {
  return (
    <div id="topo" className="theme-clinica min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalClinicSchema) }}
      />
      <ClinicaHeader />
      <main>
        <Hero />
        <AboutSection />
        <SpecialtiesSection />
        <TeamSection />
        <DifferentialsSection />
        <ProcessSection />
        <AppointmentSection />
        <InsurancePartnersSection />
        <TestimonialsCarousel />
        <FaqSection />
        <CtaSection />
      </main>
      <ClinicaFooter />
    </div>
  )
}
