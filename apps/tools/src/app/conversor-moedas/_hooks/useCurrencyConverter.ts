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
  const [rate, setRate] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRate = useCallback(async (fromCode: string, toCode: string) => {
    if (fromCode === toCode) {
      setRate(1)
      setError(null)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/exchange-rate?from=${fromCode}&to=${toCode}`)
      if (!res.ok) throw new Error('Erro ao buscar cotação')
      const data: ExchangeRateResponse = await res.json()
      setRate(data.rate)
    } catch {
      setError('Não foi possível buscar a cotação. Tente novamente.')
      setRate(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRate(from, to)
  }, [from, to, fetchRate])

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
