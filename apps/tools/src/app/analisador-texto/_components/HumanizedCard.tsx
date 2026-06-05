'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@ui'
import { Button } from '@ui'
import { Copy, Check } from 'lucide-react'
import { useCopyToClipboard } from '../_hooks/useCopyToClipboard'

interface HumanizedCardProps {
  humanizedText: string
  originalLength: number
}

export function HumanizedCard({ humanizedText, originalLength }: HumanizedCardProps) {
  const { copied, copy } = useCopyToClipboard()
  const diff = humanizedText.length - originalLength
  const diffStr = diff > 0 ? `+${diff}` : String(diff)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Texto Humanizado</CardTitle>
            <span className="text-xs text-muted-foreground">
              {humanizedText.length} chars ({diffStr})
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copy(humanizedText)}
            className="h-8 gap-1.5"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="text-xs">{copied ? 'Copiado!' : 'Copiar'}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {humanizedText}
        </p>
      </CardContent>
    </Card>
  )
}
