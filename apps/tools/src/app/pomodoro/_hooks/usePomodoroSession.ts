'use client';

import { useState, useCallback, useEffect } from 'react';
import { Timer } from '@/domain/pomodoro';
import { PomodoroStorage, LocalStorageAdapter, IPomodoroSession } from '@/infra/storage';
import { TimerWorkerManager } from '@/infra/worker';

export interface UsePomodoroSessionReturn {
  session: IPomodoroSession | null;
  isRunning: boolean;
  formattedTime: string;
  startCycle: (taskId: string | null) => void;
  pause: () => void;
  resume: () => void;
  skipToNextPhase: () => void;
  stopSession: () => void;
  completeTask: (actualCycles: number) => void;
}

export function usePomodoroSession(config: Timer | null): UsePomodoroSessionReturn {
  const [session, setSession] = useState<IPomodoroSession | null>(null);
  const [formattedTime, setFormattedTime] = useState('00:00');
  const [workerManager, setWorkerManager] = useState<TimerWorkerManager | null>(null);

  const adapter = new LocalStorageAdapter();
  const storage = new PomodoroStorage(adapter);

  // Initialize worker and load session
  useEffect(() => {
    const manager = new TimerWorkerManager();
    setWorkerManager(manager);

    const savedSession = storage.loadSession();
    if (savedSession) {
      setSession(savedSession);
    }

    return () => {
      manager.destroy();
    };
  }, []);

  // Setup worker listener
  useEffect(() => {
    if (!workerManager || !session) return;

    const listener = {
      onTick: (remaining: number) => {
        setFormattedTime(formatSeconds(remaining));

        const updated: IPomodoroSession = {
          ...session,
          secondsRemaining: remaining,
        };

        setSession(updated);
        storage.saveSession(updated);
      },

      onComplete: () => {
        if (!config) return;

        // Get current phase to determine next one
        const phase = config.getPhase(session.cycleCount);
        const nextPhase = config.getNextPhase(session.cycleCount);

        const updated: IPomodoroSession = {
          ...session,
          cycleCount: session.cycleCount + 1,
          currentPhase: nextPhase.type,
          secondsRemaining: nextPhase.durationSeconds,
          startedAt: Date.now(),
          paused: false,
        };

        setSession(updated);
        storage.saveSession(updated);

        // Auto-start next phase
        workerManager.start(nextPhase.durationSeconds);
      },
    };

    workerManager.addListener(listener);

    return () => {
      workerManager.removeListener(listener);
    };
  }, [workerManager, session, config]);

  const startCycle = useCallback(
    (taskId: string | null) => {
      if (!config || !workerManager) return;

      const phase = config.getPhase(0);
      const newSession: IPomodoroSession = {
        taskId,
        cycleCount: 0,
        currentPhase: phase.type,
        secondsRemaining: phase.durationSeconds,
        startedAt: Date.now(),
        paused: false,
      };

      setSession(newSession);
      storage.saveSession(newSession);

      workerManager.start(phase.durationSeconds);
      setFormattedTime(formatSeconds(phase.durationSeconds));
    },
    [config, workerManager]
  );

  const pause = useCallback(() => {
    if (!session || !workerManager) return;

    setSession({
      ...session,
      paused: true,
    });

    workerManager.pause();
  }, [session, workerManager]);

  const resume = useCallback(() => {
    if (!session || !workerManager) return;

    setSession({
      ...session,
      paused: false,
    });

    workerManager.resume();
  }, [session, workerManager]);

  const skipToNextPhase = useCallback(() => {
    if (!config || !session || !workerManager) return;

    const nextPhase = config.getNextPhase(session.cycleCount);

    const updated: IPomodoroSession = {
      ...session,
      cycleCount: session.cycleCount + 1,
      currentPhase: nextPhase.type,
      secondsRemaining: nextPhase.durationSeconds,
      startedAt: Date.now(),
      paused: false,
    };

    setSession(updated);
    storage.saveSession(updated);

    workerManager.stop();
    workerManager.start(nextPhase.durationSeconds);
  }, [config, session, workerManager]);

  const stopSession = useCallback(() => {
    if (!workerManager) return;

    workerManager.stop();
    setSession(null);
    storage.clearSession();
    setFormattedTime('00:00');
  }, [workerManager]);

  const completeTask = useCallback(
    (actualCycles: number) => {
      // Task completion is handled by the parent component
      // This is mainly for recording in history
    },
    []
  );

  return {
    session,
    isRunning: session ? !session.paused : false,
    formattedTime,
    startCycle,
    pause,
    resume,
    skipToNextPhase,
    stopSession,
    completeTask,
  };
}

function formatSeconds(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
