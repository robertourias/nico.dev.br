'use client'

interface ColorInputProps {
  value: string
  onChange: (color: string) => void
  disabled?: boolean
}

export function ColorInput({ value, onChange, disabled = false }: ColorInputProps) {
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="color-input" className="text-sm font-medium">
        Cor Base
      </label>
      <div className="flex gap-3 items-center">
        <input
          id="color-input"
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-16 h-16 rounded-lg cursor-pointer border border-input disabled:opacity-50"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#FF5733"
          disabled={disabled}
          className="flex-1 px-3 py-2 rounded-lg border border-input text-sm font-mono disabled:opacity-50"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Aceita #HEX, rgb(r,g,b) ou hsl(h,s%,l%)
      </p>
    </div>
  )
}
