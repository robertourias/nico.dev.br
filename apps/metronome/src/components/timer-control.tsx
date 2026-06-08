"use client";

import { Input, Label, Switch } from "@nico.dev/ui";
import { useEffect, useState } from "react";

interface TimerControlProps {
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
  totalSeconds: number;
  onTotalSecondsChange: (s: number) => void;
  remainingSeconds: number;
  isPlaying: boolean;
}

const TIMER_PRESETS = [
  { label: "1m", seconds: 60 },
  { label: "3m", seconds: 180 },
  { label: "5m", seconds: 300 },
  { label: "10m", seconds: 600 },
  { label: "15m", seconds: 900 },
] as const;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function parseTime(value: string): number | null {
  const match = value.match(/^(\d+):([0-5]\d)$/);
  if (!match) return null;
  return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
}

export function TimerControl({
  enabled,
  onEnabledChange,
  totalSeconds,
  onTotalSecondsChange,
  remainingSeconds,
  isPlaying,
}: TimerControlProps) {
  const [draft, setDraft] = useState(formatTime(totalSeconds));

  useEffect(() => {
    setDraft(formatTime(totalSeconds));
  }, [totalSeconds]);

  const commitDraft = () => {
    const parsed = parseTime(draft);
    if (parsed !== null && parsed > 0) {
      onTotalSecondsChange(parsed);
    } else {
      setDraft(formatTime(totalSeconds));
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label htmlFor="timer" className="cursor-pointer select-none">
            Timer
          </Label>
        </div>

        <div className="flex items-center gap-3">
          {enabled && (
            <div className="text-sm tabular-nums font-medium">
              {isPlaying ? (
                <span
                  className={
                    remainingSeconds <= 10 ? "text-destructive" : "text-foreground"
                  }
                >
                  {formatTime(remainingSeconds)}
                </span>
              ) : (
                <Input
                  className="w-20 h-7 text-center text-sm px-2"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={commitDraft}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                  }}
                  aria-label="Duração do timer"
                />
              )}
            </div>
          )}
          <Switch
            id="timer"
            checked={enabled}
            onCheckedChange={(v) => onEnabledChange(v === true)}
          />
        </div>
      </div>

      {enabled && !isPlaying && (
        <div
          className="grid grid-cols-5 gap-2"
          role="group"
          aria-label="Durações rápidas"
        >
          {TIMER_PRESETS.map(({ label, seconds }) => {
            const active = totalSeconds === seconds;
            return (
              <button
                key={seconds}
                onClick={() => onTotalSecondsChange(seconds)}
                aria-pressed={active}
                aria-label={`${label} minutos`}
                className={[
                  "h-10 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-surface-raised hover:text-foreground",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
