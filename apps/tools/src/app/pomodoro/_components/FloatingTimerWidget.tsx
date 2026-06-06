'use client';

import { X, Maximize2 } from 'lucide-react';

interface FloatingTimerWidgetProps {
  secondsRemaining: number;
  phase: 'work' | 'shortBreak' | 'longBreak';
  isVisible: boolean;
  onClose: () => void;
  onRestore: () => void;
}

export function FloatingTimerWidget({
  secondsRemaining,
  phase,
  isVisible,
  onClose,
  onRestore,
}: FloatingTimerWidgetProps) {
  if (!isVisible) return null;

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
    <div
      className={`fixed bottom-6 right-6 z-40 ${getPhaseColor()} rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}
      onClick={onRestore}
      title="Clique para restaurar"
    >
      <div className="flex items-center gap-3 text-white">
        <div className="flex flex-col items-center justify-center w-12 h-12">
          <div className="font-bold text-sm font-mono">{formatTime(secondsRemaining)}</div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRestore();
            }}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            title="Restaurar"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
