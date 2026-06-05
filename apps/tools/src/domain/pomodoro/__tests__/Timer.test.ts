import { Timer, TimerPhase } from '../Timer';

describe('Timer', () => {
  let timer: Timer;

  beforeEach(() => {
    timer = new Timer({
      workDurationMinutes: 25,
      shortBreakDurationMinutes: 5,
      longBreakInterval: 4,
      longBreakDurationMinutes: 15,
    });
  });

  describe('getPhase', () => {
    it('cycle 0 should be work phase', () => {
      const phase = timer.getPhase(0);
      expect(phase.type).toBe('work');
      expect(phase.durationSeconds).toBe(25 * 60);
    });

    it('cycle 1 should be short break', () => {
      const phase = timer.getPhase(1);
      expect(phase.type).toBe('shortBreak');
      expect(phase.durationSeconds).toBe(5 * 60);
    });

    it('cycle 4 should be long break', () => {
      const phase = timer.getPhase(4);
      expect(phase.type).toBe('longBreak');
      expect(phase.durationSeconds).toBe(15 * 60);
    });

    it('cycle 5 should be work after long break', () => {
      const phase = timer.getPhase(5);
      expect(phase.type).toBe('work');
    });

    it('cycle 8 should be another long break', () => {
      const phase = timer.getPhase(8);
      expect(phase.type).toBe('longBreak');
    });
  });

  describe('getRemainingSeconds', () => {
    it('should return full duration when elapsed is 0', () => {
      const phase = timer.getPhase(0);
      const remaining = timer.getRemainingSeconds(phase, 0);
      expect(remaining).toBe(25 * 60);
    });

    it('should return 0 when elapsed equals duration', () => {
      const phase = timer.getPhase(0);
      const remaining = timer.getRemainingSeconds(phase, 25 * 60);
      expect(remaining).toBe(0);
    });

    it('should return correct partial remaining', () => {
      const phase = timer.getPhase(0);
      const remaining = timer.getRemainingSeconds(phase, 10 * 60);
      expect(remaining).toBe(15 * 60);
    });
  });

  describe('isPhaseComplete', () => {
    it('should return false when not complete', () => {
      const phase = timer.getPhase(0);
      const complete = timer.isPhaseComplete(phase, 10 * 60);
      expect(complete).toBe(false);
    });

    it('should return true when complete', () => {
      const phase = timer.getPhase(0);
      const complete = timer.isPhaseComplete(phase, 25 * 60);
      expect(complete).toBe(true);
    });

    it('should return true when exceeded', () => {
      const phase = timer.getPhase(0);
      const complete = timer.isPhaseComplete(phase, 30 * 60);
      expect(complete).toBe(true);
    });
  });

  describe('formatTime', () => {
    it('should format minutes and seconds', () => {
      expect(timer.formatTime(65)).toBe('01:05');
      expect(timer.formatTime(3661)).toBe('01:01:01');
      expect(timer.formatTime(0)).toBe('00:00');
    });
  });

  describe('constructor validation', () => {
    it('should throw on invalid durations', () => {
      expect(
        () =>
          new Timer({
            workDurationMinutes: 0,
            shortBreakDurationMinutes: 5,
            longBreakInterval: 4,
            longBreakDurationMinutes: 15,
          })
      ).toThrow();

      expect(
        () =>
          new Timer({
            workDurationMinutes: 25,
            shortBreakDurationMinutes: -1,
            longBreakInterval: 4,
            longBreakDurationMinutes: 15,
          })
      ).toThrow();
    });
  });
});
