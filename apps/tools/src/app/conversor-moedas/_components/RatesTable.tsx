import type { CurrencyRate } from '@/lib/currency-data'
import { formatBRL, formatUSD, formatChange } from '@/lib/currency-format'

interface RatesTableProps {
  rates: CurrencyRate[]
}

export function RatesTable({ rates }: RatesTableProps) {
  if (rates.length === 0) return null

  const fiat   = rates.filter(r => r.type === 'fiat')
  const crypto = rates.filter(r => r.type === 'crypto')

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Moeda</th>
            <th className="text-right px-4 py-3 font-medium text-muted-foreground">Valor em BRL</th>
            <th className="text-right px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
              Valor em USD
            </th>
            <th className="text-right px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
              Variação 24h
            </th>
          </tr>
        </thead>
        <tbody>
          <SectionLabel label="Moedas Fiat" colSpan={4} />
          {fiat.map((rate, i) => (
            <RateRow key={rate.code} rate={rate} isLast={i === fiat.length - 1} />
          ))}
          <SectionLabel label="Criptomoedas" colSpan={4} />
          {crypto.map((rate, i) => (
            <RateRow key={rate.code} rate={rate} isLast={i === crypto.length - 1} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SectionLabel({ label, colSpan }: { label: string; colSpan: number }) {
  return (
    <tr className="border-b border-border/50 bg-muted/20">
      <td colSpan={colSpan} className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </td>
    </tr>
  )
}

function RateRow({ rate, isLast }: { rate: CurrencyRate; isLast: boolean }) {
  const positive = rate.change24h >= 0
  const changeClass = positive ? 'text-green-500' : 'text-red-500'

  return (
    <tr className={`hover:bg-muted/30 transition-colors ${isLast ? '' : 'border-b border-border/40'}`}>
      <td className="px-4 py-3">
        <span className="font-mono font-semibold text-foreground">{rate.code}</span>
        <span className="ml-2 text-muted-foreground hidden sm:inline">{rate.name}</span>
      </td>
      <td className="px-4 py-3 text-right font-mono text-foreground">
        {formatBRL(rate.rateInBRL)}
      </td>
      <td className="px-4 py-3 text-right font-mono text-foreground hidden sm:table-cell">
        {formatUSD(rate.rateInUSD)}
      </td>
      <td className={`px-4 py-3 text-right font-mono hidden md:table-cell ${changeClass}`}>
        {formatChange(rate.change24h)}
      </td>
    </tr>
  )
}
