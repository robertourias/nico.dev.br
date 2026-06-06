import { IStorageAdapter } from './StorageAdapter';
import { TimerConfig, ITimerConfig, Task, ITask, History, ICompletedTaskRecord } from '@/domain/pomodoro';

export interface IPomodoroSession {
  taskId: string | null;
  cycleCount: number;
  currentPhase: 'work' | 'shortBreak' | 'longBreak';
  secondsRemaining: number;
  startedAt: number;
  paused: boolean;
}

const STORAGE_KEYS = {
  CONFIG: 'pomodoro:config',
  TASKS: 'pomodoro:tasks',
  SESSION: 'pomodoro:session',
  HISTORY: 'pomodoro:history',
} as const;

export class PomodoroStorage {
  constructor(private adapter: IStorageAdapter) {}

  // Config
  saveConfig(config: ITimerConfig): void {
    this.adapter.save(STORAGE_KEYS.CONFIG, config);
  }

  loadConfig(): TimerConfig {
    const data = this.adapter.load<ITimerConfig>(STORAGE_KEYS.CONFIG);

    if (data) {
      try {
        return new TimerConfig(data);
      } catch {
        return TimerConfig.createDefault();
      }
    }

    return TimerConfig.createDefault();
  }

  // Tasks
  saveTasks(tasks: Task[]): void {
    const serialized = tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      estimatedCycles: t.estimatedCycles,
      status: t.status,
      createdAt: t.createdAt,
      completedAt: t.completedAt,
    }));

    this.adapter.save(STORAGE_KEYS.TASKS, serialized);
  }

  loadTasks(): Task[] {
    const data = this.adapter.load<ITask[]>(STORAGE_KEYS.TASKS);

    if (Array.isArray(data)) {
      return data
        .map((taskData) => {
          try {
            return new Task(taskData);
          } catch {
            return null;
          };
        })
        .filter((task): task is Task => task !== null);
    }

    return [];
  }

  addTask(task: Task): void {
    const tasks = this.loadTasks();
    tasks.push(task);
    this.saveTasks(tasks);
  }

  updateTask(taskId: string, updates: Partial<ITask>): void {
    const tasks = this.loadTasks();
    const index = tasks.findIndex((t) => t.id === taskId);

    if (index !== -1) {
      const updated = new Task({
        ...tasks[index],
        ...updates,
      });

      tasks[index] = updated;
      this.saveTasks(tasks);
    }
  }

  deleteTask(taskId: string): void {
    const tasks = this.loadTasks();
    this.saveTasks(tasks.filter((t) => t.id !== taskId));
  }

  // Session
  saveSession(session: IPomodoroSession): void {
    this.adapter.save(STORAGE_KEYS.SESSION, session);
  }

  loadSession(): IPomodoroSession | null {
    return this.adapter.load<IPomodoroSession>(STORAGE_KEYS.SESSION);
  }

  clearSession(): void {
    this.adapter.delete(STORAGE_KEYS.SESSION);
  }

  // History
  addHistoryRecord(record: ICompletedTaskRecord): void {
    const history = this.loadHistory();
    const newHistory = history.addRecord(record);
    this.adapter.save(STORAGE_KEYS.HISTORY, newHistory.getRecords().map((r) => ({ ...r })));
  }

  loadHistory(): History {
    const data = this.adapter.load<ICompletedTaskRecord[]>(STORAGE_KEYS.HISTORY);

    if (Array.isArray(data)) {
      return new History(data);
    }

    return new History([]);
  }

  clearOldHistory(olderThanDays: number): void {
    const history = this.loadHistory();
    const cleaned = history.removeOldRecords(olderThanDays);
    this.adapter.save(STORAGE_KEYS.HISTORY, cleaned.getRecords().map((r) => ({ ...r })));
  }

  // Utility
  getStorageSize(): {
    used: number;
    percentage: number;
  } {
    const quota = 5 * 1024 * 1024; // 5MB typical limit
    // Size calculation would require direct localStorage access
    // For now return a placeholder

    return {
      used: 0,
      percentage: 0,
    };
  }

  clearAll(): void {
    this.adapter.delete(STORAGE_KEYS.CONFIG);
    this.adapter.delete(STORAGE_KEYS.TASKS);
    this.adapter.delete(STORAGE_KEYS.SESSION);
    this.adapter.delete(STORAGE_KEYS.HISTORY);
  }
}
