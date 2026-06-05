'use client'

import { useEffect, useRef } from 'react'
import { MessageSquare, Bot, Loader2, SendHorizontal } from 'lucide-react'
import { Input, Button } from '@ui'
import { Skeleton } from '@ui'
import type { QAEntry } from '../_types'

interface QASectionProps {
  entries: QAEntry[]
  question: string
  onQuestionChange: (q: string) => void
  onSubmit: () => void
  isAsking: boolean
  canAsk: boolean
}

export function QASection({
  entries,
  question,
  onQuestionChange,
  onSubmit,
  isAsking,
  canAsk,
}: QASectionProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (entries.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [entries])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && canAsk) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-foreground">Perguntas sobre o documento</h2>

      {entries.length > 0 && (
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4">
          {entries.map((entry, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex gap-2 items-start">
                <MessageSquare className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  {entry.question}
                </p>
              </div>
              <div className="flex gap-2 items-start pl-1">
                <Bot className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                {entry.isLoading ? (
                  <Skeleton className="h-4 w-48 mt-0.5" />
                ) : (
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {entry.answer}
                  </p>
                )}
              </div>
              {i < entries.length - 1 && <hr className="border-border mt-2" />}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Faça uma pergunta sobre o documento..."
          disabled={isAsking}
          className="flex-1"
        />
        <Button onClick={onSubmit} disabled={!canAsk} size="sm" className="shrink-0">
          {isAsking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendHorizontal className="h-4 w-4" />
          )}
          <span className="ml-1.5 hidden sm:inline">Perguntar</span>
        </Button>
      </div>
    </div>
  )
}
