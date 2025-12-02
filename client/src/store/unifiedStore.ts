import { create } from 'zustand';
import { saveToStorage, loadFromStorage, onStorageChange, debounce } from '../lib/storage';
import type { Block } from '../types';

// Journal entry type
interface JournalEntry {
  id: string;
  type: 'create' | 'delete' | 'crash' | 'recover' | 'defrag';
  target: string;
  status: 'done' | 'pending' | 'failed';
  timestamp: Date;
}

// Directory item type
interface DirectoryItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size: number;
  parentId: string | null;
  blocks: number[];
  children?: DirectoryItem[];
}

interface UnifiedState {
  // Core data
  blocks: Block[];
  rootDirectory: DirectoryItem;
  journal: JournalEntry[];
  
  // Settings
  totalBlocks: number;
  isJournalingActive: boolean;
  
  // Stats
  usedBlocks: number;
  freeBlocks: number;
  corruptedBlocks: number;
  reservedBlocks: number;
  
  // Actions
  initializeDisk: (size?: number) => void;
  createFile: (name: string, size: number, parentId?: string | null, startBlock?: number) => void;
  createFolder: (name: string, parentId?: string | null) => void;
  deleteItem: (id: string) => void;
  simulateCrash: (severity: 'minor' | 'major' | 'catastrophic') => void;
  runRecovery: () => void;
  defragmentDisk: () => Promise<void>;
  resetSystem: () => void;
  
  // Helpers
  getDirectoryItem: (id: string) => DirectoryItem | null;
  loadFromStorage: () => void;
}

const defaultRootDirectory: DirectoryItem = {
  id: 'root',
  name: '/',
  type: 'folder',
  size: 0,
  parentId: null,
  blocks: [],
  children: [],
};

const defaultState = {
  blocks: [],
  rootDirectory: defaultRootDirectory,
  journal: [],
  totalBlocks: 256,
  isJournalingActive: true,
  usedBlocks: 0,
  freeBlocks: 256,
  corruptedBlocks: 0,
  reservedBlocks: 0,
};

const UNIFIED_STORAGE_KEY = 'fs-unified-store';

// Load initial state
const initialState = loadFromStorage(UNIFIED_STORAGE_KEY, defaultState);

// Debounced save
const debouncedSave = debounce((state: any) => {
  saveToStorage(UNIFIED_STORAGE_KEY, {
    blocks: state.blocks,
    rootDirectory: state.rootDirectory,
    journal: state.journal,
    totalBlocks: state.totalBlocks,
    isJournalingActive: state.isJournalingActive,
    usedBlocks: state.usedBlocks,
    freeBlocks: state.freeBlocks,
    corruptedBlocks: state.corruptedBlocks,
    reservedBlocks: state.reservedBlocks,
  });
}, 300);

export const useUnifiedStore = create<UnifiedState>((set, get) => ({
  ...initialState,

  initializeDisk: (size = 256) => {
    const blocks: Block[] = Array.from({ length: size }, (_, i) => ({
      id: i,
      status: 'free',
    }));

    const newState = {
      blocks,
      rootDirectory: { ...defaultRootDirectory, children: [] },
      journal: [],
      totalBlocks: size,
      usedBlocks: 0,
      freeBlocks: size,
      corruptedBlocks: 0,
      reservedBlocks: 0,
    };

    set(newState);
    debouncedSave(newState);
  },

  createFile: (name: string, size: number, parentId: string | null = 'root', startBlock?: number) => {
    const state = get();
    
    let allocatedBlocks: Block[];
    
    if (startBlock !== undefined) {
      // Allocate from specific position (for fragmentation demo)
      allocatedBlocks = [];
      for (let i = startBlock; i < state.blocks.length && allocatedBlocks.length < size; i++) {
        if (state.blocks[i].status === 'free') {
          allocatedBlocks.push(state.blocks[i]);
        }
      }
      
      if (allocatedBlocks.length < size) {
        console.error('Not enough free blocks from this position');
        return;
      }
    } else {
      // Default: allocate first available free blocks
      const freeBlocks = state.blocks.filter(b => b.status === 'free');
      
      if (freeBlocks.length < size) {
        console.error('Not enough free blocks');
        return;
      }
      
      allocatedBlocks = freeBlocks.slice(0, size);
    }

    const fileId = `file-${Date.now()}`;
    
    // Update blocks
    const updatedBlocks = state.blocks.map(block => {
      if (allocatedBlocks.find(b => b.id === block.id)) {
        return { ...block, status: 'used' as const, fileId, fileName: name };
      }
      return block;
    });

    // Create file entry
    const newFile: DirectoryItem = {
      id: fileId,
      name,
      type: 'file',
      size: size * 4, // 4KB per block
      parentId,
      blocks: allocatedBlocks.map(b => b.id),
    };

    // Add to directory
    const addToDirectory = (dir: DirectoryItem): DirectoryItem => {
      if (dir.id === parentId) {
        return {
          ...dir,
          children: [...(dir.children || []), newFile],
        };
      }
      if (dir.children) {
        return {
          ...dir,
          children: dir.children.map(addToDirectory),
        };
      }
      return dir;
    };

    // Add journal entry
    const journalEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      type: 'create',
      target: name,
      status: 'done',
      timestamp: new Date(),
    };

    const newState = {
      blocks: updatedBlocks,
      rootDirectory: addToDirectory(state.rootDirectory),
      journal: [journalEntry, ...state.journal].slice(0, 50),
      usedBlocks: state.usedBlocks + size,
      freeBlocks: state.freeBlocks - size,
    };

    set(newState);
    debouncedSave({ ...state, ...newState });
  },

  createFolder: (name: string, parentId: string | null = 'root') => {
    const state = get();
    const folderId = `folder-${Date.now()}`;

    const newFolder: DirectoryItem = {
      id: folderId,
      name,
      type: 'folder',
      size: 0,
      parentId,
      blocks: [],
      children: [],
    };

    const addToDirectory = (dir: DirectoryItem): DirectoryItem => {
      if (dir.id === parentId) {
        return {
          ...dir,
          children: [...(dir.children || []), newFolder],
        };
      }
      if (dir.children) {
        return {
          ...dir,
          children: dir.children.map(addToDirectory),
        };
      }
      return dir;
    };

    const journalEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      type: 'create',
      target: name,
      status: 'done',
      timestamp: new Date(),
    };

    const newState = {
      rootDirectory: addToDirectory(state.rootDirectory),
      journal: [journalEntry, ...state.journal].slice(0, 50),
    };

    set(newState);
    debouncedSave({ ...state, ...newState });
  },

  deleteItem: (id: string) => {
    const state = get();
    let blocksToFree: number[] = [];
    let itemName = '';

    // Find and collect blocks to free
    const collectBlocksAndRemove = (dir: DirectoryItem): DirectoryItem | null => {
      if (dir.id === id) {
        blocksToFree = [...blocksToFree, ...dir.blocks];
        itemName = dir.name;
        // Recursively collect from children
        if (dir.children) {
          dir.children.forEach(child => {
            collectBlocksAndRemove(child);
          });
        }
        return null;
      }
      if (dir.children) {
        return {
          ...dir,
          children: dir.children
            .map(child => collectBlocksAndRemove(child))
            .filter((c): c is DirectoryItem => c !== null),
        };
      }
      return dir;
    };

    const updatedRoot = collectBlocksAndRemove(state.rootDirectory);

    // Free blocks
    const updatedBlocks = state.blocks.map(block => {
      if (blocksToFree.includes(block.id)) {
        return { ...block, status: 'free' as const, fileId: undefined, fileName: undefined };
      }
      return block;
    });

    const journalEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      type: 'delete',
      target: itemName,
      status: 'done',
      timestamp: new Date(),
    };

    const newState = {
      blocks: updatedBlocks,
      rootDirectory: updatedRoot || state.rootDirectory,
      journal: [journalEntry, ...state.journal].slice(0, 50),
      usedBlocks: state.usedBlocks - blocksToFree.length,
      freeBlocks: state.freeBlocks + blocksToFree.length,
    };

    set(newState);
    debouncedSave({ ...state, ...newState });
  },

  simulateCrash: (severity: 'minor' | 'major' | 'catastrophic') => {
    const state = get();
    const blockCount = severity === 'minor' ? 5 : severity === 'major' ? 15 : 30;
    
    const usedBlocks = state.blocks.filter(b => b.status === 'used');
    const blocksToCorrupt = usedBlocks
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(blockCount, usedBlocks.length));

    const updatedBlocks = state.blocks.map(block => {
      if (blocksToCorrupt.find(b => b.id === block.id)) {
        return { ...block, status: 'bad' as const };
      }
      return block;
    });

    const journalEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      type: 'crash',
      target: `${severity.toUpperCase()} - ${blocksToCorrupt.length} blocks`,
      status: 'failed',
      timestamp: new Date(),
    };

    const corruptedCount = updatedBlocks.filter(b => b.status === 'bad').length;

    const newState = {
      blocks: updatedBlocks,
      journal: [journalEntry, ...state.journal].slice(0, 50),
      corruptedBlocks: corruptedCount,
    };

    set(newState);
    debouncedSave({ ...state, ...newState });
  },

  runRecovery: () => {
    const state = get();
    
    const updatedBlocks = state.blocks.map(block => {
      if (block.status === 'bad') {
        // Try to recover - if it had a file, mark as used, otherwise free
        if (block.fileId) {
          return { ...block, status: 'used' as const };
        }
        return { ...block, status: 'free' as const };
      }
      return block;
    });

    const journalEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      type: 'recover',
      target: 'SYSTEM',
      status: 'done',
      timestamp: new Date(),
    };

    const usedCount = updatedBlocks.filter(b => b.status === 'used').length;
    const freeCount = updatedBlocks.filter(b => b.status === 'free').length;

    const newState = {
      blocks: updatedBlocks,
      journal: [journalEntry, ...state.journal].slice(0, 50),
      corruptedBlocks: 0,
      usedBlocks: usedCount,
      freeBlocks: freeCount,
    };

    set(newState);
    debouncedSave({ ...state, ...newState });
  },

  defragmentDisk: async () => {
    const state = get();
    const usedBlocks = state.blocks.filter(b => b.status === 'used');
    
    if (usedBlocks.length === 0) return;

    // Sort by fileId to group files together
    const sortedUsed = [...usedBlocks].sort((a, b) => {
      if (!a.fileId || !b.fileId) return 0;
      return a.fileId.localeCompare(b.fileId);
    });

    // Create new block arrangement
    const newBlocks = state.blocks.map((_, index) => {
      if (index < sortedUsed.length) {
        return { ...sortedUsed[index], id: index };
      }
      return { id: index, status: 'free' as const } as Block;
    });

    const journalEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      type: 'defrag',
      target: `${usedBlocks.length} blocks reorganized`,
      status: 'done',
      timestamp: new Date(),
    };

    const newState = {
      blocks: newBlocks,
      journal: [journalEntry, ...state.journal].slice(0, 50),
    };

    set(newState);
    debouncedSave({ ...state, ...newState });
  },

  resetSystem: () => {
    const state = get();
    state.initializeDisk(state.totalBlocks);
  },

  getDirectoryItem: (id: string) => {
    const state = get();
    
    const findItem = (dir: DirectoryItem): DirectoryItem | null => {
      if (dir.id === id) return dir;
      if (dir.children) {
        for (const child of dir.children) {
          const found = findItem(child);
          if (found) return found;
        }
      }
      return null;
    };
    
    return findItem(state.rootDirectory);
  },

  loadFromStorage: () => {
    const stored = loadFromStorage(UNIFIED_STORAGE_KEY, defaultState);
    set(stored);
  },
}));

// Cross-tab sync
if (typeof window !== 'undefined') {
  onStorageChange(UNIFIED_STORAGE_KEY, () => {
    useUnifiedStore.getState().loadFromStorage();
  });
}

