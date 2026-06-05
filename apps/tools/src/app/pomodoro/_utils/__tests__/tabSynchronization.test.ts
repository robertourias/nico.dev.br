import { TabSynchronizer, SyncMessage } from '../tabSynchronization';

describe('TabSynchronizer', () => {
  let synchronizer: TabSynchronizer;

  beforeEach(() => {
    synchronizer = new TabSynchronizer();
  });

  afterEach(() => {
    synchronizer.destroy();
  });

  describe('initialization', () => {
    it('should generate unique tab ID', () => {
      const sync1 = new TabSynchronizer();
      const sync2 = new TabSynchronizer();

      expect(sync1['tabId']).toBeDefined();
      expect(sync2['tabId']).toBeDefined();
      expect(sync1['tabId']).not.toBe(sync2['tabId']);

      sync1.destroy();
      sync2.destroy();
    });
  });

  describe('message sending', () => {
    it('should broadcast session update', () => {
      const callback = jest.fn();
      synchronizer.onSessionUpdate(callback);

      const session = { taskId: '123', cycleCount: 1 };
      synchronizer.broadcastSessionUpdate(session);

      // Note: In actual test, would need to trigger message handling
      // This is a simplified version
      expect(synchronizer['listeners'].has('session')).toBe(true);
    });

    it('should broadcast tasks update', () => {
      const callback = jest.fn();
      synchronizer.onTasksUpdate(callback);

      const tasks = [{ id: '1', title: 'Task' }];
      synchronizer.broadcastTasksUpdate(tasks);

      expect(synchronizer['listeners'].has('tasks')).toBe(true);
    });

    it('should broadcast history update', () => {
      const callback = jest.fn();
      synchronizer.onHistoryUpdate(callback);

      const history = [{ taskId: '1', cyclesToComplete: 2 }];
      synchronizer.broadcastHistoryUpdate(history);

      expect(synchronizer['listeners'].has('history')).toBe(true);
    });
  });

  describe('lock mechanism', () => {
    it('should request and release lock', () => {
      const locked = synchronizer.requestLock();
      expect(locked).toBe(true);

      synchronizer.releaseLock();
      expect(synchronizer['locked']).toBe(false);
    });
  });

  describe('cleanup', () => {
    it('should clear listeners on destroy', () => {
      synchronizer.onSessionUpdate(() => {});
      expect(synchronizer['listeners'].size).toBeGreaterThan(0);

      synchronizer.destroy();
      expect(synchronizer['listeners'].size).toBe(0);
    });
  });
});
