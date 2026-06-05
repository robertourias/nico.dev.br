'use client'

import { useEffect, useState } from 'react'
import { FileText, FileCode, X } from 'lucide-react'
import { Button } from '@ui'
import { getMimeType } from '../_types'

interface FilePreviewProps {
  file: File
  onRemove: () => void
  isAnalyzing: boolean
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FilePreview({ file, onRemove, isAnalyzing }: FilePreviewProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const mimeType = getMimeType(file)
  const isImage = mimeType.startsWith('image/')

  useEffect(() => {
    if (!isImage) return
    const url = URL.createObjectURL(file)
    setThumbnailUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file, isImage])

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
      {isImage && thumbnailUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnailUrl}
          alt={file.name}
          className="h-10 w-10 rounded object-cover shrink-0"
        />
      ) : mimeType === 'application/pdf' ? (
        <FileText className="h-8 w-8 text-muted-foreground shrink-0" />
      ) : (
        <FileCode className="h-8 w-8 text-muted-foreground shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        disabled={isAnalyzing}
        className="h-8 w-8 p-0 shrink-0"
        aria-label="Remover arquivo"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
