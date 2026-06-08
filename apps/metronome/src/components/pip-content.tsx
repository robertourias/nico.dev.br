"use client";

import { Play, Square } from "lucide-react";
import { PRESETS } from "@/components/bpm-presets";
import { SOUNDS, type SoundId } from "@/lib/sounds";

interface PipContentProps {
  bpm: number;
  isPlaying: boolean;
  timerEnabled: boolean;
  timerRemaining: number;
  beats: number;
  currentBeat: number;
  stressFirstBeat: boolean;
  sound: SoundId;
  onToggle: () => void;
  onBpmChange: (bpm: number) => void;
  onSoundChange: (id: SoundId) => void;
  onPreviewSound: (id: SoundId) => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function PipContent({
  bpm,
  isPlaying,
  timerEnabled,
  timerRemaining,
  beats,
  currentBeat,
  stressFirstBeat,
  sound,
  onToggle,
  onBpmChange,
  onSoundChange,
  onPreviewSound,
}: PipContentProps) {
  const adjustBpm = (delta: number) => {
    onBpmChange(Math.max(20, Math.min(300, bpm + delta)));
  };

  return (
    <div className="flex flex-col gap-6 p-4 bg-background text-foreground min-h-screen">
      {/* BPM control */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => adjustBpm(-5)}
          aria-label="Diminuir BPM"
          className="w-9 h-9 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
        >
          <span className="text-base leading-none select-none">−</span>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold tabular-nums leading-none">{bpm}</span>
          <span className="text-xs text-muted-foreground mt-0.5">BPM</span>
        </div>
        <button
          onClick={() => adjustBpm(5)}
          aria-label="Aumentar BPM"
          className="w-9 h-9 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
        >
          <span className="text-base leading-none select-none">+</span>
        </button>
      </div>

      {/* BPM presets */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {PRESETS.map((preset) => {
          const active = bpm === preset;
          return (
            <button
              key={preset}
              onClick={() => onBpmChange(preset)}
              aria-pressed={active}
              aria-label={`${preset} BPM`}
              className={[
                "h-8 px-2.5 rounded-full text-xs font-medium transition-colors cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-surface-raised hover:text-foreground",
              ].join(" ")}
            >
              {preset}
            </button>
          );
        })}
      </div>

      {/* Beat indicators */}
      <div className="flex items-center justify-center gap-1.5">
        {Array.from({ length: beats }, (_, i) => {
          const isActive = isPlaying && i === currentBeat;
          const isFirst = i === 0 && stressFirstBeat;
          return (
            <div
              key={i}
              className={[
                "rounded-full transition-colors motion-reduce:transition-none",
                isFirst ? "w-9 h-9" : "w-7 h-7",
                isActive ? "bg-primary" : "bg-muted",
              ].join(" ")}
            />
          );
        })}
      </div>

      {/* Sound picker */}
      <div className="flex items-center justify-center gap-1.5">
        {SOUNDS.map((s) => {
          const isSelected = s.id === sound;
          return (
            <button
              key={s.id}
              onClick={() => {
                onPreviewSound(s.id);
                onSoundChange(s.id);
              }}
              aria-pressed={isSelected}
              className={[
                "h-7 px-3 rounded-full text-xs font-medium transition-colors cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-surface-raised hover:text-foreground",
              ].join(" ")}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Timer display */}
      {timerEnabled && (
        <div className="flex items-center justify-center">
          <span
            className={[
              "text-xl font-mono font-semibold tabular-nums",
              timerRemaining <= 10 && isPlaying ? "text-destructive" : "text-muted-foreground",
            ].join(" ")}
          >
            ⏱ {formatTime(timerRemaining)}
          </span>
        </div>
      )}

      {/* Start / Stop */}
      <button
        onClick={onToggle}
        className={[
          "w-full h-11 rounded-lg flex items-center justify-center gap-2 text-base font-medium transition-colors cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "bg-primary text-primary-foreground hover:bg-primary/90",
        ].join(" ")}
      >
        {isPlaying ? (
          <>
            <Square className="w-4 h-4 fill-current" />
            Stop
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            Start
          </>
        )}
      </button>
    </div>
  );
}
