# Plano: Debug Code — Validador de Código com IA

**Spec:** `docs/specs/2026-06-03-debug-code.md`
**Status:** ready
**Data:** 2026-06-03

---

## Contexto técnico

### Estado atual de `apps/tools`

- Estrutura de feature: `src/app/[tool-name]/_components/` — componentes colocados junto à rota
- `src/components/tool-page-header.tsx` — header reutilizável por tool
- `page.tsx` home: arrays `utilidades` e `ferramentasParaDevs`; a entrada `code-debugger` já existe em `ferramentasParaDevs` com `status: "coming-soon"` — será atualizada para `debug-code` / `active`
- `@anthropic-ai/sdk` já instalado (não usado nesta feature)
- Nenhuma biblioteca de syntax highlight instalada

### Dependências novas

| Pacote | Motivo |
|--------|--------|
| `@google/generative-ai` | SDK oficial Google Gemini — server-side no Route Handler |
| `react-syntax-highlighter` | Renderiza código com tema de editor escuro |
| `@types/react-syntax-highlighter` | Tipagens TypeScript |

### Estrutura de arquivos adotada

```
apps/tools/src/
  app/
    api/
      debug-code/
        route.ts              ← Route Handler POST /api/debug-code
    debug-code/
      _types/
        index.ts              ← tipos compartilhados da feature
      _components/
        CodeInput.tsx         ← textarea com contador + limite
        ErrorList.tsx         ← lista de erros anotados
        DebugResult.tsx       ← código corrigido com highlight + ErrorList
        CodeDebugger.tsx      ← componente pai (estado + fetch)
      page.tsx                ← rota /debug-code
```

### Contrato da API

**`POST /api/debug-code`**

Request body:
```json
{ "code": "<string, max 10000 chars>" }
```

Response 200:
```json
{
  "language": "javascript",
  "correctedCode": "...",
  "errors": [
    {
      "line": 5,
      "type": "SyntaxError",
      "message": "Missing closing bracket",
      "fix": "Added '}' at end of function body"
    }
  ]
}
```

Response 400:
```json
{ "error": "CODE_TOO_LONG" }
```

Response 500:
```json
{ "error": "GEMINI_PARSE_ERROR" }
```

Variável de ambiente requerida: `GEMINI_API_KEY` (server-side only, nunca exposta ao client).

### Prompt Gemini

```
You are a code debugger. Analyze the following code for syntax errors, runtime errors, logic issues, and style problems.

Return ONLY valid JSON (no markdown fences, no text outside JSON) matching exactly this schema:
{
  "language": "<detected language, lowercase>",
  "correctedCode": "<full corrected code>",
  "errors": [
    {
      "line": <number | null>,
      "type": "<SyntaxError | RuntimeError | LogicError | StyleWarning>",
      "message": "<clear problem description>",
      "fix": "<what was done to fix this>"
    }
  ]
}

If no errors found, return errors as empty array and correctedCode equal to the original code.

Code:
${code}
```

---

## Tarefas

---

## T-01: Instalar dependências

**Tipo:** chore
**Agente:** frontend

```bash
pnpm add @google/generative-ai react-syntax-highlighter --filter @nico.dev/tools
pnpm add -D @types/react-syntax-highlighter --filter @nico.dev/tools
```

**Critérios de aceite:**
- [ ] `pnpm --filter @nico.dev/tools build` passa após instalação.

---

## T-02: Tipos compartilhados — `src/app/debug-code/_types/index.ts`

**Tipo:** feature
**Agente:** frontend

Criar `apps/tools/src/app/debug-code/_types/index.ts`:

```ts
export type ErrorType = 'SyntaxError' | 'RuntimeError' | 'LogicError' | 'StyleWarning';

export interface CodeError {
  line: number | null;
  type: ErrorType;
  message: string;
  fix: string;
}

export interface DebugResult {
  language: string;
  correctedCode: string;
  errors: CodeError[];
}

export interface DebugApiResponse extends DebugResult {}

export interface DebugApiError {
  error: 'CODE_TOO_LONG' | 'GEMINI_PARSE_ERROR' | 'MISSING_API_KEY' | 'UNKNOWN_ERROR';
}
```

**Critérios de aceite:**
- [ ] Arquivo exporta todos os tipos sem erros TypeScript.

---

## T-03: Route Handler — `src/app/api/debug-code/route.ts`

**Tipo:** feature
**Agente:** frontend

Criar `apps/tools/src/app/api/debug-code/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { DebugApiResponse, DebugApiError } from '@/app/debug-code/_types';

const MAX_CODE_LENGTH = 10_000;

const PROMPT_TEMPLATE = `You are a code debugger. Analyze the following code for syntax errors, runtime errors, logic issues, and style problems.

Return ONLY valid JSON (no markdown fences, no text outside JSON) matching exactly this schema:
{
  "language": "<detected language, lowercase>",
  "correctedCode": "<full corrected code>",
  "errors": [
    {
      "line": <number | null>,
      "type": "<SyntaxError | RuntimeError | LogicError | StyleWarning>",
      "message": "<clear problem description>",
      "fix": "<what was done to fix this>"
    }
  ]
}

If no errors found, return errors as empty array and correctedCode equal to the original code.

Code:
`;

export async function POST(req: NextRequest): Promise<NextResponse<DebugApiResponse | DebugApiError>> {
  const { code } = await req.json() as { code?: string };

  if (!code || code.length > MAX_CODE_LENGTH) {
    return NextResponse.json({ error: 'CODE_TOO_LONG' }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'MISSING_API_KEY' }, { status: 500 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(PROMPT_TEMPLATE + code);
    const text = result.response.text().trim();

    const parsed = JSON.parse(text) as DebugApiResponse;
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: 'GEMINI_PARSE_ERROR' }, { status: 500 });
  }
}
```

**Critérios de aceite:**
- [ ] `POST /api/debug-code` com código válido retorna 200 com JSON estruturado.
- [ ] `POST /api/debug-code` com código de 10.001+ chars retorna 400 `CODE_TOO_LONG`.
- [ ] `GEMINI_API_KEY` ausente retorna 500 `MISSING_API_KEY`.
- [ ] JSON mal-formado do Gemini retorna 500 `GEMINI_PARSE_ERROR` sem crash.
- [ ] `GEMINI_API_KEY` nunca aparece no bundle client-side.

---

## T-04: `CodeInput.tsx` — textarea com contador e limite

**Tipo:** feature
**Agente:** frontend

Criar `apps/tools/src/app/debug-code/_components/CodeInput.tsx`:

**Comportamento:**
- Textarea monoespaçada para colar código
- Contador de caracteres `N / 10.000` no canto inferior direito
- Borda muda para `border-destructive` quando `length > 10.000`
- Botão "Analisar Código" abaixo do textarea, desabilitado quando vazio ou acima do limite
- Estado de loading: botão mostra spinner e texto "Analisando…" enquanto `isLoading`

**Interface:**
```tsx
interface CodeInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}
```

**Componentes de `@nico.dev/ui`:** `Button` (para o botão de submit).

**Critérios de aceite:**
- [ ] Contador atualiza em tempo real.
- [ ] Botão desabilitado com campo vazio ou > 10.000 chars.
- [ ] Botão mostra estado de loading quando `isLoading === true`.
- [ ] Textarea aceita Tab como caractere (não muda foco).

---

## T-05: `ErrorList.tsx` — lista de erros anotados

**Tipo:** feature
**Agente:** frontend

Criar `apps/tools/src/app/debug-code/_components/ErrorList.tsx`:

**Layout por erro:**
```
┌─────────────────────────────────────────────┐
│ [badge tipo]  Linha 5                        │
│ Missing closing bracket                      │
│ Fix: Added '}' at end of function body       │
└─────────────────────────────────────────────┘
```

**Cores de badge por `ErrorType`:**
- `SyntaxError` → `bg-destructive/15 text-destructive`
- `RuntimeError` → `bg-orange-500/15 text-orange-600`
- `LogicError` → `bg-yellow-500/15 text-yellow-600`
- `StyleWarning` → `bg-muted text-muted-foreground`

**Mensagem de ausência de erros:** Se `errors.length === 0`, exibir card verde com "Nenhum erro encontrado. Código parece correto."

**Interface:**
```tsx
import type { CodeError } from '../_types';

interface ErrorListProps {
  errors: CodeError[];
}
```

**Critérios de aceite:**
- [ ] Renderiza sem erro para `errors = []` (exibe mensagem de sucesso).
- [ ] Badge correto por tipo de erro.
- [ ] Linha exibida como "Linha N" ou "—" quando `line === null`.

---

## T-06: `DebugResult.tsx` — código corrigido com highlight + lista de erros

**Tipo:** feature
**Agente:** frontend

Criar `apps/tools/src/app/debug-code/_components/DebugResult.tsx`:

**Layout:**
```
Linguagem detectada: javascript

┌── Código Corrigido ──────────────────────────┐
│  <SyntaxHighlighter language={language}       │
│     style={vscDarkPlus}                       │
│     showLineNumbers                           │
│     customStyle={{ borderRadius: '0.5rem' }} │
│  >                                            │
│    {correctedCode}                            │
│  </SyntaxHighlighter>                         │
└───────────────────────────────────────────────┘

┌── Erros Encontrados (N) ──────────────────────┐
│  <ErrorList errors={errors} />                │
└───────────────────────────────────────────────┘
```

**Biblioteca:** `react-syntax-highlighter` com tema `vscDarkPlus` de `react-syntax-highlighter/dist/esm/styles/prism`.

**Interface:**
```tsx
import type { DebugResult as DebugResultType } from '../_types';

interface DebugResultProps {
  result: DebugResultType;
}
```

**Importante:** Importar `SyntaxHighlighter` com `dynamic(() => import(...), { ssr: false })` para evitar hydration mismatch.

**Critérios de aceite:**
- [ ] Código renderizado com highlight de sintaxe e números de linha.
- [ ] Tema escuro (`vscDarkPlus`) aplicado.
- [ ] `ErrorList` renderiza abaixo do código.
- [ ] Sem hydration errors no Next.js App Router.

---

## T-07: `CodeDebugger.tsx` — componente pai

**Tipo:** feature
**Agente:** frontend

Criar `apps/tools/src/app/debug-code/_components/CodeDebugger.tsx`:

```tsx
"use client"

import { useState } from 'react';
import { CodeInput } from './CodeInput';
import { DebugResult } from './DebugResult';
import type { DebugResult as DebugResultType, DebugApiError } from '../_types';

const ERROR_MESSAGES: Record<DebugApiError['error'], string> = {
  CODE_TOO_LONG: 'Código muito longo. Máximo de 10.000 caracteres.',
  GEMINI_PARSE_ERROR: 'Não foi possível processar a resposta da IA. Tente novamente.',
  MISSING_API_KEY: 'Configuração do servidor incompleta.',
  UNKNOWN_ERROR: 'Erro inesperado. Tente novamente.',
};

export function CodeDebugger() {
  const [code, setCode] = useState('');
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

      const data = await res.json();

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
```

**Critérios de aceite:**
- [ ] Estado de loading impede re-submit durante processamento.
- [ ] Novo submit limpa resultado anterior e erro anterior.
- [ ] Erro de API exibe mensagem amigável (não stack trace).
- [ ] Resultado renderiza logo após resposta da API.

---

## T-08: Rota `src/app/debug-code/page.tsx`

**Tipo:** feature
**Agente:** frontend

Criar `apps/tools/src/app/debug-code/page.tsx`:

```tsx
import type { Metadata } from "next";
import ToolPageHeader from "@/components/tool-page-header";
import { CodeDebugger } from "./_components/CodeDebugger";

export const metadata: Metadata = {
  title: "Debug Code | tools.nico.dev",
  description:
    "Cole seu código e receba uma versão corrigida com explicações detalhadas dos erros encontrados. Powered by Google Gemini.",
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
```

**Critérios de aceite:**
- [ ] Rota `/debug-code` acessível e renderiza sem erro.
- [ ] SSR não quebra (componentes client corretamente marcados com `"use client"`).
- [ ] `<title>` e `<meta description>` presentes no HTML gerado.

---

## T-09: Atualizar home — ativar card `debug-code`

**Tipo:** feature
**Agente:** frontend

Em `apps/tools/src/app/page.tsx`, substituir a entrada `code-debugger` no array `ferramentasParaDevs`:

```ts
// Remover:
{
  slug: "code-debugger",
  name: "Debugger de Código com IA",
  description: "Analise e corrija bugs no seu código com ajuda do Claude.",
  icon: "🐛",
  status: "coming-soon",
},

// Adicionar:
{
  slug: "debug-code",
  name: "Debug Code",
  description: "Cole seu código e receba versão corrigida com apontamento de erros. Powered by Gemini.",
  icon: "🐛",
  status: "active",
  href: "/debug-code",
},
```

**Critérios de aceite:**
- [ ] Card aparece na home com link funcional para `/debug-code`.
- [ ] Badge "Em breve" não aparece mais.
- [ ] Descrição reflete Gemini (não Claude).

---

## Ordem de execução

```
T-01  instalar dependências                      (pré-requisito)
T-02  tipos compartilhados                       (base para todos)
T-03  Route Handler /api/debug-code              (depende de T-01, T-02)
T-04  CodeInput.tsx                              (depende de T-02, paralelo com T-05/T-06)
T-05  ErrorList.tsx                              (depende de T-02, paralelo)
T-06  DebugResult.tsx                            (depende de T-01, T-02, T-05)
T-07  CodeDebugger.tsx                           (depende de T-04, T-06)
T-08  page.tsx                                   (depende de T-07)
T-09  home page.tsx                              (depende de T-08)
```

---

## Riscos de implementação

| Risco | Mitigação |
|-------|-----------|
| `react-syntax-highlighter` com SSR no App Router | `dynamic(..., { ssr: false })` no `DebugResult.tsx` |
| Gemini retorna JSON com markdown fences (```json...```) | `route.ts` faz strip de fences antes de `JSON.parse` |
| `gemini-1.5-flash` depreciado no futuro | Mover model ID para constante; atualizar em T-03 |
| Timeout Gemini para código grande | Next.js Route Handler timeout padrão 30s — suficiente para 10k chars |
| `GEMINI_API_KEY` não configurada em dev | README do app deve documentar; retorno 500 `MISSING_API_KEY` cobre o caso |
