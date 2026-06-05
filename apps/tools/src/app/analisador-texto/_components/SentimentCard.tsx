import { Card, CardContent, CardHeader, CardTitle } from '@ui'
import { Badge } from '@ui'
import type { AnalysisResult } from '../_types'

interface SentimentCardProps {
  sentiment: AnalysisResult['sentiment']
  detectedLanguage: string
}

const SENTIMENT_COLOR = {
  Positivo: 'bg-green-500',
  Neutro: 'bg-muted-foreground',
  Negativo: 'bg-red-500',
} as const

const SENTIMENT_LABEL_COLOR = {
  Positivo: 'text-green-500',
  Neutro: 'text-muted-foreground',
  Negativo: 'text-red-500',
} as const

export function SentimentCard({ sentiment, detectedLanguage }: SentimentCardProps) {
  const barColor = SENTIMENT_COLOR[sentiment.label]
  const labelColor = SENTIMENT_LABEL_COLOR[sentiment.label]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Sentimento</CardTitle>
          <Badge className="text-xs uppercase">
            {detectedLanguage}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className={`text-2xl font-bold ${labelColor}`}>{sentiment.label}</p>
        <div className="flex flex-col gap-1">
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${barColor}`}
              style={{ width: `${sentiment.score}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-right">
            Score: {sentiment.score}/100
          </p>
        </div>
        <p className="text-sm text-muted-foreground">{sentiment.explanation}</p>
      </CardContent>
    </Card>
  )
}
