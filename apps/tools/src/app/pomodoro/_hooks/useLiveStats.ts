'use client';

import { useState, useEffect, useRef } from 'react';
import { LocalStorageAdapter } from '@/infra/storage';

interface PersistedStats {
  totalElapsedSeconds: number;
  totalCycles: number;
}

const STATS_KEY = 'pomodoro_live_stats';

function loadPersistedStats(): PersistedStats {
  try {
    const adapter = new LocalStorageAdapter();
    const saved = adapter.load<PersistedStats>(STATS_KEY);
    if (saved && typeof saved.totalElapsedSeconds === 'number') return saved;
  } catch {}
  return { totalElapsedSeconds: 0, totalCycles: 0 };
}

export interface UseLiveStatsReturn {
  totalElapsedSeconds: number;
  totalCycles: number;
}

/**
 * Tracks live elapsed seconds (work phase only) and total work cycles completed.
 * Persists to localStorage.
 *
 * cycleCount is treated as a delta — first value seen is used as baseline
 * to avoid double-counting cycles from a restored session.
 */
export function useLiveStats(
  isRunning: boolean,
  cycleCount: number | undefined,
  currentPhase: string | undefined
): UseLiveStatsReturn {
  const [stats, setStats] = useState<PersistedStats>(loadPersistedStats);
  // null = not yet initialised; once set, tracks last seen value
  const prevCycleRef = useRef<number | null>(null);
  const adapterRef = useRef(new LocalStorageAdapter());

  // Accumulate 1s only during work phase
  useEffect(() => {
    if (!isRunning || currentPhase !== 'work') return;
    const id = setInterval(() => {
      setStats((prev) => {
        const next = { ...prev, totalElapsedSeconds: prev.totalElapsedSeconds + 1 };
        adapterRef.current.save(STATS_KEY, next);
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, currentPhase]);

  // Track only work cycle completions (transition to a break phase)
  useEffect(() => {
    const current = cycleCount ?? 0;
    if (prevCycleRef.current === null) {
      prevCycleRef.current = current;
      return;
    }
    if (current > prevCycleRef.current) {
      const isWorkCompletion = currentPhase === 'shortBreak' || currentPhase === 'longBreak';
      if (isWorkCompletion) {
        const delta = current - prevCycleRef.current;
        setStats((prev) => {
          const next = { ...prev, totalCycles: prev.totalCycles + delta };
          adapterRef.current.save(STATS_KEY, next);
          return next;
        });
      }
      prevCycleRef.current = current;
    }
  }, [cycleCount, currentPhase]);

  return stats;
}
