import type { Metadata } from "next"
import "./theme.css"
import { EventHeader } from "./_components/EventHeader"
import { Hero } from "./_components/Hero"
import { HighlightsSection } from "./_components/HighlightsSection"
import { AboutSection } from "./_components/AboutSection"
import { ScheduleSection } from "./_components/ScheduleSection"
import { SpeakersSection } from "./_components/SpeakersSection"
import { StatsSection } from "./_components/StatsSection"
import { TestimonialsCarousel } from "./_components/TestimonialsCarousel"
import { PartnersSection } from "./_components/PartnersSection"
import { PricingSection } from "./_components/PricingSection"
import { LocationMap } from "./_components/LocationMap"
import { FaqAccordion } from "./_components/FaqAccordion"
import { FinalCta } from "./_components/FinalCta"
import { RegistrationSection } from "./_components/RegistrationSection"
import { EventFooter } from "./_components/EventFooter"

export const metadata: Metadata = {
  title: "NEXUS Summit 2026 — Inscrições Abertas | O Encontro de Profissionais do Mercado",
  description:
    "Participe do NEXUS Summit: workshops, palestras e networking com grandes nomes da indústria. Formato híbrido, vagas limitadas. Garanta sua inscrição.",
}

// Página fora do route group `(site)`: header próprio, sem navegação do site
// — tema escopado (`theme-nexus`) com identidade visual exclusiva e clara
// (referência: TEDx, Web Summit, RD Summit), distinta do restante das
// landings do app "criativo", que usam fundo escuro premium. Ver theme.css.
export default function NexusSummitPage() {
  return (
    <div className="theme-nexus min-h-screen bg-[var(--nexus-bg)] text-[var(--nexus-fg)]">
      <EventHeader />
      <main>
        <Hero />
        <HighlightsSection />
        <AboutSection />
        <ScheduleSection />
        <SpeakersSection />
        <StatsSection />
        <TestimonialsCarousel />
        <PartnersSection />
        <PricingSection />
        <LocationMap />
        <FaqAccordion />
        <FinalCta />
        <RegistrationSection />
      </main>
      <EventFooter />
    </div>
  )
}
