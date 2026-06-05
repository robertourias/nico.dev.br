'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@ui'
import { Button } from '@ui'
import { Copy, Check } from 'lucide-react'
import { useCopyToClipboard } from '../_hooks/useCopyToClipboard'

interface SummaryCardProps {
  summary: string
}

export function SummaryCard({ summary }: SummaryCardProps) {
  const { copied, copy } = useCopyToClipboard()

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Resumo</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => copy(summary)} className="h-8 gap-1.5">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="text-xs">{copied ? 'Copiado!' : 'Copiar'}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
      </CardContent>
    </Card>
  )
}
