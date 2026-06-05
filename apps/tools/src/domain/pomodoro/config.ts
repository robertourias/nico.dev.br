export interface ITimerConfig {
  workDuration: number;
  shortBreakDuration: number;
  longBreakInterval: number;
  longBreakDuration: number;
}

export class TimerConfig implements ITimerConfig {
  workDuration: number;
  shortBreakDuration: number;
  longBreakInterval: number;
  longBreakDuration: number;

  constructor(data: ITimerConfig) {
    if (data.workDuration <= 0) {
      throw new Error('Work duration must be greater than 0');
    }

    if (data.shortBreakDuration <= 0) {
      throw new Error('Short break duration must be greater than 0');
    }

    if (data.longBreakInterval <= 0) {
      throw new Error('Long break interval must be greater than 0');
    }

    if (data.longBreakDuration <= 0) {
      throw new Error('Long break duration must be greater than 0');
    }

    this.workDuration = data.workDuration;
    this.shortBreakDuration = data.shortBreakDuration;
    this.longBreakInterval = data.longBreakInterval;
    this.longBreakDuration = data.longBreakDuration;
  }

  static createDefault(): TimerConfig {
    return new TimerConfig({
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakInterval: 4,
      longBreakDuration: 15,
    });
  }

  equals(other: ITimerConfig): boolean {
    return (
      this.workDuration === other.workDuration &&
      this.shortBreakDuration === other.shortBreakDuration &&
      this.longBreakInterval === other.longBreakInterval &&
      this.longBreakDuration === other.longBreakDuration
    );
  }

  toJSON(): ITimerConfig {
    return {
      workDuration: this.workDuration,
      shortBreakDuration: this.shortBreakDuration,
      longBreakInterval: this.longBreakInterval,
      longBreakDuration: this.longBreakDuration,
    };
  }
}
