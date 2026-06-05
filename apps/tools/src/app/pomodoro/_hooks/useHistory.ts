'use client';

import { useState, useCallback, useEffect } from 'react';
import { History, HistoryRecord, ICompletedTaskRecord } from '@/domain/pomodoro';
import { PomodoroStorage, LocalStorageAdapter } from '@/infra/storage';

export interface UseHistoryReturn {
  history: History;
  records: HistoryRecord[];
  isLoaded: boolean;
  addRecord: (record: ICompletedTaskRecord) => void;
  getCycleHistoryForTask: (taskId: string) => HistoryRecord[];
  getRecordsSince: (timestamp: number) => HistoryRecord[];
  getTotalStats: () => {
    totalTasks: number;
    totalCycles: number;
    totalTimeMinutes: number;
    averageCyclesPerTask: number;
    averageTimePerTask: number;
  };
  clearOldRecords: (olderThanDays: number) => void;
}

export function useHistory(): UseHistoryReturn {
  const [history, setHistory] = useState<History>(new History());
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const adapter = new LocalStorageAdapter();
  const storage = new PomodoroStorage(adapter);

  // Load history on mount
  useEffect(() => {
    const loadedHistory = storage.loadHistory();
    setHistory(loadedHistory);
    setRecords(loadedHistory.getRecords());
    setIsLoaded(true);
  }, []);

  const addRecord = useCallback((record: ICompletedTaskRecord) => {
    try {
      const newHistory = history.addRecord(record);
      setHistory(newHistory);
      setRecords(newHistory.getRecords());

      // Persist to storage
      storage.addHistoryRecord(record);
    } catch (error) {
      console.error('Failed to add history record:', error);
      throw error;
    }
  }, [history]);

  const getCycleHistoryForTask = useCallback(
    (taskId: string) => {
      return history.getRecordsByTaskId(taskId);
    },
    [history]
  );

  const getRecordsSince = useCallback(
    (timestamp: number) => {
      return history.getRecordsSince(timestamp);
    },
    [history]
  );

  const getTotalStats = useCallback(() => {
    return history.getTotalProductivityStats();
  }, [history]);

  const clearOldRecords = useCallback((olderThanDays: number) => {
    try {
      const newHistory = history.removeOldRecords(olderThanDays);
      setHistory(newHistory);
      setRecords(newHistory.getRecords());

      // Persist to storage
      storage.clearOldHistory(olderThanDays);
    } catch (error) {
      console.error('Failed to clear old records:', error);
      throw error;
    }
  }, [history]);

  return {
    history,
    records,
    isLoaded,
    addRecord,
    getCycleHistoryForTask,
    getRecordsSince,
    getTotalStats,
    clearOldRecords,
  };
}
