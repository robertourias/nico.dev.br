'use client';

import dynamic from 'next/dynamic';
import type { DebugResult as DebugResultType } from '../_types';
import { ErrorList } from './ErrorList';

// SSR disabled to avoid hydration mismatch from syntax highlighting
const CodeBlock = dynamic(() => import('./CodeBlock').then((m) => m.CodeBlock), {
  ssr: false,
  loading: () => (
    <div className="h-48 animate-pulse rounded-lg bg-muted" />
  ),
});

interface DebugResultProps {
  result: DebugResultType;
}

export function DebugResult({ result }: DebugResultProps) {
  const { language, correctedCode, errors } = result;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">Código Corrigido</h3>
          <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {language}
          </span>
        </div>
        <div className="overflow-hidden rounded-lg border border-border">
          <CodeBlock language={language} code={correctedCode} />
        </div>
      </div>

      <ErrorList errors={errors} />
    </div>
  );
}
