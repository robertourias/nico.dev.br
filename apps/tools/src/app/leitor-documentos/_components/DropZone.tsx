'use client'

import { useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { cn } from '@ui'

interface DropZoneProps {
  onFileSelect: (file: File) => void
  isDisabled?: boolean
  error?: string | null
}

export function DropZone({ onFileSelect, isDisabled, error }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    if (!isDisabled) setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    if (isDisabled) return
    const dropped = e.dataTransfer.files[0]
    if (dropped) onFileSelect(dropped)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (selected) onFileSelect(selected)
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={isDisabled}
        className={cn(
          'w-full rounded-xl border-2 border-dashed transition-colors px-6 py-12 flex flex-col items-center gap-3',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent/30'
        )}
      >
        <UploadCloud className="h-10 w-10 text-muted-foreground" />
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            Arraste um documento ou clique para selecionar
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PDF, JPG, PNG, WebP, TXT, MD — máx. 5 MB
          </p>
        </div>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp,.txt,.md"
        className="hidden"
        onChange={handleChange}
        disabled={isDisabled}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
