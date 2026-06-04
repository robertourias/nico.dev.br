"use client"

import { Card, CardContent, Skeleton } from "@ui"
import { formatBRL, type CompoundInterestResult } from "@/lib/compound-interest"

interface ResultSummaryProps {
  result: CompoundInterestResult | null
}

export function ResultSummary({ result }: ResultSummaryProps) {
  if (!result) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-5 pb-5 space-y-2">
              <Skeleton variant="line-short" className="w-24" />
              <Skeleton variant="line" className="h-8 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      label: "Montante final",
      value: formatBRL(result.finalAmount),
      sub: null,
      highlight: false,
    },
    {
      label: "Capital investido",
      value: formatBRL(result.totalInvested),
      sub: "Principal + aportes",
      highlight: false,
    },
    {
      label: "Juros acumulados",
      value: formatBRL(result.totalInterest),
      sub: `${result.interestPercentage.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% do capital`,
      highlight: true,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="pt-5 pb-5">
            <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
            <p
              className={`text-2xl font-bold font-mono tabular-nums ${
                card.highlight ? "text-primary" : "text-foreground"
              }`}
            >
              {card.value}
            </p>
            {card.sub && (
              <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
