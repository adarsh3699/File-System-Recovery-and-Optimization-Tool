import { motion } from 'framer-motion';
import { Card } from '../common/Card';

interface FragmentationGaugeProps {
  percentage: number;
}

export function FragmentationGauge({ percentage }: FragmentationGaugeProps) {
  const color = percentage < 30 ? '#10b981' : percentage < 70 ? '#f59e0b' : '#ef4444';
  const circumference = 2 * Math.PI * 80;
  const offset = circumference - (circumference * percentage) / 100;

  return (
    <Card title="Fragmentation Level" description="Disk fragmentation status" glass>
      <div className="flex items-center justify-center py-8">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="#374151"
              strokeWidth="16"
              fill="none"
            />
            {/* Progress circle */}
            <motion.circle
              cx="96"
              cy="96"
              r="80"
              stroke={color}
              strokeWidth="16"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              style={{
                strokeDasharray: circumference,
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={percentage}
              initial={{ scale: 1.3, color }}
              animate={{ scale: 1, color: '#ffffff' }}
              className="text-4xl font-bold"
            >
              {percentage}%
            </motion.span>
            <span className="text-sm text-gray-400 mt-1">
              {percentage < 30 ? 'Good' : percentage < 70 ? 'Moderate' : 'High'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

