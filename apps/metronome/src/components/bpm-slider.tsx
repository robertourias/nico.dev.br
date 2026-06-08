"use client";

import { useCallback, useRef } from "react";

interface BpmSliderProps {
  bpm: number;
  onChange: (bpm: number) => void;
}

const MIN = 20;
const MAX = 300;
const HOLD_DELAY_MS = 400;
const HOLD_INTERVAL_MS = 80;

export function BpmSlider({ bpm, onChange }: BpmSliderProps) {
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fillPercent = ((bpm - MIN) / (MAX - MIN)) * 100;

  const startHold = useCallback(
    (delta: number) => {
      holdTimerRef.current = setTimeout(() => {
        holdIntervalRef.current = setInterval(() => {
          onChange(Math.max(MIN, Math.min(MAX, bpm + delta)));
        }, HOLD_INTERVAL_MS);
      }, HOLD_DELAY_MS);
    },
    [bpm, onChange]
  );

  const stopHold = useCallback(() => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
  }, []);

  const handleStep = useCallback(
    (delta: number) => {
      onChange(Math.max(MIN, Math.min(MAX, bpm + delta)));
    },
    [bpm, onChange]
  );

  return (
    <div className="flex items-center gap-3 w-full absolute top-24">
      {/* Minus button */}
      <button
        aria-label="Diminuir BPM"
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors cursor-pointer"
        onMouseDown={() => { handleStep(-1); startHold(-1); }}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={(e) => { e.preventDefault(); handleStep(-1); startHold(-1); }}
        onTouchEnd={stopHold}
      >
        <span className="text-lg leading-none select-none">−</span>
      </button>

      {/* Slider */}
      <input
        type="range"
        min={MIN}
        max={MAX}
        value={bpm}
        aria-label="BPM"
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-2 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-[var(--primary)]
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:shadow-sm
          [&::-moz-range-thumb]:w-5
          [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-[var(--primary)]
          [&::-moz-range-thumb]:border-0
          [&::-moz-range-thumb]:cursor-pointer"
        style={{
          background: `linear-gradient(to right, var(--primary) ${fillPercent}%, var(--border) ${fillPercent}%)`,
        }}
      />

      {/* Plus button */}
      <button
        aria-label="Aumentar BPM"
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors cursor-pointer"
        onMouseDown={() => { handleStep(1); startHold(1); }}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={(e) => { e.preventDefault(); handleStep(1); startHold(1); }}
        onTouchEnd={stopHold}
      >
        <span className="text-lg leading-none select-none">+</span>
      </button>
    </div>
  );
}
