'use client';

import { Task } from '@/domain/pomodoro';
import { Trash2, Check, Minus, Plus } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  activeTaskId?: string | null;
  onSelectTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onCompleteTask: (taskId: string) => void;
  onUpdateCycles: (taskId: string, delta: number) => void;
  onAddTask?: () => void;
  onClearCompleted?: () => void;
  hideTitle?: boolean;
}

export function TaskList({
  tasks,
  activeTaskId,
  onSelectTask,
  onDeleteTask,
  onCompleteTask,
  onUpdateCycles,
  onAddTask,
  onClearCompleted,
  hideTitle,
}: TaskListProps) {
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        {!hideTitle && <h3 className="text-lg font-semibold text-foreground">Tarefas</h3>}
        {onAddTask && (
          <button
            onClick={onAddTask}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
            title="Nova tarefa"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Pending Tasks */}
      <div>
        {pendingTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Nenhuma tarefa pendente</p>
        ) : (
          <div className="space-y-2">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  activeTaskId === task.id
                    ? 'border-primary bg-accent'
                    : 'border-border hover:border-primary/40'
                }`}
                onClick={() => onSelectTask(task.id)}
              >
                <div className="flex items-center gap-2">
                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-muted-foreground truncate">{task.description}</p>
                    )}
                  </div>

                  {/* Cycle counter */}
                  <div
                    className="flex items-center gap-0.5 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onUpdateCycles(task.id, -1)}
                      className="w-5 h-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Reduzir ciclos"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-medium text-foreground w-5 text-center">
                      {task.estimatedCycles}
                    </span>
                    <button
                      onClick={() => onUpdateCycles(task.id, 1)}
                      className="w-5 h-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Aumentar ciclos"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCompleteTask(task.id);
                      }}
                      className="p-1 hover:bg-green-100 dark:hover:bg-green-900 rounded transition-colors"
                      title="Concluir tarefa"
                    >
                      <Check className="w-4 h-4 text-green-600" />
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
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-muted-foreground">CONCLUÍDAS ({completedTasks.length})</p>
            {onClearCompleted && (
              <button
                onClick={onClearCompleted}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                title="Limpar concluídas"
              >
                Limpar
              </button>
            )}
          </div>
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
