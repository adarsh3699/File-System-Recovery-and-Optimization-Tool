# 🗂️ File System Recovery and Optimization Tool

An interactive, visual demonstration of file system operations, crash recovery mechanisms, and disk optimization techniques. This educational tool simulates real-world disk operations, crash scenarios, and recovery processes with stunning animations and real-time performance metrics.

![File System Simulator](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green.svg)

🔗 **[Live Demo](https://file-system-simulator.vercel.app)** | 📖 **[Documentation](./GETTING_STARTED.md)** | 🐛 **[Report Bug](https://github.com/adarsh3699/File-System-Recovery-and-Optimization-Tool/issues)**

## 🎯 Why This Tool?

File systems are a fundamental concept in operating systems, yet they're often taught through textbooks and lectures alone. This interactive simulator bridges the gap between theory and practice by:

- **Visualizing the Invisible** - See exactly what happens when you create a file, simulate a crash, or defragment a disk
- **Learning by Doing** - Experiment with file operations without risk of damaging your real system
- **Understanding Failures** - Watch how journaling protects your data during catastrophic crashes
- **Optimizing Performance** - Observe the real impact of fragmentation and defragmentation on disk efficiency
- **Building Intuition** - Develop a mental model of how modern file systems work under the hood

Perfect for students, educators, and developers who want to truly understand file system internals!

## ✨ Features

### 🎨 Visual Disk Representation

- **Real-time 256-block disk grid** with color-coded states (free, used, metadata, bad, cached)
- **Animated file operations** showing block allocation and deallocation in real-time
- **Interactive block selection** with click-to-inspect functionality
- **Live fragmentation visualization** showing scattered file blocks across the disk

### 📊 Performance Dashboard

- **Real-time metrics** tracking disk usage, operations, and system health
- **Multi-chart analytics**:
  - Space distribution pie chart (free, used, metadata, bad blocks)
  - Read/write speed line graph with historical data
  - Operation statistics bar chart (creates, deletes, reads, writes)
  - Fragmentation gauge with dynamic color-coded status
- **Live sync with simulator** - all metrics update as you perform operations
- **Cache hit rate** and **journal size** monitoring

### 💥 Crash & Recovery Simulation

- **Three crash severity levels**:
  - Minor Crash (10% block corruption)
  - Major Crash (25% block corruption)
  - Catastrophic Crash (50% block corruption)
- **Cinematic crash animations** with explosion effects and screen shake
- **Journaling system** with write-ahead logging for transaction safety
- **Animated recovery process** showing step-by-step block restoration
- **Journal replay mechanism** to restore file system consistency

### 🔄 Disk Defragmentation

- **Visual fragmentation detection** highlighting scattered file blocks
- **Animated block reorganization** with smooth transitions
- **Real-time efficiency metrics** showing fragmentation percentage
- **Before/after comparison** demonstrating performance improvements
- **Smart defrag algorithm** that consolidates file blocks contiguously

### 📚 Educational Content

- **Comprehensive About page** with file system concepts and tutorials
- **Interactive explanations** of:
  - Block allocation strategies
  - Journaling and crash recovery
  - Defragmentation techniques
  - Performance optimization
- **Usage guides** with step-by-step instructions
- **Visual learning** through animations and color-coding

## 🎬 What Can You Do?

### Try These Interactive Scenarios

**🎯 Scenario 1: Create and Organize Files**

1. Create files and folders in the directory tree
2. Watch blocks get allocated in real-time on the disk grid
3. See metadata blocks reserved for file system structures

**💥 Scenario 2: Simulate a Disk Crash**

1. Create several files to populate your disk
2. Click "Simulate Crash" and choose severity (Minor/Major/Catastrophic)
3. Watch the dramatic crash animation with explosion effects
4. Observe which blocks get corrupted (marked red)
5. Click "Run Recovery" to see the journal replay mechanism restore your files

**🔄 Scenario 3: Defragment a Messy Disk**

1. Click "Create Fragmented Demo" to generate a scattered file layout
2. Notice the fragmentation percentage in the metrics
3. Click "Defragment Disk" and watch blocks reorganize
4. See the fragmentation drop to near 0% as files become contiguous

**📊 Scenario 4: Monitor Performance**

1. Create, delete, and modify files in the simulator
2. Switch to the Dashboard page
3. Observe real-time charts updating with your operations
4. Track read/write speeds, operation counts, and disk health

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and pnpm
- **Python** 3.10+ (for backend)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/adarsh3699/File-System-Recovery-and-Optimization-Tool.git
cd File-System-Recovery-and-Optimization-Tool
```

2. **Install frontend dependencies**

```bash
cd client
pnpm install
```

3. **Install backend dependencies**

```bash
cd ../server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Running the Application

#### Development Mode

**Terminal 1 - Frontend:**

```bash
cd client
pnpm run dev
```

The frontend will start at `http://localhost:5173`

**Terminal 2 - Backend (Optional):**

```bash
cd server
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app/main.py
```

The backend API will start at `http://localhost:4000`

### Building for Production

```bash
cd client
pnpm run build
```

The built files will be in `client/dist/`

## 📖 Usage Guide

### 1. **Start at Home**

The **Home** page provides:

- Quick overview of the tool's capabilities
- Direct navigation to all sections
- Visual introduction to key concepts

### 2. **Experiment in Simulator**

The **Unified Simulator** is the heart of the tool where you can:

- **Create Files & Folders**: Build a directory structure with named files
- **Manual Block Allocation**: Click on blocks to assign them to files
- **View Disk State**: See real-time visualization of all 256 disk blocks
- **Simulate Crashes**: Test minor, major, or catastrophic disk failures with cinematic animations
- **Run Recovery**: Watch the journal replay mechanism restore file system consistency
- **Defragment Disk**: Reorganize scattered blocks for optimal performance
- **Pre-built Demos**:
  - Create Fragmented Demo (random files in random locations)
  - Create Clustered Demo (all files together)
  - Fill Disk Demo (allocate all available blocks)

### 3. **Monitor Performance**

The **Dashboard** provides live analytics:

- **Disk Space Chart**: Visual breakdown of block distribution
- **Performance Trends**: Historical read/write speed graphs
- **Operation Statistics**: Track all file system operations
- **Fragmentation Gauge**: Real-time disk efficiency percentage
- **System Metrics**: Cache hits, journal size, total operations

### 4. **Learn Concepts**

Visit the **About** page for:

- File system fundamentals
- Block allocation strategies
- Journaling and recovery mechanisms
- Defragmentation techniques
- Complete usage tutorials

## 🏗️ Project Structure

```
File-System-Recovery-and-Optimization-Tool/
├── client/                          # React Frontend Application
│   ├── src/
│   │   ├── components/             # Reusable UI Components
│   │   │   ├── charts/            # Recharts visualizations
│   │   │   │   ├── FragmentationGauge.tsx
│   │   │   │   ├── PerformanceChart.tsx
│   │   │   │   ├── SpaceChart.tsx
│   │   │   │   └── OperationChart.tsx
│   │   │   ├── common/            # Shared components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   └── Modal.tsx
│   │   │   ├── crash/             # Crash & recovery animations
│   │   │   │   ├── CrashAnimation.tsx
│   │   │   │   └── RecoveryAnimation.tsx
│   │   │   ├── disk/              # Disk visualization
│   │   │   │   ├── DiskGrid.tsx
│   │   │   │   ├── BlockCell.tsx
│   │   │   │   └── DiskLegend.tsx
│   │   │   └── effects/           # Visual effects
│   │   │       ├── ExplosionEffect.tsx
│   │   │       ├── PulseRing.tsx
│   │   │       └── SparkleEffect.tsx
│   │   ├── pages/                 # Main application pages
│   │   │   ├── Home.tsx           # Landing page
│   │   │   ├── UnifiedSimulator.tsx  # Main simulator
│   │   │   ├── Dashboard.tsx      # Analytics dashboard
│   │   │   └── About.tsx          # Educational content
│   │   ├── store/                 # Zustand state management
│   │   │   └── unifiedStore.ts    # Global file system state
│   │   ├── hooks/                 # Custom React hooks
│   │   │   └── useEffects.tsx
│   │   ├── lib/                   # Utility functions
│   │   │   ├── utils.ts
│   │   │   └── storage.ts
│   │   ├── types/                 # TypeScript definitions
│   │   │   └── index.ts
│   │   ├── App.tsx                # Main app & routing
│   │   └── main.tsx               # React entry point
│   ├── public/                    # Static assets
│   ├── dist/                      # Production build output
│   ├── package.json               # Frontend dependencies
│   └── vite.config.ts             # Vite configuration
│
├── server/                        # FastAPI Backend (Optional)
│   ├── app/
│   │   └── main.py               # REST API endpoints
│   └── requirements.txt           # Python dependencies
│
├── README.md                      # This file
├── GETTING_STARTED.md             # Setup guide
├── PROJECT_STEPS.md               # Implementation roadmap
├── FEATURES_ADDED.md              # Feature changelog
├── FEATURE_VERIFICATION.md        # Testing documentation
└── SETUP_COMPLETE.md              # Setup verification
```

## 🎯 Key Concepts Demonstrated

### File System Operations

- **Block Allocation**: 256 fixed-size blocks (4KB each) with visual tracking
- **File Management**: Create, delete, and organize files in a hierarchical directory structure
- **Directory Structure**: Root directory with nested folders (unlimited depth)
- **Free Space Management**: Bitmap-based allocation with real-time availability tracking
- **Metadata Storage**: Reserved blocks for file system metadata (inodes, bitmaps)

### Crash Recovery Mechanisms

- **Journaling System**: Write-ahead logging (WAL) that records all operations before execution
- **Transaction Management**: Atomic operation groups ensuring all-or-nothing execution
- **Journal Replay**: Automatic recovery by replaying committed transactions after crashes
- **Corruption Detection**: Identify and mark bad blocks that fail integrity checks
- **Data Restoration**: Restore file system to last consistent state using journal entries

### Performance Optimization

- **Defragmentation Engine**: Reorganizes scattered file blocks to improve contiguity
- **Fragmentation Analysis**: Real-time calculation using two-factor algorithm:
  - File-level fragmentation (40% weight): Checks if individual files are split
  - Disk-level scatter (60% weight): Measures gaps between all used blocks
- **Efficiency Metrics**: Dynamic color-coded status (Optimal, Good, Normal, Fair, Poor)
- **Block Caching**: Track cached blocks for performance monitoring
- **Operation Counting**: Measure reads, writes, creates, and deletes for performance analysis

## 🛠️ Tech Stack

### Frontend Technologies

| Technology        | Version | Purpose                                      |
| ----------------- | ------- | -------------------------------------------- |
| **React**         | 18.3+   | Component-based UI framework                 |
| **TypeScript**    | 5.6+    | Type-safe JavaScript for better code quality |
| **Vite**          | 6.0+    | Lightning-fast build tool and dev server     |
| **Framer Motion** | 12.x    | Smooth animations and transitions            |
| **Recharts**      | 2.x     | Interactive data visualization charts        |
| **Tailwind CSS**  | 3.x     | Utility-first CSS framework                  |
| **Zustand**       | 5.x     | Lightweight state management                 |
| **Lucide React**  | Latest  | Beautiful, consistent icon set               |
| **React Router**  | 7.x     | Client-side routing                          |

### Backend Technologies (Optional)

| Technology   | Version | Purpose                                 |
| ------------ | ------- | --------------------------------------- |
| **FastAPI**  | Latest  | High-performance Python web framework   |
| **Uvicorn**  | Latest  | ASGI server for async Python            |
| **Pydantic** | Latest  | Data validation and settings management |

### Development Tools

- **pnpm** - Fast, disk-efficient package manager
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing
- **Git** - Version control

## 📊 Implemented Features

### Visual Components ✅

- ✅ **Interactive 256-block disk grid** with smooth animations
- ✅ **Color-coded block states**: Free (green), Used (blue), Metadata (orange), Bad (red), Cached (purple)
- ✅ **Real-time performance charts** using Recharts (pie, line, bar, gauge)
- ✅ **Animated file operations** with Framer Motion transitions
- ✅ **Cinematic crash animations** with explosion effects and screen shake
- ✅ **Smooth recovery animations** showing block-by-block restoration
- ✅ **Defragmentation visualization** with block reorganization animations
- ✅ **Directory tree view** with expandable/collapsible folders
- ✅ **Journal log display** showing operation history

### Core Functional Features ✅

- ✅ **File creation and deletion** with automatic block allocation/deallocation
- ✅ **Folder management** with hierarchical directory structure
- ✅ **Block allocation tracking** with real-time free space monitoring
- ✅ **Three-level crash simulation**: Minor (10%), Major (25%), Catastrophic (50%)
- ✅ **Automated recovery** using journal replay mechanism
- ✅ **Smart defragmentation engine** that consolidates scattered blocks
- ✅ **Comprehensive performance metrics** (speed, operations, cache, fragmentation)
- ✅ **Dynamic fragmentation analysis** with two-factor calculation
- ✅ **State persistence** via localStorage (auto-save on every operation)

### Interactive Features ✅

- ✅ **Click blocks to inspect** - see which file owns each block
- ✅ **Select files to highlight blocks** - visualize file allocation
- ✅ **Demo scenarios** with one-click setup:
  - Random Fragmented Demo (8-12 files with gaps)
  - Clustered Demo (contiguous allocation)
  - Fill Disk Demo (maximum capacity test)
- ✅ **Responsive UI** with smooth transitions and hover effects
- ✅ **Dark theme** optimized for long viewing sessions

## 🎨 Color Scheme

The simulator uses an intuitive color scheme:

| Color     | Block State | Meaning                        |
| --------- | ----------- | ------------------------------ |
| 🟢 Green  | Free        | Available for allocation       |
| 🔵 Blue   | Used        | Contains file data             |
| 🟠 Orange | Metadata    | System metadata (inodes, etc.) |
| 🔴 Red    | Bad         | Corrupted/damaged blocks       |
| 🟣 Purple | Cached      | In memory cache                |

## 🔧 Configuration

### Disk Settings

- **Total Blocks**: 256 (configurable)
- **Block Size**: 4KB each
- **Total Capacity**: 1MB
- **Journaling**: Enabled by default

### Performance Settings

- **Cache Size**: Configurable
- **Animation Speed**: Adjustable
- **Auto-save**: Enabled (localStorage)

## 🧪 Testing & Verification

### Build Verification

```bash
cd client
pnpm run build
```

This will compile the TypeScript and bundle the application.

### Manual Testing

The application includes extensive visual feedback:

- Block operations show immediate visual changes
- Crash animations confirm crash simulation
- Recovery animations show restoration progress
- Dashboard charts update in real-time

### Troubleshooting

**Issue: Port 5173 already in use**

```bash
# Kill the process using the port
lsof -ti:5173 | xargs kill -9
# Or change the port in vite.config.ts
```

**Issue: Build errors**

```bash
# Clean install dependencies
cd client
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Issue: Dashboard shows zeros**

```bash
# Clear localStorage and refresh
localStorage.clear()
location.reload()
```

**Issue: Animations are laggy**

- Reduce the number of blocks by modifying `totalBlocks` in `unifiedStore.ts`
- Disable some animations in `framer-motion` components
- Use a more powerful device or close other browser tabs

## 📝 Documentation

- **[Getting Started Guide](./GETTING_STARTED.md)** - Detailed setup and installation instructions
- **[Project Steps](./PROJECT_STEPS.md)** - Complete implementation roadmap
- **[Features Added](./FEATURES_ADDED.md)** - Comprehensive feature changelog
- **[Feature Verification](./FEATURE_VERIFICATION.md)** - Complete testing documentation and verification
- **[Setup Complete](./SETUP_COMPLETE.md)** - Initial setup verification checklist
- **[New Features Summary](./NEW_FEATURES_SUMMARY.md)** - Latest additions and updates
- **[Crash Simulator Complete](./CRASH_SIMULATOR_COMPLETE.md)** - Crash recovery implementation details
- **[Dynamic Stats Complete](./DYNAMIC_STATS_COMPLETE.md)** - Dashboard and metrics implementation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏆 Key Highlights

- **🎨 Beautiful Animations** - Every operation is visually represented with smooth transitions
- **📊 Real-time Metrics** - Dashboard updates live as you interact with the simulator
- **💾 State Persistence** - Your disk state is automatically saved and restored
- **🎓 Educational** - Learn complex OS concepts through visual, hands-on interaction
- **⚡ Fast & Responsive** - Built with modern tools for optimal performance
- **🎯 Accurate Simulation** - Implements real file system concepts (journaling, fragmentation, recovery)

## 🙏 Acknowledgments

This project draws inspiration from:

- **"Operating System Concepts"** by Silberschatz, Galvin, and Gagne - Foundational OS theory
- **Modern File Systems** - Design patterns from ext4, NTFS, APFS, and ZFS
- **VisuAlgo** - Interactive algorithm visualization approach
- **OS Course Materials** - Various university operating systems courses
- **Open Source Community** - Amazing tools and libraries that made this possible

## 📧 Contact

**Developer:** Adarsh Suman

For questions or feedback, please contact:

- **Email**: adarsh3699@gmail.com
- **Website**: [bhemu.in/contact](https://www.bhemu.in/contact)
- **GitHub**: [@adarsh3699](https://github.com/adarsh3699)
- **Repository**: [File-System-Recovery-and-Optimization-Tool](https://github.com/adarsh3699/File-System-Recovery-and-Optimization-Tool)

## 🎓 Educational Use

This tool is perfect for:

- **Computer Science Students** - Visual learning of OS concepts (file systems, crash recovery, disk optimization)
- **Operating Systems Courses** - Hands-on demonstrations for lectures and labs
- **Self-taught Developers** - Understanding low-level storage mechanisms
- **Technical Interviews** - Discussing file system design and optimization strategies
- **Educators** - Interactive teaching aid with pre-built demos and tutorials
- **Anyone Curious** - Demystifying how computers store and recover data

### Learning Outcomes

After using this tool, users will understand:

- How file systems organize data into blocks
- Why fragmentation occurs and how it impacts performance
- How journaling protects data during crashes
- What happens during disk failures and recovery
- How defragmentation improves read/write speeds
- The trade-offs in different allocation strategies

## 🚦 Project Status

### ✅ Completed Features

- ✅ **Core file system operations** - File/folder creation, deletion, block management
- ✅ **Crash and recovery simulation** - Three severity levels with journal-based recovery
- ✅ **Defragmentation visualization** - Animated block reorganization
- ✅ **Performance dashboard** - Live metrics with charts and graphs
- ✅ **Interactive simulator** - Real-time disk visualization
- ✅ **Educational content** - About page with comprehensive tutorials
- ✅ **Demo scenarios** - Pre-built examples for quick testing
- ✅ **Dynamic fragmentation calculation** - Two-factor algorithm (file + disk scatter)
- ✅ **State persistence** - Auto-save using localStorage
- ✅ **Responsive animations** - Smooth transitions with Framer Motion

### 🔄 Future Enhancements

- 🔄 **Multiple allocation methods** - Contiguous, Linked, Indexed comparison
- 🔄 **Mobile responsive design** - Optimized for tablets and phones
- 🔄 **WebSocket integration** - Real-time multi-user collaboration
- 🔄 **Backend integration** - Full FastAPI backend with persistent storage
- 🔄 **Export/Import** - Save and load disk images
- 🔄 **Advanced caching** - LRU, MRU, and other cache strategies

## 📈 Roadmap & Future Enhancements

### Near-term Goals

- [ ] **Allocation Method Comparison** - Side-by-side visualization of contiguous, linked, and indexed allocation
- [ ] **Mobile Optimization** - Responsive design for tablets and smartphones
- [ ] **Performance Improvements** - Optimize for larger disk sizes (512+ blocks)
- [ ] **Enhanced Tutorials** - Interactive step-by-step guides with tooltips

### Mid-term Goals

- [ ] **RAID Simulation** - Demonstrate RAID 0, 1, 5 configurations
- [ ] **Advanced Caching** - LRU, MRU, FIFO cache replacement policies
- [ ] **Compression Visualization** - Show how file compression affects storage
- [ ] **Export/Import Functionality** - Save and load disk states as JSON
- [ ] **Undo/Redo** - Operation history with rollback capability

### Long-term Vision

- [ ] **Network File Systems** - Simulate NFS, SMB protocols
- [ ] **Encryption Demonstration** - Visualize encrypted block storage
- [ ] **Multi-user Scenarios** - Concurrent access and locking mechanisms
- [ ] **Real Backend Integration** - Full FastAPI backend with database persistence
- [ ] **WebSocket Real-time** - Live collaboration and monitoring
- [ ] **Plugin System** - Extensible architecture for custom simulators

---

## 🌟 Show Your Support

If you find this tool helpful, please:

- ⭐ **Star this repository** on GitHub
- 🐛 **Report bugs** or suggest features via [Issues](https://github.com/adarsh3699/File-System-Recovery-and-Optimization-Tool/issues)
- 🤝 **Contribute** by submitting pull requests
- 📢 **Share** with fellow students and educators

## 📜 Version History

**v1.0.0** - December 2024

- Initial release with core file system operations
- Crash and recovery simulation
- Defragmentation visualization
- Performance dashboard with live metrics
- Educational about page

---

<div align="center">

**Made with ❤️ for education and learning**

### Developer: [Adarsh Suman](https://github.com/adarsh3699)

[🌐 Website](https://www.bhemu.in/contact) • [💼 GitHub](https://github.com/adarsh3699) • [📧 Email](mailto:adarsh3699@gmail.com)

_Star ⭐ this repository if you found it helpful!_

**Version 1.0.0** | **December 2024**

</div>
