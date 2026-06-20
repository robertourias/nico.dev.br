"use client"

import { useSyncExternalStore } from "react"
import { getRegistrationDeadline } from "../_lib/event"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const ZERO: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 }

function computeFromTotalSeconds(totalSeconds: number): TimeLeft {
  if (totalSeconds <= 0) return ZERO

  return {
    days: Math.floor(totalSeconds / (60 * 60 * 24)),
    hours: Math.floor((totalSeconds / (60 * 60)) % 24),
    minutes: Math.floor((totalSeconds / 60) % 60),
    seconds: Math.floor(totalSeconds % 60),
  }
}

// `getSnapshot` precisa devolver uma referência estável entre chamadas
// (contrato do useSyncExternalStore) — por isso cacheamos o último snapshot
// em módulo e só criamos um objeto novo quando os segundos restantes mudam de
// fato. Mesmo padrão de `pre-venda-metodo-apice/CountdownTimer.tsx`.
let cachedSnapshot: TimeLeft = ZERO
let cachedTotalSeconds = -1

function getSnapshot(): TimeLeft {
  const diff = getRegistrationDeadline().getTime() - Date.now()
  const totalSeconds = diff <= 0 ? 0 : Math.floor(diff / 1000)

  if (totalSeconds !== cachedTotalSeconds) {
    cachedTotalSeconds = totalSeconds
    cachedSnapshot = computeFromTotalSeconds(totalSeconds)
  }

  return cachedSnapshot
}

const UNITS: { key: keyof TimeLeft; label: string }[] = [
  { key: "days", label: "Dias" },
  { key: "hours", label: "Horas" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Seg" },
]

function subscribe(onStoreChange: () => void) {
  const interval = setInterval(onStoreChange, 1000)
  return () => clearInterval(interval)
}

function getServerSnapshot(): TimeLeft {
  return ZERO
}

// Countdown em tempo real até o fechamento das inscrições. Deriva sempre de
// `Date.now()` via useSyncExternalStore (nunca decrementa um contador local),
// então não dessincroniza do horário real do dispositivo.
export function CountdownTimer({ className }: { className?: string }) {
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return (
    <div
      className={`inline-flex items-center gap-2 sm:gap-3 rounded-2xl nexus-glass nexus-glow px-3 sm:px-5 py-4 ${className ?? ""}`}
      role="timer"
      aria-live="polite"
      aria-label="Contagem regressiva para o encerramento das inscrições"
    >
      {UNITS.map((unit, i) => (
        <div key={unit.key} className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col items-center min-w-[2.75rem] sm:min-w-[3.5rem]">
            <span
              className="text-2xl sm:text-4xl font-bold tabular-nums bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--nexus-gradient-primary)" }}
            >
              {String(value[unit.key]).padStart(2, "0")}
            </span>
            <span className="text-[0.65rem] sm:text-xs uppercase tracking-wider text-[var(--nexus-fg-faint)] mt-1">
              {unit.label}
            </span>
          </div>
          {i < UNITS.length - 1 && (
            <span className="text-xl sm:text-2xl text-[var(--nexus-fg-faint)] -mt-4 sm:-mt-5" aria-hidden="true">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
