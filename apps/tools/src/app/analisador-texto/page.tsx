import type { Metadata } from 'next'
import ToolPageHeader from '@/components/tool-page-header'
import { TextAnalyzer } from './_components/TextAnalyzer'

export const metadata: Metadata = {
  title: 'Analisador de Texto | tools.nico.dev',
  description:
    'Analise sentimento, entidades, resumo e insights de qualquer texto. Gera versão humanizada com IA.',
}

export default function TextAnalyzerPage() {
  return (
    <main className="flex-1 px-6 py-12 max-w-5xl mx-auto w-full">
      <ToolPageHeader
        name="Analisador de Texto"
        description="Cole qualquer texto para extrair sentimento, entidades, resumo, insights e uma versão humanizada. Suporta qualquer idioma."
      />
      <TextAnalyzer />
    </main>
  )
}
