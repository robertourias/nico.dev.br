export interface ICompletedTaskRecord {
  taskId: string;
  taskTitle: string;
  completedAt: number;
  cyclesToComplete: number;
  realTimeMinutes: number;
}

export class HistoryRecord implements ICompletedTaskRecord {
  taskId: string;
  taskTitle: string;
  completedAt: number;
  cyclesToComplete: number;
  realTimeMinutes: number;

  constructor(data: ICompletedTaskRecord) {
    if (!data.taskId) {
      throw new Error('Task ID is required');
    }

    if (!data.taskTitle || data.taskTitle.trim().length === 0) {
      throw new Error('Task title is required');
    }

    if (data.cyclesToComplete <= 0) {
      throw new Error('Cycles to complete must be greater than 0');
    }

    if (data.realTimeMinutes < 0) {
      throw new Error('Real time minutes cannot be negative');
    }

    this.taskId = data.taskId;
    this.taskTitle = data.taskTitle;
    this.completedAt = data.completedAt;
    this.cyclesToComplete = data.cyclesToComplete;
    this.realTimeMinutes = data.realTimeMinutes;
  }

  getFormattedDate(): string {
    return new Date(this.completedAt).toLocaleDateString('pt-BR');
  }

  getFormattedTime(): string {
    return new Date(this.completedAt).toLocaleTimeString('pt-BR');
  }

  getFormattedDuration(): string {
    const hours = Math.floor(this.realTimeMinutes / 60);
    const minutes = this.realTimeMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  }
}

export class History {
  private records: HistoryRecord[] = [];

  constructor(records?: ICompletedTaskRecord[]) {
    if (records) {
      this.records = records.map((r) => new HistoryRecord(r));
    }
  }

  addRecord(record: ICompletedTaskRecord): History {
    const newRecord = new HistoryRecord(record);
    return new History([...this.records, newRecord]);
  }

  getRecords(): HistoryRecord[] {
    return [...this.records].sort((a, b) => b.completedAt - a.completedAt);
  }

  getRecordsByTaskId(taskId: string): HistoryRecord[] {
    return this.getRecords().filter((r) => r.taskId === taskId);
  }

  getRecordsSince(timestamp: number): HistoryRecord[] {
    return this.getRecords().filter((r) => r.completedAt >= timestamp);
  }

  getTotalProductivityStats(): {
    totalTasks: number;
    totalCycles: number;
    totalTimeMinutes: number;
    averageCyclesPerTask: number;
    averageTimePerTask: number;
  } {
    if (this.records.length === 0) {
      return {
        totalTasks: 0,
        totalCycles: 0,
        totalTimeMinutes: 0,
        averageCyclesPerTask: 0,
        averageTimePerTask: 0,
      };
    }

    const totalTasks = this.records.length;
    const totalCycles = this.records.reduce((sum, r) => sum + r.cyclesToComplete, 0);
    const totalTimeMinutes = this.records.reduce((sum, r) => sum + r.realTimeMinutes, 0);

    return {
      totalTasks,
      totalCycles,
      totalTimeMinutes,
      averageCyclesPerTask: Math.round(totalCycles / totalTasks),
      averageTimePerTask: Math.round(totalTimeMinutes / totalTasks),
    };
  }

  removeOldRecords(olderThanDays: number): History {
    const cutoffTime = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;
    const filteredRecords = this.records.filter((r) => r.completedAt >= cutoffTime);
    return new History(filteredRecords.map((r) => ({ ...r })));
  }
}
