import type { Metadata } from 'next';
import ToolPageHeader from '@/components/tool-page-header';
import { CodeDebugger } from './_components/CodeDebugger';

export const metadata: Metadata = {
  title: 'Debug Code | tools.nico.dev',
  description:
    'Cole seu código e receba uma versão corrigida com explicações detalhadas dos erros encontrados. Powered by Google Gemini.',
};

export default function DebugCodePage() {
  return (
    <main className="flex-1 px-6 py-12 max-w-5xl mx-auto w-full">
      <ToolPageHeader
        name="Debug Code"
        description="Cole seu código e receba uma versão corrigida com apontamento detalhado de cada erro. Funciona com qualquer linguagem."
      />
      <CodeDebugger />
    </main>
  );
}
