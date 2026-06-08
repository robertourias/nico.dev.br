'use client';

import { Play, Pause, SkipForward } from 'lucide-react';
import { PhaseIndicator } from './PhaseIndicator';

interface PictureInPictureContentProps {
  secondsRemaining: number;
  phase: 'work' | 'shortBreak' | 'longBreak';
  cycleCount: number;
  longBreakInterval: number;
  isRunning: boolean;
  onPause: () => void;
  onResume: () => void;
  onSkip: () => void;
}

export function PictureInPictureContent({
  secondsRemaining,
  phase,
  cycleCount,
  longBreakInterval,
  isRunning,
  onPause,
  onResume,
  onSkip,
}: PictureInPictureContentProps) {
  const getPhaseColor = () => {
    switch (phase) {
      case 'work':
        return 'bg-primary';
      case 'shortBreak':
        return 'bg-emerald-600';
      case 'longBreak':
        return 'bg-violet-600';
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className={`flex flex-col gap-3 w-full h-full p-4 text-white ${getPhaseColor()}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="text-3xl font-bold font-mono tabular-nums">{formatTime(secondsRemaining)}</div>
        <div className="flex gap-2">
          {isRunning ? (
            <button onClick={onPause} className="p-2 hover:bg-white/20 rounded-lg transition-colors" title="Pausar">
              <Pause className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={onResume} className="p-2 hover:bg-white/20 rounded-lg transition-colors" title="Retomar">
              <Play className="w-5 h-5" />
            </button>
          )}
          <button onClick={onSkip} className="p-2 hover:bg-white/20 rounded-lg transition-colors" title="Pular">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      <PhaseIndicator phase={phase} cycleCount={cycleCount} longBreakInterval={longBreakInterval} />
    </div>
  );
}
