const BASE_URL = 'https://api.frankfurter.app'

interface FrankfurterLatestResponse {
  rates: Record<string, number>
  base: string
  date: string
}

interface FrankfurterHistoryResponse {
  rates: Record<string, Record<string, number>>
  base: string
  start_date: string
  end_date: string
}

export async function fetchFrankfurterRate(from: string, to: string): Promise<number> {
  const res = await fetch(`${BASE_URL}/latest?from=${from}&to=${to}`, {
    next: { revalidate: 300 },
  })
  if (!res.ok) throw new Error(`Frankfurter error ${res.status}: ${from}→${to}`)
  const data: FrankfurterLatestResponse = await res.json()
  const rate = data.rates[to]
  if (rate === undefined) throw new Error(`Rate not found for ${to}`)
  return rate
}

export async function fetchFrankfurterRates(
  from: string,
  targets: string[],
): Promise<Record<string, number>> {
  const res = await fetch(`${BASE_URL}/latest?from=${from}&to=${targets.join(',')}`, {
    next: { revalidate: 300 },
  })
  if (!res.ok) throw new Error(`Frankfurter rates error ${res.status}`)
  const data: FrankfurterLatestResponse = await res.json()
  return data.rates
}

export async function fetchFrankfurterRatesOnDate(
  date: string,
  from: string,
  targets: string[],
): Promise<Record<string, number>> {
  const res = await fetch(`${BASE_URL}/${date}?from=${from}&to=${targets.join(',')}`, {
    next: { revalidate: 300 },
  })
  if (!res.ok) return {}
  const data: FrankfurterLatestResponse = await res.json()
  return data.rates ?? {}
}

export async function fetchFrankfurterHistory(
  from: string,
  to: string,
  days = 365,
): Promise<{ labels: string[]; values: number[] }> {
  const end = toDateString(new Date())
  const start = toDateString(daysAgo(days))
  const res = await fetch(`${BASE_URL}/${start}..${end}?from=${from}&to=${to}`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`Frankfurter history error ${res.status}`)
  const data: FrankfurterHistoryResponse = await res.json()
  const entries = Object.entries(data.rates)
    .sort(([a], [b]) => a.localeCompare(b))
    .filter(([, rates]) => rates[to] !== undefined)
  return {
    labels: entries.map(([date]) => date),
    values: entries.map(([, rates]) => rates[to]),
  }
}

function toDateString(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function daysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}
