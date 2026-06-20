import type { Metadata } from "next"
import "./theme.css"
import { LandingHeader } from "./_components/LandingHeader"
import { Hero } from "./_components/Hero"
import { EconomySimulator } from "./_components/EconomySimulator"
import { EducationalSection } from "./_components/EducationalSection"
import { FinalCta } from "./_components/FinalCta"
import { LandingFooter } from "./_components/LandingFooter"

export const metadata: Metadata = {
  title: "Simulador de Economia Doméstica — Descubra quanto você pode economizar",
  description:
    "Simule em tempo real quanto você pode economizar por mês, por ano e em 5 anos ajustando pequenos hábitos como delivery, café fora, transporte por aplicativo, assinaturas e energia elétrica.",
}

// Página fora do route group `(site)`: header e footer próprios, tema
// escopado (`theme-economia`) independente do restante do app "criativo",
// para manter o foco total no simulador. Todo o cálculo é local — sem
// backend — e os hábitos informados são persistidos em localStorage.
export default function SimuladorEconomiaDomesticaPage() {
  return (
    <div className="theme-economia min-h-screen bg-background text-foreground">
      <LandingHeader />
      <main>
        <Hero />
        <EconomySimulator />
        <EducationalSection />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  )
}
