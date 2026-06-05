'use client'

import { Button } from '@ui'

interface QuantitySelectorProps {
  value: 3 | 5 | 7 | 10
  onChange: (count: 3 | 5 | 7 | 10) => void
  disabled?: boolean
}

const QUANTITIES = [3, 5, 7, 10] as const

export function QuantitySelector({
  value,
  onChange,
  disabled = false,
}: QuantitySelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium">Quantidade de Cores</label>
      <div className="flex gap-2 flex-wrap">
        {QUANTITIES.map((qty) => (
          <Button
            key={qty}
            onClick={() => onChange(qty as 3 | 5 | 7 | 10)}
            variant={value === qty ? 'default' : 'outline'}
            disabled={disabled}
          >
            {qty}
          </Button>
        ))}
      </div>
    </div>
  )
}
