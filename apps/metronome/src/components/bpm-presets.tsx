"use client";

interface BpmPresetsProps {
  bpm: number;
  onChange: (bpm: number) => void;
}

export const PRESETS = [70, 80, 90, 100, 110, 120] as const;

export function BpmPresets({ bpm, onChange }: BpmPresetsProps) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label="BPM rápidos">
      {PRESETS.map((preset) => {
        const active = bpm === preset;
        return (
          <button
            key={preset}
            onClick={() => onChange(preset)}
            aria-pressed={active}
            aria-label={`${preset} BPM`}
            className={[
              "h-9 px-3.5 rounded-full text-sm font-medium transition-colors hover:cursor-pointer",
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
  );
}
