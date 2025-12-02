import { motion } from 'framer-motion';
import type { Block } from '../../types';
import { BlockCell } from './BlockCell';
import { useMemo, useState } from 'react';

interface DiskGridProps {
  blocks: Block[];
  onBlockClick?: (block: Block) => void;
  highlightedBlocks?: number[];
  compact?: boolean;
}

export function DiskGrid({ blocks, onBlockClick, highlightedBlocks = [], compact = false }: DiskGridProps) {
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

  // Calculate grid dimensions based on number of blocks
  const cols = useMemo(() => {
    const sqrt = Math.ceil(Math.sqrt(blocks.length));
    return Math.min(sqrt, 32); // Max 32 columns for readability
  }, [blocks.length]);

  const handleBlockClick = (block: Block) => {
    setSelectedBlock(block);
    onBlockClick?.(block);
  };

  return (
    <div className="space-y-4">
      {/* Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid gap-1 p-4 bg-gray-900/50 rounded-lg"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {blocks.map((block) => (
          <BlockCell
            key={block.id}
            block={block}
            onClick={handleBlockClick}
            isHighlighted={highlightedBlocks.includes(block.id)}
          />
        ))}
      </motion.div>

      {/* Selected Block Info */}
      {!compact && selectedBlock && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-4 rounded-lg"
        >
          <h4 className="font-bold text-lg mb-2">Block Information</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-400">Block ID:</div>
            <div className="text-white font-mono">{selectedBlock.id}</div>
            <div className="text-gray-400">Status:</div>
            <div className="text-white capitalize">{selectedBlock.status}</div>
            {selectedBlock.fileName && (
              <>
                <div className="text-gray-400">File:</div>
                <div className="text-white">{selectedBlock.fileName}</div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

