"use client";

import { useEffect, useRef, useState } from "react";

interface BpmDisplayProps {
  bpm: number;
  tempoName: string;
  onChange: (bpm: number) => void;
}

const MIN = 20;
const MAX = 300;

export function BpmDisplay({ bpm, tempoName, onChange }: BpmDisplayProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const startEditing = () => {
    setDraft(String(bpm));
    setEditing(true);
  };

  const commit = () => {
    const parsed = parseInt(draft, 10);
    if (!isNaN(parsed)) onChange(Math.max(MIN, Math.min(MAX, parsed)));
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") setEditing(false);
  };

  return (
    <div className="flex flex-col items-center gap-1">
      {editing ? (
        <input
          ref={inputRef}
          type="number"
          min={MIN}
          max={MAX}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          aria-label="BPM"
          className="w-44 text-center text-8xl font-bold tracking-tight leading-none bg-transparent border-b-2 border-primary text-foreground outline-none tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      ) : (
        <button
          onClick={startEditing}
          aria-label={`BPM: ${bpm}. Clique para editar`}
          className="text-8xl font-bold tracking-tight leading-none text-foreground hover:text-primary transition-colors cursor-text select-none"
        >
          {bpm}
        </button>
      )}
      <span className="text-sm text-muted-foreground">{tempoName}</span>
    </div>
  );
}
