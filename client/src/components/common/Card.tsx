import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  glass?: boolean;
}

export function Card({ children, className, title, description, glass = false }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-lg p-6',
        glass
          ? 'bg-white/5 backdrop-blur-lg border border-white/10'
          : 'bg-gray-800 border border-gray-700',
        className
      )}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-xl font-bold text-white">{title}</h3>}
          {description && (
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          )}
        </div>
      )}
      {children}
    </motion.div>
  );
}

