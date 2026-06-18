"use client"

import { useSyncExternalStore } from "react"
import { getLaunchDate } from "../_lib/launch"

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
// (contrato do useSyncExternalStore) — usar `computeTimeLeft()` direto como
// getSnapshot aloca um objeto novo a cada chamada, o que faz o React achar
// que o snapshot "mudou" a cada verificação e disparar o aviso/loop
// infinito ("The result of getSnapshot should be cached"). Por isso
// cacheamos o último snapshot em módulo e só criamos um novo objeto quando
// os segundos restantes de fato mudam.
let cachedSnapshot: TimeLeft = ZERO
let cachedTotalSeconds = -1

function getSnapshot(): TimeLeft {
  const diff = getLaunchDate().getTime() - Date.now()
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
  { key: "minutes", label: "Minutos" },
  { key: "seconds", label: "Segundos" },
]

// Assina o "relógio" como uma store externa (useSyncExternalStore) em vez de
// chamar setState dentro de um efeito — evita o render em cascata logo após
// o mount e mantém o valor sempre derivado de `Date.now()` (nunca decrementa
// um contador local, então não dessincroniza do horário real do
// dispositivo). `getServerSnapshot` devolve zero para casar com o HTML
// gerado no servidor e não causar mismatch de hidratação.
function subscribe(onStoreChange: () => void) {
  const interval = setInterval(onStoreChange, 1000)
  return () => clearInterval(interval)
}

function getServerSnapshot(): TimeLeft {
  return ZERO
}

// Countdown em tempo real até `LAUNCH_DATE_ISO`.
export function CountdownTimer({ className }: { className?: string }) {
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return (
    <div
      className={`inline-flex items-center gap-2 sm:gap-3 rounded-2xl apice-glass apice-pulse-glow px-3 sm:px-5 py-4 ${className ?? ""}`}
      role="timer"
      aria-live="polite"
      aria-label="Contagem regressiva para o lançamento"
    >
      {UNITS.map((unit, i) => (
        <div key={unit.key} className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col items-center min-w-[3rem] sm:min-w-[3.75rem]">
            <span
              className="text-2xl sm:text-4xl font-bold tabular-nums bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--apice-gradient-primary)" }}
            >
              {String(value[unit.key]).padStart(2, "0")}
            </span>
            <span className="text-[0.65rem] sm:text-xs uppercase tracking-wider text-[var(--apice-fg-muted)] mt-1">
              {unit.label}
            </span>
          </div>
          {i < UNITS.length - 1 && (
            <span className="text-xl sm:text-2xl text-[var(--apice-fg-faint)] -mt-4 sm:-mt-5" aria-hidden="true">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
