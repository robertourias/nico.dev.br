"use client";

interface BeatIndicatorsProps {
  beats: number;
  currentBeat: number;
  stressFirstBeat: boolean;
  isPlaying: boolean;
}

export function BeatIndicators({
  beats,
  currentBeat,
  stressFirstBeat,
  isPlaying,
}: BeatIndicatorsProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
        Beats
      </span>
      <div className="flex items-center gap-2">
        {Array.from({ length: beats }, (_, i) => {
          const isActive = isPlaying && i === currentBeat;
          const isFirst = i === 0 && stressFirstBeat;

          return (
            <div
              key={i}
              className={[
                "rounded-full transition-colors",
                isFirst ? "w-11 h-11" : "w-9 h-9",
                isActive
                  ? "bg-primary"
                  : "bg-muted",
                // Disable transition for reduced-motion users — audio still plays
                "motion-reduce:transition-none",
              ].join(" ")}
            />
          );
        })}
      </div>
    </div>
  );
}
