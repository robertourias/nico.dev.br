'use client';

import { useState, useEffect } from 'react';
import { Timer } from '@/domain/pomodoro';
import { useTimerConfig, usePomodoroSession, useTaskManager, useHistory } from '../_hooks';
import {
  TimerDisplay,
  PhaseIndicator,
  TaskList,
  HistoryPanel,
  ConfigModal,
  FloatingTimerWidget,
} from './index';
import { Play, Pause, SkipForward, Settings, Trash2 } from 'lucide-react';
import { playNotificationSound } from '../_utils/playNotificationSound';

export function PomodoroApp() {
  const { config, isLoaded: configLoaded, updateConfig } = useTimerConfig();
  const { tasks, addTask, deleteTask, completeTask: markTaskComplete } = useTaskManager();
  const { records, getTotalStats, addRecord } = useHistory();
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCycles, setNewTaskCycles] = useState(1);
  const [showFloatingWidget, setShowFloatingWidget] = useState(false);
  const [lastPhase, setLastPhase] = useState<string | null>(null);

  const timer = config ? new Timer({
    workDurationMinutes: config.workDuration,
    shortBreakDurationMinutes: config.shortBreakDuration,
    longBreakInterval: config.longBreakInterval,
    longBreakDurationMinutes: config.longBreakDuration,
  }) : null;

  const { session, isRunning, formattedTime, startCycle, pause, resume, skipToNextPhase, stopSession } =
    usePomodoroSession(timer);

  // Phase change detection for sound
  useEffect(() => {
    if (session && session.currentPhase !== lastPhase) {
      playNotificationSound();
      setLastPhase(session.currentPhase);
    }
  }, [session?.currentPhase, lastPhase]);

  // Tab visibility handling
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
      addTask(newTaskTitle, '', newTaskCycles);
      setNewTaskTitle('');
      setNewTaskCycles(1);
    }
  };

  const handleCompleteTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task && session?.taskId === taskId) {
      // Record completion
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

  const stats = getTotalStats();

  if (!configLoaded || !timer) {
    return <div className="flex items-center justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="w-full h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pomodoro Timer</h1>
        <button
          onClick={() => setShowConfigModal(true)}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
          title="Configurações"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-4 p-4">
        {/* Left: Timer */}
        <div className="flex-1 flex flex-col items-center justify-center lg:border-r border-border">
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
              <div className="flex gap-3 mt-6">
                {!isRunning ? (
                  <button
                    onClick={resume}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" /> Retomar
                  </button>
                ) : (
                  <button
                    onClick={pause}
                    className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
                  >
                    <Pause className="w-4 h-4" /> Pausar
                  </button>
                )}
                <button
                  onClick={skipToNextPhase}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <SkipForward className="w-4 h-4" /> Pular
                </button>
                <button
                  onClick={stopSession}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Parar
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="text-6xl font-bold text-muted-foreground mb-4">00:00</div>
              <p className="text-muted-foreground mb-6">Selecione uma tarefa para começar</p>
              <button
                onClick={() => startCycle(null)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4" /> Iniciar
              </button>
            </div>
          )}
        </div>

        {/* Right: Sidebar */}
        <div className="w-full lg:w-96 flex flex-col gap-4 overflow-hidden">
          {/* Add Task */}
          <div className="bg-accent rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-foreground">Nova Tarefa</h3>
            <input
              type="text"
              placeholder="Título da tarefa"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="10"
                value={newTaskCycles}
                onChange={(e) => setNewTaskCycles(parseInt(e.target.value) || 1)}
                className="w-16 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddTask}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Adicionar
              </button>
            </div>
          </div>

          {/* Task List */}
          <div className="flex-1 overflow-hidden bg-accent rounded-lg p-4">
            <TaskList
              tasks={tasks}
              activeTaskId={session?.taskId}
              onSelectTask={(taskId) => {
                if (!session) startCycle(taskId);
              }}
              onDeleteTask={deleteTask}
              onCompleteTask={handleCompleteTask}
            />
          </div>

          {/* History */}
          <div className="h-48 bg-accent rounded-lg p-4 overflow-hidden">
            <HistoryPanel records={records} totalStats={stats} />
          </div>
        </div>
      </div>

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
