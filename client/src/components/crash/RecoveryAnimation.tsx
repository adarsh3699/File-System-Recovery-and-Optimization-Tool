import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface RecoveryStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'error';
}

interface RecoveryAnimationProps {
  steps: RecoveryStep[];
  onComplete?: () => void;
}

export function RecoveryAnimation({ steps, onComplete }: RecoveryAnimationProps) {
  const allCompleted = steps.every((step) => step.status === 'completed');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass p-8 rounded-lg max-w-md w-full mx-4"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            animate={{ rotate: allCompleted ? 0 : 360 }}
            transition={{ duration: 2, repeat: allCompleted ? 0 : Infinity, ease: 'linear' }}
          >
            {allCompleted ? (
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            ) : (
              <Loader2 className="w-16 h-16 text-blue-500 mx-auto" />
            )}
          </motion.div>
          <h2 className="text-2xl font-bold text-white mt-4">
            {allCompleted ? 'Recovery Complete!' : 'System Recovery'}
          </h2>
          <p className="text-gray-400 mt-2">
            {allCompleted
              ? 'File system has been restored'
              : 'Repairing file system...'}
          </p>
        </div>

        {/* Recovery steps */}
        <div className="space-y-3">
          <AnimatePresence>
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg"
              >
                {/* Status icon */}
                <div className="flex-shrink-0">
                  {step.status === 'completed' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring' }}
                    >
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </motion.div>
                  )}
                  {step.status === 'running' && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader2 className="w-5 h-5 text-blue-500" />
                    </motion.div>
                  )}
                  {step.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  {step.status === 'pending' && (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                  )}
                </div>

                {/* Step label */}
                <div className="flex-1">
                  <p
                    className={`text-sm ${
                      step.status === 'completed'
                        ? 'text-green-400'
                        : step.status === 'running'
                        ? 'text-blue-400'
                        : step.status === 'error'
                        ? 'text-red-400'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>

                {/* Progress bar for running step */}
                {step.status === 'running' && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5 }}
                    className="absolute bottom-0 left-0 h-1 bg-blue-500"
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Complete button */}
        {allCompleted && onComplete && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="w-full mt-6 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Continue
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}



