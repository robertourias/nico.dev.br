'use client';

import { useState, useEffect, useMemo } from 'react';
import { Timer } from '@/domain/pomodoro';
import { useTimerConfig, usePomodoroSession, useTaskManager, useHistory, useLiveStats } from '../_hooks';
import {
  TimerDisplay,
  PhaseIndicator,
  TaskList,
  HistoryPanel,
  ConfigModal,
  FloatingTimerWidget,
} from './index';
import { Play, Pause, SkipForward, Settings } from 'lucide-react';
import { Button } from '@nico.dev/ui';
import { playNotificationSound } from '../_utils/playNotificationSound';
import { sendPhaseNotification, requestNotificationPermission } from '../_utils/browserNotification';

export function PomodoroApp() {
  const { config, isLoaded: configLoaded, updateConfig } = useTimerConfig();
  const { tasks, addTask, deleteTask, completeTask: markTaskComplete, updateTask, clearCompletedTasks } = useTaskManager();
  const { records, addRecord } = useHistory();
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showFloatingWidget, setShowFloatingWidget] = useState(false);
  const [lastPhase, setLastPhase] = useState<string | null>(null);

  const timer = useMemo(() => config ? new Timer({
    workDurationMinutes: config.workDuration,
    shortBreakDurationMinutes: config.shortBreakDuration,
    longBreakInterval: config.longBreakInterval,
    longBreakDurationMinutes: config.longBreakDuration,
  }) : null, [config]);

  const { session, isRunning, startCycle, pause, resume, skipToNextPhase, stopSession } =
    usePomodoroSession(timer);

  const liveStats = useLiveStats(isRunning, session?.cycleCount, session?.currentPhase);

  // Phase change: sound + browser notification
  useEffect(() => {
    if (session && session.currentPhase !== lastPhase) {
      playNotificationSound();
      sendPhaseNotification(session.currentPhase);
      setLastPhase(session.currentPhase);
    }
  }, [session?.currentPhase, lastPhase]);

  // Tab visibility: show floating widget when tab hidden and running
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && session && isRunning) {
        setShowFloatingWidget(true);
      } else {
        setShowFloatingWidget(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [session, isRunning]);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle);
      setNewTaskTitle('');
      setShowAddTaskModal(false);
    }
  };

  const handleCompleteTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task && session?.taskId === taskId) {
      addRecord({
        taskId,
        taskTitle: task.title,
        completedAt: Date.now(),
        cyclesToComplete: session.cycleCount,
        realTimeMinutes: Math.round((Date.now() - session.startedAt) / 1000 / 60),
      });
      markTaskComplete(taskId);
      stopSession();
    } else if (task) {
      markTaskComplete(taskId);
    }
  };

  const handleUpdateCycles = (taskId: string, delta: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      updateTask(taskId, { estimatedCycles: Math.max(1, task.estimatedCycles + delta) });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (session?.taskId === taskId) {
      stopSession();
    }
    deleteTask(taskId);
  };

  const handleStartCycle = (taskId: string | null) => {
    requestNotificationPermission();
    startCycle(taskId);
  };

  const totalTasksCompleted = tasks.filter((t) => t.status === 'completed').length;
  const averageTimePerTaskMinutes = records.length > 0
    ? Math.round(records.reduce((sum, r) => sum + r.realTimeMinutes, 0) / records.length)
    : 0;

  if (!configLoaded || !timer) {
    return <div className="flex items-center justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border py-4 shrink-0">
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Pomodoro Timer</h1>
          <button
            onClick={() => setShowConfigModal(true)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            title="Configurações"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">

          {/* Timer Area */}
          <div className="flex flex-col items-center gap-4">
            {session && config ? (
              <>
                <PhaseIndicator
                  phase={session.currentPhase}
                  cycleCount={session.cycleCount}
                  longBreakInterval={config.longBreakInterval}
                />
                <TimerDisplay
                  secondsRemaining={session.secondsRemaining}
                  phase={session.currentPhase}
                  isRunning={isRunning}
                />
                <div className="flex gap-3">
                  {!isRunning ? (
                    <Button onClick={resume} size="lg">
                      <Play className="w-4 h-4" /> Retomar
                    </Button>
                  ) : (
                    <Button onClick={pause} variant="outline" size="lg">
                      <Pause className="w-4 h-4" /> Pausar
                    </Button>
                  )}
                  <Button onClick={skipToNextPhase} variant="outline" size="lg">
                    <SkipForward className="w-4 h-4" /> Pular
                  </Button>
                  <Button onClick={stopSession} variant="destructive" size="lg">
                    Parar
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl font-bold text-muted-foreground mb-4 font-mono tabular-nums">
                  00:00
                </div>
                <p className="text-muted-foreground mb-6">Selecione uma tarefa para começar</p>
                <Button onClick={() => handleStartCycle(null)} size="lg">
                  <Play className="w-4 h-4" /> Iniciar
                </Button>
              </div>
            )}
          </div>

          {/* Task List */}
          <div className="bg-accent rounded-lg p-4">
            <TaskList
              tasks={tasks}
              activeTaskId={session?.taskId}
              onSelectTask={(taskId) => {
                if (!session) handleStartCycle(taskId);
              }}
              onDeleteTask={handleDeleteTask}
              onCompleteTask={handleCompleteTask}
              onUpdateCycles={handleUpdateCycles}
              onAddTask={() => setShowAddTaskModal(true)}
              onClearCompleted={clearCompletedTasks}
            />
          </div>

          {/* History */}
          <div className="bg-accent rounded-lg p-4">
            <HistoryPanel
              records={records}
              totalStats={{
                totalTasks: totalTasksCompleted,
                totalCycles: liveStats.totalCycles,
                totalElapsedSeconds: liveStats.totalElapsedSeconds,
                averageTimePerTaskMinutes,
              }}
            />
          </div>

        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl p-6 w-full max-w-sm shadow-xl border border-border">
            <h3 className="font-semibold text-lg text-foreground mb-4">Nova Tarefa</h3>
            <input
              type="text"
              placeholder="Título da tarefa"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground mb-4 focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddTaskModal(false);
                  setNewTaskTitle('');
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleAddTask}>Adicionar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Widget */}
      {session && (
        <FloatingTimerWidget
          secondsRemaining={session.secondsRemaining}
          phase={session.currentPhase}
          isVisible={showFloatingWidget}
          onClose={() => setShowFloatingWidget(false)}
          onRestore={() => setShowFloatingWidget(false)}
        />
      )}

      {/* Config Modal */}
      {config && (
        <ConfigModal
          config={config.toJSON()}
          isOpen={showConfigModal}
          onSave={(newConfig) => {
            updateConfig(newConfig);
            setShowConfigModal(false);
          }}
          onCancel={() => setShowConfigModal(false)}
        />
      )}
    </div>
  );
}
