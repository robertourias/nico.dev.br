# Plano Técnico: Analisador de Texto Inteligente

**Spec:** `docs/specs/2026-06-05-text-analyzer.md`
**Status:** ready
**Data:** 2026-06-05
**Agente:** frontend

---

## Contexto

Feature nova em `apps/tools/`. Sem banco, sem auth. Segue exatamente o mesmo padrão do `debug-code`:
- `@google/genai` já instalado
- `GEMINI_API_KEY` disponível via `process.env`
- Route Handler POST → Gemini → JSON estruturado → componentes de exibição

---

## Estrutura de Arquivos

```
apps/tools/src/app/
  analisador-texto/
    page.tsx
    _types/
      index.ts
    _hooks/
      useTextAnalyzer.ts          ← estado + fetch
      useCopyToClipboard.ts       ← copy util reutilizável
    _components/
      TextAnalyzer.tsx            ← 'use client' orchestrator
      TextInput.tsx               ← textarea + counter + botões
      AnalysisResult.tsx          ← render dos 5 cards
      SentimentCard.tsx           ← label + score bar + explicação
      EntitiesCard.tsx            ← lista de entidades com badges
      SummaryCard.tsx             ← texto + botão copiar
      InsightsCard.tsx            ← lista bullets + botão copiar
      HumanizedCard.tsx           ← texto reescrito + botão copiar
  api/
    analyze-text/
      route.ts                    ← POST handler
  page.tsx                        ← adicionar entry "Analisador de Texto"
```

---

## Contrato de API

### `POST /api/analyze-text`

**Body:**
```json
{ "text": "string (máx 5000 chars)" }
```

**Resposta de sucesso (200):**
```json
{
  "detectedLanguage": "pt",
  "sentiment": {
    "label": "Positivo",
    "score": 78,
    "explanation": "O texto demonstra tom otimista com linguagem encorajadora."
  },
  "entities": [
    { "name": "Google", "type": "Organização", "relevance": "Alta" }
  ],
  "summary": "Parágrafo conciso em português...",
  "insights": ["Insight 1", "Insight 2", "Insight 3"],
  "humanizedText": "Versão reescrita no idioma original com tom mais natural..."
}
```

**Erros:**
| Status | `error` field          | Quando                          |
|--------|------------------------|---------------------------------|
| 400    | `EMPTY_TEXT`           | body vazio ou só espaços        |
| 400    | `TEXT_TOO_LONG`        | > 5000 chars                    |
| 429    | `QUOTA_EXCEEDED`       | rate limit Gemini               |
| 500    | `GEMINI_PARSE_ERROR`   | JSON inválido na resposta       |
| 500    | `MISSING_API_KEY`      | env não configurada             |
| 502    | `GEMINI_API_ERROR`     | erro upstream Gemini            |

---

## Prompt Template (Gemini)

```
You are a multilingual text analysis AI. Analyze the following text and return ONLY valid JSON
(no markdown fences, no text outside JSON) matching exactly this schema:

{
  "detectedLanguage": "<ISO 639-1 code, e.g. 'pt', 'en', 'es'>",
  "sentiment": {
    "label": "<Positivo | Neutro | Negativo>",
    "score": <integer 0-100: 0=very negative, 50=neutral, 100=very positive>,
    "explanation": "<one sentence in Brazilian Portuguese explaining the sentiment>"
  },
  "entities": [
    {
      "name": "<entity name as it appears in text>",
      "type": "<Pessoa | Organização | Local | Produto | Evento | Outro>",
      "relevance": "<Alta | Média | Baixa>"
    }
  ],
  "summary": "<concise 2-4 sentence summary ALWAYS in Brazilian Portuguese>",
  "insights": ["<3-5 observations in Brazilian Portuguese, non-obvious, relevant>"],
  "humanizedText": "<full rewrite in the SAME language as input with more natural, fluid tone>"
}

Rules:
- entities may be empty array if no clear entities exist
- insights must have exactly 3-5 items
- humanizedText must be in the SAME language as the input text
- summary and insights are ALWAYS in Brazilian Portuguese regardless of input language
- Return ONLY the JSON object, nothing else

Text to analyze:
```

---

## Tarefas

---

### Tarefa 1: Types
Tipo: feature
Agente: frontend

Criar `apps/tools/src/app/analisador-texto/_types/index.ts`:

```ts
export type SentimentLabel = 'Positivo' | 'Neutro' | 'Negativo'
export type EntityType = 'Pessoa' | 'Organização' | 'Local' | 'Produto' | 'Evento' | 'Outro'
export type EntityRelevance = 'Alta' | 'Média' | 'Baixa'

export interface Entity {
  name: string
  type: EntityType
  relevance: EntityRelevance
}

export interface AnalysisResult {
  detectedLanguage: string
  sentiment: {
    label: SentimentLabel
    score: number
    explanation: string
  }
  entities: Entity[]
  summary: string
  insights: string[]
  humanizedText: string
}

export type AnalysisApiError =
  | { error: 'EMPTY_TEXT' }
  | { error: 'TEXT_TOO_LONG' }
  | { error: 'QUOTA_EXCEEDED' }
  | { error: 'GEMINI_PARSE_ERROR' }
  | { error: 'GEMINI_API_ERROR'; detail?: string }
  | { error: 'MISSING_API_KEY' }
```

Critérios de Aceite:
- [ ] Tipos importáveis pelos componentes e route handler sem erros TypeScript.

---

### Tarefa 2: Route Handler
Tipo: feature
Agente: frontend

Criar `apps/tools/src/app/api/analyze-text/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import type { AnalysisResult, AnalysisApiError } from '@/app/analisador-texto/_types'

const MAX_TEXT_LENGTH = 5_000

const PROMPT = `You are a multilingual text analysis AI...` // (template completo acima)

function stripMarkdownFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim()
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<AnalysisResult | AnalysisApiError>> {
  const { text } = await req.json() as { text?: string }

  if (!text || text.trim().length === 0) {
    return NextResponse.json({ error: 'EMPTY_TEXT' }, { status: 400 })
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json({ error: 'TEXT_TOO_LONG' }, { status: 400 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'MISSING_API_KEY' }, { status: 500 })
  }

  let raw: string
  try {
    const ai = new GoogleGenAI({ apiKey })
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: PROMPT + text,
    })
    raw = (response.text ?? '').trim()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[analyze-text] Gemini error:', message)
    if (message.includes('429') || message.includes('RESOURCE_EXHAUSTED')) {
      return NextResponse.json({ error: 'QUOTA_EXCEEDED' }, { status: 429 })
    }
    return NextResponse.json({ error: 'GEMINI_API_ERROR', detail: message }, { status: 502 })
  }

  try {
    const parsed = JSON.parse(stripMarkdownFences(raw)) as AnalysisResult
    return NextResponse.json(parsed)
  } catch {
    console.error('[analyze-text] parse error. Raw:', raw)
    return NextResponse.json({ error: 'GEMINI_PARSE_ERROR' }, { status: 500 })
  }
}
```

Critérios de Aceite:
- [ ] POST com texto válido retorna `AnalysisResult` com os 5 campos preenchidos.
- [ ] POST com texto vazio retorna 400 `EMPTY_TEXT`.
- [ ] POST com texto > 5000 chars retorna 400 `TEXT_TOO_LONG`.
- [ ] Sem API key retorna 500 `MISSING_API_KEY`.
- [ ] Stacktrace nunca exposto na resposta.

Notas: Mesmo `stripMarkdownFences` do debug-code. Modelo `gemini-2.5-flash-lite` — não alterar sem ajuste de custo.

---

### Tarefa 3: Hook `useTextAnalyzer`
Tipo: feature
Agente: frontend

Criar `apps/tools/src/app/analisador-texto/_hooks/useTextAnalyzer.ts`:

```ts
'use client'

import { useState } from 'react'
import type { AnalysisResult, AnalysisApiError } from '../_types'

const ERROR_MESSAGES: Record<AnalysisApiError['error'], string> = {
  EMPTY_TEXT: 'O texto não pode estar vazio.',
  TEXT_TOO_LONG: 'Texto muito longo. Máximo de 5.000 caracteres.',
  QUOTA_EXCEEDED: 'Limite de uso da API atingido. Aguarde alguns minutos.',
  GEMINI_PARSE_ERROR: 'Não foi possível processar a resposta da IA. Tente novamente.',
  GEMINI_API_ERROR: 'Erro ao chamar a API de IA. Tente novamente.',
  MISSING_API_KEY: 'Configuração do servidor incompleta.',
}

export function useTextAnalyzer() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const canAnalyze = text.trim().length > 0 && text.length <= 5_000 && !isLoading

  async function analyze() {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/analyze-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      const data = await res.json() as AnalysisResult | AnalysisApiError

      if (!res.ok) {
        const err = data as AnalysisApiError
        setError(ERROR_MESSAGES[err.error] ?? ERROR_MESSAGES.GEMINI_API_ERROR)
        return
      }

      setResult(data as AnalysisResult)
    } catch {
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  function reset() {
    setText('')
    setResult(null)
    setError(null)
  }

  return { text, setText, result, error, isLoading, canAnalyze, analyze, reset }
}
```

Criar `apps/tools/src/app/analisador-texto/_hooks/useCopyToClipboard.ts`:

```ts
'use client'

import { useState, useCallback } from 'react'

export function useCopyToClipboard(timeoutMs = 2000) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), timeoutMs)
    } catch {
      // clipboard API não disponível ou bloqueada
    }
  }, [timeoutMs])

  return { copied, copy }
}
```

Critérios de Aceite:
- [ ] `canAnalyze` é `false` para texto vazio, > 5000 chars, ou durante loading.
- [ ] `reset()` limpa texto, resultado e erro.
- [ ] `useCopyToClipboard` reverte `copied` para `false` após timeout.

---

### Tarefa 4: Componente SentimentCard
Tipo: feature
Agente: frontend

Criar `apps/tools/src/app/analisador-texto/_components/SentimentCard.tsx`:

```ts
interface SentimentCardProps {
  sentiment: AnalysisResult['sentiment']
  detectedLanguage: string
}
```

Layout:
- Header: título "Sentimento" + badge do idioma detectado (ex: "PT", "EN")
- Label grande com ícone: ✅ Positivo / ➖ Neutro / ❌ Negativo — sem emoji se houver suporte a ícones Lucide adequados
- Barra de progresso horizontal (0–100): verde se Positivo, cinza se Neutro, vermelho se Negativo
- Score como texto: "Score: 78/100"
- Explicação em muted abaixo

Cores da barra:
- Positivo: `bg-green-500`
- Neutro: `bg-muted-foreground`
- Negativo: `bg-red-500`

Critérios de Aceite:
- [ ] Barra de progresso reflete o score (78 → 78% de largura)
- [ ] Cor da barra muda conforme label
- [ ] Badge de idioma visível

---

### Tarefa 5: Componente EntitiesCard
Tipo: feature
Agente: frontend

Criar `apps/tools/src/app/analisador-texto/_components/EntitiesCard.tsx`:

```ts
interface EntitiesCardProps {
  entities: Entity[]
}
```

Layout:
- Header: "Entidades" com contagem `(N)`
- Se `entities.length === 0`: mensagem "Nenhuma entidade identificada." em muted
- Lista de entidades: cada item mostra nome + badge de tipo + badge de relevância
- Badge de relevância: Alta → verde, Média → amarelo, Baixa → cinza
- Badge de tipo: cor neutra uniforme

Critérios de Aceite:
- [ ] Estado vazio exibido quando `entities` é array vazio
- [ ] Badges de relevância com cores corretas

---

### Tarefa 6: Componentes SummaryCard, InsightsCard, HumanizedCard
Tipo: feature
Agente: frontend

Os três seguem o mesmo padrão — criar separadamente:

**SummaryCard** (`_components/SummaryCard.tsx`):
- Props: `{ summary: string }`
- Header "Resumo" + botão copiar (ícone Copy do Lucide + texto "Copiado!" quando copiado)
- Texto do resumo em parágrafo

**InsightsCard** (`_components/InsightsCard.tsx`):
- Props: `{ insights: string[] }`
- Header "Insights" com contagem + botão copiar (copia todos os insights como lista)
- Lista com bullet point para cada insight

**HumanizedCard** (`_components/HumanizedCard.tsx`):
- Props: `{ humanizedText: string; originalLength: number }`
- Header "Texto Humanizado" + botão copiar
- Diff de caracteres: "N chars" em muted
- Texto reescrito em parágrafo com `whitespace-pre-wrap`

Cada botão copiar usa `useCopyToClipboard`. Ícone: `Copy` do Lucide → muda para `Check` quando `copied === true`.

Critérios de Aceite:
- [ ] Botão copiar funciona nos 3 componentes
- [ ] Ícone muda para Check após cópia e reverte após 2s
- [ ] HumanizedCard mostra contagem de chars do texto humanizado

---

### Tarefa 7: Componente AnalysisResult
Tipo: feature
Agente: frontend

Criar `apps/tools/src/app/analisador-texto/_components/AnalysisResult.tsx`:

```ts
interface AnalysisResultProps {
  result: AnalysisResult
}
```

Monta os 5 cards em grid responsivo:
```
[SentimentCard        ] [EntitiesCard         ]
[SummaryCard (full width)                     ]
[InsightsCard         ] [HumanizedCard        ]
```

Em mobile: todos em coluna única.
Em desktop (md+): SentimentCard e EntitiesCard lado a lado; SummaryCard full-width; InsightsCard e HumanizedCard lado a lado.

Critérios de Aceite:
- [ ] Layout grid correto em desktop e mobile
- [ ] Todos os 5 cards renderizam com dados válidos

---

### Tarefa 8: Componente TextInput
Tipo: feature
Agente: frontend

Criar `apps/tools/src/app/analisador-texto/_components/TextInput.tsx`:

```ts
interface TextInputProps {
  value: string
  onChange: (text: string) => void
  onSubmit: () => void
  isLoading: boolean
  hasResult: boolean
  onReset: () => void
}
```

Layout:
- Textarea multilinha (min 6 linhas, `resize-y`)
- Contador: `"N / 5.000"` alinhado à direita — vermelho quando > 5000
- Linha de ações: botão "Analisar" (primary, disabled se não pode) + spinner durante loading + botão "Limpar" (outline, só visível se `hasResult`)
- Placeholder: `"Cole seu texto aqui para análise..."`

Critérios de Aceite:
- [ ] Contador fica vermelho ao ultrapassar 5000 chars
- [ ] Botão Analisar desabilitado para texto vazio ou > 5000 chars
- [ ] Botão Limpar visível apenas após resultado

---

### Tarefa 9: Componente TextAnalyzer (orchestrator)
Tipo: feature
Agente: frontend

Criar `apps/tools/src/app/analisador-texto/_components/TextAnalyzer.tsx`:

```ts
'use client'

import { useTextAnalyzer } from '../_hooks/useTextAnalyzer'
import { TextInput } from './TextInput'
import { AnalysisResult } from './AnalysisResult'
import { Skeleton } from '@ui'

export function TextAnalyzer() {
  const { text, setText, result, error, isLoading, canAnalyze, analyze, reset } = useTextAnalyzer()

  return (
    <div className="flex flex-col gap-8">
      <TextInput
        value={text}
        onChange={setText}
        onSubmit={analyze}
        isLoading={isLoading}
        hasResult={!!result}
        onReset={reset}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {isLoading && <AnalysisSkeleton />}
      {result && !isLoading && <AnalysisResult result={result} />}
    </div>
  )
}
```

`AnalysisSkeleton`: placeholder com 5 Skeleton cards durante loading — evita CLS.

Critérios de Aceite:
- [ ] Skeleton visível durante loading
- [ ] Resultado substitui skeleton após resposta
- [ ] Erro exibido inline abaixo do TextInput

---

### Tarefa 10: Page Assembly + Homepage
Tipo: feature
Agente: frontend

**Criar** `apps/tools/src/app/analisador-texto/page.tsx`:

```tsx
import type { Metadata } from 'next'
import ToolPageHeader from '@/components/tool-page-header'
import { TextAnalyzer } from './_components/TextAnalyzer'

export const metadata: Metadata = {
  title: 'Analisador de Texto | tools.nico.dev',
  description: 'Analise sentimento, entidades, resumo e insights de qualquer texto. Gera versão humanizada com IA.',
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
```

**Atualizar** `apps/tools/src/app/page.tsx` — adicionar em `ferramentasParaDevs`:

```ts
{
  slug: 'analisador-texto',
  name: 'Analisador de Texto',
  description: 'Sentimento, entidades, resumo, insights e versão humanizada de qualquer texto. Powered by Gemini.',
  icon: '🧠',
  status: 'active',
  href: '/analisador-texto',
},
```

Critérios de Aceite:
- [ ] Página carrega em `tools.nico.dev/analisador-texto`
- [ ] Card aparece na seção "Ferramentas para devs" com status `active`

---

## Ordem de Execução

```
T1 → T2 → T3 → T4 + T5 + T6 (paralelas) → T7 → T8 → T9 → T10
```

T1 (types) é pré-requisito para todos.
T4, T5, T6 são independentes entre si — podem ser desenvolvidos em paralelo após T3.
T7 (AnalysisResult) requer T4+T5+T6.
T8 (TextInput) pode ser feito em paralelo com T4-T6.
T9 requer T7+T8.
T10 requer T9.
