const LARGE_DECIMAL_CODES = ['BTC', 'ETH']

export function formatRate(value: number, toCurrency: string): string {
  const decimals = LARGE_DECIMAL_CODES.includes(toCurrency) ? 8 : toCurrency === 'JPY' ? 0 : 4
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  })
}

export function formatBRL(value: number): string {
  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} M`
  }
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatUSD(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  }
  if (value >= 1) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 4, maximumFractionDigits: 6 })
}

export function formatChange(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function formatChartDate(dateStr: string): string {
  // dateStr is YYYY-MM-DD — append time to prevent UTC offset shifting day
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
}

export function formatTooltipDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
