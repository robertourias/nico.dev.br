'use client';

import { HistoryRecord } from '@/domain/pomodoro';

interface HistoryPanelProps {
  records: HistoryRecord[];
  totalStats: {
    totalTasks: number;
    totalCycles: number;
    totalTimeMinutes: number;
    averageCyclesPerTask: number;
    averageTimePerTask: number;
  };
}

export function HistoryPanel({ records, totalStats }: HistoryPanelProps) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <h3 className="text-lg font-semibold text-foreground">Histórico & Estatísticas</h3>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
          <p className="text-xs text-muted-foreground">Total de Tarefas</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalStats.totalTasks}</p>
        </div>
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950">
          <p className="text-xs text-muted-foreground">Total de Ciclos</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{totalStats.totalCycles}</p>
        </div>
        <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950">
          <p className="text-xs text-muted-foreground">Tempo Total</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {Math.floor(totalStats.totalTimeMinutes / 60)}h {totalStats.totalTimeMinutes % 60}m
          </p>
        </div>
        <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950">
          <p className="text-xs text-muted-foreground">Média por Tarefa</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {totalStats.averageTimePerTask}m
          </p>
        </div>
      </div>

      {/* Records Table */}
      {records.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-center">
          <p className="text-sm text-muted-foreground">Nenhuma tarefa concluída ainda</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-accent">
              <tr className="border-b">
                <th className="px-3 py-2 text-left font-semibold">Tarefa</th>
                <th className="px-3 py-2 text-center font-semibold">Ciclos</th>
                <th className="px-3 py-2 text-right font-semibold">Tempo</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={`${record.taskId}-${record.completedAt}`} className="border-b hover:bg-muted">
                  <td className="px-3 py-2 text-foreground">
                    <div>
                      <p className="font-medium truncate">{record.taskTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        {record.getFormattedDate()} às {record.getFormattedTime()}
                      </p>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center text-foreground">{record.cyclesToComplete}</td>
                  <td className="px-3 py-2 text-right text-foreground">{record.getFormattedDuration()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
