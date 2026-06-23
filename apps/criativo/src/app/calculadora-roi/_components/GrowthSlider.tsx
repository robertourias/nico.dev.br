"use client"

import { useId } from "react"

interface GrowthSliderProps {
  value: number
  onChange: (value: number) => void
}

// Slider de crescimento esperado de receita (0% a 100%) — usa o range nativo
// estilizado via `.roi-range` em theme.css, mesmo padrão das demais landings.
export function GrowthSlider({ value, onChange }: GrowthSliderProps) {
  const id = useId()

  return (
    <div>
      <label htmlFor={id} className="flex items-center justify-between text-sm font-medium text-foreground mb-2">
        Crescimento Esperado
        <span className="text-sm font-semibold text-primary tabular-nums">{value}%</span>
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="roi-range"
        aria-label="Crescimento esperado de receita em percentual"
      />
      <div className="flex items-center justify-between text-[0.65rem] text-muted-foreground mt-1.5">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  )
}
