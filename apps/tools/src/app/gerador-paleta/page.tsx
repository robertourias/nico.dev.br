import type { Metadata } from 'next'
import ToolPageHeader from '@/components/tool-page-header'
import { PaletteGenerator } from './_components/PaletteGenerator'

export const metadata: Metadata = {
  title: 'Gerador de Paleta de Cores | tools.nico.dev',
  description:
    'Gere paletas de cores harmônicas com IA. Escolha uma cor base, tipo de harmonia e quantidade. Exporte em CSS, SCSS, JSON ou Tailwind.',
}

export default function PaletteGeneratorPage() {
  return (
    <main className="flex-1 px-6 py-12 max-w-5xl mx-auto w-full">
      <ToolPageHeader
        name="Gerador de Paleta de Cores"
        description="Gere paletas harmônicas com IA escolhendo uma cor base, tipo de harmonia e quantidade de cores. Exporte em CSS, SCSS, JSON ou Tailwind."
      />
      <PaletteGenerator />
    </main>
  )
}
