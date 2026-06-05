import { Task } from '../Task';

describe('Task', () => {
  describe('constructor', () => {
    it('should create task with required fields', () => {
      const task = new Task({
        title: 'Test Task',
        estimatedCycles: 2,
        status: 'pending',
      });

      expect(task.title).toBe('Test Task');
      expect(task.estimatedCycles).toBe(2);
      expect(task.status).toBe('pending');
      expect(task.id).toBeDefined();
      expect(task.createdAt).toBeDefined();
    });

    it('should throw on empty title', () => {
      expect(
        () =>
          new Task({
            title: '',
            estimatedCycles: 2,
            status: 'pending',
          })
      ).toThrow();

      expect(
        () =>
          new Task({
            title: '   ',
            estimatedCycles: 2,
            status: 'pending',
          })
      ).toThrow();
    });

    it('should throw on invalid estimated cycles', () => {
      expect(
        () =>
          new Task({
            title: 'Task',
            estimatedCycles: 0,
            status: 'pending',
          })
      ).toThrow();
    });
  });

  describe('status methods', () => {
    let task: Task;

    beforeEach(() => {
      task = new Task({
        title: 'Test Task',
        estimatedCycles: 2,
        status: 'pending',
      });
    });

    it('should check status correctly', () => {
      expect(task.isPending()).toBe(true);
      expect(task.isActive()).toBe(false);
      expect(task.isCompleted()).toBe(false);
    });

    it('should mark as active', () => {
      const active = task.markAsActive();
      expect(active.status).toBe('active');
      expect(active.id).toBe(task.id); // Same ID
    });

    it('should mark as completed', () => {
      const completed = task.markAsCompleted();
      expect(completed.status).toBe('completed');
      expect(completed.completedAt).toBeDefined();
      expect(completed.completedAt! > 0).toBe(true);
    });

    it('should mark as pending', () => {
      const active = task.markAsActive();
      const pending = active.markAsPending();
      expect(pending.status).toBe('pending');
      expect(pending.completedAt).toBeUndefined();
    });
  });

  describe('immutability', () => {
    it('should not mutate original task', () => {
      const original = new Task({
        title: 'Original',
        estimatedCycles: 1,
        status: 'pending',
      });

      const modified = original.markAsActive();

      expect(original.status).toBe('pending');
      expect(modified.status).toBe('active');
    });
  });

  describe('elapsed time', () => {
    it('should return 0 for incomplete task', () => {
      const task = new Task({
        title: 'Task',
        estimatedCycles: 1,
        status: 'pending',
      });

      expect(task.getElapsedTime()).toBe(0);
    });

    it('should calculate elapsed time for completed task', () => {
      const now = Date.now();
      const task = new Task({
        title: 'Task',
        estimatedCycles: 1,
        status: 'completed',
        createdAt: now - 60000, // 1 minute ago
        completedAt: now,
      });

      expect(task.getElapsedTime()).toBe(1); // 1 minute
    });
  });
});
