'use client';

import { HistoryRecord } from '@/domain/pomodoro';

interface HistoryPanelProps {
  records: HistoryRecord[];
  totalStats: {
    totalTasks: number;
    totalCycles: number;
    totalElapsedSeconds: number;
    averageTimePerTaskMinutes: number;
  };
}

function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
  }
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

export function HistoryPanel({ records, totalStats }: HistoryPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-foreground">Histórico & Estatísticas</h3>

      {/* Stats Cards */}
      <div className="flex flex-col gap-2">
        <div className="p-3 rounded-lg bg-surface-raised text-center">
          <p className="text-xs text-muted-foreground">Total de Tarefas</p>
          <p className="text-2xl font-bold text-foreground">{totalStats.totalTasks}</p>
        </div>
        <div className="p-3 rounded-lg bg-surface-raised text-center">
          <p className="text-xs text-muted-foreground">Total de Ciclos</p>
          <p className="text-2xl font-bold text-foreground">{totalStats.totalCycles}</p>
        </div>
        <div className="p-3 rounded-lg bg-surface-raised text-center">
          <p className="text-xs text-muted-foreground">Tempo Total</p>
          <p className="text-lg font-bold text-foreground tabular-nums">
            {formatElapsed(totalStats.totalElapsedSeconds)}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-surface-raised text-center">
          <p className="text-xs text-muted-foreground">Média por Tarefa</p>
          <p className="text-2xl font-bold text-foreground">
            {totalStats.averageTimePerTaskMinutes}m
          </p>
        </div>
      </div>

      {/* Records Table */}
      {records.length > 0 && (
        <div className="border border-border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-accent">
              <tr className="border-b border-border">
                <th className="px-3 py-2 text-left font-semibold">Tarefa</th>
                <th className="px-3 py-2 text-center font-semibold">Ciclos</th>
                <th className="px-3 py-2 text-right font-semibold">Tempo</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={`${record.taskId}-${record.completedAt}`} className="border-b border-border hover:bg-muted">
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
