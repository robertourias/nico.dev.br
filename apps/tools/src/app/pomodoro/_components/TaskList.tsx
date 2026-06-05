'use client';

import { Task } from '@/domain/pomodoro';
import { Trash2, Play } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  activeTaskId?: string | null;
  onSelectTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onCompleteTask: (taskId: string) => void;
}

export function TaskList({
  tasks,
  activeTaskId,
  onSelectTask,
  onDeleteTask,
  onCompleteTask,
}: TaskListProps) {
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  return (
    <div className="flex flex-col gap-4 h-full">
      <h3 className="text-lg font-semibold text-foreground">Tarefas</h3>

      {/* Pending Tasks */}
      <div className="flex-1 overflow-y-auto">
        {pendingTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Nenhuma tarefa pendente</p>
        ) : (
          <div className="space-y-2">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  activeTaskId === task.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                    : 'border-border hover:border-blue-300 dark:hover:border-blue-700'
                }`}
                onClick={() => onSelectTask(task.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-muted-foreground truncate">{task.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {task.estimatedCycles} ciclo{task.estimatedCycles !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCompleteTask(task.id);
                      }}
                      className="p-1 hover:bg-green-100 dark:hover:bg-green-900 rounded transition-colors"
                      title="Concluir tarefa"
                    >
                      <Play className="w-4 h-4 text-green-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask(task.id);
                      }}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                      title="Deletar tarefa"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="border-t pt-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2">CONCLUÍDAS ({completedTasks.length})</p>
          <div className="space-y-1">
            {completedTasks.slice(0, 3).map((task) => (
              <div key={task.id} className="p-2 rounded text-xs text-muted-foreground bg-muted">
                <p className="line-through truncate">{task.title}</p>
              </div>
            ))}
            {completedTasks.length > 3 && (
              <p className="text-xs text-muted-foreground text-center py-1">
                +{completedTasks.length - 3} mais
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
