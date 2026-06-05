import { SentimentCard } from './SentimentCard'
import { EntitiesCard } from './EntitiesCard'
import { SummaryCard } from './SummaryCard'
import { InsightsCard } from './InsightsCard'
import { HumanizedCard } from './HumanizedCard'
import type { AnalysisResult as AnalysisResultType } from '../_types'

interface AnalysisResultProps {
  result: AnalysisResultType
  originalLength: number
}

export function AnalysisResult({ result, originalLength }: AnalysisResultProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SentimentCard
          sentiment={result.sentiment}
          detectedLanguage={result.detectedLanguage}
        />
        <EntitiesCard entities={result.entities} />
      </div>
      <SummaryCard summary={result.summary} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InsightsCard insights={result.insights} />
        <HumanizedCard humanizedText={result.humanizedText} originalLength={originalLength} />
      </div>
    </div>
  )
}
