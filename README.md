# 🗂️ File System Simulator

An interactive, visual demonstration of file system operations, crash recovery mechanisms, and performance optimization techniques. Built with modern web technologies for an engaging educational experience.

![File System Simulator](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 🎨 Visual Disk Map
- Real-time block visualization with color-coded states
- Animated file allocation and deallocation
- Interactive block selection and highlighting
- Fragmentation patterns visualization

### 📊 Performance Dashboard
- Live performance metrics and charts
- Read/write speed tracking
- Operation statistics
- Disk space distribution
- Fragmentation analysis

### 💥 Crash & Recovery Simulation
- Simulate minor, major, and catastrophic crashes
- Journaling system with write-ahead logging
- Animated recovery process with step-by-step visualization
- Data integrity verification

### 🔄 Defragmentation
- Visualize file fragmentation
- Animated block reorganization
- Real-time efficiency metrics
- Before/after performance comparison

### 🎮 Interactive Demos
- Pre-built scenarios showcasing key concepts
- Guided tours with explanations
- Multiple difficulty levels
- Auto-play with pause/resume controls

### 📚 Educational Content
- Comprehensive about page with concepts
- In-app tooltips and hints
- Step-by-step tutorials
- Visual learning through animations

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and pnpm
- **Python** 3.10+ (for backend)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd "File System Recovery and Optimization Tool"
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

### 1. **Start with Demos**
Navigate to the **Demos** page to see pre-built scenarios:
- Basic File Operations
- Fragmentation & Defragmentation
- Crash & Recovery
- Performance Under Load
- Allocation Methods Comparison

### 2. **Experiment in Simulator**
Use the **Simulator** to:
- Create files and folders
- Allocate blocks manually
- Simulate system crashes
- Run recovery operations
- Monitor disk state in real-time

### 3. **Monitor Performance**
Check the **Dashboard** for:
- Real-time performance graphs
- Operation statistics
- Disk space distribution
- System metrics

### 4. **Optimize Disk**
Use the **Defrag** page to:
- Create fragmented demo scenarios
- Run defragmentation
- Compare before/after metrics
- Learn about fragmentation impact

## 🏗️ Project Structure

```
File System Recovery and Optimization Tool/
├── client/                      # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── charts/        # Performance charts
│   │   │   ├── common/        # Common UI components
│   │   │   ├── crash/         # Crash animations
│   │   │   ├── disk/          # Disk visualization
│   │   │   └── effects/       # Visual effects
│   │   ├── pages/             # Page components
│   │   ├── store/             # State management (Zustand)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utilities
│   │   └── types/             # TypeScript types
│   ├── public/                # Static assets
│   └── dist/                  # Build output
│
├── server/                     # Python Backend (FastAPI)
│   ├── app/
│   │   └── main.py           # API endpoints
│   └── requirements.txt       # Python dependencies
│
└── docs/                      # Documentation
    ├── GETTING_STARTED.md
    ├── PROJECT_STEPS.md
    └── FEATURES_ADDED.md
```

## 🎯 Key Concepts Demonstrated

### File System Operations
- **Block Allocation**: Fixed-size blocks with different strategies
- **Inode Management**: Metadata storage and tracking
- **Directory Structure**: Hierarchical file organization
- **Free Space Management**: Bitmap-based allocation

### Recovery Mechanisms
- **Journaling**: Write-ahead logging for crash recovery
- **Transaction Management**: Atomic operation groups
- **Journal Replay**: Recovering committed transactions
- **Integrity Checking**: Detecting and repairing corruption

### Performance Optimization
- **Defragmentation**: Reorganizing files for contiguous storage
- **Block Caching**: LRU cache for frequently accessed blocks
- **Read-Ahead**: Prefetching sequential blocks
- **Write Buffering**: Batching small writes

## 🛠️ Technologies Used

### Frontend
- **React 18** - Component-based UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **Lucide React** - Beautiful icons

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation

## 📊 Features Breakdown

### Visual Components
- ✅ Interactive disk block grid (256 blocks)
- ✅ Color-coded block states (free, used, corrupted, reserved)
- ✅ Real-time performance charts
- ✅ Animated file operations
- ✅ Crash and recovery animations
- ✅ Defragmentation visualization
- ✅ Directory tree view
- ✅ Journal log display

### Functional Features
- ✅ File creation and deletion
- ✅ Folder management
- ✅ Block allocation tracking
- ✅ Crash simulation (minor, major, catastrophic)
- ✅ Recovery mechanisms
- ✅ Defragmentation engine
- ✅ Performance metrics
- ✅ Fragmentation analysis
- ✅ State persistence (localStorage)

### Interactive Features
- ✅ Drag and drop (future enhancement)
- ✅ Click blocks to allocate files
- ✅ Select files to highlight blocks
- ✅ Hover tooltips for education
- ✅ Demo scenarios
- ✅ Guided tutorials

## 🎨 Color Scheme

The simulator uses an intuitive color scheme:

| Color | Block State | Meaning |
|-------|-------------|---------|
| 🟢 Green | Free | Available for allocation |
| 🔵 Blue | Used | Contains file data |
| 🟠 Orange | Metadata | System metadata (inodes, etc.) |
| 🔴 Red | Bad | Corrupted/damaged blocks |
| 🟣 Purple | Cached | In memory cache |

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

## 🧪 Testing

### Run Tests
```bash
cd client
pnpm test
```

### Build Verification
```bash
cd client
pnpm run build
```

## 📝 Documentation

- **[Getting Started Guide](./GETTING_STARTED.md)** - Detailed setup instructions
- **[Project Steps](./PROJECT_STEPS.md)** - Implementation roadmap
- **[Features Added](./FEATURES_ADDED.md)** - Feature changelog
- **[Setup Complete](./SETUP_COMPLETE.md)** - Setup verification

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Operating Systems concepts from Silberschatz, Galvin, and Gagne
- File system design patterns from modern OSes (ext4, NTFS, APFS)
- Animation inspiration from VisuAlgo and similar educational tools

## 📧 Contact

For questions or feedback, please contact:
- **Email**: contact@example.com
- **GitHub**: [Your GitHub Profile](https://github.com)

## 🎓 Educational Use

This simulator is designed for:
- Computer Science students learning about file systems
- Developers wanting to understand OS internals
- Educators teaching operating systems concepts
- Anyone curious about how computers store data

## 🚦 Status

- ✅ Core file system operations
- ✅ Crash and recovery simulation
- ✅ Defragmentation visualization
- ✅ Performance dashboard
- ✅ Interactive demos
- ✅ Educational content
- 🔄 Advanced allocation methods (in progress)
- 🔄 WebSocket real-time updates (planned)
- 🔄 Mobile responsive design (planned)

## 📈 Future Enhancements

- [ ] Multiple allocation method comparison
- [ ] RAID simulation
- [ ] Network file system concepts
- [ ] Compression visualization
- [ ] Encryption demonstration
- [ ] Advanced caching strategies
- [ ] Multi-user scenarios
- [ ] Export/import disk images

---

**Made with ❤️ for education and learning**

*Version 1.0.0 - December 2024*
