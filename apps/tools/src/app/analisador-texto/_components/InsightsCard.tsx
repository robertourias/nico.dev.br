'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@ui'
import { Button } from '@ui'
import { Copy, Check } from 'lucide-react'
import { useCopyToClipboard } from '../_hooks/useCopyToClipboard'

interface InsightsCardProps {
  insights: string[]
}

export function InsightsCard({ insights }: InsightsCardProps) {
  const { copied, copy } = useCopyToClipboard()

  function copyAll() {
    copy(insights.map((item, i) => `${i + 1}. ${item}`).join('\n'))
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            Insights{' '}
            <span className="font-normal text-muted-foreground">({insights.length})</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={copyAll} className="h-8 gap-1.5">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="text-xs">{copied ? 'Copiado!' : 'Copiar'}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2">
          {insights.map((insight, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
              <span className="text-foreground font-medium shrink-0">{i + 1}.</span>
              <span className="leading-relaxed">{insight}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
