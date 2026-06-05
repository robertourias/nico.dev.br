# Plano Técnico: Leitor de Documentos Inteligente

**Spec:** `docs/specs/2026-06-05-document-reader.md`
**Status:** ready
**Data:** 2026-06-05
**Agente:** frontend

---

## Contexto

Feature nova em `apps/tools/`. Sem banco, sem auth. Segue o padrão das ferramentas existentes (debug-code, analisador-texto):
- `@google/genai` v2.8 já instalado
- `GEMINI_API_KEY` disponível via `process.env`
- **Diferencial**: multimodal — PDFs e imagens enviados como `inlineData` (base64) ao Gemini; texto enviado como parte textual
- Upload via `FormData` (sem base64-in-JSON) → evita limite de body parser

---

## Estrutura de Arquivos

```
apps/tools/src/app/
  leitor-documentos/
    page.tsx
    _types/
      index.ts
    _hooks/
      useDocumentReader.ts          ← estado + upload + análise + Q&A
    _components/
      DocumentReader.tsx             ← 'use client' orchestrator
      DropZone.tsx                   ← drag-and-drop + file picker
      FilePreview.tsx                ← nome + tamanho + thumbnail (imagens)
      AnalysisResult.tsx             ← 3 cards de resultado fixo
      DocumentTypeCard.tsx           ← tipo de documento como badge
      SummaryCard.tsx                ← resumo + badge de idioma
      KeyPointsCard.tsx              ← lista de pontos-chave
      QASection.tsx                  ← input + thread de perguntas
  api/
    analyze-document/
      route.ts                       ← POST FormData, análise fixa
    ask-document/
      route.ts                       ← POST FormData + question
  page.tsx                           ← adicionar card "Leitor de Documentos"
```

---

## Contrato de API

### `POST /api/analyze-document`

**Body:** `FormData` com campo `file` (PDF, imagem ou texto)

**Resposta de sucesso (200):**
```json
{
  "detectedLanguage": "pt",
  "documentType": "Nota Fiscal",
  "summary": "Documento emitido pela empresa X...",
  "keyPoints": [
    "Valor total: R$ 1.250,00",
    "Data de emissão: 01/06/2026",
    "CNPJ do emitente: 00.000.000/0001-00"
  ]
}
```

**Erros:**
| Status | `error` field         | Quando                                 |
|--------|-----------------------|----------------------------------------|
| 400    | `EMPTY_FILE`          | file ausente ou tamanho 0              |
| 400    | `FILE_TOO_LARGE`      | > 5 MB                                 |
| 400    | `UNSUPPORTED_FORMAT`  | MIME type não aceito                   |
| 429    | `QUOTA_EXCEEDED`      | rate limit Gemini                      |
| 500    | `GEMINI_PARSE_ERROR`  | JSON inválido na resposta              |
| 500    | `MISSING_API_KEY`     | env não configurada                    |
| 502    | `GEMINI_API_ERROR`    | erro upstream Gemini                   |

---

### `POST /api/ask-document`

**Body:** `FormData` com campos `file` (mesmo arquivo) + `question` (string)

**Resposta de sucesso (200):**
```json
{ "answer": "Texto livre da resposta do Gemini..." }
```

**Erros:** mesmos códigos de analyze-document + `EMPTY_QUESTION` (400).

---

## Prompts Gemini

### Análise fixa (`analyze-document`)

```
You are a document analysis AI. Analyze the provided document and return ONLY valid JSON
(no markdown fences, no text outside JSON) matching exactly this schema:

{
  "detectedLanguage": "<ISO 639-1 code, e.g. 'pt', 'en', 'es'>",
  "documentType": "<brief classification in Brazilian Portuguese, e.g. 'Nota Fiscal', 'Contrato de Prestação de Serviços', 'Currículo', 'Artigo Científico', 'Receita Médica', 'Extrato Bancário'>",
  "summary": "<concise 2-4 sentence summary ALWAYS in Brazilian Portuguese>",
  "keyPoints": ["<3-7 key information items ALWAYS in Brazilian Portuguese>"]
}

Rules:
- documentType: short, specific classification in pt-BR
- summary: ALWAYS in Brazilian Portuguese, regardless of document language
- keyPoints: ALWAYS in Brazilian Portuguese, extract most relevant facts (dates, values, names, deadlines)
- Return ONLY the JSON object, nothing else
```

### Pergunta livre (`ask-document`)

```
You are a document assistant. The user uploaded a document and has a question about it.
Answer clearly and directly based solely on the document content.
Respond in the SAME language as the question.
Question: {question}
```

---

## Detalhes de Implementação

### Tipos MIME aceitos

```ts
const ACCEPTED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'text/plain',
  'text/markdown',
])

// .md files may have empty MIME type — detect by extension
function getMimeType(file: File): string {
  if (file.type) return file.type
  if (file.name.endsWith('.md')) return 'text/markdown'
  return ''
}
```

### Lógica de envio ao Gemini (por tipo)

```ts
// PDFs e imagens → inline_data (OCR nativo)
parts: [
  { inlineData: { mimeType, data: base64 } },
  { text: PROMPT }
]

// .txt e .md → texto direto
parts: [
  { text: `${PROMPT}\n\nDocument content:\n${fileText}` }
]
```

### Construção de `contents` no route handler

```ts
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey })

const isTextFile = mimeType === 'text/plain' || mimeType === 'text/markdown'

const contents = isTextFile
  ? [{ text: `${ANALYSIS_PROMPT}\n\nDocument content:\n${await file.text()}` }]
  : [
      { inlineData: { mimeType, data: Buffer.from(await file.arrayBuffer()).toString('base64') } },
      { text: ANALYSIS_PROMPT },
    ]

const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: [{ role: 'user', parts: contents }],
})
```

---

## Tarefas

---

### Tarefa 1: Types
Tipo: feature
Agente: frontend

Criar `apps/tools/src/app/leitor-documentos/_types/index.ts`:

```ts
export interface DocumentAnalysis {
  detectedLanguage: string
  documentType: string
  summary: string
  keyPoints: string[]
}

export interface QAEntry {
  question: string
  answer: string
  isLoading?: boolean
}

export type DocumentApiErrorCode =
  | 'EMPTY_FILE'
  | 'FILE_TOO_LARGE'
  | 'UNSUPPORTED_FORMAT'
  | 'EMPTY_QUESTION'
  | 'QUOTA_EXCEEDED'
  | 'GEMINI_PARSE_ERROR'
  | 'GEMINI_API_ERROR'
  | 'MISSING_API_KEY'

export interface DocumentApiError {
  error: DocumentApiErrorCode
  detail?: string
}

export const ACCEPTED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'text/plain',
  'text/markdown',
])

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export function getMimeType(file: File): string {
  if (file.type) return file.type
  if (file.name.endsWith('.md')) return 'text/markdown'
  return ''
}

export function isTextFile(mimeType: string): boolean {
  return mimeType === 'text/plain' || mimeType === 'text/markdown'
}
```

Critérios de Aceite:
- [ ] Tipos importáveis pelos componentes e route handlers sem erros TypeScript.

---

### Tarefa 2: Route Handler `analyze-document`
Tipo: feature
Agente: frontend

Criar `apps/tools/src/app/api/analyze-document/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import type { DocumentAnalysis, DocumentApiError } from '@/app/leitor-documentos/_types'
import { ACCEPTED_MIME_TYPES, MAX_FILE_SIZE, getMimeType, isTextFile } from '@/app/leitor-documentos/_types'

const ANALYSIS_PROMPT = `You are a document analysis AI. ...` // prompt completo da seção Prompts

function stripMarkdownFences(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<DocumentAnalysis | DocumentApiError>> {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'EMPTY_FILE' }, { status: 400 })
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'FILE_TOO_LARGE' }, { status: 400 })
  }

  const mimeType = getMimeType(file)
  if (!ACCEPTED_MIME_TYPES.has(mimeType)) {
    return NextResponse.json({ error: 'UNSUPPORTED_FORMAT' }, { status: 400 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'MISSING_API_KEY' }, { status: 500 })
  }

  let raw: string
  try {
    const ai = new GoogleGenAI({ apiKey })
    const parts = isTextFile(mimeType)
      ? [{ text: `${ANALYSIS_PROMPT}\n\nDocument content:\n${await file.text()}` }]
      : [
          { inlineData: { mimeType, data: Buffer.from(await file.arrayBuffer()).toString('base64') } },
          { text: ANALYSIS_PROMPT },
        ]
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts }],
    })
    raw = (response.text ?? '').trim()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[analyze-document] Gemini error:', message)
    if (message.includes('429') || message.includes('RESOURCE_EXHAUSTED')) {
      return NextResponse.json({ error: 'QUOTA_EXCEEDED' }, { status: 429 })
    }
    return NextResponse.json({ error: 'GEMINI_API_ERROR', detail: message }, { status: 502 })
  }

  try {
    const parsed = JSON.parse(stripMarkdownFences(raw)) as DocumentAnalysis
    return NextResponse.json(parsed)
  } catch (err) {
    console.error('[analyze-document] parse error. Raw:', raw, err)
    return NextResponse.json({ error: 'GEMINI_PARSE_ERROR' }, { status: 500 })
  }
}
```

Critérios de Aceite:
- [ ] POST com PDF válido retorna `DocumentAnalysis` com os 4 campos.
- [ ] POST com imagem válida retorna resultado (OCR).
- [ ] POST com .txt válido retorna resultado.
- [ ] Arquivo > 5 MB retorna 400 `FILE_TOO_LARGE`.
- [ ] Formato não suportado retorna 400 `UNSUPPORTED_FORMAT`.
- [ ] Sem API key retorna 500 `MISSING_API_KEY`.

---

### Tarefa 3: Route Handler `ask-document`
Tipo: feature
Agente: frontend

Criar `apps/tools/src/app/api/ask-document/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import type { DocumentApiError } from '@/app/leitor-documentos/_types'
import { ACCEPTED_MIME_TYPES, MAX_FILE_SIZE, getMimeType, isTextFile } from '@/app/leitor-documentos/_types'

const QA_PROMPT_PREFIX = `You are a document assistant. Answer clearly and directly based solely on the document content. Respond in the SAME language as the question.\n\nQuestion: `

export async function POST(
  req: NextRequest
): Promise<NextResponse<{ answer: string } | DocumentApiError>> {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const question = (formData.get('question') as string | null)?.trim()

  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'EMPTY_FILE' }, { status: 400 })
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'FILE_TOO_LARGE' }, { status: 400 })
  }
  if (!question) {
    return NextResponse.json({ error: 'EMPTY_QUESTION' }, { status: 400 })
  }

  const mimeType = getMimeType(file)
  if (!ACCEPTED_MIME_TYPES.has(mimeType)) {
    return NextResponse.json({ error: 'UNSUPPORTED_FORMAT' }, { status: 400 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'MISSING_API_KEY' }, { status: 500 })
  }

  try {
    const ai = new GoogleGenAI({ apiKey })
    const promptText = `${QA_PROMPT_PREFIX}${question}`
    const parts = isTextFile(mimeType)
      ? [{ text: `${promptText}\n\nDocument content:\n${await file.text()}` }]
      : [
          { inlineData: { mimeType, data: Buffer.from(await file.arrayBuffer()).toString('base64') } },
          { text: promptText },
        ]
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts }],
    })
    return NextResponse.json({ answer: (response.text ?? '').trim() })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[ask-document] Gemini error:', message)
    if (message.includes('429') || message.includes('RESOURCE_EXHAUSTED')) {
      return NextResponse.json({ error: 'QUOTA_EXCEEDED' }, { status: 429 })
    }
    return NextResponse.json({ error: 'GEMINI_API_ERROR', detail: message }, { status: 502 })
  }
}
```

Critérios de Aceite:
- [ ] POST com arquivo + pergunta retorna `{ answer: string }`.
- [ ] Pergunta vazia retorna 400 `EMPTY_QUESTION`.
- [ ] Resposta no mesmo idioma da pergunta.

---

### Tarefa 4: Hook `useDocumentReader`
Tipo: feature
Agente: frontend

Criar `apps/tools/src/app/leitor-documentos/_hooks/useDocumentReader.ts`:

```ts
'use client'

import { useState, useRef } from 'react'
import type { DocumentAnalysis, QAEntry, DocumentApiError } from '../_types'
import { ACCEPTED_MIME_TYPES, MAX_FILE_SIZE, getMimeType } from '../_types'

const ERROR_MESSAGES: Record<string, string> = {
  EMPTY_FILE: 'Nenhum arquivo selecionado.',
  FILE_TOO_LARGE: 'Arquivo muito grande. Máximo de 5 MB.',
  UNSUPPORTED_FORMAT: 'Formato não suportado. Use PDF, imagem ou texto.',
  EMPTY_QUESTION: 'Digite uma pergunta antes de enviar.',
  QUOTA_EXCEEDED: 'Limite de uso da API atingido. Aguarde alguns minutos.',
  GEMINI_PARSE_ERROR: 'Não foi possível processar a resposta da IA. Tente novamente.',
  GEMINI_API_ERROR: 'Erro ao chamar a API de IA. Tente novamente.',
  MISSING_API_KEY: 'Configuração do servidor incompleta.',
}

export function useDocumentReader() {
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [qaEntries, setQaEntries] = useState<QAEntry[]>([])
  const [question, setQuestion] = useState('')
  const [isAsking, setIsAsking] = useState(false)
  const fileRef = useRef<File | null>(null)

  function selectFile(f: File) {
    const mimeType = getMimeType(f)
    if (!ACCEPTED_MIME_TYPES.has(mimeType)) {
      setFileError('Formato não suportado. Use PDF, imagem (JPG, PNG, WebP) ou texto (.txt, .md).')
      return
    }
    if (f.size > MAX_FILE_SIZE) {
      setFileError('Arquivo muito grande. Máximo de 5 MB.')
      return
    }
    setFileError(null)
    setFile(f)
    fileRef.current = f
    // reset previous analysis
    setAnalysis(null)
    setAnalysisError(null)
    setQaEntries([])
    setQuestion('')
  }

  async function analyze() {
    if (!file) return
    setIsAnalyzing(true)
    setAnalysisError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/analyze-document', { method: 'POST', body: formData })
      const data = (await res.json()) as DocumentAnalysis | DocumentApiError
      if (!res.ok) {
        setAnalysisError(ERROR_MESSAGES[(data as DocumentApiError).error] ?? ERROR_MESSAGES.GEMINI_API_ERROR)
        return
      }
      setAnalysis(data as DocumentAnalysis)
    } catch {
      setAnalysisError('Erro inesperado. Tente novamente.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  async function askQuestion() {
    if (!file || !question.trim()) return
    const q = question.trim()
    setQuestion('')
    setIsAsking(true)

    // Optimistic: add entry with isLoading
    setQaEntries(prev => [...prev, { question: q, answer: '', isLoading: true }])

    const formData = new FormData()
    formData.append('file', file)
    formData.append('question', q)

    try {
      const res = await fetch('/api/ask-document', { method: 'POST', body: formData })
      const data = (await res.json()) as { answer: string } | DocumentApiError
      if (!res.ok) {
        const msg = ERROR_MESSAGES[(data as DocumentApiError).error] ?? ERROR_MESSAGES.GEMINI_API_ERROR
        setQaEntries(prev => prev.map((e, i) => i === prev.length - 1 ? { ...e, answer: msg, isLoading: false } : e))
        return
      }
      setQaEntries(prev => prev.map((e, i) => i === prev.length - 1
        ? { ...e, answer: (data as { answer: string }).answer, isLoading: false }
        : e
      ))
    } catch {
      setQaEntries(prev => prev.map((e, i) => i === prev.length - 1
        ? { ...e, answer: 'Erro inesperado. Tente novamente.', isLoading: false }
        : e
      ))
    } finally {
      setIsAsking(false)
    }
  }

  function reset() {
    setFile(null)
    fileRef.current = null
    setFileError(null)
    setAnalysis(null)
    setAnalysisError(null)
    setIsAnalyzing(false)
    setQaEntries([])
    setQuestion('')
    setIsAsking(false)
  }

  const canAnalyze = !!file && !isAnalyzing
  const canAsk = !!file && !!analysis && question.trim().length > 0 && !isAsking

  return {
    file, selectFile, fileError,
    analysis, analysisError, isAnalyzing, analyze,
    qaEntries, question, setQuestion, isAsking, askQuestion,
    canAnalyze, canAsk,
    reset,
  }
}
```

Critérios de Aceite:
- [ ] `selectFile` rejeita formatos inválidos e tamanhos > 5 MB com `fileError` adequado.
- [ ] `selectFile` com arquivo válido limpa análise e Q&A anteriores.
- [ ] `askQuestion` adiciona entry otimista com `isLoading: true`, atualiza após resposta.
- [ ] `reset()` limpa todo o estado.

---

### Tarefa 5: Componente DropZone
Tipo: feature
Agente: frontend

Criar `apps/tools/src/app/leitor-documentos/_components/DropZone.tsx`:

```ts
interface DropZoneProps {
  onFileSelect: (file: File) => void
  isDisabled?: boolean
  error?: string | null
}
```

Layout:
- Área clicável com borda dashed `border-dashed border-2 border-border`
- Ícone `UploadCloud` (Lucide) centralizado
- Texto: "Arraste um documento ou clique para selecionar"
- Sub-texto: "PDF, JPG, PNG, WebP, TXT, MD — máx. 5 MB"
- `input[type=file]` hidden, acionado pelo clique na área
- Drag events: `onDragOver` (highlight borda), `onDragLeave` (reset), `onDrop` (seleciona arquivo)
- Se `error`: mensagem em `text-destructive` abaixo da área

Critérios de Aceite:
- [ ] Clique na área abre file picker.
- [ ] Drag-and-drop do arquivo dispara `onFileSelect`.
- [ ] Apenas primeiro arquivo de um drop múltiplo é aceito.
- [ ] Estado de drag destacado visualmente (borda `border-primary`).

---

### Tarefa 6: Componente FilePreview
Tipo: feature
Agente: frontend

Criar `apps/tools/src/app/leitor-documentos/_components/FilePreview.tsx`:

```ts
interface FilePreviewProps {
  file: File
  onRemove: () => void
  isAnalyzing: boolean
}
```

Layout:
- Card com ícone baseado no tipo:
  - PDF: `FileText` (Lucide)
  - Imagem: thumbnail `<img>` via `URL.createObjectURL` + `useEffect` para revogar URL
  - Texto: `FileCode` (Lucide)
- Nome do arquivo (truncado com `truncate max-w-xs`)
- Tamanho formatado (ex: "1.2 MB", "800 KB")
- Botão X para remover (`X` icon, `disabled={isAnalyzing}`)

Critérios de Aceite:
- [ ] Thumbnail visível para arquivos de imagem.
- [ ] URL de object URL revogada no `useEffect` cleanup (sem memory leak).
- [ ] Botão remover desabilitado durante análise.

---

### Tarefa 7: Componentes de Resultado da Análise
Tipo: feature
Agente: frontend

**DocumentTypeCard** (`_components/DocumentTypeCard.tsx`):
- Props: `{ documentType: string }`
- Header "Tipo de Documento"
- Badge grande com o tipo detectado (ex: "Nota Fiscal")
- Badge usa variante `default`

**SummaryCard** (`_components/SummaryCard.tsx`):
- Props: `{ summary: string; detectedLanguage: string }`
- Header "Resumo" + badge de idioma (ex: "PT")
- Parágrafo com o resumo
- Botão copiar (padrão do analisador-texto)

**KeyPointsCard** (`_components/KeyPointsCard.tsx`):
- Props: `{ keyPoints: string[] }`
- Header "Pontos-chave" com contagem
- Lista numerada dos pontos
- Botão copiar (copia como lista numerada)

Reutilizar `useCopyToClipboard` de `@/app/analisador-texto/_hooks/useCopyToClipboard`.

Critérios de Aceite:
- [ ] Badge de idioma visível em SummaryCard.
- [ ] Botões copiar funcionam nos 3 componentes.
- [ ] KeyPointsCard mostra contagem correta.

---

### Tarefa 8: Componente AnalysisResult
Tipo: feature
Agente: frontend

Criar `apps/tools/src/app/leitor-documentos/_components/AnalysisResult.tsx`:

```ts
interface AnalysisResultProps {
  analysis: DocumentAnalysis
}
```

Layout grid:
```
[DocumentTypeCard     ] [SummaryCard          ]
[KeyPointsCard (full width)                   ]
```

Mobile: coluna única. Desktop (md+): DocumentTypeCard + SummaryCard lado a lado; KeyPointsCard full-width.

Critérios de Aceite:
- [ ] Grid correto em desktop e mobile.
- [ ] Todos 3 cards com dados preenchidos.

---

### Tarefa 9: Componente QASection
Tipo: feature
Agente: frontend

Criar `apps/tools/src/app/leitor-documentos/_components/QASection.tsx`:

```ts
interface QASectionProps {
  entries: QAEntry[]
  question: string
  onQuestionChange: (q: string) => void
  onSubmit: () => void
  isAsking: boolean
  canAsk: boolean
}
```

Layout:
- Título "Perguntas sobre o documento"
- Thread de pares pergunta/resposta:
  - Pergunta: `font-medium text-foreground` com ícone `MessageSquare`
  - Resposta: `text-muted-foreground` com ícone `Bot`
  - Durante loading: `Skeleton` ou `Loader2` animado
- Input de pergunta + botão "Perguntar" com `Loader2` durante loading
- `ref` no container da thread para auto-scroll após nova resposta (`scrollIntoView`)

Critérios de Aceite:
- [ ] Thread exibe pares pergunta/resposta em ordem.
- [ ] Skeleton/loader visível enquanto `isLoading: true`.
- [ ] Auto-scroll para última entrada após nova resposta.
- [ ] Botão desabilitado quando pergunta vazia ou `isAsking`.

---

### Tarefa 10: Componente DocumentReader (orchestrator)
Tipo: feature
Agente: frontend

Criar `apps/tools/src/app/leitor-documentos/_components/DocumentReader.tsx`:

```ts
'use client'

import { Skeleton } from '@ui'
import { Button } from '@ui'
import { useDocumentReader } from '../_hooks/useDocumentReader'
import { DropZone } from './DropZone'
import { FilePreview } from './FilePreview'
import { AnalysisResult } from './AnalysisResult'
import { QASection } from './QASection'

function AnalysisSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-[120px] rounded-xl" />
        <Skeleton className="h-[160px] rounded-xl" />
      </div>
      <Skeleton className="h-[200px] rounded-xl" />
    </div>
  )
}

export function DocumentReader() {
  const { ... } = useDocumentReader()

  return (
    <div className="flex flex-col gap-8">
      {/* Upload area — hidden after analysis */}
      {!analysis && !isAnalyzing && (
        <>
          <DropZone onFileSelect={selectFile} error={fileError} />
          {file && (
            <FilePreview file={file} onRemove={reset} isAnalyzing={isAnalyzing} />
          )}
        </>
      )}
      {/* File preview + reset button after analysis */}
      {(analysis || isAnalyzing) && file && (
        <div className="flex items-center justify-between">
          <FilePreview file={file} onRemove={() => {}} isAnalyzing={isAnalyzing} />
          {analysis && (
            <Button variant="outline" size="sm" onClick={reset}>
              Novo documento
            </Button>
          )}
        </div>
      )}
      {/* Analyze button */}
      {file && !analysis && !isAnalyzing && (
        <Button onClick={analyze} disabled={!canAnalyze}>
          Analisar Documento
        </Button>
      )}
      {analysisError && <p className="text-sm text-destructive">{analysisError}</p>}
      {isAnalyzing && <AnalysisSkeleton />}
      {analysis && !isAnalyzing && (
        <>
          <AnalysisResult analysis={analysis} />
          <QASection
            entries={qaEntries}
            question={question}
            onQuestionChange={setQuestion}
            onSubmit={askQuestion}
            isAsking={isAsking}
            canAsk={canAsk}
          />
        </>
      )}
    </div>
  )
}
```

Critérios de Aceite:
- [ ] DropZone oculta após análise concluída.
- [ ] FilePreview + botão "Novo documento" visíveis após análise.
- [ ] Skeleton durante análise.
- [ ] QASection aparece apenas após análise bem-sucedida.
- [ ] Reset limpa tudo e volta ao estado inicial.

---

### Tarefa 11: Page Assembly + Homepage
Tipo: feature
Agente: frontend

**Criar** `apps/tools/src/app/leitor-documentos/page.tsx`:

```tsx
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
```

**Atualizar** `apps/tools/src/app/page.tsx` — na seção `utilidades`, substituir card `document-reader` de `coming-soon` para `active`:

```ts
{
  slug: 'leitor-documentos',
  name: 'Leitor de Documentos',
  description: 'Extraia resumo, tipo e pontos-chave de PDFs, imagens e textos. Faça perguntas livres sobre o conteúdo com IA.',
  icon: '📄',
  status: 'active',
  href: '/leitor-documentos',
},
```

Critérios de Aceite:
- [ ] Página carrega em `tools.nico.dev/leitor-documentos`.
- [ ] Card aparece em "Utilidades" com status `active`.

---

## Ordem de Execução

```
T1 → T2 + T3 (paralelas) → T4 → T5 + T6 + T7 (paralelas) → T8 → T9 → T10 → T11
```

- T1 (types): pré-requisito para T2, T3, T4
- T2, T3 (routes): independentes entre si, dependem de T1
- T4 (hook): depende de T1
- T5, T6, T7 (componentes folha): independentes entre si, dependem de T1
- T8 (AnalysisResult): depende de T7
- T9 (QASection): depende de T1
- T10 (DocumentReader): depende de T4 + T5 + T6 + T8 + T9
- T11 (page + homepage): depende de T10
