/**
 * Session Storage utilities with cross-tab synchronization
 */

export const STORAGE_KEYS = {
  FILE_SYSTEM: 'fs-simulator-file-system',
  PERFORMANCE: 'fs-simulator-performance',
  SYNC_EVENT: 'fs-simulator-sync',
} as const;

// Save to session storage
export function saveToStorage<T>(key: string, data: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
    // Broadcast change to other tabs
    broadcastStorageChange(key);
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
}

// Load from session storage
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from storage:', error);
    return defaultValue;
  }
}

// Clear storage
export function clearStorage(key: string): void {
  try {
    sessionStorage.removeItem(key);
    broadcastStorageChange(key);
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
}

// Broadcast storage change to other tabs using BroadcastChannel
const channels = new Map<string, BroadcastChannel>();

function getBroadcastChannel(key: string): BroadcastChannel {
  if (!channels.has(key)) {
    channels.set(key, new BroadcastChannel(key));
  }
  return channels.get(key)!;
}

function broadcastStorageChange(key: string): void {
  try {
    const channel = getBroadcastChannel(key);
    channel.postMessage({ type: 'update', timestamp: Date.now() });
  } catch (error) {
    console.error('Error broadcasting change:', error);
  }
}

// Listen for storage changes from other tabs
export function onStorageChange(key: string, callback: () => void): () => void {
  try {
    const channel = getBroadcastChannel(key);
    
    const handler = (event: MessageEvent) => {
      if (event.data.type === 'update') {
        callback();
      }
    };

    channel.addEventListener('message', handler);

    // Return cleanup function
    return () => {
      channel.removeEventListener('message', handler);
    };
  } catch (error) {
    console.error('Error setting up storage listener:', error);
    return () => {};
  }
}

// Debounce function to limit storage writes
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait) as unknown as number;
  };
}

