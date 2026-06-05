import { DocumentTypeCard } from './DocumentTypeCard'
import { SummaryCard } from './SummaryCard'
import { KeyPointsCard } from './KeyPointsCard'
import type { DocumentAnalysis } from '../_types'

interface AnalysisResultProps {
  analysis: DocumentAnalysis
}

export function AnalysisResult({ analysis }: AnalysisResultProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocumentTypeCard documentType={analysis.documentType} />
        <SummaryCard summary={analysis.summary} detectedLanguage={analysis.detectedLanguage} />
      </div>
      <KeyPointsCard keyPoints={analysis.keyPoints} />
    </div>
  )
}
