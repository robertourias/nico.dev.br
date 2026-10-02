'use client'

import { useState, useEffect, useCallback } from 'react'

interface ExchangeRateResponse {
  rate: number
  from: string
  to: string
  timestamp: string
}

interface ConverterState {
  from: string
  to: string
  amount: string
  rate: number | null
  result: number | null
  loading: boolean
  error: string | null
}

interface ConverterActions {
  setFrom: (code: string) => void
  setTo: (code: string) => void
  setAmount: (value: string) => void
  swap: () => void
}

export function useCurrencyConverter(): ConverterState & ConverterActions {
  const [from, setFromState] = useState('USD')
  const [to, setToState] = useState('BRL')
  const [amount, setAmount] = useState('1')
  const [fetchedRate, setFetchedRate] = useState<number | null>(null)
  const [settledKey, setSettledKey] = useState<string | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const sameCurrency = from === to
  const requestKey = `${from}|${to}`
  const rate = sameCurrency ? 1 : fetchedRate
  const loading = !sameCurrency && settledKey !== requestKey
  const error = sameCurrency || loading ? null : fetchError

  useEffect(() => {
    if (from === to) return
    let cancelled = false
    fetch(`/api/exchange-rate?from=${from}&to=${to}`)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar cotação')
        return res.json() as Promise<ExchangeRateResponse>
      })
      .then(data => {
        if (cancelled) return
        setFetchedRate(data.rate)
        setFetchError(null)
        setSettledKey(requestKey)
      })
      .catch(() => {
        if (cancelled) return
        setFetchedRate(null)
        setFetchError('Não foi possível buscar a cotação. Tente novamente.')
        setSettledKey(requestKey)
      })
    return () => { cancelled = true }
  }, [from, to, requestKey])

  const result = rate !== null && amount !== '' ? parseFloat(amount) * rate : null

  const setFrom = useCallback((code: string) => {
    setFromState(code)
  }, [])

  const setTo = useCallback((code: string) => {
    setToState(code)
  }, [])

  const swap = useCallback(() => {
    const nextFrom = to
    const nextTo = from
    setFromState(nextFrom)
    setToState(nextTo)
  }, [from, to])

  return { from, to, amount, rate, result, loading, error, setFrom, setTo, setAmount, swap }
}
