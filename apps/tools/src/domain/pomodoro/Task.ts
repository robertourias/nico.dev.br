import { v4 as uuidv4 } from 'uuid';

export type TaskStatus = 'pending' | 'active' | 'completed';

export interface ITask {
  id: string;
  title: string;
  description?: string;
  estimatedCycles: number;
  status: TaskStatus;
  createdAt: number;
  completedAt?: number;
}

export class Task implements ITask {
  id: string;
  title: string;
  description?: string;
  estimatedCycles: number;
  status: TaskStatus;
  createdAt: number;
  completedAt?: number;

  constructor(data: Omit<ITask, 'id' | 'createdAt'> & { id?: string; createdAt?: number }) {
    if (!data.title || data.title.trim().length === 0) {
      throw new Error('Task title is required and cannot be empty');
    }

    if (data.estimatedCycles <= 0) {
      throw new Error('Estimated cycles must be greater than 0');
    }

    this.id = data.id || uuidv4();
    this.title = data.title;
    this.description = data.description;
    this.estimatedCycles = data.estimatedCycles;
    this.status = data.status;
    this.createdAt = data.createdAt || Date.now();
    this.completedAt = data.completedAt;
  }

  isCompleted(): boolean {
    return this.status === 'completed';
  }

  isActive(): boolean {
    return this.status === 'active';
  }

  isPending(): boolean {
    return this.status === 'pending';
  }

  markAsActive(): Task {
    return new Task({
      ...this,
      status: 'active',
    });
  }

  markAsCompleted(): Task {
    return new Task({
      ...this,
      status: 'completed',
      completedAt: Date.now(),
    });
  }

  markAsPending(): Task {
    return new Task({
      ...this,
      status: 'pending',
      completedAt: undefined,
    });
  }

  getElapsedTime(): number {
    if (!this.completedAt) {
      return 0;
    }

    return Math.floor((this.completedAt - this.createdAt) / 1000 / 60); // minutes
  }
}
