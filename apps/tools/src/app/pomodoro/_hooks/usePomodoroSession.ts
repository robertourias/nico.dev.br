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
  const [workerManager, setWorkerManager] = useState<TimerWorkerManager | null>(null);

  const adapter = new LocalStorageAdapter();
  const storage = new PomodoroStorage(adapter);

  // Initialize worker and restore session from storage
  useEffect(() => {
    const manager = new TimerWorkerManager();
    setWorkerManager(manager);

    const savedSession = storage.loadSession();
    if (savedSession) {
      setSession(savedSession);
      // If session was running when saved, restart worker from saved remaining time
      if (!savedSession.paused) {
        manager.start(savedSession.secondsRemaining);
      }
    }

    return () => {
      manager.destroy();
    };
  }, []);

  // Register worker listener.
  // Deps: only workerManager and config — NOT session — to avoid re-registering on every tick.
  // Session is accessed via setSession(prev => ...) functional updates.
  useEffect(() => {
    if (!workerManager) return;

    const listener = {
      onTick: (remaining: number) => {
        setSession(prev => {
          if (!prev) return prev;
          const updated = { ...prev, secondsRemaining: remaining };
          storage.saveSession(updated);
          return updated;
        });
      },

      onComplete: () => {
        if (!config) return;
        setSession(prev => {
          if (!prev) return prev;
          const nextPhase = config.getNextPhase(prev.cycleCount);
          const updated: IPomodoroSession = {
            ...prev,
            cycleCount: prev.cycleCount + 1,
            currentPhase: nextPhase.type,
            secondsRemaining: nextPhase.durationSeconds,
            startedAt: Date.now(),
            paused: true,
          };
          storage.saveSession(updated);
          return updated;
        });
      },
    };

    workerManager.addListener(listener);

    return () => {
      workerManager.removeListener(listener);
    };
  }, [workerManager, config]);

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
    },
    [config, workerManager]
  );

  const pause = useCallback(() => {
    if (!session || !workerManager) return;
    workerManager.pause();
    setSession(prev => prev ? { ...prev, paused: true } : prev);
  }, [session, workerManager]);

  // resume() always starts the worker from session.secondsRemaining — the persisted
  // remaining time. This works for normal pause/resume, page-reload restore, and
  // phase-transition (after onComplete, secondsRemaining = nextPhase.durationSeconds).
  const resume = useCallback(() => {
    if (!session || !workerManager) return;
    workerManager.start(session.secondsRemaining);
    setSession(prev => prev ? { ...prev, paused: false } : prev);
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
  }, [workerManager]);

  const completeTask = useCallback(
    (_actualCycles: number) => {
      // Task completion is handled by the parent component
    },
    []
  );

  return {
    session,
    isRunning: session ? !session.paused : false,
    formattedTime: session ? formatSeconds(session.secondsRemaining) : '00:00',
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
