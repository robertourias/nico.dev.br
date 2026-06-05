'use client';

interface PhaseIndicatorProps {
  phase: 'work' | 'shortBreak' | 'longBreak';
  cycleCount: number;
  longBreakInterval: number;
}

export function PhaseIndicator({ phase, cycleCount, longBreakInterval }: PhaseIndicatorProps) {
  const getPhaseEmoji = () => {
    switch (phase) {
      case 'work':
        return '💪';
      case 'shortBreak':
        return '☕';
      case 'longBreak':
        return '🌟';
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

  const cycleNumber = Math.floor(cycleCount / 2) + 1;
  const isLongBreak = cycleCount > 0 && cycleCount % longBreakInterval === 0;

  return (
    <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
      <span className="text-2xl">{getPhaseEmoji()}</span>
      <div className="flex flex-col">
        <span className="font-semibold text-foreground">{getPhaseLabel()}</span>
        <span className="text-xs text-muted-foreground">
          Ciclo {cycleNumber}{isLongBreak && ' (pausa longa)'}
        </span>
      </div>
    </div>
  );
}
