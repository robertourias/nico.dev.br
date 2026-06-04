'use client';

import { Button } from '@ui';
import { Loader2 } from 'lucide-react';

const MAX_CHARS = 10_000;

interface CodeInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function CodeInput({ value, onChange, onSubmit, isLoading }: CodeInputProps) {
  const isOverLimit = value.length > MAX_CHARS;
  const isEmpty = value.trim().length === 0;
  const isDisabled = isEmpty || isOverLimit || isLoading;

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      onChange(value.substring(0, start) + '  ' + value.substring(end));
      // restore cursor after React re-render
      requestAnimationFrame(() => {
        target.selectionStart = start + 2;
        target.selectionEnd = start + 2;
      });
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Cole seu código aqui..."
          rows={16}
          spellCheck={false}
          className={[
            'w-full rounded-lg border bg-muted/30 p-4 font-mono text-sm text-foreground',
            'resize-y outline-none focus:ring-2 focus:ring-ring',
            'placeholder:text-muted-foreground transition-colors',
            isOverLimit ? 'border-destructive focus:ring-destructive' : 'border-border',
          ].join(' ')}
        />
        <span
          className={[
            'absolute bottom-3 right-3 text-xs tabular-nums',
            isOverLimit ? 'text-destructive' : 'text-muted-foreground',
          ].join(' ')}
        >
          {value.length.toLocaleString('pt-BR')} / {MAX_CHARS.toLocaleString('pt-BR')}
        </span>
      </div>

      {isOverLimit && (
        <p className="text-xs text-destructive">
          Limite de {MAX_CHARS.toLocaleString('pt-BR')} caracteres excedido.
        </p>
      )}

      <Button onClick={onSubmit} disabled={isDisabled} className="self-start">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analisando…
          </>
        ) : (
          'Analisar Código'
        )}
      </Button>
    </div>
  );
}
