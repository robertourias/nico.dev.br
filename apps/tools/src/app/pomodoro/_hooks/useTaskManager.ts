'use client';

import { useState, useCallback, useEffect } from 'react';
import { Task, ITask } from '@/domain/pomodoro';
import { PomodoroStorage, LocalStorageAdapter } from '@/infra/storage';

export interface UseTaskManagerReturn {
  tasks: Task[];
  isLoaded: boolean;
  addTask: (title: string, description?: string, estimatedCycles?: number) => Task;
  updateTask: (taskId: string, updates: Partial<ITask>) => void;
  deleteTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  clearCompletedTasks: () => void;
  getTaskById: (taskId: string) => Task | undefined;
}

export function useTaskManager(): UseTaskManagerReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const adapter = new LocalStorageAdapter();
  const storage = new PomodoroStorage(adapter);

  // Load tasks on mount
  useEffect(() => {
    const loadedTasks = storage.loadTasks();
    setTasks(loadedTasks);
    setIsLoaded(true);
  }, []);

  const addTask = useCallback(
    (title: string, description?: string, estimatedCycles: number = 1): Task => {
      try {
        const newTask = new Task({
          title,
          description,
          estimatedCycles,
          status: 'pending',
        });

        setTasks((prev) => {
          const updated = [...prev, newTask];
          storage.saveTasks(updated);
          return updated;
        });

        return newTask;
      } catch (error) {
        console.error('Failed to add task:', error);
        throw error;
      }
    },
    []
  );

  const updateTask = useCallback((taskId: string, updates: Partial<ITask>) => {
    try {
      setTasks((prev) => {
        const updated = prev.map((task) => {
          if (task.id === taskId) {
            return new Task({
              ...task,
              ...updates,
            });
          }

          return task;
        });

        storage.saveTasks(updated);
        return updated;
      });
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    try {
      setTasks((prev) => {
        const updated = prev.filter((task) => task.id !== taskId);
        storage.saveTasks(updated);
        return updated;
      });
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  }, []);

  const completeTask = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        const completedTask = task.markAsCompleted();
        updateTask(taskId, {
          status: completedTask.status,
          completedAt: completedTask.completedAt,
        });
      }
    },
    [tasks, updateTask]
  );

  const clearCompletedTasks = useCallback(() => {
    try {
      setTasks((prev) => {
        const updated = prev.filter((task) => task.status !== 'completed');
        storage.saveTasks(updated);
        return updated;
      });
    } catch (error) {
      console.error('Failed to clear completed tasks:', error);
      throw error;
    }
  }, []);

  const getTaskById = useCallback(
    (taskId: string) => {
      return tasks.find((t) => t.id === taskId);
    },
    [tasks]
  );

  return {
    tasks,
    isLoaded,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    clearCompletedTasks,
    getTaskById,
  };
}
