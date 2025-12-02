import { motion } from 'framer-motion';

interface PulseRingProps {
  x: number;
  y: number;
  color?: string;
}

export function PulseRing({ x, y, color = '#3b82f6' }: PulseRingProps) {
  return (
    <div
      className="absolute pointer-events-none z-40"
      style={{ left: x, top: y }}
    >
      {[0, 0.2, 0.4].map((delay) => (
        <motion.div
          key={delay}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{
            scale: [0, 2],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay,
            ease: 'easeOut',
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
        >
          <div
            className="w-16 h-16 rounded-full border-4"
            style={{
              borderColor: color,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

