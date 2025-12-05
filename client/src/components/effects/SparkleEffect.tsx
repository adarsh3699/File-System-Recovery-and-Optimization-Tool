import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SparkleEffectProps {
  x: number;
  y: number;
  onComplete?: () => void;
}

interface Sparkle {
  id: number;
  angle: number;
  distance: number;
  size: number;
}

export function SparkleEffect({ x, y, onComplete }: SparkleEffectProps) {
  const [sparkles] = useState<Sparkle[]>(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (i * 360) / 12,
      distance: Math.random() * 30 + 20,
      size: Math.random() * 4 + 2,
    }))
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{ left: x, top: y }}
    >
      {sparkles.map((sparkle) => {
        const rad = (sparkle.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * sparkle.distance;
        const ty = Math.sin(rad) * sparkle.distance;

        return (
          <motion.div
            key={sparkle.id}
            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
            animate={{
              scale: [0, 1.5, 0],
              x: [0, tx],
              y: [0, ty],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 0.6,
              ease: 'easeOut',
              delay: sparkle.id * 0.02,
            }}
            className="absolute"
          >
            <div
              className="rounded-full bg-yellow-400"
              style={{
                width: sparkle.size,
                height: sparkle.size,
                boxShadow: '0 0 10px rgba(250, 204, 21, 0.8)',
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}



