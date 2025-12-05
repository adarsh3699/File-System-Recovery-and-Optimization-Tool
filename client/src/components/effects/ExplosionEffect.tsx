import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ExplosionEffectProps {
  x: number;
  y: number;
  onComplete?: () => void;
}

interface Particle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
}

const colors = ['#ef4444', '#f97316', '#fbbf24', '#f59e0b'];

export function ExplosionEffect({ x, y, onComplete }: ExplosionEffectProps) {
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      angle: (i * 360) / 20,
      distance: Math.random() * 50 + 30,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{ left: x, top: y }}
    >
      {/* Center flash */}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{
          scale: [0, 2, 0],
          opacity: [1, 0.5, 0],
        }}
        transition={{ duration: 0.5 }}
        className="absolute -translate-x-1/2 -translate-y-1/2"
      >
        <div className="w-16 h-16 rounded-full bg-red-500" style={{
          boxShadow: '0 0 30px rgba(239, 68, 68, 0.9)',
        }} />
      </motion.div>

      {/* Particles */}
      {particles.map((particle) => {
        const rad = (particle.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * particle.distance;
        const ty = Math.sin(rad) * particle.distance;

        return (
          <motion.div
            key={particle.id}
            initial={{ scale: 1, x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{
              scale: [1, 0],
              x: [0, tx],
              y: [0, ty],
              opacity: [1, 0],
              rotate: [0, Math.random() * 360],
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
              delay: particle.id * 0.01,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            <div
              className="rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                boxShadow: `0 0 8px ${particle.color}`,
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}



