"use client";

import { SOUNDS, type SoundId } from "@/lib/sounds";

interface SoundPickerProps {
  selected: SoundId;
  onChange: (id: SoundId) => void;
  onPreview: (id: SoundId) => void;
}

export function SoundPicker({ selected, onChange, onPreview }: SoundPickerProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
        Sound
      </span>
      <div className="flex items-center gap-2">
        {SOUNDS.map((sound) => {
          const isSelected = sound.id === selected;
          return (
            <button
              key={sound.id}
              onClick={() => {
                onPreview(sound.id);
                onChange(sound.id);
              }}
              aria-pressed={isSelected}
              aria-label={`${sound.label} sound`}
              className={[
                "h-8 px-5 rounded-full text-sm font-medium transition-colors cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-surface-raised hover:text-foreground",
              ].join(" ")}
            >
              {sound.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
