import { create } from 'zustand';
import { saveToStorage, loadFromStorage, onStorageChange, STORAGE_KEYS, debounce } from '../lib/storage';

interface PerformanceData {
  time: string;
  read: number;
  write: number;
}

interface OperationCount {
  operation: string;
  count: number;
}

interface PerformanceState {
  performanceHistory: PerformanceData[];
  operationCounts: OperationCount[];
  fragmentation: number;
  
  // Actions
  addPerformanceData: (data: PerformanceData) => void;
  incrementOperation: (operation: string) => void;
  updateFragmentation: (value: number) => void;
  reset: () => void;
  loadFromStorage: () => void;
}

// Default state
const defaultState = {
  performanceHistory: [
    { time: '0s', read: 0, write: 0 },
  ],
  operationCounts: [
    { operation: 'Create', count: 0 },
    { operation: 'Read', count: 0 },
    { operation: 'Write', count: 0 },
    { operation: 'Delete', count: 0 },
  ],
  fragmentation: 0,
};

// Load initial state from storage
const initialState = loadFromStorage(STORAGE_KEYS.PERFORMANCE, defaultState);

// Debounced save function
const debouncedSave = debounce((state: Omit<PerformanceState, 'addPerformanceData' | 'incrementOperation' | 'updateFragmentation' | 'reset' | 'loadFromStorage'>) => {
  saveToStorage(STORAGE_KEYS.PERFORMANCE, {
    performanceHistory: state.performanceHistory,
    operationCounts: state.operationCounts,
    fragmentation: state.fragmentation,
  });
}, 300);

export const usePerformanceStore = create<PerformanceState>((set) => ({
  ...initialState,

  addPerformanceData: (data) =>
    set((state) => {
      const newState = {
        performanceHistory: [...state.performanceHistory.slice(-19), data],
      };
      debouncedSave({ ...state, ...newState });
      return newState;
    }),

  incrementOperation: (operation) =>
    set((state) => {
      const newState = {
        operationCounts: state.operationCounts.map((op) =>
          op.operation === operation ? { ...op, count: op.count + 1 } : op
        ),
      };
      debouncedSave({ ...state, ...newState });
      return newState;
    }),

  updateFragmentation: (value) =>
    set((state) => {
      const newState = { fragmentation: value };
      debouncedSave({ ...state, ...newState });
      return newState;
    }),

  reset: () =>
    set(() => {
      const newState = defaultState;
      debouncedSave(newState);
      return newState;
    }),

  loadFromStorage: () => {
    const stored = loadFromStorage(STORAGE_KEYS.PERFORMANCE, defaultState);
    set(stored);
  },
}));

// Set up cross-tab synchronization
if (typeof window !== 'undefined') {
  onStorageChange(STORAGE_KEYS.PERFORMANCE, () => {
    usePerformanceStore.getState().loadFromStorage();
  });
}

