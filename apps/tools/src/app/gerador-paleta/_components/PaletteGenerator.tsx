'use client'

import { Skeleton } from '@ui'
import { Button } from '@ui'
import { Loader2 } from 'lucide-react'
import { usePaletteGenerator } from '../_hooks/usePaletteGenerator'
import { ColorInput } from './ColorInput'
import { HarmonySelector } from './HarmonySelector'
import { QuantitySelector } from './QuantitySelector'
import { PaletteGrid } from './PaletteGrid'
import { ExportSection } from './ExportSection'

function PaletteSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-12 rounded-lg" />
    </div>
  )
}

export function PaletteGenerator() {
  const {
    baseColor,
    setBaseColor,
    harmonyType,
    setHarmonyType,
    count,
    setCount,
    result,
    error,
    isLoading,
    canGenerate,
    generate,
    reset,
    copyColor,
  } = usePaletteGenerator()

  async function handleCopyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 p-6 rounded-lg border border-input bg-muted/30">
        <ColorInput value={baseColor} onChange={setBaseColor} disabled={isLoading} />
        <HarmonySelector value={harmonyType} onChange={setHarmonyType} disabled={isLoading} />
        <QuantitySelector value={count} onChange={setCount} disabled={isLoading} />

        <div className="flex gap-2 pt-2">
          <Button onClick={generate} disabled={!canGenerate} className="flex-1">
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isLoading ? 'Gerando...' : 'Gerar Paleta'}
          </Button>
          {result && (
            <Button onClick={reset} variant="outline">
              Limpar
            </Button>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {isLoading && <PaletteSkeleton />}

      {result && !isLoading && (
        <div className="flex flex-col gap-8">
          <PaletteGrid colors={result.colors} onCopyColor={copyColor} />
          <ExportSection colors={result.colors} onCopyToClipboard={handleCopyToClipboard} />
        </div>
      )}
    </div>
  )
}
