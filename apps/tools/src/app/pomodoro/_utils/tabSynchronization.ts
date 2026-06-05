// Tab synchronization using BroadcastChannel API with localStorage fallback

const CHANNEL_NAME = 'pomodoro-sync';

export interface SyncMessage {
  type: 'session-update' | 'task-update' | 'history-update' | 'lock-request' | 'lock-release';
  payload?: unknown;
  timestamp: number;
  tabId: string;
}

export class TabSynchronizer {
  private channel: BroadcastChannel | null = null;
  private tabId: string;
  private listeners: Map<string, (payload: unknown) => void> = new Map();
  private locked: boolean = false;

  constructor() {
    this.tabId = this.generateTabId();

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event: MessageEvent<SyncMessage>) => {
          this.handleMessage(event.data);
        };
      } catch {
        // BroadcastChannel not supported, fallback to localStorage
        this.setupStorageListener();
      }
    } else {
      this.setupStorageListener();
    }
  }

  private generateTabId(): string {
    return `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupStorageListener(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (event.key?.startsWith('pomodoro-sync:')) {
          try {
            const message = JSON.parse(event.newValue || '{}') as SyncMessage;
            this.handleMessage(message);
          } catch {
            // Ignore parse errors
          }
        }
      });
    }
  }

  private handleMessage(message: SyncMessage): void {
    // Ignore own messages
    if (message.tabId === this.tabId) return;

    switch (message.type) {
      case 'session-update':
        this.listeners.get('session')?.(message.payload);
        break;
      case 'task-update':
        this.listeners.get('tasks')?.(message.payload);
        break;
      case 'history-update':
        this.listeners.get('history')?.(message.payload);
        break;
      case 'lock-request':
        if (!this.locked) {
          this.sendMessage('lock-release', {});
        }
        break;
    }
  }

  private sendMessage(type: SyncMessage['type'], payload: unknown): void {
    const message: SyncMessage = {
      type,
      payload,
      timestamp: Date.now(),
      tabId: this.tabId,
    };

    if (this.channel) {
      this.channel.postMessage(message);
    } else {
      // Fallback to localStorage
      try {
        localStorage.setItem(`pomodoro-sync:${type}`, JSON.stringify(message));
      } catch {
        // localStorage full or unavailable
      }
    }
  }

  onSessionUpdate(callback: (payload: unknown) => void): void {
    this.listeners.set('session', callback);
  }

  onTasksUpdate(callback: (payload: unknown) => void): void {
    this.listeners.set('tasks', callback);
  }

  onHistoryUpdate(callback: (payload: unknown) => void): void {
    this.listeners.set('history', callback);
  }

  broadcastSessionUpdate(session: unknown): void {
    this.sendMessage('session-update', session);
  }

  broadcastTasksUpdate(tasks: unknown): void {
    this.sendMessage('task-update', tasks);
  }

  broadcastHistoryUpdate(history: unknown): void {
    this.sendMessage('history-update', history);
  }

  requestLock(): boolean {
    this.sendMessage('lock-request', {});
    // Simple lock: just set flag locally
    // In production, would need proper distributed lock
    this.locked = true;
    return true;
  }

  releaseLock(): void {
    this.locked = false;
  }

  destroy(): void {
    if (this.channel) {
      this.channel.close();
    }

    this.listeners.clear();
  }
}

// Singleton instance
let synchronizer: TabSynchronizer | null = null;

export function getTabSynchronizer(): TabSynchronizer {
  if (!synchronizer) {
    synchronizer = new TabSynchronizer();
  }

  return synchronizer;
}
