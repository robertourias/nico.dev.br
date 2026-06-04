import type { CodeError, ErrorType } from '../_types';

const BADGE_STYLES: Record<ErrorType, string> = {
  SyntaxError: 'bg-destructive/15 text-destructive',
  RuntimeError: 'bg-orange-500/15 text-orange-600',
  LogicError: 'bg-yellow-500/15 text-yellow-600',
  StyleWarning: 'bg-muted text-muted-foreground',
};

const BADGE_LABELS: Record<ErrorType, string> = {
  SyntaxError: 'Erro de Sintaxe',
  RuntimeError: 'Erro de Execução',
  LogicError: 'Erro de Lógica',
  StyleWarning: 'Aviso de Estilo',
};

interface ErrorListProps {
  errors: CodeError[];
}

export function ErrorList({ errors }: ErrorListProps) {
  if (errors.length === 0) {
    return (
      <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
        <p className="text-sm text-green-700 dark:text-green-400">
          Nenhum erro encontrado. Código parece correto.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-foreground">
        Erros encontrados ({errors.length})
      </h3>
      <ul className="flex flex-col gap-2">
        {errors.map((err, i) => (
          <li key={i} className="rounded-lg border border-border bg-muted/20 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={[
                  'inline-block rounded-full px-2 py-0.5 text-xs font-medium',
                  BADGE_STYLES[err.type] ?? 'bg-muted text-muted-foreground',
                ].join(' ')}
              >
                {BADGE_LABELS[err.type] ?? err.type}
              </span>
              <span className="text-xs text-muted-foreground">
                {err.line !== null ? `Linha ${err.line}` : '—'}
              </span>
            </div>
            <p className="text-sm text-foreground mb-1">{err.message}</p>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Correção:</span> {err.fix}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
