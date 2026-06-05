'use client';

import { useState, useCallback, useEffect } from 'react';
import { TimerConfig, ITimerConfig } from '@/domain/pomodoro';
import { PomodoroStorage, LocalStorageAdapter } from '@/infra/storage';

export function useTimerConfig() {
  const [config, setConfig] = useState<TimerConfig | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize storage on mount
  useEffect(() => {
    const adapter = new LocalStorageAdapter();
    const storage = new PomodoroStorage(adapter);
    const savedConfig = storage.loadConfig();

    setConfig(savedConfig);
    setIsLoaded(true);
  }, []);

  const updateConfig = useCallback((newConfig: ITimerConfig) => {
    try {
      const updated = new TimerConfig(newConfig);
      setConfig(updated);

      const adapter = new LocalStorageAdapter();
      const storage = new PomodoroStorage(adapter);
      storage.saveConfig(updated.toJSON());
    } catch (error) {
      console.error('Failed to update config:', error);
      throw error;
    }
  }, []);

  const resetToDefault = useCallback(() => {
    const defaultConfig = TimerConfig.createDefault();
    setConfig(defaultConfig);

    const adapter = new LocalStorageAdapter();
    const storage = new PomodoroStorage(adapter);
    storage.saveConfig(defaultConfig.toJSON());
  }, []);

  return {
    config,
    isLoaded,
    updateConfig,
    resetToDefault,
  };
}
