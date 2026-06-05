import { LocalStorageAdapter } from '../StorageAdapter';

describe('LocalStorageAdapter', () => {
  let adapter: LocalStorageAdapter;

  beforeEach(() => {
    adapter = new LocalStorageAdapter();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('save and load', () => {
    it('should save and load string values', () => {
      adapter.save('key', 'value');
      expect(adapter.load('key')).toBe('value');
    });

    it('should save and load objects', () => {
      const obj = { name: 'test', count: 42 };
      adapter.save('key', obj);
      expect(adapter.load('key')).toEqual(obj);
    });

    it('should save and load arrays', () => {
      const arr = [1, 2, 3];
      adapter.save('key', arr);
      expect(adapter.load('key')).toEqual(arr);
    });

    it('should return null for non-existent key', () => {
      expect(adapter.load('nonexistent')).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a key', () => {
      adapter.save('key', 'value');
      expect(adapter.hasKey('key')).toBe(true);

      adapter.delete('key');
      expect(adapter.hasKey('key')).toBe(false);
    });

    it('should not throw when deleting non-existent key', () => {
      expect(() => adapter.delete('nonexistent')).not.toThrow();
    });
  });

  describe('hasKey', () => {
    it('should return true for existing key', () => {
      adapter.save('key', 'value');
      expect(adapter.hasKey('key')).toBe(true);
    });

    it('should return false for non-existent key', () => {
      expect(adapter.hasKey('key')).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all keys', () => {
      adapter.save('key1', 'value1');
      adapter.save('key2', 'value2');

      adapter.clear();

      expect(adapter.hasKey('key1')).toBe(false);
      expect(adapter.hasKey('key2')).toBe(false);
    });
  });

  describe('JSON serialization', () => {
    it('should handle null values', () => {
      adapter.save('key', null);
      expect(adapter.load('key')).toBe(null);
    });

    it('should handle undefined values', () => {
      adapter.save('key', undefined);
      expect(adapter.load('key')).toBe(undefined);
    });

    it('should handle boolean values', () => {
      adapter.save('key', true);
      expect(adapter.load('key')).toBe(true);
    });

    it('should handle numbers', () => {
      adapter.save('key', 42);
      expect(adapter.load('key')).toBe(42);
    });
  });

  describe('error handling', () => {
    it('should return null on parse error', () => {
      localStorage.setItem('key', 'invalid json {');
      expect(adapter.load('key')).toBeNull();
    });
  });
});
