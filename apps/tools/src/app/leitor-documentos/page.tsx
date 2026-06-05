import type { Metadata } from 'next'
import ToolPageHeader from '@/components/tool-page-header'
import { DocumentReader } from './_components/DocumentReader'

export const metadata: Metadata = {
  title: 'Leitor de Documentos | tools.nico.dev',
  description:
    'Faça upload de PDFs, imagens ou arquivos de texto e extraia resumo, tipo e pontos-chave com IA. Faça perguntas livres sobre o conteúdo.',
}

export default function DocumentReaderPage() {
  return (
    <main className="flex-1 px-6 py-12 max-w-5xl mx-auto w-full">
      <ToolPageHeader
        name="Leitor de Documentos"
        description="Faça upload de PDF, imagem ou texto e extraia informações automaticamente com IA. Faça perguntas sobre o conteúdo sem precisar ler o documento inteiro."
      />
      <DocumentReader />
    </main>
  )
}
