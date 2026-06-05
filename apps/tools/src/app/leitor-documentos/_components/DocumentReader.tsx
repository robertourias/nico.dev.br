'use client'

import { Skeleton } from '@ui'
import { Button } from '@ui'
import { Loader2 } from 'lucide-react'
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
  const {
    file,
    selectFile,
    fileError,
    analysis,
    analysisError,
    isAnalyzing,
    analyze,
    qaEntries,
    question,
    setQuestion,
    isAsking,
    askQuestion,
    canAnalyze,
    canAsk,
    reset,
  } = useDocumentReader()

  return (
    <div className="flex flex-col gap-6">
      {/* Upload area — shown only before analysis */}
      {!analysis && !isAnalyzing && (
        <DropZone onFileSelect={selectFile} isDisabled={isAnalyzing} error={fileError} />
      )}

      {/* File preview */}
      {file && (
        <div className="flex items-center justify-between gap-3">
          <FilePreview
            file={file}
            onRemove={reset}
            isAnalyzing={isAnalyzing}
          />
          {analysis && (
            <Button variant="outline" size="sm" onClick={reset} className="shrink-0">
              Novo documento
            </Button>
          )}
        </div>
      )}

      {/* Analyze button — before analysis */}
      {file && !analysis && !isAnalyzing && (
        <Button onClick={analyze} disabled={!canAnalyze}>
          Analisar Documento
        </Button>
      )}

      {/* Analyzing state */}
      {isAnalyzing && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Analisando documento...</span>
        </div>
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
