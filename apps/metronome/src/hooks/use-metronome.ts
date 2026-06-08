import { useCallback, useEffect, useRef, useState } from "react";
import { useWakeLock } from "@nico.dev/ui";
import { createClick } from "@/lib/audio-engine";
import { getSubdivisionPattern, type SubdivisionId } from "@/lib/subdivisions";
import { type SoundId } from "@/lib/sounds";

interface ScheduledNote {
  beat: number;
  time: number;
}

export interface MetronomeState {
  bpm: number;
  beats: number;
  isPlaying: boolean;
  currentBeat: number;
  stressFirstBeat: boolean;
  subdivision: SubdivisionId;
  sound: SoundId;
  timerEnabled: boolean;
  timerSeconds: number;
  timerRemaining: number;
}

export interface MetronomeActions {
  setBpm: (bpm: number) => void;
  setBeats: (beats: number) => void;
  toggle: () => void;
  setStressFirstBeat: (v: boolean) => void;
  setSubdivision: (id: SubdivisionId) => void;
  setSound: (id: SoundId) => void;
  previewSound: (id: SoundId) => void;
  setTimerEnabled: (v: boolean) => void;
  setTimerSeconds: (s: number) => void;
}

export function useMetronome(): MetronomeState & MetronomeActions {
  // ── React state (drives rendering) ──────────────────────────────────────
  const [bpm, setBpmState] = useState(100);
  const [beats, setBeatsState] = useState(4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [stressFirstBeat, setStressFirstBeatState] = useState(true);
  const [subdivision, setSubdivisionState] = useState<SubdivisionId>("none");
  const [sound, setSoundState] = useState<SoundId>("click");
  const [timerEnabled, setTimerEnabledState] = useState(false);
  const [timerSeconds, setTimerSecondsState] = useState(60);
  const [timerRemaining, setTimerRemaining] = useState(60);

  // ── Refs for scheduler (reads these instead of closed-over state) ────────
  const bpmRef = useRef(100);
  const beatsRef = useRef(4);
  const stressFirstBeatRef = useRef(true);
  const subdivisionRef = useRef<SubdivisionId>("none");
  const soundRef = useRef<SoundId>("click");
  const timerSecondsRef = useRef(60);
  const isPlayingRef = useRef(false);

  // ── Web Audio + scheduling state ─────────────────────────────────────────
  const audioCtxRef = useRef<AudioContext | null>(null);
  const schedulerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number>(0);
  const nextNoteTimeRef = useRef(0);
  const currentBeatRef = useRef(0);
  const notesInQueue = useRef<ScheduledNote[]>([]);

  useWakeLock(isPlaying);

  // ── Schedule one beat click + its subdivisions ───────────────────────────
  const scheduleNote = useCallback((beat: number, time: number) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const accented = beat === 0 && stressFirstBeatRef.current;
    createClick(ctx, accented ? 900 : 600, accented ? 0.015 : 0.01, time, soundRef.current);

    const pattern = getSubdivisionPattern(subdivisionRef.current);
    const spb = 60.0 / bpmRef.current;
    for (const offset of pattern.offsets.slice(1)) {
      createClick(ctx, 400, 0.008, time + offset * spb, soundRef.current);
    }

    notesInQueue.current.push({ beat, time });
  }, []);

  // ── Scheduler loop: runs every 25ms, looks 100ms ahead ──────────────────
  const scheduler = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const lookahead = 0.1;
    const spb = 60.0 / bpmRef.current;

    while (nextNoteTimeRef.current < ctx.currentTime + lookahead) {
      scheduleNote(currentBeatRef.current, nextNoteTimeRef.current);
      nextNoteTimeRef.current += spb;
      currentBeatRef.current =
        (currentBeatRef.current + 1) % beatsRef.current;
    }

    schedulerTimerRef.current = setTimeout(scheduler, 25);
  }, [scheduleNote]);

  // ── rAF loop: syncs visual beat to audio time ────────────────────────────
  const draw = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (ctx) {
      while (
        notesInQueue.current.length > 0 &&
        notesInQueue.current[0].time <= ctx.currentTime + 0.005
      ) {
        setCurrentBeat(notesInQueue.current[0].beat);
        notesInQueue.current.shift();
      }
    }
    rafRef.current = requestAnimationFrame(draw);
  }, []);

  // ── Internal stop (no timer reset — caller decides) ──────────────────────
  const stopEngine = useCallback(() => {
    if (schedulerTimerRef.current) clearTimeout(schedulerTimerRef.current);
    cancelAnimationFrame(rafRef.current);
    notesInQueue.current = [];
    currentBeatRef.current = 0;
    isPlayingRef.current = false;
    setIsPlaying(false);
    setCurrentBeat(0);
  }, []);

  // ── Toggle start / stop ──────────────────────────────────────────────────
  const toggle = useCallback(() => {
    if (isPlayingRef.current) {
      stopEngine();
      setTimerRemaining(timerSecondsRef.current);
      return;
    }

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    void audioCtxRef.current.resume().then(() => {
      const ctx = audioCtxRef.current!;
      nextNoteTimeRef.current = ctx.currentTime;
      currentBeatRef.current = 0;
      notesInQueue.current = [];
      isPlayingRef.current = true;
      setIsPlaying(true);
      setCurrentBeat(0);
      setTimerRemaining(timerSecondsRef.current);
      scheduler();
      rafRef.current = requestAnimationFrame(draw);
    });
  }, [stopEngine, scheduler, draw]);

  // ── Preview a sound (single click, no scheduling) ────────────────────────
  const previewSound = useCallback((id: SoundId) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    void audioCtxRef.current.resume().then(() => {
      const ctx = audioCtxRef.current!;
      createClick(ctx, 900, 0.015, ctx.currentTime, id);
    });
  }, []);

  // ── Timer countdown ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying || !timerEnabled || timerRemaining <= 0) return;
    const id = setTimeout(
      () => setTimerRemaining((prev) => prev - 1),
      1000
    );
    return () => clearTimeout(id);
  }, [isPlaying, timerEnabled, timerRemaining]);

  // ── Auto-stop when timer reaches 0 ──────────────────────────────────────
  useEffect(() => {
    if (isPlaying && timerEnabled && timerRemaining === 0) {
      stopEngine();
    }
  }, [isPlaying, timerEnabled, timerRemaining, stopEngine]);

  // ── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (schedulerTimerRef.current) clearTimeout(schedulerTimerRef.current);
      cancelAnimationFrame(rafRef.current);
      audioCtxRef.current?.close();
    };
  }, []);

  // ── Public setters ───────────────────────────────────────────────────────
  const setBpm = useCallback((value: number) => {
    const v = Math.max(20, Math.min(300, Math.round(value)));
    bpmRef.current = v;
    setBpmState(v);
  }, []);

  const setBeats = useCallback((value: number) => {
    const v = Math.max(1, Math.min(12, value));
    beatsRef.current = v;
    if (currentBeatRef.current >= v) currentBeatRef.current = 0;
    setBeatsState(v);
  }, []);

  const setStressFirstBeat = useCallback((v: boolean) => {
    stressFirstBeatRef.current = v;
    setStressFirstBeatState(v);
  }, []);

  const setSubdivision = useCallback((id: SubdivisionId) => {
    subdivisionRef.current = id;
    setSubdivisionState(id);
  }, []);

  const setSound = useCallback((id: SoundId) => {
    soundRef.current = id;
    setSoundState(id);
  }, []);

  const setTimerEnabled = useCallback((v: boolean) => {
    setTimerEnabledState(v);
  }, []);

  const setTimerSeconds = useCallback((s: number) => {
    timerSecondsRef.current = s;
    setTimerSecondsState(s);
    if (!isPlayingRef.current) setTimerRemaining(s);
  }, []);

  return {
    bpm,
    beats,
    isPlaying,
    currentBeat,
    stressFirstBeat,
    subdivision,
    sound,
    timerEnabled,
    timerSeconds,
    timerRemaining,
    setBpm,
    setBeats,
    toggle,
    setStressFirstBeat,
    setSubdivision,
    setSound,
    previewSound,
    setTimerEnabled,
    setTimerSeconds,
  };
}
