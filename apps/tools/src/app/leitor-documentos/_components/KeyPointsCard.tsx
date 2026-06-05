'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@ui'
import { Button } from '@ui'
import { Copy, Check } from 'lucide-react'
import { useCopyToClipboard } from '@/app/analisador-texto/_hooks/useCopyToClipboard'

interface KeyPointsCardProps {
  keyPoints: string[]
}

export function KeyPointsCard({ keyPoints }: KeyPointsCardProps) {
  const { copied, copy } = useCopyToClipboard()

  function copyAll() {
    copy(keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n'))
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            Pontos-chave{' '}
            <span className="font-normal text-muted-foreground">({keyPoints.length})</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={copyAll} className="h-8 gap-1.5">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="text-xs">{copied ? 'Copiado!' : 'Copiar'}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2">
          {keyPoints.map((point, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
              <span className="text-foreground font-medium shrink-0">{i + 1}.</span>
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
