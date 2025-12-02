export type BlockStatus = 'free' | 'used' | 'metadata' | 'bad' | 'cached';

export interface Block {
  id: number;
  status: BlockStatus;
  fileId?: string;
  fileName?: string;
  color?: string;
}

export interface FileSystemFile {
  id: string;
  name: string;
  size: number;
  blocks: number[];
  createdAt: Date;
  type: 'file' | 'directory';
  children?: FileSystemFile[];
}

export interface PerformanceMetrics {
  readSpeed: number;  // MB/s
  writeSpeed: number; // MB/s
  operationCount: {
    create: number;
    read: number;
    write: number;
    delete: number;
  };
  cacheHitRate: number; // percentage
  fragmentation: number; // percentage
}

export interface DiskStats {
  totalBlocks: number;
  usedBlocks: number;
  freeBlocks: number;
  metadataBlocks: number;
  badBlocks: number;
  cachedBlocks: number;
}

