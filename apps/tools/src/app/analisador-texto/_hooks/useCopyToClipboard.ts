'use client'

import { useState, useCallback } from 'react'

export function useCopyToClipboard(timeoutMs = 2000) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), timeoutMs)
      } catch {
        // clipboard API not available
      }
    },
    [timeoutMs]
  )

  return { copied, copy }
}
