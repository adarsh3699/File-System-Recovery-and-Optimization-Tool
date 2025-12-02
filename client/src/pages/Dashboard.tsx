import { motion } from 'framer-motion';
import { PerformanceChart } from '../components/charts/PerformanceChart';
import { SpaceChart } from '../components/charts/SpaceChart';
import { OperationChart } from '../components/charts/OperationChart';
import { FragmentationGauge } from '../components/charts/FragmentationGauge';
import { useFileSystemStore } from '../store/fileSystemStore';
import { usePerformanceStore } from '../store/performanceStore';
import { useEffect } from 'react';

export function Dashboard() {
  const { diskStats } = useFileSystemStore();
  const { performanceHistory, operationCounts, fragmentation, addPerformanceData } = usePerformanceStore();

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

  const spaceData = [
    { name: 'Free', value: diskStats.freeBlocks },
    { name: 'Used', value: diskStats.usedBlocks },
    { name: 'Metadata', value: diskStats.metadataBlocks },
    { name: 'Bad', value: diskStats.badBlocks },
    { name: 'Cached', value: diskStats.cachedBlocks },
  ].filter(item => item.value > 0);

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
          Real-time system metrics and analytics
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
          <OperationChart data={operationCounts} />
        </motion.div>

        {/* Fragmentation Gauge */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <FragmentationGauge percentage={fragmentation} />
        </motion.div>
      </div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="glass p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Disk Usage</p>
          <p className="text-2xl font-bold text-white mt-1">
            {((diskStats.usedBlocks / diskStats.totalBlocks) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="glass p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Total Operations</p>
          <p className="text-2xl font-bold text-white mt-1">
            {operationCounts.reduce((sum, op) => sum + op.count, 0)}
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
          <p className="text-gray-400 text-sm">Avg Write Speed</p>
          <p className="text-2xl font-bold text-white mt-1">
            {performanceHistory.length > 1
              ? (performanceHistory.reduce((sum, p) => sum + p.write, 0) / performanceHistory.length).toFixed(1)
              : 0} MB/s
          </p>
        </div>
      </motion.div>
    </div>
  );
}

