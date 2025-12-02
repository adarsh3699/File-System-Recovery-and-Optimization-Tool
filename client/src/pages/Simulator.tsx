import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileCheck, Trash2, HardDrive, Zap } from 'lucide-react';
import { DiskGrid } from '../components/disk/DiskGrid';
import { DiskLegend } from '../components/disk/DiskLegend';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useFileSystemStore } from '../store/fileSystemStore';
import { usePerformanceStore } from '../store/performanceStore';
import { useEffects } from '../hooks/useEffects';

export function Simulator() {
  const { blocks, files, diskStats, initializeDisk, allocateBlocks, freeBlocks } = useFileSystemStore();
  const { incrementOperation, updateFragmentation } = usePerformanceStore();
  const { addEffect, renderEffects } = useEffects();
  const [isInitialized, setIsInitialized] = useState(false);
  const diskMapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isInitialized) {
      initializeDisk(256); // Initialize with 256 blocks
      setIsInitialized(true);
    }
  }, [isInitialized, initializeDisk]);

  // Calculate fragmentation
  useEffect(() => {
    if (files.length === 0) {
      updateFragmentation(0);
      return;
    }

    let fragmentedFiles = 0;
    files.forEach((file) => {
      const sortedBlocks = [...file.blocks].sort((a, b) => a - b);
      let isFragmented = false;
      for (let i = 1; i < sortedBlocks.length; i++) {
        if (sortedBlocks[i] !== sortedBlocks[i - 1] + 1) {
          isFragmented = true;
          break;
        }
      }
      if (isFragmented) fragmentedFiles++;
    });

    const fragmentation = files.length > 0 ? (fragmentedFiles / files.length) * 100 : 0;
    updateFragmentation(Math.round(fragmentation));
  }, [files, updateFragmentation]);

  const handleCreateFile = () => {
    const fileId = `file-${Date.now()}`;
    const fileName = `document-${files.length + 1}.txt`;
    const blockCount = Math.floor(Math.random() * 8) + 4; // 4-12 blocks
    allocateBlocks(fileId, fileName, blockCount);
    incrementOperation('Create');
    
    // Add sparkle effect at a random block location
    if (diskMapRef.current) {
      const rect = diskMapRef.current.getBoundingClientRect();
      const x = rect.left + Math.random() * rect.width;
      const y = rect.top + Math.random() * rect.height;
      addEffect('sparkle', x, y);
    }
  };

  const handleDeleteFile = (fileId?: string) => {
    const targetFile = fileId ? files.find(f => f.id === fileId) : files[Math.floor(Math.random() * files.length)];
    
    if (targetFile && diskMapRef.current) {
      // Add explosion effect at the file's first block
      const blockElement = diskMapRef.current.querySelector(`[data-block-id="${targetFile.blocks[0]}"]`);
      
      if (blockElement) {
        const blockRect = blockElement.getBoundingClientRect();
        addEffect('explosion', blockRect.left + blockRect.width / 2, blockRect.top + blockRect.height / 2);
      }
      
      freeBlocks(targetFile.id);
      incrementOperation('Delete');
    }
  };

  const legendStats = {
    free: diskStats.freeBlocks,
    used: diskStats.usedBlocks,
    metadata: diskStats.metadataBlocks,
    bad: diskStats.badBlocks,
    cached: diskStats.cachedBlocks,
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          File System Simulator
        </h1>
        <p className="text-gray-400">
          Visualize how files are stored on disk in real-time
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card glass>
          <div className="flex items-center gap-3">
            <HardDrive className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-gray-400 text-sm">Total Blocks</p>
              <p className="text-2xl font-bold text-white">{diskStats.totalBlocks}</p>
            </div>
          </div>
        </Card>

        <Card glass>
          <div className="flex items-center gap-3">
            <FileCheck className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-gray-400 text-sm">Free Blocks</p>
              <p className="text-2xl font-bold text-white">{diskStats.freeBlocks}</p>
            </div>
          </div>
        </Card>

        <Card glass>
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-gray-400 text-sm">Used Blocks</p>
              <p className="text-2xl font-bold text-white">{diskStats.usedBlocks}</p>
            </div>
          </div>
        </Card>

        <Card glass>
          <div className="flex items-center gap-3">
            <Trash2 className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-gray-400 text-sm">Total Files</p>
              <p className="text-2xl font-bold text-white">{files.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Disk Visualization */}
        <div className="lg:col-span-3">
          <Card title="Disk Map" description="Visual representation of disk blocks">
            <div ref={diskMapRef} className="relative">
              <DiskGrid blocks={blocks} />
              {/* Render effects */}
              {renderEffects()}
            </div>
          </Card>

          {/* Controls */}
          <div className="mt-6 flex gap-4">
            <Button onClick={handleCreateFile} variant="primary">
              <FileCheck size={20} />
              Create File (✨ Sparkle!)
            </Button>
            <Button
              onClick={() => handleDeleteFile()}
              variant="danger"
              disabled={files.length === 0}
            >
              <Trash2 size={20} />
              Delete File (💥 Boom!)
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <DiskLegend stats={legendStats} />

          {/* Files List */}
          <Card title="Files" description={`${files.length} files`}>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {files.length === 0 ? (
                <p className="text-gray-500 text-sm">No files yet. Create one!</p>
              ) : (
                files.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="glass p-3 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {file.name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {file.blocks.length} blocks
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteFile(file.id)}
                        className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete with explosion effect"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

