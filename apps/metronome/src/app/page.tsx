"use client";

import { createPortal } from "react-dom";
import { PictureInPicture2 } from "lucide-react";
import { BeatIndicators } from "@/components/beat-indicators";
import { BeatsControl } from "@/components/beats-control";
import { BpmDisplay } from "@/components/bpm-display";
import { BpmPresets } from "@/components/bpm-presets";
import { BpmSlider } from "@/components/bpm-slider";
import { MetronomeControls } from "@/components/metronome-controls";
import { PipContent } from "@/components/pip-content";
import { SoundPicker } from "@/components/sound-picker";
import { StressFirstBeat } from "@/components/stress-first-beat";
import { SubdivisionPicker } from "@/components/subdivision-picker";
import { TimerControl } from "@/components/timer-control";
import { useMetronome } from "@/hooks/use-metronome";
import { usePictureInPicture } from "@/hooks/use-pip";
import { useTapBpm } from "@/hooks/use-tap-bpm";
import { getTempoName } from "@/lib/tempo-names";

export default function MetronomePage() {
  const metronome = useMetronome();
  const { tap } = useTapBpm(metronome.setBpm);
  const tempoName = getTempoName(metronome.bpm);
  const pip = usePictureInPicture();

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-10 justify-center">
      {/* Fixed PiP button — desktop only */}
      {pip.isSupported && (
        <button
          onClick={() => pip.toggle()}
          title={pip.isOpen ? "Fechar janela flutuante" : "Abrir em janela flutuante"}
          className={[
            "fixed top-4 right-4 z-40 hidden md:flex items-center justify-center",
            "w-10 h-10 rounded-lg shadow-md transition-colors cursor-pointer",
            pip.isOpen
              ? "bg-primary text-primary-foreground hover:bg-primary/80"
              : "bg-muted text-muted-foreground hover:bg-surface-raised hover:text-foreground",
          ].join(" ")}
        >
          <PictureInPicture2 className="w-5 h-5" />
        </button>
      )}

      <div className="relative w-full max-w-md flex flex-col items-center gap-7">
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

        {/* Sound picker */}
        <SoundPicker
          selected={metronome.sound}
          onChange={metronome.setSound}
          onPreview={metronome.previewSound}
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

      {/* PiP portal */}
      {pip.isOpen && pip.pipWindow &&
        createPortal(
          <PipContent
            bpm={metronome.bpm}
            isPlaying={metronome.isPlaying}
            timerEnabled={metronome.timerEnabled}
            timerRemaining={metronome.timerRemaining}
            beats={metronome.beats}
            currentBeat={metronome.currentBeat}
            stressFirstBeat={metronome.stressFirstBeat}
            sound={metronome.sound}
            onToggle={metronome.toggle}
            onBpmChange={metronome.setBpm}
            onSoundChange={metronome.setSound}
            onPreviewSound={metronome.previewSound}
          />,
          pip.pipWindow.document.body
        )}
    </main>
  );
}
