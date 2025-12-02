import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HardDrive,
  Folder,
  File,
  Plus,
  Trash2,
  Zap,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useUnifiedStore } from "../store/unifiedStore";
import { cn } from "../lib/utils";
import { CrashAnimation } from "../components/crash/CrashAnimation";
import { RecoveryAnimation } from "../components/crash/RecoveryAnimation";

type ControlTab = "files" | "crash" | "optimize";

interface RecoveryStep {
  id: string;
  label: string;
  status: "pending" | "running" | "completed" | "error";
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function UnifiedSimulator() {
  const {
    blocks,
    rootDirectory,
    journal,
    totalBlocks,
    isJournalingActive,
    usedBlocks,
    freeBlocks,
    corruptedBlocks,
    initializeDisk,
    createFile,
    createFolder,
    deleteItem,
    simulateCrash,
    runRecovery,
    defragmentDisk,
    resetSystem,
  } = useUnifiedStore();

  const [isInitialized, setIsInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState<ControlTab>("files");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(4);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["root"])
  );

  // Block click modal state
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockFileSize, setBlockFileSize] = useState(4);
  const [blockFileName, setBlockFileName] = useState("");

  // Crash/Recovery animation states
  const [showCrashAnimation, setShowCrashAnimation] = useState(false);
  const [showRecoveryAnimation, setShowRecoveryAnimation] = useState(false);
  const [recoverySteps, setRecoverySteps] = useState<RecoveryStep[]>([]);

  // Defrag animation states
  const [isDefragging, setIsDefragging] = useState(false);
  const [defragProgress, setDefragProgress] = useState(0);
  const [movingBlockId, setMovingBlockId] = useState<number | null>(null);
  const [defragBlocks, setDefragBlocks] = useState<
    ((typeof blocks)[0] & { isMoving?: boolean })[]
  >([]);
  const [useDefragBlocks, setUseDefragBlocks] = useState(false);
  const [blockMoves, setBlockMoves] = useState(0);

  // Random name generator
  const generateRandomName = (type: "file" | "folder") => {
    const adjectives = [
      "new",
      "my",
      "temp",
      "backup",
      "data",
      "project",
      "work",
      "test",
    ];
    const nouns = [
      "file",
      "doc",
      "report",
      "image",
      "video",
      "audio",
      "archive",
      "backup",
    ];
    const extensions = [
      ".txt",
      ".pdf",
      ".doc",
      ".jpg",
      ".mp4",
      ".zip",
      ".dat",
      ".csv",
    ];

    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 100);

    if (type === "folder") {
      return `${adj}-${noun}-${num}`;
    }
    const ext = extensions[Math.floor(Math.random() * extensions.length)];
    return `${adj}-${noun}-${num}${ext}`;
  };

  // Calculate contiguous free blocks from a starting position
  const getContiguousFreeBlocks = (startBlock: number) => {
    let count = 0;
    for (let i = startBlock; i < blocks.length; i++) {
      if (blocks[i].status === "free") {
        count++;
      } else {
        break;
      }
    }
    return count;
  };

  // Calculate fragmentation percentage
  const calculateFragmentation = () => {
    if (usedBlocks === 0) return 0;

    // Group blocks by file
    const fileBlocks = new Map<string, number[]>();
    blocks.forEach((block) => {
      if (block.status === "used" && block.fileId) {
        if (!fileBlocks.has(block.fileId)) {
          fileBlocks.set(block.fileId, []);
        }
        fileBlocks.get(block.fileId)!.push(block.id);
      }
    });

    // Calculate fragmentation for each file
    let totalFragments = 0;
    let totalFiles = 0;

    fileBlocks.forEach((blockIds) => {
      if (blockIds.length === 0) return;

      totalFiles++;
      // Sort block IDs
      const sortedIds = [...blockIds].sort((a, b) => a - b);

      // Count gaps (fragments)
      let fragments = 1; // Every file has at least 1 fragment
      for (let i = 1; i < sortedIds.length; i++) {
        if (sortedIds[i] !== sortedIds[i - 1] + 1) {
          fragments++;
        }
      }

      totalFragments += fragments;
    });

    // Calculate fragmentation score
    // Perfect: totalFragments === totalFiles (each file is contiguous)
    // Worst: totalFragments >> totalFiles (many gaps)
    if (totalFiles === 0) return 0;

    const avgFragmentsPerFile = totalFragments / totalFiles;
    // Normalize to 0-100 scale (assume 5+ fragments per file is 100% fragmented)
    const fragmentation = Math.min(((avgFragmentsPerFile - 1) / 4) * 100, 100);

    return Math.round(fragmentation);
  };

  // Get efficiency status based on fragmentation
  const getEfficiencyStatus = () => {
    if (usedBlocks === 0) return { label: "Optimal", color: "text-green-400" };

    const fragmentation = calculateFragmentation();

    if (fragmentation < 10) {
      return { label: "Optimal", color: "text-green-400" };
    } else if (fragmentation < 30) {
      return { label: "Good", color: "text-cyan-400" };
    } else if (fragmentation < 50) {
      return { label: "Normal", color: "text-yellow-400" };
    } else if (fragmentation < 70) {
      return { label: "Fair", color: "text-orange-400" };
    } else {
      return { label: "Poor", color: "text-red-400" };
    }
  };

  // Initialize on mount
  useEffect(() => {
    if (!isInitialized && blocks.length === 0) {
      initializeDisk(256);
      setIsInitialized(true);
    } else {
      setIsInitialized(true);
    }
  }, [isInitialized, blocks.length, initializeDisk]);

  // Toggle folder expansion
  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Handle file creation
  const handleCreateFile = () => {
    const name = fileName.trim() || generateRandomName("file");
    createFile(name, fileSize, selectedItem || "root");
    setFileName("");
  };

  // Handle folder creation
  const handleCreateFolder = () => {
    const name = fileName.trim() || generateRandomName("folder");
    createFolder(name, selectedItem || "root");
    setFileName("");
  };

  // Handle block click - open modal to create file at this position
  const handleBlockClick = (block: (typeof blocks)[0]) => {
    if (block.status === "free") {
      setSelectedBlock(block.id);
      const available = getContiguousFreeBlocks(block.id);
      setBlockFileSize(Math.min(4, available));
      setBlockFileName("");
      setShowBlockModal(true);
    }
  };

  // Create file from block modal - at specific position for fragmentation
  const handleCreateFileFromBlock = () => {
    if (selectedBlock === null) return;
    const name = blockFileName.trim() || generateRandomName("file");
    // Pass the block position to create file at that specific location
    createFile(name, blockFileSize, selectedItem || "root", selectedBlock);
    setBlockFileName("");
    setShowBlockModal(false);
    setSelectedBlock(null);
  };

  // Handle crash with animation
  const handleCrash = async (severity: "minor" | "major" | "catastrophic") => {
    setShowCrashAnimation(true);

    // Wait for animation, then trigger actual crash
    await sleep(1500);
    simulateCrash(severity);
  };

  // Handle crash animation complete
  const handleCrashAnimationComplete = () => {
    setShowCrashAnimation(false);
  };

  // Handle recovery with animation
  const handleRecovery = async () => {
    const steps: RecoveryStep[] = [
      { id: "1", label: "Scanning file system...", status: "pending" },
      { id: "2", label: "Checking journal entries...", status: "pending" },
      {
        id: "3",
        label: "Replaying committed transactions...",
        status: "pending",
      },
      { id: "4", label: "Verifying block integrity...", status: "pending" },
      { id: "5", label: "Repairing damaged sectors...", status: "pending" },
      { id: "6", label: "Rebuilding metadata...", status: "pending" },
    ];

    setRecoverySteps(steps);
    setShowRecoveryAnimation(true);

    // Animate through steps
    for (let i = 0; i < steps.length; i++) {
      setRecoverySteps((prev) =>
        prev.map((step, idx) => ({
          ...step,
          status: idx === i ? "running" : idx < i ? "completed" : "pending",
        }))
      );

      await sleep(1200);

      // On step 5, actually run recovery
      if (i === 4) {
        runRecovery();
      }

      setRecoverySteps((prev) =>
        prev.map((step, idx) => ({
          ...step,
          status: idx <= i ? "completed" : step.status,
        }))
      );
    }
  };

  // Handle recovery complete
  const handleRecoveryComplete = () => {
    setShowRecoveryAnimation(false);
    setRecoverySteps([]);
  };

  // Animated defragmentation with visual block movement (like Defrag page)
  const handleAnimatedDefrag = async () => {
    if (isDefragging) return;

    setIsDefragging(true);
    setDefragProgress(0);
    setBlockMoves(0);

    // Create a working copy of blocks for animation
    const currentBlocks = blocks.map((b) => ({ ...b, isMoving: false }));
    setDefragBlocks(currentBlocks);
    setUseDefragBlocks(true);

    const usedBlocksData = currentBlocks.filter((b) => b.status === "used");

    if (usedBlocksData.length === 0) {
      setIsDefragging(false);
      setUseDefragBlocks(false);
      return;
    }

    // Sort used blocks by fileId to group files together
    const sortedUsed = [...usedBlocksData].sort((a, b) => {
      if (!a.fileId || !b.fileId) return 0;
      return a.fileId.localeCompare(b.fileId);
    });

    let targetIndex = 0;
    const totalMoves = sortedUsed.length;
    let moves = 0;

    for (const block of sortedUsed) {
      const currentIndex = currentBlocks.findIndex((b) => b.id === block.id);

      if (currentIndex !== targetIndex) {
        // Mark block as moving
        setDefragBlocks((prev) =>
          prev.map((b) => (b.id === block.id ? { ...b, isMoving: true } : b))
        );
        setMovingBlockId(block.id);

        await sleep(150);

        // Swap blocks in array
        const temp = currentBlocks[targetIndex];
        currentBlocks[targetIndex] = { ...block, isMoving: false };
        currentBlocks[currentIndex] = temp;

        // Update state to trigger re-render and animation
        setDefragBlocks([...currentBlocks]);
        moves++;
        setBlockMoves(moves);

        await sleep(100);
        setMovingBlockId(null);
      }

      targetIndex++;
      setDefragProgress(Math.round((targetIndex / totalMoves) * 100));
      await sleep(80);
    }

    // Final pause to show completed state
    await sleep(500);

    // Apply the final defragmentation to the store
    defragmentDisk();

    setIsDefragging(false);
    setDefragProgress(0);
    setMovingBlockId(null);
    setUseDefragBlocks(false);
    setDefragBlocks([]);
  };

  // Create a fragmented demo disk
  const createFragmentedDemo = async () => {
    // Reset first
    resetSystem();

    // Wait for reset
    await sleep(100);

    // Helper to generate random number between min and max (inclusive)
    const randomBetween = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    // Decide how many files to create (between 8 and 12)
    const numFiles = randomBetween(8, 12);

    // Track used positions to avoid overlaps
    const usedRanges: Array<{ start: number; end: number }> = [];

    // Helper to check if a range overlaps with used ranges
    const hasOverlap = (start: number, size: number) => {
      const end = start + size - 1;
      return usedRanges.some(
        (range) => !(end < range.start || start > range.end)
      );
    };

    // Create files with random names, sizes, and positions
    for (let i = 0; i < numFiles; i++) {
      // Generate random file size (3 to 10 blocks)
      const size = randomBetween(3, 10);

      // Generate random file name
      const name = generateRandomName("file");

      // Try to find a random position that doesn't overlap
      let position = -1;
      let attempts = 0;
      const maxAttempts = 50;

      while (attempts < maxAttempts) {
        // Random position, leaving some space at the end
        const candidatePos = randomBetween(0, totalBlocks - size - 1);

        if (!hasOverlap(candidatePos, size)) {
          position = candidatePos;
          usedRanges.push({
            start: candidatePos,
            end: candidatePos + size - 1,
          });
          break;
        }

        attempts++;
      }

      // If we found a valid position, create the file
      if (position >= 0) {
        createFile(name, size, "root", position);
        await sleep(50);
      }
    }

    // Now fill some random gaps to create more fragmentation
    const numGapFiles = randomBetween(3, 5);

    for (let i = 0; i < numGapFiles; i++) {
      const size = randomBetween(2, 5);
      const name = generateRandomName("file");

      // Try to find a gap between existing files
      let position = -1;
      let attempts = 0;

      while (attempts < 30) {
        const candidatePos = randomBetween(0, totalBlocks - size - 1);

        // Check if this position is in a gap (not overlapping with used ranges)
        if (!hasOverlap(candidatePos, size)) {
          // Check if it's actually between existing files (in a gap)
          const isBetweenFiles = usedRanges.some(
            (range) =>
              candidatePos > range.end && candidatePos < range.start + 15
          );

          if (isBetweenFiles || attempts > 15) {
            position = candidatePos;
            usedRanges.push({
              start: candidatePos,
              end: candidatePos + size - 1,
            });
            break;
          }
        }

        attempts++;
      }

      if (position >= 0) {
        createFile(name, size, "root", position);
        await sleep(50);
      }
    }
  };

  // Render directory tree item
  const renderDirectoryItem = (item: typeof rootDirectory, depth = 0) => {
    const isExpanded = expandedFolders.has(item.id);
    const isSelected = selectedItem === item.id;
    const hasChildren =
      item.type === "folder" && item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors",
            isSelected
              ? "bg-blue-500/20 text-blue-400"
              : "hover:bg-white/5 text-gray-300",
            depth > 0 && "ml-4"
          )}
          onClick={() => {
            setSelectedItem(item.id);
            if (item.type === "folder") {
              toggleFolder(item.id);
            }
          }}
        >
          {item.type === "folder" && (
            <span className="w-4">
              {hasChildren &&
                (isExpanded ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                ))}
            </span>
          )}
          {item.type === "folder" ? (
            <Folder size={16} className="text-yellow-500" />
          ) : (
            <File size={16} className="text-blue-400" />
          )}
          <span className="flex-1 truncate text-sm">{item.name}</span>
          {item.type === "file" && (
            <span className="text-xs text-gray-500">{item.size}K</span>
          )}
        </motion.div>

        {/* Children */}
        <AnimatePresence>
          {item.type === "folder" && isExpanded && item.children && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {item.children.map((child) =>
                renderDirectoryItem(child, depth + 1)
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-[100%] bg-gray-900 text-white">
      {/* Main Content */}
      <div className="flex h-[calc(100vh-66px)]">
        {/* Left Panel - Directory Tree + Controls */}
        <div className="w-80 border-r border-gray-700 flex flex-col">
          {/* Directory Tree */}
          <div className="flex-1 overflow-auto p-4">
            <h2 className="text-sm font-semibold text-gray-400 mb-3">
              Directory
            </h2>
            <div className="bg-gray-800 rounded-lg p-3">
              {renderDirectoryItem(rootDirectory)}
            </div>
          </div>

          {/* Controls */}
          <div className="border-t border-gray-700 p-4">
            <h2 className="text-sm font-semibold text-gray-400 mb-3">
              Controls
            </h2>

            {/* Tab Buttons */}
            <div className="flex gap-1 bg-gray-800 p-1 rounded-lg mb-4">
              {(["files", "crash", "optimize"] as ControlTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 py-2 px-3 rounded text-sm font-medium transition-colors capitalize",
                    activeTab === tab
                      ? "bg-gray-700 text-white"
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === "files" && (
                <motion.div
                  key="files"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-xs text-gray-400">Name</label>
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="Enter name..."
                      className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">
                      Size: {fileSize} blocks
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={fileSize}
                      onChange={(e) => setFileSize(Number(e.target.value))}
                      className="w-full mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateFile}
                      disabled={freeBlocks < fileSize}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-700 border border-blue-500 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} />
                      File
                    </button>
                    <button
                      onClick={handleCreateFolder}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-sm"
                    >
                      <Folder size={16} />
                      Folder
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Leave name empty for random name
                  </p>
                  <button
                    onClick={() => selectedItem && deleteItem(selectedItem)}
                    disabled={!selectedItem || selectedItem === "root"}
                    className="w-full flex items-center justify-center gap-2 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={16} />
                    Delete Selected
                  </button>
                </motion.div>
              )}

              {activeTab === "crash" && (
                <motion.div
                  key="crash"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <p className="text-xs text-gray-400">
                    Simulate disk failures to test recovery
                  </p>
                  <button
                    onClick={() => handleCrash("minor")}
                    disabled={showCrashAnimation || showRecoveryAnimation}
                    className="w-full flex items-center justify-center gap-2 py-2 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 rounded-lg text-sm disabled:opacity-50"
                  >
                    <Zap size={16} />
                    Minor (5 blocks)
                  </button>
                  <button
                    onClick={() => handleCrash("major")}
                    disabled={showCrashAnimation || showRecoveryAnimation}
                    className="w-full flex items-center justify-center gap-2 py-2 border border-orange-500/50 text-orange-400 hover:bg-orange-500/10 rounded-lg text-sm disabled:opacity-50"
                  >
                    <Zap size={16} />
                    Major (15 blocks)
                  </button>
                  <button
                    onClick={() => handleCrash("catastrophic")}
                    disabled={showCrashAnimation || showRecoveryAnimation}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm disabled:opacity-50"
                  >
                    <Zap size={16} />
                    Catastrophic (30 blocks)
                  </button>
                  <button
                    onClick={handleRecovery}
                    disabled={
                      corruptedBlocks === 0 ||
                      showCrashAnimation ||
                      showRecoveryAnimation
                    }
                    className="w-full flex items-center justify-center gap-2 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw size={16} />
                    Run Recovery
                  </button>
                </motion.div>
              )}

              {activeTab === "optimize" && (
                <motion.div
                  key="optimize"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <p className="text-xs text-gray-400">
                    Optimize disk performance
                  </p>
                  <button
                    onClick={createFragmentedDemo}
                    disabled={isDefragging}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm disabled:opacity-50"
                  >
                    <HardDrive size={16} />
                    Create Fragmented Demo
                  </button>
                  <button
                    onClick={handleAnimatedDefrag}
                    disabled={isDefragging || usedBlocks === 0}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm disabled:opacity-50"
                  >
                    <HardDrive size={16} />
                    {isDefragging
                      ? `Defragging... ${defragProgress}%`
                      : "Defragment Disk"}
                  </button>
                  <button
                    onClick={resetSystem}
                    className="w-full flex items-center justify-center gap-2 py-2 border border-gray-600 text-gray-400 hover:bg-gray-800 rounded-lg text-sm"
                  >
                    <RefreshCw size={16} />
                    Reset System
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Center Panel - Disk Blocks */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Dynamic Stats at TOP based on active tab */}
          <div className="mb-4 grid grid-cols-4 gap-4">
            {activeTab === "files" && (
              <>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Total Files</p>
                  <p className="text-xl font-bold text-blue-400">
                    {rootDirectory.children?.length || 0}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Free Blocks</p>
                  <p className="text-xl font-bold text-green-400">
                    {freeBlocks}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Used Blocks</p>
                  <p className="text-xl font-bold text-blue-400">
                    {usedBlocks}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Disk Usage</p>
                  <p className="text-xl font-bold text-purple-400">
                    {totalBlocks > 0
                      ? Math.round((usedBlocks / totalBlocks) * 100)
                      : 0}
                    %
                  </p>
                </div>
              </>
            )}

            {activeTab === "crash" && (
              <>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Healthy Blocks</p>
                  <p className="text-xl font-bold text-green-400">
                    {totalBlocks - corruptedBlocks}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Corrupted</p>
                  <p className="text-xl font-bold text-red-400">
                    {corruptedBlocks}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Corruption Rate</p>
                  <p className="text-xl font-bold text-orange-400">
                    {totalBlocks > 0
                      ? Math.round((corruptedBlocks / totalBlocks) * 100)
                      : 0}
                    %
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Journal Status</p>
                  <p className="text-xl font-bold text-green-400">
                    {isJournalingActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </>
            )}

            {activeTab === "optimize" && (
              <>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Total Blocks</p>
                  <p className="text-xl font-bold text-blue-400">
                    {totalBlocks}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Used Blocks</p>
                  <p className="text-xl font-bold text-purple-400">
                    {usedBlocks}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-400">
                    {isDefragging ? "Moves Made" : "Free Space"}
                  </p>
                  <p className="text-xl font-bold text-green-400">
                    {isDefragging ? blockMoves : freeBlocks}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-400">
                    {isDefragging ? "Progress" : "Efficiency"}
                  </p>
                  <p
                    className={`text-xl font-bold ${
                      isDefragging
                        ? "text-cyan-400"
                        : getEfficiencyStatus().color
                    }`}
                  >
                    {isDefragging
                      ? `${defragProgress}%`
                      : getEfficiencyStatus().label}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Defrag Progress Bar */}
          {isDefragging && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-400">
                  Defragmenting... ({blockMoves} moves)
                </span>
                <span className="text-sm text-purple-400">
                  {defragProgress}%
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${defragProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Block Grid */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}
            >
              <AnimatePresence mode="popLayout">
                {(useDefragBlocks ? defragBlocks : blocks).map((block) => (
                  <motion.div
                    key={block.id}
                    layout
                    initial={{ scale: 0 }}
                    animate={{
                      scale: 1,
                      backgroundColor:
                        block.status === "free"
                          ? "#374151"
                          : block.status === "bad"
                          ? "#ef4444"
                          : movingBlockId === block.id ||
                            (useDefragBlocks &&
                              "isMoving" in block &&
                              (block as { isMoving?: boolean }).isMoving)
                          ? "#a855f7"
                          : "#3b82f6",
                      boxShadow:
                        selectedBlock === block.id
                          ? "0 0 0 2px #3b82f6"
                          : movingBlockId === block.id ||
                            (useDefragBlocks &&
                              "isMoving" in block &&
                              (block as { isMoving?: boolean }).isMoving)
                          ? "0 0 20px rgba(168, 85, 247, 0.8)"
                          : "none",
                    }}
                    transition={{
                      layout: {
                        duration: 0.3,
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      },
                      scale: { duration: 0.2 },
                    }}
                    whileHover={!isDefragging ? { scale: 1.2, zIndex: 10 } : {}}
                    onClick={() => !isDefragging && handleBlockClick(block)}
                    className={cn(
                      "aspect-square rounded border relative group flex items-center justify-center",
                      block.status === "free"
                        ? "border-gray-600"
                        : block.status === "bad"
                        ? "border-red-400"
                        : "border-blue-400",
                      block.status === "free" && !isDefragging
                        ? "cursor-pointer hover:border-blue-500"
                        : "cursor-default",
                      (movingBlockId === block.id ||
                        (useDefragBlocks &&
                          "isMoving" in block &&
                          (block as { isMoving?: boolean }).isMoving)) &&
                        "z-20 border-purple-400"
                    )}
                    title={`Block #${block.id} - ${block.status}${
                      block.fileName ? ` (${block.fileName})` : ""
                    }${
                      block.status === "free"
                        ? " - Click to create file here"
                        : ""
                    }`}
                  >
                    {/* Block Number */}
                    <span
                      className={cn(
                        "text-[8px] font-bold",
                        block.status === "free"
                          ? "text-gray-500"
                          : "text-white/70",
                        (movingBlockId === block.id ||
                          (useDefragBlocks &&
                            "isMoving" in block &&
                            (block as { isMoving?: boolean }).isMoving)) &&
                          "text-white font-extrabold"
                      )}
                    >
                      {block.id}
                    </span>

                    {/* Tooltip */}
                    {!isDefragging && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                        Block #{block.id} - {block.status}
                        {block.fileName && (
                          <>
                            <br />
                            {block.fileName}
                          </>
                        )}
                        {block.status === "free" && (
                          <>
                            <br />
                            Click to create file
                          </>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Disk Blocks Legend - Bottom */}
          <div className="flex items-center justify-between mt-4">
            <h2 className="text-sm font-semibold text-gray-400">Disk Blocks</h2>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-700 border border-gray-600" />
                <span className="text-gray-400">Free</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500" />
                <span className="text-gray-400">Used</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span className="text-gray-400">Corrupted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-500" />
                <span className="text-gray-400">Moving</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Journal Log */}
        <div className="w-80 border-l border-gray-700 p-4 overflow-auto">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">
            Journal Log
          </h2>
          <div className="space-y-2">
            {journal.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No entries yet
              </p>
            ) : (
              journal.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-800 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {entry.type === "create" && (
                      <File size={14} className="text-green-400" />
                    )}
                    {entry.type === "delete" && (
                      <Trash2 size={14} className="text-red-400" />
                    )}
                    {entry.type === "crash" && (
                      <AlertCircle size={14} className="text-red-400" />
                    )}
                    {entry.type === "recover" && (
                      <RefreshCw size={14} className="text-green-400" />
                    )}
                    {entry.type === "defrag" && (
                      <HardDrive size={14} className="text-blue-400" />
                    )}
                    <span className="text-sm font-medium capitalize">
                      {entry.type}
                    </span>
                    <span
                      className={cn(
                        "text-xs px-1.5 py-0.5 rounded",
                        entry.status === "done"
                          ? "bg-green-500/20 text-green-400"
                          : entry.status === "failed"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      )}
                    >
                      {entry.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{entry.target}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <Clock size={10} />
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Block Click Modal */}
      <AnimatePresence>
        {showBlockModal && selectedBlock !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setShowBlockModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-80 shadow-xl"
            >
              <h3 className="text-lg font-bold text-white mb-2">
                Create File at Block
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Starting at Block #{selectedBlock}
                <br />
                <span className="text-green-400">
                  {getContiguousFreeBlocks(selectedBlock)} contiguous blocks
                  available
                </span>
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400">
                    File Name (optional - random if empty)
                  </label>
                  <input
                    type="text"
                    value={blockFileName}
                    onChange={(e) => setBlockFileName(e.target.value)}
                    placeholder="Random name if empty..."
                    className="w-full mt-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400">
                    Size: {blockFileSize} blocks ({blockFileSize * 4}KB)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max={Math.min(20, getContiguousFreeBlocks(selectedBlock))}
                    value={blockFileSize}
                    onChange={(e) => setBlockFileSize(Number(e.target.value))}
                    className="w-full mt-1"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowBlockModal(false)}
                    className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateFileFromBlock}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium"
                  >
                    Create File
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crash Animation Overlay */}
      <AnimatePresence>
        {showCrashAnimation && (
          <CrashAnimation onComplete={handleCrashAnimationComplete} />
        )}
      </AnimatePresence>

      {/* Recovery Animation Overlay */}
      <AnimatePresence>
        {showRecoveryAnimation && (
          <RecoveryAnimation
            steps={recoverySteps}
            onComplete={handleRecoveryComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
