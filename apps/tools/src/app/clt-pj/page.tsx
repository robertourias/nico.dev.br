import type { Metadata } from "next"
import Link from "next/link"
import ToolPageHeader from "@/components/tool-page-header"
import { Button } from "@nico.dev/ui"
import { ArrowLeftIcon } from "lucide-react"

import { ComparisonSelector } from "./_components/comparison-selector"
import CalculatorForm from "./_components/calculator-form"
import CalculatorPjPj from "./_components/calculator-pj-pj"
import CalculatorCltClt from "./_components/calculator-clt-clt"

export const metadata: Metadata = {
  title: "Calculadora de Propostas e Regimes | tools.nico.dev",
  description:
    "Compare propostas e salários líquidos entre regimes CLT e PJ. Ferramenta para desenvolvedores.",
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CltPjPage({ searchParams }: Props) {
  const params = await searchParams
  const mode = params.mode

  let Content = ComparisonSelector
  let title = "O que você deseja comparar?"
  let description = "Selecione o tipo de comparação para abrir a calculadora correspondente."

  if (mode === "clt-pj") {
    Content = CalculatorForm
    title = "Calculadora CLT vs PJ"
    description = "Compare o salário líquido entre regime CLT e PJ. Preencha um ou ambos os campos — o equivalente do outro é calculado automaticamente."
  } else if (mode === "pj-pj") {
    Content = CalculatorPjPj
    title = "Calculadora PJ vs PJ"
    description = "Compare propostas PJ com diferentes custos e tributações."
  } else if (mode === "clt-clt") {
    Content = CalculatorCltClt
    title = "Calculadora CLT vs CLT"
    description = "Compare propostas CLT com diferentes pacotes de benefícios."
  }

  return (
    <main className="flex-1 px-6 py-12 max-w-5xl mx-auto w-full">
      {mode ? (
        <div className="mb-6">
          <Button variant="ghost" asChild className="-ml-4 text-muted-foreground">
            <Link href="/clt-pj">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Trocar tipo de comparação
            </Link>
          </Button>
        </div>
      ) : null}
      
      <ToolPageHeader
        name={title}
        description={description}
      />
      <Content />
    </main>
  )
}
