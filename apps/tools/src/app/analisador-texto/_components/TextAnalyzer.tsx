'use client'

import { Skeleton } from '@ui'
import { useTextAnalyzer } from '../_hooks/useTextAnalyzer'
import { TextInput } from './TextInput'
import { AnalysisResult } from './AnalysisResult'

function AnalysisSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-[180px] rounded-xl" />
        <Skeleton className="h-[180px] rounded-xl" />
      </div>
      <Skeleton className="h-[120px] rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-[200px] rounded-xl" />
        <Skeleton className="h-[200px] rounded-xl" />
      </div>
    </div>
  )
}

export function TextAnalyzer() {
  const { text, setText, result, error, isLoading, canAnalyze, analyze, reset } =
    useTextAnalyzer()

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
      {result && !isLoading && (
        <AnalysisResult result={result} originalLength={text.length} />
      )}
    </div>
  )
}
