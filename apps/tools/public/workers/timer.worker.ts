type WorkerMessage =
  | { type: 'START'; durationSeconds: number }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'STOP' }
  | { type: 'SYNC_TIME'; serverTime: number };

interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  durationSeconds: number;
  elapsedSeconds: number;
  startTime: number;
  pausedTime: number;
  lastSyncTime: number;
}

let state: TimerState = {
  isRunning: false,
  isPaused: false,
  durationSeconds: 0,
  elapsedSeconds: 0,
  startTime: 0,
  pausedTime: 0,
  lastSyncTime: Date.now(),
};

let intervalId: number | null = null;

function calculateElapsed(): number {
  if (!state.isRunning) return state.elapsedSeconds;
  if (state.isPaused) return state.elapsedSeconds;

  const now = Date.now();
  const totalElapsed = state.elapsedSeconds + (now - state.startTime) / 1000;

  return Math.min(totalElapsed, state.durationSeconds);
}

function tick(): void {
  const elapsed = calculateElapsed();
  const remaining = Math.max(0, state.durationSeconds - elapsed);

  const message = {
    type: 'TICK' as const,
    secondsRemaining: Math.round(remaining),
    elapsedSeconds: Math.round(elapsed),
  };

  self.postMessage(message);

  // Check if timer is complete
  if (elapsed >= state.durationSeconds) {
    state.isRunning = false;
    state.elapsedSeconds = 0;

    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }

    self.postMessage({ type: 'COMPLETE' });
  }
}

function startTimer(durationSeconds: number): void {
  state.isRunning = true;
  state.isPaused = false;
  state.durationSeconds = durationSeconds;
  state.elapsedSeconds = 0;
  state.startTime = Date.now();
  state.pausedTime = 0;

  if (intervalId !== null) {
    clearInterval(intervalId);
  }

  // Tick every 100ms for smooth updates
  intervalId = setInterval(tick, 100) as unknown as number;

  tick(); // Immediate first tick
}

function pauseTimer(): void {
  if (!state.isRunning || state.isPaused) return;

  state.isPaused = true;
  state.elapsedSeconds = calculateElapsed();
  state.pausedTime = Date.now();
}

function resumeTimer(): void {
  if (!state.isRunning || !state.isPaused) return;

  state.isPaused = false;
  state.startTime = Date.now() - (state.elapsedSeconds * 1000);
}

function stopTimer(): void {
  state.isRunning = false;
  state.isPaused = false;
  state.elapsedSeconds = 0;

  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function syncTime(serverTime: number): void {
  const clientTime = Date.now();
  const drift = clientTime - serverTime;

  if (state.isRunning && !state.isPaused) {
    // Adjust startTime to account for drift
    state.startTime += drift;
  }

  state.lastSyncTime = serverTime;

  self.postMessage({
    type: 'SYNC_ACK',
    drift,
  });
}

self.onmessage = (event: MessageEvent<WorkerMessage>): void => {
  const { type } = event.data;

  switch (type) {
    case 'START':
      startTimer(event.data.durationSeconds);
      break;

    case 'PAUSE':
      pauseTimer();
      break;

    case 'RESUME':
      resumeTimer();
      break;

    case 'STOP':
      stopTimer();
      break;

    case 'SYNC_TIME':
      syncTime(event.data.serverTime);
      break;

    default:
      console.warn('Unknown message type', type);
  }
};

export {};
