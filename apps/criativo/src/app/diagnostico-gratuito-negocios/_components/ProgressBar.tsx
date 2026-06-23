interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = Math.round((current / total) * 100)

  return (
    <div>
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-2">
        <span>
          Pergunta {current} de {total}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="diag-progress-track">
        <div className="diag-progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
