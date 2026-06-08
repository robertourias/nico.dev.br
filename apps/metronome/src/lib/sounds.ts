export type SoundId = "click" | "wood" | "beep";

export interface SoundOption {
  id: SoundId;
  label: string;
}

export const SOUNDS: SoundOption[] = [
  { id: "click", label: "Click" },
  { id: "wood", label: "Wood" },
  { id: "beep", label: "Beep" },
];
