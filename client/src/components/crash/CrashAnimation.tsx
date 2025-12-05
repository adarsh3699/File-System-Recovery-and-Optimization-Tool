import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface CrashAnimationProps {
  onComplete?: () => void;
}

export function CrashAnimation({ onComplete }: CrashAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Screen shake effect */}
      <motion.div
        className="absolute inset-0 bg-red-500/20"
        animate={{
          x: [0, -10, 10, -10, 10, -5, 5, 0],
          y: [0, -10, 10, -10, 10, -5, 5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: 'easeInOut',
        }}
      />

      {/* Glitch overlay */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-red-600"
          style={{ mixBlendMode: 'multiply' }}
          animate={{
            opacity: [0, 0.8, 0, 0.6, 0, 0.9, 0],
          }}
          transition={{
            duration: 0.5,
            times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 1],
          }}
        />
        <motion.div
          className="absolute inset-0 bg-blue-600"
          style={{ mixBlendMode: 'multiply' }}
          animate={{
            opacity: [0, 0, 0.7, 0, 0.8, 0, 0],
            x: [0, -5, 5, -5, 5, 0, 0],
          }}
          transition={{
            duration: 0.5,
            times: [0, 0.15, 0.25, 0.35, 0.45, 0.55, 1],
          }}
        />
      </div>

      {/* Warning text */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.2, 1, 0.8] }}
        transition={{ duration: 2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">⚠️</div>
            <div className="text-4xl font-bold text-red-500 drop-shadow-lg">
              SYSTEM CRASH!
            </div>
            <div className="text-xl text-red-400 mt-2">
              Disk failure detected
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scanlines effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15) 0px, transparent 1px, transparent 2px, rgba(0, 0, 0, 0.15) 3px)',
        }}
      />
    </div>
  );
}



