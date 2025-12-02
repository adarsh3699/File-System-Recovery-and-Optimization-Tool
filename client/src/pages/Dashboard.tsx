import { motion } from 'framer-motion';
import { PerformanceChart } from '../components/charts/PerformanceChart';
import { SpaceChart } from '../components/charts/SpaceChart';
import { OperationChart } from '../components/charts/OperationChart';
import { FragmentationGauge } from '../components/charts/FragmentationGauge';
import { useUnifiedStore } from '../store/unifiedStore';
import { usePerformanceStore } from '../store/performanceStore';
import { useEffect, useMemo } from 'react';

export function Dashboard() {
  // Connect to the unified store (same as simulator)
  const { 
    blocks, 
    rootDirectory,
    journal,
    totalBlocks, 
    usedBlocks, 
    freeBlocks, 
    corruptedBlocks 
  } = useUnifiedStore();

  const { performanceHistory, addPerformanceData } = usePerformanceStore();

  // Simulate performance data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      const read = Math.floor(Math.random() * 40) + 60; // 60-100 MB/s
      const write = Math.floor(Math.random() * 30) + 50; // 50-80 MB/s
      addPerformanceData({ time, read, write });
    }, 2000);

    return () => clearInterval(interval);
  }, [addPerformanceData]);

  // Calculate real disk stats from unified store
  const diskStats = useMemo(() => {
    const metadataBlocks = 0; // Could calculate from root directory
    const badBlocks = blocks.filter(b => b.status === 'bad').length;
    const cachedBlocks = blocks.filter(b => b.status === 'cached').length;

    return {
      totalBlocks,
      usedBlocks,
      freeBlocks,
      metadataBlocks,
      badBlocks: corruptedBlocks || badBlocks,
      cachedBlocks,
    };
  }, [blocks, totalBlocks, usedBlocks, freeBlocks, corruptedBlocks]);

  // Calculate real operation counts from journal
  const realOperationCounts = useMemo(() => {
    const counts = {
      create: 0,
      read: 0,
      write: 0,
      delete: 0,
    };

    journal.forEach(entry => {
      if (entry.type === 'create') counts.create++;
      else if (entry.type === 'delete') counts.delete++;
    });

    // Add some simulated read/write counts
    counts.read = Math.floor(counts.create * 3.5);
    counts.write = Math.floor(counts.create * 2);

    return [
      { operation: 'Create', count: counts.create },
      { operation: 'Read', count: counts.read },
      { operation: 'Write', count: counts.write },
      { operation: 'Delete', count: counts.delete },
    ];
  }, [journal]);

  // Calculate real fragmentation from blocks
  const realFragmentation = useMemo(() => {
    if (usedBlocks === 0) return 0;

    // Group blocks by file ID or file name
    const fileBlocks = new Map<string, number[]>();
    blocks.forEach((block) => {
      if (block.status === 'used') {
        const key = block.fileId || block.fileName || 'unknown';
        if (key !== 'unknown') {
          if (!fileBlocks.has(key)) {
            fileBlocks.set(key, []);
          }
          fileBlocks.get(key)!.push(block.id);
        }
      }
    });

    if (fileBlocks.size === 0) return 0;

    // Calculate fragmentation based on disk scatter
    let totalFragments = 0;
    let totalGaps = 0;
    let totalFileBlocks = 0;

    fileBlocks.forEach((blockIds) => {
      if (blockIds.length === 0) return;
      
      totalFileBlocks += blockIds.length;
      const sortedIds = [...blockIds].sort((a, b) => a - b);
      
      // Count fragments
      let fragments = 1;
      for (let i = 1; i < sortedIds.length; i++) {
        if (sortedIds[i] !== sortedIds[i - 1] + 1) {
          fragments++;
          totalGaps += (sortedIds[i] - sortedIds[i - 1] - 1);
        }
      }
      
      totalFragments += fragments;
    });

    // Calculate disk scatter (how spread out files are)
    const usedBlockPositions = blocks
      .filter(b => b.status === 'used')
      .map(b => b.id)
      .sort((a, b) => a - b);

    let diskGaps = 0;
    if (usedBlockPositions.length > 1) {
      for (let i = 1; i < usedBlockPositions.length; i++) {
        if (usedBlockPositions[i] !== usedBlockPositions[i - 1] + 1) {
          diskGaps++;
        }
      }
    }

    // Fragmentation metrics
    const avgFragmentsPerFile = totalFragments / fileBlocks.size;
    const gapRatio = diskGaps / Math.max(fileBlocks.size, 1); // gaps per file

    // Calculate fragmentation based on multiple factors
    let fragmentation = 0;

    // Factor 1: File fragmentation (40% weight)
    if (avgFragmentsPerFile > 1) {
      const fileFrag = Math.min(((avgFragmentsPerFile - 1) / 2) * 40, 40);
      fragmentation += fileFrag;
    }

    // Factor 2: Disk scatter (60% weight) - this is the key metric!
    // If files are scattered across disk with gaps, that's fragmentation
    const scatterFrag = Math.min(gapRatio * 10, 60);
    fragmentation += scatterFrag;
    
    return Math.round(Math.min(fragmentation, 100));
  }, [blocks, usedBlocks]);

  const spaceData = [
    { name: 'Free', value: diskStats.freeBlocks },
    { name: 'Used', value: diskStats.usedBlocks },
    { name: 'Metadata', value: diskStats.metadataBlocks },
    { name: 'Bad', value: diskStats.badBlocks },
    { name: 'Cached', value: diskStats.cachedBlocks },
  ].filter(item => item.value > 0);

  // Count total files
  const totalFiles = useMemo(() => {
    const countFiles = (item: typeof rootDirectory): number => {
      if (item.type === 'file') return 1;
      if (item.children) {
        return item.children.reduce((sum, child) => sum + countFiles(child), 0);
      }
      return 0;
    };
    return countFiles(rootDirectory);
  }, [rootDirectory]);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          Performance Dashboard
        </h1>
        <p className="text-gray-400">
          Real-time system metrics from the simulator
        </p>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PerformanceChart data={performanceHistory} />
        </motion.div>

        {/* Space Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SpaceChart data={spaceData} />
        </motion.div>

        {/* Operation Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <OperationChart data={realOperationCounts} />
        </motion.div>

        {/* Fragmentation Gauge */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <FragmentationGauge percentage={realFragmentation} />
        </motion.div>
      </div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        <div className="glass p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Disk Usage</p>
          <p className="text-2xl font-bold text-white mt-1">
            {diskStats.totalBlocks > 0 
              ? ((diskStats.usedBlocks / diskStats.totalBlocks) * 100).toFixed(1)
              : 0}%
          </p>
        </div>
        <div className="glass p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Total Files</p>
          <p className="text-2xl font-bold text-white mt-1">
            {totalFiles}
          </p>
        </div>
        <div className="glass p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Operations</p>
          <p className="text-2xl font-bold text-white mt-1">
            {journal.length}
          </p>
        </div>
        <div className="glass p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Avg Read Speed</p>
          <p className="text-2xl font-bold text-white mt-1">
            {performanceHistory.length > 1
              ? (performanceHistory.reduce((sum, p) => sum + p.read, 0) / performanceHistory.length).toFixed(1)
              : 0} MB/s
          </p>
        </div>
        <div className="glass p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Fragmentation</p>
          <p className={`text-2xl font-bold mt-1 ${
            realFragmentation < 10 ? 'text-green-400' :
            realFragmentation < 30 ? 'text-cyan-400' :
            realFragmentation < 50 ? 'text-yellow-400' :
            realFragmentation < 70 ? 'text-orange-400' :
            'text-red-400'
          }`}>
            {realFragmentation}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {realFragmentation < 10 ? 'Optimal' :
             realFragmentation < 30 ? 'Good' :
             realFragmentation < 50 ? 'Normal' :
             realFragmentation < 70 ? 'Fair' : 'Poor'}
          </p>
        </div>
      </motion.div>

      {/* Live Status Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 glass p-4 rounded-lg flex items-center justify-between"
      >
        <div>
          <p className="text-white font-semibold">Connected to Simulator</p>
          <p className="text-gray-400 text-sm">
            Showing real-time data from UnifiedSimulator
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm">Live</span>
        </div>
      </motion.div>
    </div>
  );
}
