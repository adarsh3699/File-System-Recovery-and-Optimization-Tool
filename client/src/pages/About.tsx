import { motion } from 'framer-motion';
import { BookOpen, Code, Database, Shield, Zap, Users, Github } from 'lucide-react';

const features = [
  {
    icon: <Database className="w-6 h-6" />,
    title: 'File System Simulation',
    description: 'Interactive visualization of file allocation, inode management, and disk block operations.',
    color: 'blue',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Crash & Recovery',
    description: 'Simulate system crashes and observe journaling-based recovery mechanisms in action.',
    color: 'red',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Performance Optimization',
    description: 'Defragmentation, caching, and real-time performance metrics visualization.',
    color: 'yellow',
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Educational Demos',
    description: 'Pre-built scenarios that teach file system concepts through interactive animations.',
    color: 'green',
  },
];

const concepts = [
  {
    title: 'Block Allocation',
    description: 'Files are stored in fixed-size blocks on disk. Different allocation strategies (contiguous, linked, indexed) have different trade-offs.',
  },
  {
    title: 'Fragmentation',
    description: 'When files are scattered across non-contiguous blocks, it slows down access. Defragmentation reorganizes files to be contiguous.',
  },
  {
    title: 'Journaling',
    description: 'A write-ahead log that records operations before they happen. Enables recovery after unexpected crashes.',
  },
  {
    title: 'Inodes',
    description: 'Data structures that store metadata about files (size, timestamps, block pointers). Each file has one inode.',
  },
  {
    title: 'Directory Structure',
    description: 'Hierarchical organization of files and folders. Directories are special files that map names to inodes.',
  },
  {
    title: 'Bad Sectors',
    description: 'Disk blocks that are damaged and cannot store data reliably. File systems must detect and avoid them.',
  },
];

const technologies = [
  { name: 'React', description: 'Component-based UI framework' },
  { name: 'TypeScript', description: 'Type-safe JavaScript' },
  { name: 'Framer Motion', description: 'Smooth animations' },
  { name: 'Recharts', description: 'Data visualization' },
  { name: 'Tailwind CSS', description: 'Utility-first styling' },
  { name: 'Zustand', description: 'State management' },
  { name: 'FastAPI', description: 'Python backend API' },
];

export function About() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto mb-16"
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            File System Simulator
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            An interactive, visual demonstration of file system operations, recovery mechanisms,
            and performance optimization techniques.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className={`inline-block p-3 rounded-lg bg-${feature.color}-500/20 mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Key Concepts Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-6xl mx-auto mb-16"
      >
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-400" />
          Key Concepts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {concepts.map((concept, index) => (
            <motion.div
              key={concept.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/30"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                {concept.title}
              </h3>
              <p className="text-sm text-gray-400">
                {concept.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* How to Use Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="max-w-6xl mx-auto mb-16"
      >
        <h2 className="text-3xl font-bold text-white mb-8">
          How to Use
        </h2>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold">1</span>
                Start with Demos
              </h3>
              <p className="text-gray-400 ml-10">
                Visit the <strong>Demos</strong> page to see pre-built scenarios that showcase key concepts.
                Each demo runs automatically and explains what's happening.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold">2</span>
                Experiment in Simulator
              </h3>
              <p className="text-gray-400 ml-10">
                Use the <strong>Simulator</strong> to create files, simulate crashes, and try recovery operations.
                Watch the disk map update in real-time as you perform operations.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold">3</span>
                Monitor Performance
              </h3>
              <p className="text-gray-400 ml-10">
                Check the <strong>Dashboard</strong> for real-time performance metrics, charts, and system statistics.
                Compare efficiency before and after optimization.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold">4</span>
                Optimize & Defrag
              </h3>
              <p className="text-gray-400 ml-10">
                Use the <strong>Defrag</strong> page to create fragmented scenarios and watch
                the defragmentation process reorganize blocks for better performance.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Technologies Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="max-w-6xl mx-auto mb-16"
      >
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <Code className="w-8 h-8 text-green-400" />
          Built With
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.05 }}
              className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 text-center"
            >
              <h3 className="text-white font-semibold mb-1">{tech.name}</h3>
              <p className="text-xs text-gray-400">{tech.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Project Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-8 border border-blue-500/30">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Users className="w-6 h-6" />
            About This Project
          </h2>
          <p className="text-gray-300 mb-4">
            This File System Simulator is an educational tool designed to help students and developers
            understand the inner workings of file systems. Through interactive visualizations and
            animations, complex concepts become intuitive and engaging.
          </p>
          <p className="text-gray-300 mb-6">
            <strong>Developer:</strong> Adarsh Suman (adarsh3699)
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/adarsh3699/File-System-Recovery-and-Optimization-Tool"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors"
            >
              <Github size={18} />
              <span className="text-white">View on GitHub</span>
            </a>
            <a
              href="https://www.bhemu.in/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors"
            >
              <Users size={18} />
              <span className="text-white">Contact Developer</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

