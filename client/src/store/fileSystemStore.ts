import { create } from 'zustand';
import type { Block, FileSystemFile, DiskStats } from '../types';
import { saveToStorage, loadFromStorage, onStorageChange, STORAGE_KEYS, debounce } from '../lib/storage';

interface FileSystemState {
  blocks: Block[];
  files: FileSystemFile[];
  diskStats: DiskStats;
  
  // Actions
  initializeDisk: (size: number) => void;
  allocateBlocks: (fileId: string, fileName: string, count: number) => void;
  freeBlocks: (fileId: string) => void;
  updateBlockStatus: (blockId: number, status: Block['status']) => void;
  loadFromStorage: () => void;
}

// Default state
const defaultState = {
  blocks: [],
  files: [],
  diskStats: {
    totalBlocks: 0,
    usedBlocks: 0,
    freeBlocks: 0,
    metadataBlocks: 0,
    badBlocks: 0,
    cachedBlocks: 0,
  },
};

// Load initial state from storage
const initialState = loadFromStorage(STORAGE_KEYS.FILE_SYSTEM, defaultState);

// Debounced save function to avoid too many writes
const debouncedSave = debounce((state: Omit<FileSystemState, 'initializeDisk' | 'allocateBlocks' | 'freeBlocks' | 'updateBlockStatus' | 'loadFromStorage'>) => {
  saveToStorage(STORAGE_KEYS.FILE_SYSTEM, {
    blocks: state.blocks,
    files: state.files,
    diskStats: state.diskStats,
  });
}, 300);

export const useFileSystemStore = create<FileSystemState>((set, get) => ({
  ...initialState,

  initializeDisk: (size: number) => {
    const blocks: Block[] = Array.from({ length: size }, (_, i) => ({
      id: i,
      status: 'free',
    }));
    
    const newState = {
      blocks,
      files: [],
      diskStats: {
        totalBlocks: size,
        usedBlocks: 0,
        freeBlocks: size,
        metadataBlocks: 0,
        badBlocks: 0,
        cachedBlocks: 0,
      },
    };
    
    set(newState);
    debouncedSave(newState);
  },

  allocateBlocks: (fileId: string, fileName: string, count: number) => {
    const { blocks } = get();
    const freeBlocks = blocks.filter((b) => b.status === 'free');
    
    if (freeBlocks.length < count) {
      console.error('Not enough free blocks');
      return;
    }

    const allocatedBlocks = freeBlocks.slice(0, count);
    const updatedBlocks = blocks.map((block) => {
      if (allocatedBlocks.find((b) => b.id === block.id)) {
        return { ...block, status: 'used' as const, fileId, fileName };
      }
      return block;
    });

    const newFile: FileSystemFile = {
      id: fileId,
      name: fileName,
      size: count * 4096, // 4KB per block
      blocks: allocatedBlocks.map((b) => b.id),
      createdAt: new Date(),
      type: 'file',
    };

    set((state) => {
      const newState = {
        blocks: updatedBlocks,
        files: [...state.files, newFile],
        diskStats: {
          ...state.diskStats,
          usedBlocks: state.diskStats.usedBlocks + count,
          freeBlocks: state.diskStats.freeBlocks - count,
        },
      };
      debouncedSave(newState);
      return newState;
    });
  },

  freeBlocks: (fileId: string) => {
    const { blocks, files } = get();
    const file = files.find((f) => f.id === fileId);
    
    if (!file) return;

    const updatedBlocks = blocks.map((block) => {
      if (block.fileId === fileId) {
        return { ...block, status: 'free' as const, fileId: undefined, fileName: undefined };
      }
      return block;
    });

    set((state) => {
      const newState = {
        blocks: updatedBlocks,
        files: state.files.filter((f) => f.id !== fileId),
        diskStats: {
          ...state.diskStats,
          usedBlocks: state.diskStats.usedBlocks - file.blocks.length,
          freeBlocks: state.diskStats.freeBlocks + file.blocks.length,
        },
      };
      debouncedSave(newState);
      return newState;
    });
  },

  updateBlockStatus: (blockId: number, status: Block['status']) => {
    set((state) => {
      const newState = {
        blocks: state.blocks.map((block) =>
          block.id === blockId ? { ...block, status } : block
        ),
      };
      debouncedSave({ ...state, ...newState });
      return newState;
    });
  },

  loadFromStorage: () => {
    const stored = loadFromStorage(STORAGE_KEYS.FILE_SYSTEM, defaultState);
    set(stored);
  },
}));

// Set up cross-tab synchronization
if (typeof window !== 'undefined') {
  onStorageChange(STORAGE_KEYS.FILE_SYSTEM, () => {
    useFileSystemStore.getState().loadFromStorage();
  });
}

