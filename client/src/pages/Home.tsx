import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  HardDrive, FileText, Zap, RefreshCw, BarChart3, Shield, 
  FolderTree, Database, ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: FolderTree,
    title: 'Directory Management',
    description: 'Create files and folders in a hierarchical structure',
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
  },
  {
    icon: HardDrive,
    title: 'Block Allocation',
    description: 'Visual disk block allocation with real-time updates',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Zap,
    title: 'Crash Simulation',
    description: 'Simulate disk failures from minor to catastrophic',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
  {
    icon: RefreshCw,
    title: 'Recovery System',
    description: 'Automatic recovery using journaling techniques',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: Database,
    title: 'Defragmentation',
    description: 'Optimize disk layout by reorganizing blocks',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: FileText,
    title: 'Journal Logging',
    description: 'Track all file system operations in real-time',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
];

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} />
        </div>

        <div className="container mx-auto px-6 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 rounded-2xl mb-8"
            >
              <HardDrive className="w-10 h-10 text-blue-500" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              File System
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                {' '}Simulator
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              An interactive tool for understanding file system recovery and optimization.
              Create files, simulate crashes, and watch recovery in action.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/simulator">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl flex items-center gap-2 transition-colors"
                >
                  <HardDrive size={20} />
                  Launch Simulator
                  <ArrowRight size={20} />
                </motion.button>
              </Link>
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl flex items-center gap-2 border border-gray-700 transition-colors"
                >
                  <BarChart3 size={20} />
                  View Dashboard
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">All-in-One Simulator</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            All features work together on the same data, providing a realistic and connected experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors"
            >
              <div className={`w-12 h-12 ${feature.bg} rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A complete workflow from file creation to recovery
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: 1, title: 'Create Files', desc: 'Add files and folders to the virtual disk', icon: FileText },
            { step: 2, title: 'Simulate Crash', desc: 'Trigger disk failures to corrupt blocks', icon: Zap },
            { step: 3, title: 'Run Recovery', desc: 'Use journaling to restore data', icon: Shield },
            { step: 4, title: 'Optimize', desc: 'Defragment for better performance', icon: RefreshCw },
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              <div className="bg-gray-800 rounded-xl p-6 text-center relative z-10">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <item.icon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
              {index < 3 && (
                <div className="hidden md:block absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-0">
                  <ArrowRight className="w-6 h-6 text-gray-600" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Explore?</h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Start the simulator and experience file system operations firsthand.
            Create, crash, recover, and optimize!
          </p>
          <Link to="/simulator">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl flex items-center gap-2 mx-auto transition-colors"
            >
              Start Simulating
              <ArrowRight size={20} />
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-gray-800">
        <div className="text-center text-gray-400">
          <p className="mb-2">
            Developed by <strong className="text-white">Adarsh Suman</strong> (adarsh3699)
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <a
              href="https://github.com/adarsh3699/File-System-Recovery-and-Optimization-Tool"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              GitHub Repository
            </a>
            <span>•</span>
            <a
              href="https://www.bhemu.in/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
