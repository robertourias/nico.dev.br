export interface IStorageAdapter {
  save(key: string, value: unknown): void;
  load<T = unknown>(key: string): T | null;
  delete(key: string): void;
  clear(): void;
  hasKey(key: string): boolean;
}

export class LocalStorageAdapter implements IStorageAdapter {
  private isAvailable: boolean;

  constructor() {
    this.isAvailable = this.checkAvailability();
  }

  private checkAvailability(): boolean {
    try {
      const test = '__storage_test__';
      if (typeof window === 'undefined') return false;
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  save(key: string, value: unknown): void {
    if (!this.isAvailable) {
      console.warn('localStorage is not available');
      return;
    }

    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'QuotaExceededError') {
          console.error(`localStorage quota exceeded for key: ${key}`);
          throw new Error('Storage quota exceeded');
        }
      }
      throw error;
    }
  }

  load<T = unknown>(key: string): T | null {
    if (!this.isAvailable) {
      return null;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return null;
      }

      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Failed to load item from localStorage for key: ${key}`, error);
      return null;
    }
  }

  delete(key: string): void {
    if (!this.isAvailable) {
      return;
    }

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to delete item from localStorage for key: ${key}`, error);
    }
  }

  clear(): void {
    if (!this.isAvailable) {
      return;
    }

    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage', error);
    }
  }

  hasKey(key: string): boolean {
    if (!this.isAvailable) {
      return false;
    }

    return localStorage.getItem(key) !== null;
  }

  getSize(): number {
    if (!this.isAvailable) {
      return 0;
    }

    let size = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        size += localStorage[key].length + key.length;
      }
    }

    return size; // bytes
  }
}
