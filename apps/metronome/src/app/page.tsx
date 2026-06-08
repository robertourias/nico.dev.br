"use client";

import { BeatIndicators } from "@/components/beat-indicators";
import { BeatsControl } from "@/components/beats-control";
import { BpmDisplay } from "@/components/bpm-display";
import { BpmPresets } from "@/components/bpm-presets";
import { BpmSlider } from "@/components/bpm-slider";
import { MetronomeControls } from "@/components/metronome-controls";
import { StressFirstBeat } from "@/components/stress-first-beat";
import { SubdivisionPicker } from "@/components/subdivision-picker";
import { TimerControl } from "@/components/timer-control";
import { useMetronome } from "@/hooks/use-metronome";
import { useTapBpm } from "@/hooks/use-tap-bpm";
import { getTempoName } from "@/lib/tempo-names";

export default function MetronomePage() {
  const metronome = useMetronome();
  const { tap } = useTapBpm(metronome.setBpm);
  const tempoName = getTempoName(metronome.bpm);

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-10 justify-center">
      <div className="w-full max-w-md flex flex-col items-center gap-7">
        {/* BPM display — clique para editar */}
        <BpmDisplay
          bpm={metronome.bpm}
          tempoName={tempoName}
          onChange={metronome.setBpm}
        />

        {/* BPM slider */}
        <BpmSlider bpm={metronome.bpm} onChange={metronome.setBpm} />

        {/* BPM presets */}
        <BpmPresets bpm={metronome.bpm} onChange={metronome.setBpm} />

        {/* Beat dots */}
        <BeatIndicators
          beats={metronome.beats}
          currentBeat={metronome.currentBeat}
          stressFirstBeat={metronome.stressFirstBeat}
          isPlaying={metronome.isPlaying}
        />

        {/* Start / Tap BPM */}
        <MetronomeControls
          isPlaying={metronome.isPlaying}
          onToggle={metronome.toggle}
          onTap={tap}
        />

        {/* Settings panel */}
        <div className="w-full rounded-xl border border-border bg-surface p-4 flex flex-col divide-y divide-border">
          <div className="pb-3">
            <BeatsControl
              beats={metronome.beats}
              onChange={metronome.setBeats}
            />
          </div>

          <div className="py-3">
            <StressFirstBeat
              checked={metronome.stressFirstBeat}
              onChange={metronome.setStressFirstBeat}
            />
          </div>

          <div className="py-3">
            <TimerControl
              enabled={metronome.timerEnabled}
              onEnabledChange={metronome.setTimerEnabled}
              totalSeconds={metronome.timerSeconds}
              onTotalSecondsChange={metronome.setTimerSeconds}
              remainingSeconds={metronome.timerRemaining}
              isPlaying={metronome.isPlaying}
            />
          </div>

          <div className="pt-3">
            <SubdivisionPicker
              selected={metronome.subdivision}
              onChange={metronome.setSubdivision}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
