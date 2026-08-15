// Universal Safe Storage Engine with In-Memory Fallback
// Guarantees zero crashes even in restricted sandboxed iframes or private browsing modes

const memoryStore = new Map<string, string>();

export const safeLocalStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const val = window.localStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch (e) {
      // Storage access blocked or restricted
    }
    return memoryStore.get(key) ?? null;
  },

  setItem(key: string, value: string): void {
    const strVal = String(value);
    memoryStore.set(key, strVal);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, strVal);
      }
    } catch (e) {
      // Storage access blocked or restricted
    }
  },

  removeItem(key: string): void {
    memoryStore.delete(key);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      // Storage access blocked
    }
  },

  clear(): void {
    memoryStore.clear();
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    } catch (e) {
      // Storage access blocked
    }
  },

  key(index: number): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.key(index);
      }
    } catch (e) {
      // Storage access blocked
    }
    const keys = Array.from(memoryStore.keys());
    return index >= 0 && index < keys.length ? keys[index] : null;
  },

  get length(): number {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.length;
      }
    } catch (e) {
      // Storage access blocked
    }
    return memoryStore.size;
  }
};
