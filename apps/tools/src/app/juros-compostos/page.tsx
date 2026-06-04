import type { Metadata } from "next"
import ToolPageHeader from "@/components/tool-page-header"
import { CompoundInterestCalculator } from "./_components/CompoundInterestCalculator"

export const metadata: Metadata = {
  title: "Calculadora de Juros Compostos | tools.nico.dev",
  description:
    "Simule o rendimento de investimentos com capital fixo ou aportes mensais. Visualize a evolução mês a mês com gráfico e tabela detalhada.",
}

export default function CompoundInterestPage() {
  return (
    <main className="flex-1 px-6 py-12 max-w-5xl mx-auto w-full">
      <ToolPageHeader
        name="Juros Compostos"
        description="Simule rendimentos com capital fixo ou aportes mensais. Taxa mensal ou anual, período em meses ou anos."
      />
      <CompoundInterestCalculator />
    </main>
  )
}
