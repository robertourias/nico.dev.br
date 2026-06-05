export interface TimerPhase {
  type: 'work' | 'shortBreak' | 'longBreak';
  durationSeconds: number;
}

export class Timer {
  private workDurationSeconds: number;
  private shortBreakDurationSeconds: number;
  private longBreakInterval: number;
  private longBreakDurationSeconds: number;

  constructor(config: {
    workDurationMinutes: number;
    shortBreakDurationMinutes: number;
    longBreakInterval: number;
    longBreakDurationMinutes: number;
  }) {
    if (
      config.workDurationMinutes <= 0 ||
      config.shortBreakDurationMinutes <= 0 ||
      config.longBreakInterval <= 0 ||
      config.longBreakDurationMinutes <= 0
    ) {
      throw new Error('All durations must be greater than 0');
    }

    this.workDurationSeconds = config.workDurationMinutes * 60;
    this.shortBreakDurationSeconds = config.shortBreakDurationMinutes * 60;
    this.longBreakInterval = config.longBreakInterval;
    this.longBreakDurationSeconds = config.longBreakDurationMinutes * 60;
  }

  getPhase(cycleCount: number): TimerPhase {
    const isLongBreakCycle = cycleCount > 0 && cycleCount % this.longBreakInterval === 0;

    if (cycleCount % 2 === 0) {
      // Even: work phase
      return {
        type: 'work',
        durationSeconds: this.workDurationSeconds,
      };
    } else {
      // Odd: break phase
      return {
        type: isLongBreakCycle ? 'longBreak' : 'shortBreak',
        durationSeconds: isLongBreakCycle
          ? this.longBreakDurationSeconds
          : this.shortBreakDurationSeconds,
      };
    }
  }

  getNextPhase(cycleCount: number): TimerPhase {
    return this.getPhase(cycleCount + 1);
  }

  getRemainingSeconds(phase: TimerPhase, elapsedSeconds: number): number {
    return Math.max(0, phase.durationSeconds - elapsedSeconds);
  }

  isPhaseComplete(phase: TimerPhase, elapsedSeconds: number): boolean {
    return elapsedSeconds >= phase.durationSeconds;
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
}
