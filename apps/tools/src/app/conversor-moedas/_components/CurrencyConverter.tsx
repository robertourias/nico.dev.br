'use client'

import dynamic from 'next/dynamic'
import { ArrowLeftRight, Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Input,
} from '@ui'
import { FIAT_CURRENCIES, CRYPTO_CURRENCIES } from '@/lib/currency-data'
import { formatRate } from '@/lib/currency-format'
import { useCurrencyConverter } from '../_hooks/useCurrencyConverter'

// recharts is browser-only
const ExchangeChart = dynamic(
  () => import('./ExchangeChart').then(m => ({ default: m.ExchangeChart })),
  { ssr: false },
)

export function CurrencyConverter() {
  const { from, to, amount, rate, result, loading, error, setFrom, setTo, setAmount, swap } =
    useCurrencyConverter()

  const resultDisplay =
    result !== null && !isNaN(result) ? formatRate(result, to) : '—'

  return (
    <div className="flex flex-col gap-8">
      {/* Converter card */}
      <div className="rounded-xl border border-border bg-surface p-6 flex flex-col gap-6">
        {/* Pair selectors + amount/result */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          {/* FROM */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              De
            </label>
            <CurrencySelect value={from} onChange={setFrom} exclude={to} />
            <Input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0"
              className="font-mono text-lg h-11"
            />
          </div>

          {/* Swap button */}
          <div className="flex justify-center pb-[2px] sm:pb-0 sm:items-end sm:h-[calc(100%-1.5rem-0.5rem)] sm:self-end">
            <button
              onClick={swap}
              aria-label="Inverter par"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-surface hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>
          </div>

          {/* TO */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Para
            </label>
            <CurrencySelect value={to} onChange={setTo} exclude={from} />
            <div className="flex h-11 w-full items-center rounded-lg border border-input bg-muted/30 px-3 font-mono text-lg text-foreground">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <span>{resultDisplay}</span>
              )}
            </div>
          </div>
        </div>

        {/* Current rate display */}
        <div className="text-sm text-muted-foreground">
          {loading ? (
            <span>Buscando cotação...</span>
          ) : error ? (
            <span className="text-red-500">{error}</span>
          ) : rate !== null ? (
            <span>
              1 {from} ={' '}
              <span className="font-mono text-foreground font-medium">
                {formatRate(rate, to)}
              </span>{' '}
              {to}
            </span>
          ) : null}
        </div>
      </div>

      {/* Historical chart */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <ExchangeChart from={from} to={to} />
      </div>
    </div>
  )
}

interface CurrencySelectProps {
  value: string
  onChange: (code: string) => void
  exclude: string
}

function CurrencySelect({ value, onChange, exclude }: CurrencySelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-11">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Moedas Fiat</SelectLabel>
          {FIAT_CURRENCIES.filter(c => c.code !== exclude).map(c => (
            <SelectItem key={c.code} value={c.code}>
              <span className="font-mono font-semibold">{c.code}</span>
              <span className="ml-2 text-muted-foreground">{c.name}</span>
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Criptomoedas</SelectLabel>
          {CRYPTO_CURRENCIES.filter(c => c.code !== exclude).map(c => (
            <SelectItem key={c.code} value={c.code}>
              <span className="font-mono font-semibold">{c.code}</span>
              <span className="ml-2 text-muted-foreground">{c.name}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
