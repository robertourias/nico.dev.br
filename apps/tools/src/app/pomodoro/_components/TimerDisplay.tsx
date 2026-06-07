'use client';

interface TimerDisplayProps {
  secondsRemaining: number;
  phase: 'work' | 'shortBreak' | 'longBreak';
  isRunning: boolean;
}

export function TimerDisplay({ secondsRemaining, phase, isRunning }: TimerDisplayProps) {
  const getPhaseColor = () => {
    switch (phase) {
      case 'work':
        return 'bg-primary';
      case 'shortBreak':
        return 'bg-emerald-600 dark:bg-emerald-700';
      case 'longBreak':
        return 'bg-violet-600 dark:bg-violet-700';
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-lg p-2">
      <div className={`relative w-36 h-36 ${getPhaseColor()} rounded-full flex items-center justify-center shadow-lg transition-all ${isRunning ? 'animate-pulse' : ''}`}>
        <div className="text-4xl font-bold text-white font-mono">
          {formatTime(secondsRemaining)}
        </div>
      </div>
    </div>
  );
}
