type WorkerMessage =
  | { type: 'START'; durationSeconds: number }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'STOP' }
  | { type: 'SYNC_TIME'; serverTime: number };

type WorkerResponse =
  | { type: 'TICK'; secondsRemaining: number; elapsedSeconds: number }
  | { type: 'COMPLETE' }
  | { type: 'SYNC_ACK'; drift: number };

export interface TimerWorkerListener {
  onTick?(remaining: number, elapsed: number): void;
  onComplete?(): void;
  onError?(error: Error): void;
}

export class TimerWorkerManager {
  private worker: Worker | null = null;
  private isSupported: boolean;
  private messageQueue: WorkerMessage[] = [];
  private listeners: TimerWorkerListener[] = [];
  private fallbackIntervalId: number | null = null;
  private fallbackElapsed: number = 0;
  private fallbackDuration: number = 0;
  private fallbackRunning: boolean = false;

  constructor() {
    this.isSupported = this.checkWorkerSupport();

    if (this.isSupported) {
      this.initializeWorker();
    }
  }

  private checkWorkerSupport(): boolean {
    return typeof Worker !== 'undefined' && typeof window !== 'undefined';
  }

  private initializeWorker(): void {
    try {
      // Web Worker from public directory (public/workers/timer.worker.js)
      // Use absolute path from site root
      const worker = new Worker('/workers/timer.worker.js');
      this.worker = worker;

      this.worker.onmessage = (event: MessageEvent<WorkerResponse>): void => {
        this.handleWorkerMessage(event.data);
      };

      this.worker.onerror = (error: ErrorEvent): void => {
        console.error('Worker error:', error);
        this.notifyError(new Error(error.message));
        this.fallbackToSetInterval();
      };

      // Process any queued messages
      while (this.messageQueue.length > 0) {
        const msg = this.messageQueue.shift();
        if (msg) {
          this.worker.postMessage(msg);
        }
      }
    } catch (error) {
      console.warn('Failed to initialize Worker, falling back to setInterval:', error);
      this.fallbackToSetInterval();
    }
  }

  private handleWorkerMessage(response: WorkerResponse): void {
    switch (response.type) {
      case 'TICK':
        this.notifyTick(response.secondsRemaining, response.elapsedSeconds);
        break;

      case 'COMPLETE':
        this.notifyComplete();
        break;

      case 'SYNC_ACK':
        // Drift acknowledged
        break;

      default:
        console.warn('Unknown worker response type');
    }
  }

  private fallbackToSetInterval(): void {
    this.worker = null;

    if (this.fallbackRunning) {
      // Resume with setInterval
      this.startFallbackTimer();
    }
  }

  private startFallbackTimer(): void {
    if (this.fallbackIntervalId !== null) {
      clearInterval(this.fallbackIntervalId);
    }

    this.fallbackIntervalId = setInterval(() => {
      this.fallbackElapsed += 0.1;
      const remaining = Math.max(0, this.fallbackDuration - this.fallbackElapsed);

      this.notifyTick(Math.round(remaining), Math.round(this.fallbackElapsed));

      if (this.fallbackElapsed >= this.fallbackDuration) {
        this.stopFallbackTimer();
        this.notifyComplete();
      }
    }, 100) as unknown as number;
  }

  private stopFallbackTimer(): void {
    if (this.fallbackIntervalId !== null) {
      clearInterval(this.fallbackIntervalId);
      this.fallbackIntervalId = null;
    }

    this.fallbackRunning = false;
    this.fallbackElapsed = 0;
    this.fallbackDuration = 0;
  }

  private sendMessage(message: WorkerMessage): void {
    if (this.worker) {
      this.worker.postMessage(message);
    } else {
      this.messageQueue.push(message);
    }
  }

  private notifyTick(remaining: number, elapsed: number): void {
    this.listeners.forEach((l) => l.onTick?.(remaining, elapsed));
  }

  private notifyComplete(): void {
    this.listeners.forEach((l) => l.onComplete?.());
  }

  private notifyError(error: Error): void {
    this.listeners.forEach((l) => l.onError?.(error));
  }

  // Public API
  start(durationSeconds: number): void {
    if (this.worker) {
      this.sendMessage({ type: 'START', durationSeconds });
    } else {
      this.fallbackDuration = durationSeconds;
      this.fallbackElapsed = 0;
      this.fallbackRunning = true;
      this.startFallbackTimer();
    }
  }

  pause(): void {
    if (this.worker) {
      this.sendMessage({ type: 'PAUSE' });
    } else {
      if (this.fallbackIntervalId !== null) {
        clearInterval(this.fallbackIntervalId);
        this.fallbackIntervalId = null;
      }
    }
  }

  resume(): void {
    if (this.worker) {
      this.sendMessage({ type: 'RESUME' });
    } else {
      if (this.fallbackRunning) {
        this.startFallbackTimer();
      }
    }
  }

  stop(): void {
    if (this.worker) {
      this.sendMessage({ type: 'STOP' });
    } else {
      this.stopFallbackTimer();
    }
  }

  syncTime(serverTime: number): void {
    if (this.worker) {
      this.sendMessage({ type: 'SYNC_TIME', serverTime });
    }
  }

  addListener(listener: TimerWorkerListener): void {
    this.listeners.push(listener);
  }

  removeListener(listener: TimerWorkerListener): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  destroy(): void {
    this.stop();

    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }

    this.listeners = [];
    this.messageQueue = [];
  }

  isWorkerSupported(): boolean {
    return this.isSupported && this.worker !== null;
  }
}
