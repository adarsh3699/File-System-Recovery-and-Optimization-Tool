import { motion } from 'framer-motion';
import type { Block } from '../../types';
import { cn } from '../../lib/utils';

interface BlockCellProps {
  block: Block;
  onClick?: (block: Block) => void;
  isHighlighted?: boolean;
}

const colorMap: Record<Block['status'], string> = {
  free: 'bg-green-500 hover:bg-green-400',
  used: 'bg-blue-500 hover:bg-blue-400',
  metadata: 'bg-orange-500 hover:bg-orange-400',
  bad: 'bg-red-500 hover:bg-red-400',
  cached: 'bg-purple-500 hover:bg-purple-400',
};

export function BlockCell({ block, onClick, isHighlighted }: BlockCellProps) {
  return (
    <motion.div
      layout
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        boxShadow: isHighlighted ? '0 0 10px 2px rgba(255,255,255,0.5)' : 'none'
      }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.2, zIndex: 10 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => onClick?.(block)}
      data-block-id={block.id}
      className={cn(
        'w-8 h-8 rounded cursor-pointer transition-all duration-300 relative group',
        colorMap[block.status]
      )}
      title={`Block ${block.id}: ${block.status}${block.fileName ? ` (${block.fileName})` : ''}`}
    >
      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
        Block {block.id}: {block.status}
        {block.fileName && <div className="text-gray-300">{block.fileName}</div>}
      </div>

      {/* Show block number on larger screens */}
      <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white/70">
        {block.id}
      </span>
    </motion.div>
  );
}

