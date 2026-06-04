'use client';

import { useState } from 'react';
import { CodeInput } from './CodeInput';
import { DebugResult } from './DebugResult';
import type { DebugResult as DebugResultType, DebugApiError } from '../_types';

const EXAMPLE_CODE = `// Exemplo TypeScript com erros — clique em "Analisar Código" para ver a correção
interface User {
  id: number
  name: string
  email: string
}

async function fetchUser(id: number): User {
  const response = await fetch(\`/api/users/\${id}\`)
  const data = response.json()

  if (data.id = id) {
    console.log("User found: " + data)
    return data
  }
}

function formatName(user: User | undefined) {
  return user.name.toUpperCase()
}

const users: Array<User> = []
users.push({ id: 1, name: "Alice" })

const found = users.find(u => u.id === 1)
console.log(formatName(found))
`.trim();

const ERROR_MESSAGES: Record<DebugApiError['error'], string> = {
  CODE_TOO_LONG: 'Código muito longo. Máximo de 10.000 caracteres.',
  GEMINI_PARSE_ERROR: 'Não foi possível processar a resposta da IA. Tente novamente.',
  GEMINI_API_ERROR: 'Erro ao chamar a API do Gemini. Verifique a chave de API.',
  QUOTA_EXCEEDED: 'Limite de uso da API atingido. Aguarde alguns minutos e tente novamente.',
  MISSING_API_KEY: 'Configuração do servidor incompleta.',
  UNKNOWN_ERROR: 'Erro inesperado. Tente novamente.',
};

export function CodeDebugger() {
  const [code, setCode] = useState(EXAMPLE_CODE);
  const [result, setResult] = useState<DebugResultType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleAnalyze() {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/debug-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json() as DebugResultType | DebugApiError;

      if (!res.ok) {
        const apiError = data as DebugApiError;
        setError(ERROR_MESSAGES[apiError.error] ?? ERROR_MESSAGES.UNKNOWN_ERROR);
        return;
      }

      setResult(data as DebugResultType);
    } catch {
      setError(ERROR_MESSAGES.UNKNOWN_ERROR);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <CodeInput
        value={code}
        onChange={setCode}
        onSubmit={handleAnalyze}
        isLoading={isLoading}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      {result && <DebugResult result={result} />}
    </div>
  );
}
