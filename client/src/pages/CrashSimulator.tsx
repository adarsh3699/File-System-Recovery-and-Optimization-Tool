import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, RefreshCw, AlertTriangle, Shield, Activity } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { CrashAnimation } from '../components/crash/CrashAnimation';
import { RecoveryAnimation } from '../components/crash/RecoveryAnimation';
import { useFileSystemStore } from '../store/fileSystemStore';
import { sleep } from '../lib/utils';

type CrashType = 'power-loss' | 'sector-failure' | 'corruption' | 'metadata';

interface RecoveryStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'error';
}

export function CrashSimulator() {
  const { blocks, updateBlockStatus } = useFileSystemStore();
  const [isCrashing, setIsCrashing] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoverySteps, setRecoverySteps] = useState<RecoveryStep[]>([]);

  const crashScenarios = [
    {
      type: 'power-loss' as CrashType,
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: 'Power Loss',
      description: 'Simulate sudden power failure during write operation',
      severity: 'High',
    },
    {
      type: 'sector-failure' as CrashType,
      icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
      title: 'Bad Sector',
      description: 'Simulate disk sector becoming unreadable',
      severity: 'Critical',
    },
    {
      type: 'corruption' as CrashType,
      icon: <Activity className="w-8 h-8 text-orange-500" />,
      title: 'Data Corruption',
      description: 'Simulate random bit flips in stored data',
      severity: 'Medium',
    },
    {
      type: 'metadata' as CrashType,
      icon: <Shield className="w-8 h-8 text-purple-500" />,
      title: 'Metadata Damage',
      description: 'Simulate corruption of file system metadata',
      severity: 'High',
    },
  ];

  const simulateCrash = async (_type: CrashType) => {
    setIsCrashing(true);

    // Wait for crash animation
    await sleep(2000);

    // Apply crash effects to blocks
    const usedBlocks = blocks.filter((b) => b.status === 'used');
    const randomBlocks = usedBlocks
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 5) + 3);

    randomBlocks.forEach((block) => {
      updateBlockStatus(block.id, 'bad');
    });

    setIsCrashing(false);
    await sleep(500);

    // Start recovery
    await startRecovery();
  };

  const startRecovery = async () => {
    const steps: RecoveryStep[] = [
      { id: '1', label: 'Scanning file system...', status: 'pending' },
      { id: '2', label: 'Checking journal entries...', status: 'pending' },
      { id: '3', label: 'Replaying committed transactions...', status: 'pending' },
      { id: '4', label: 'Verifying block integrity...', status: 'pending' },
      { id: '5', label: 'Repairing damaged sectors...', status: 'pending' },
      { id: '6', label: 'Rebuilding metadata...', status: 'pending' },
    ];

    setRecoverySteps(steps);
    setIsRecovering(true);

    // Execute recovery steps
    for (let i = 0; i < steps.length; i++) {
      // Mark as running
      setRecoverySteps((prev) =>
        prev.map((step, idx) =>
          idx === i ? { ...step, status: 'running' } : step
        )
      );

      await sleep(1500);

      // Mark as completed
      setRecoverySteps((prev) =>
        prev.map((step, idx) =>
          idx === i ? { ...step, status: 'completed' } : step
        )
      );

      // Repair some blocks during recovery
      if (i === 4) {
        const badBlocks = blocks.filter((b) => b.status === 'bad');
        badBlocks.forEach((block) => {
          if (block.fileId) {
            updateBlockStatus(block.id, 'used');
          } else {
            updateBlockStatus(block.id, 'free');
          }
        });
      }
    }
  };

  const handleRecoveryComplete = () => {
    setIsRecovering(false);
    setRecoverySteps([]);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          Crash & Recovery Simulator
        </h1>
        <p className="text-gray-400">
          Simulate disk failures and watch the recovery process
        </p>
      </motion.div>

      {/* Warning Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 glass p-4 rounded-lg border border-yellow-500/20"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
          <div>
            <p className="text-yellow-500 font-medium">
              Simulation Mode Active
            </p>
            <p className="text-gray-400 text-sm">
              These are simulated crashes. Your actual file system is safe.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Crash Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {crashScenarios.map((scenario, index) => (
          <motion.div
            key={scenario.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card glass className="h-full">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  {scenario.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">
                      {scenario.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        scenario.severity === 'Critical'
                          ? 'bg-red-500/20 text-red-400'
                          : scenario.severity === 'High'
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {scenario.severity}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    {scenario.description}
                  </p>
                  <Button
                    onClick={() => simulateCrash(scenario.type)}
                    variant="danger"
                    size="sm"
                    disabled={isCrashing || isRecovering}
                    className="w-full"
                  >
                    <Zap size={16} />
                    Trigger Crash
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glass>
          <div className="flex items-center gap-3 mb-2">
            <RefreshCw className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-bold text-white">Journaling</h3>
          </div>
          <p className="text-gray-400 text-sm">
            Write-ahead logging ensures data integrity by recording changes
            before applying them to the file system.
          </p>
        </Card>

        <Card glass>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-bold text-white">Recovery</h3>
          </div>
          <p className="text-gray-400 text-sm">
            The recovery process replays journal entries to restore the file
            system to a consistent state after a crash.
          </p>
        </Card>

        <Card glass>
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-6 h-6 text-purple-500" />
            <h3 className="text-lg font-bold text-white">Integrity</h3>
          </div>
          <p className="text-gray-400 text-sm">
            Checksums and verification ensure data hasn't been corrupted during
            the recovery process.
          </p>
        </Card>
      </div>

      {/* Crash Animation */}
      {isCrashing && <CrashAnimation onComplete={() => {}} />}

      {/* Recovery Animation */}
      {isRecovering && (
        <RecoveryAnimation
          steps={recoverySteps}
          onComplete={handleRecoveryComplete}
        />
      )}
    </div>
  );
}

