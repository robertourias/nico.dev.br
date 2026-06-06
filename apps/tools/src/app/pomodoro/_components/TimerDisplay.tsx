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

  const getPhaseLabel = () => {
    switch (phase) {
      case 'work':
        return 'Trabalho';
      case 'shortBreak':
        return 'Pausa Curta';
      case 'longBreak':
        return 'Pausa Longa';
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
    <div className="flex flex-col items-center justify-center gap-6 rounded-lg p-8">
      <div className={`relative w-64 h-64 ${getPhaseColor()} rounded-full flex items-center justify-center shadow-lg transition-all ${isRunning ? 'animate-pulse' : ''}`}>
        <div className="text-6xl font-bold text-white font-mono">
          {formatTime(secondsRemaining)}
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">{getPhaseLabel()}</h2>
        <p className="text-sm text-muted-foreground mt-2">
          {isRunning ? 'Em andamento...' : 'Pausado'}
        </p>
      </div>
    </div>
  );
}
