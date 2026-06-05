'use client'

import { Textarea } from '@ui'
import { Button } from '@ui'
import { Loader2, Trash2 } from 'lucide-react'

const MAX_LENGTH = 5_000

interface TextInputProps {
  value: string
  onChange: (text: string) => void
  onSubmit: () => void
  isLoading: boolean
  hasResult: boolean
  onReset: () => void
}

export function TextInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  hasResult,
  onReset,
}: TextInputProps) {
  const isOverLimit = value.length > MAX_LENGTH
  const canSubmit = value.trim().length > 0 && !isOverLimit && !isLoading

  return (
    <div className="flex flex-col gap-3">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cole seu texto aqui para análise..."
        className="min-h-[160px] resize-y"
        disabled={isLoading}
      />
      <div className="flex items-center justify-between gap-3">
        <span
          className={`text-xs tabular-nums ${
            isOverLimit ? 'text-destructive font-medium' : 'text-muted-foreground'
          }`}
        >
          {value.length.toLocaleString('pt-BR')} / {MAX_LENGTH.toLocaleString('pt-BR')}
        </span>
        <div className="flex gap-2">
          {hasResult && (
            <Button variant="outline" size="sm" onClick={onReset} disabled={isLoading}>
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Limpar
            </Button>
          )}
          <Button onClick={onSubmit} disabled={!canSubmit} size="sm">
            {isLoading && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
            {isLoading ? 'Analisando...' : 'Analisar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
