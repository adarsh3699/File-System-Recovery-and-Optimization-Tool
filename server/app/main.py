from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random
from datetime import datetime

app = FastAPI(
    title="File System Simulator API",
    description="Backend API for file system simulation",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class FileCreate(BaseModel):
    name: str
    size: int
    parent_id: Optional[str] = "root"

class CrashSimulation(BaseModel):
    severity: str  # "minor", "major", "catastrophic"
    affected_blocks: int

class PerformanceMetrics(BaseModel):
    timestamp: str
    read_speed: float
    write_speed: float
    cache_hit_rate: float
    fragmentation: float

# In-memory storage (for simulation)
disk_state = {
    "total_blocks": 256,
    "used_blocks": 0,
    "free_blocks": 256,
    "metadata_blocks": 0,
    "bad_blocks": 0,
    "cached_blocks": 0,
    "files": []
}

performance_history = []

# Root endpoint
@app.get("/")
def read_root():
    return {
        "message": "File System Simulator API",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "disk": "/api/disk/*",
            "files": "/api/files/*",
            "performance": "/api/performance/*",
            "simulation": "/api/simulation/*"
        }
    }

# Disk endpoints
@app.get("/api/disk/stats")
def get_disk_stats():
    """Get current disk statistics"""
    return disk_state

@app.post("/api/disk/initialize")
def initialize_disk(size: int = 256):
    """Initialize disk with specified size"""
    global disk_state
    disk_state = {
        "total_blocks": size,
        "used_blocks": 0,
        "free_blocks": size,
        "metadata_blocks": 0,
        "bad_blocks": 0,
        "cached_blocks": 0,
        "files": []
    }
    return {"message": "Disk initialized", "size": size}

@app.post("/api/disk/reset")
def reset_disk():
    """Reset disk to initial state"""
    global disk_state, performance_history
    disk_state = {
        "total_blocks": 256,
        "used_blocks": 0,
        "free_blocks": 256,
        "metadata_blocks": 0,
        "bad_blocks": 0,
        "cached_blocks": 0,
        "files": []
    }
    performance_history = []
    return {"message": "Disk reset successfully"}

# File operations
@app.post("/api/files/create")
def create_file(file: FileCreate):
    """Create a new file"""
    if disk_state["free_blocks"] < file.size:
        raise HTTPException(status_code=400, detail="Not enough free blocks")
    
    disk_state["used_blocks"] += file.size
    disk_state["free_blocks"] -= file.size
    
    file_data = {
        "id": f"file-{len(disk_state['files']) + 1}",
        "name": file.name,
        "size": file.size,
        "parent_id": file.parent_id,
        "created_at": datetime.now().isoformat()
    }
    disk_state["files"].append(file_data)
    
    return file_data

@app.get("/api/files/list")
def list_files():
    """List all files"""
    return disk_state["files"]

@app.delete("/api/files/{file_id}")
def delete_file(file_id: str):
    """Delete a file"""
    file = next((f for f in disk_state["files"] if f["id"] == file_id), None)
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    disk_state["used_blocks"] -= file["size"]
    disk_state["free_blocks"] += file["size"]
    disk_state["files"] = [f for f in disk_state["files"] if f["id"] != file_id]
    
    return {"message": "File deleted", "file_id": file_id}

# Performance endpoints
@app.get("/api/performance/metrics")
def get_performance_metrics():
    """Get current performance metrics"""
    fragmentation = calculate_fragmentation()
    
    metrics = {
        "read_speed": round(random.uniform(70.0, 95.0), 1),
        "write_speed": round(random.uniform(50.0, 80.0), 1),
        "cache_hit_rate": round(random.uniform(65.0, 85.0), 1),
        "fragmentation": fragmentation,
        "operation_count": {
            "create": random.randint(40, 50),
            "read": random.randint(150, 200),
            "write": random.randint(60, 90),
            "delete": random.randint(20, 30),
        },
        "timestamp": datetime.now().isoformat()
    }
    
    return metrics

@app.get("/api/performance/history")
def get_performance_history():
    """Get performance history"""
    return performance_history

@app.post("/api/performance/record")
def record_performance(metrics: PerformanceMetrics):
    """Record performance metrics"""
    performance_history.append(metrics.dict())
    # Keep only last 50 entries
    if len(performance_history) > 50:
        performance_history.pop(0)
    return {"message": "Metrics recorded"}

# Simulation endpoints
@app.post("/api/simulation/crash")
def simulate_crash(crash: CrashSimulation):
    """Simulate a system crash"""
    severity_map = {
        "minor": (3, 8),
        "major": (10, 20),
        "catastrophic": (25, 40)
    }
    
    if crash.severity not in severity_map:
        raise HTTPException(status_code=400, detail="Invalid severity level")
    
    min_blocks, max_blocks = severity_map[crash.severity]
    affected = min(
        random.randint(min_blocks, max_blocks),
        disk_state["used_blocks"]
    )
    
    disk_state["bad_blocks"] += affected
    disk_state["used_blocks"] -= affected
    
    return {
        "severity": crash.severity,
        "affected_blocks": affected,
        "total_bad_blocks": disk_state["bad_blocks"],
        "message": f"Simulated {crash.severity} crash affecting {affected} blocks"
    }

@app.post("/api/simulation/recover")
def run_recovery():
    """Run recovery process"""
    recovered = disk_state["bad_blocks"]
    
    # Recover blocks (simulate journal replay)
    disk_state["used_blocks"] += int(recovered * 0.8)  # 80% recovery rate
    disk_state["free_blocks"] += int(recovered * 0.2)  # 20% lost
    disk_state["bad_blocks"] = 0
    
    return {
        "recovered_blocks": int(recovered * 0.8),
        "lost_blocks": int(recovered * 0.2),
        "message": "Recovery completed successfully"
    }

@app.post("/api/simulation/defragment")
def defragment_disk():
    """Defragment the disk"""
    before_fragmentation = calculate_fragmentation()
    
    # Simulate defragmentation (reset fragmentation to near 0)
    # In real implementation, this would reorganize blocks
    
    after_fragmentation = round(random.uniform(0, 10), 1)
    
    return {
        "before_fragmentation": before_fragmentation,
        "after_fragmentation": after_fragmentation,
        "improvement": round(before_fragmentation - after_fragmentation, 1),
        "message": "Defragmentation completed"
    }

# Demo endpoints
@app.get("/api/demos/list")
def list_demos():
    """List available demo scenarios"""
    return {
        "demos": [
            {
                "id": "basic-ops",
                "name": "Basic File Operations",
                "description": "Create, read, and delete files",
                "duration": "3 min"
            },
            {
                "id": "fragmentation",
                "name": "Fragmentation Demo",
                "description": "See how fragmentation affects performance",
                "duration": "4 min"
            },
            {
                "id": "crash-recovery",
                "name": "Crash & Recovery",
                "description": "Simulate crash and recovery process",
                "duration": "5 min"
            }
        ]
    }

@app.post("/api/demos/run/{demo_id}")
def run_demo(demo_id: str):
    """Run a specific demo scenario"""
    demos = ["basic-ops", "fragmentation", "crash-recovery", "performance", "comparison"]
    
    if demo_id not in demos:
        raise HTTPException(status_code=404, detail="Demo not found")
    
    return {
        "demo_id": demo_id,
        "status": "started",
        "message": f"Demo '{demo_id}' is now running"
    }

# Helper functions
def calculate_fragmentation():
    """Calculate current disk fragmentation percentage"""
    if disk_state["used_blocks"] == 0:
        return 0.0
    
    # Simple fragmentation simulation based on used blocks
    usage_ratio = disk_state["used_blocks"] / disk_state["total_blocks"]
    
    # More files = more potential fragmentation
    file_count = len(disk_state["files"])
    
    fragmentation = min(usage_ratio * file_count * 5, 100.0)
    return round(fragmentation, 1)

# Health check
@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=4000)
