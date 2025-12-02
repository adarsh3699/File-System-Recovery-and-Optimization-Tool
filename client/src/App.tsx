import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Home } from "./pages/Home";
import { UnifiedSimulator } from "./pages/UnifiedSimulator";
import { Dashboard } from "./pages/Dashboard";
import { About } from "./pages/About";
import { HardDrive, Github, BarChart3, BookOpen } from "lucide-react";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900">
        {/* Navigation */}
        <nav className="glass-dark border-b border-white/5 sticky top-0 z-30">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <HardDrive className="w-8 h-8 text-blue-500" />
                <span className="text-xl font-bold text-white">
                  FileSystem Simulator
                </span>
              </Link>

              <div className="flex items-center gap-6">
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/simulator"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Simulator
                </Link>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <BarChart3 size={18} />
                  Dashboard
                </Link>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <BookOpen size={18} />
                  About
                </Link>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <Github size={20} />
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulator" element={<UnifiedSimulator />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
