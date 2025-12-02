import { motion } from 'framer-motion';
import type { BlockStatus } from '../../types';

interface DiskLegendProps {
  stats?: {
    free: number;
    used: number;
    metadata: number;
    bad: number;
    cached: number;
  };
}

const legendItems: Array<{ status: BlockStatus; label: string; color: string }> = [
  { status: 'free', label: 'Free', color: 'bg-green-500' },
  { status: 'used', label: 'Used', color: 'bg-blue-500' },
  { status: 'metadata', label: 'Metadata', color: 'bg-orange-500' },
  { status: 'bad', label: 'Bad Sector', color: 'bg-red-500' },
  { status: 'cached', label: 'Cached', color: 'bg-purple-500' },
];

export function DiskLegend({ stats }: DiskLegendProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass p-4 rounded-lg"
    >
      <h4 className="font-bold text-sm mb-3 text-white">Legend</h4>
      <div className="space-y-2">
        {legendItems.map((item) => (
          <div key={item.status} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${item.color}`} />
              <span className="text-sm text-gray-300">{item.label}</span>
            </div>
            {stats && (
              <span className="text-sm font-mono text-gray-400">
                {stats[item.status]}
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

