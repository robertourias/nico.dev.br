"use client";

import { Label, Switch } from "@nico.dev/ui";

interface StressFirstBeatProps {
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function StressFirstBeat({ checked, onChange }: StressFirstBeatProps) {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="stress-first-beat" className="cursor-pointer select-none">
        Stress first beat
      </Label>
      <Switch
        id="stress-first-beat"
        checked={checked}
        onCheckedChange={(v) => onChange(v === true)}
      />
    </div>
  );
}
