"""
FastAPI backend for AI Avatar Browser Extension
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any

# Create FastAPI app instance
app = FastAPI(
    title="AI Avatar Browser Extension Backend",
    description="Backend API for the AI Avatar Browser Extension",
    version="0.1.0",
)

# Add CORS middleware to allow browser extension to make requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class HealthResponse(BaseModel):
    status: str
    message: str
    version: str

class HelloResponse(BaseModel):
    message: str
    timestamp: str
    data: Dict[str, Any]

@app.get("/", response_model=HelloResponse)
async def hello_world():
    """Hello world endpoint"""
    import datetime
    
    return HelloResponse(
        message="Hello from AI Avatar Browser Extension Backend!",
        timestamp=datetime.datetime.now().isoformat(),
        data={
            "service": "browser-extension-backend",
            "framework": "FastAPI",
            "python_version": "3.12"
        }
    )

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        message="Backend is running successfully",
        version="0.1.0"
    )

@app.get("/api/status")
async def api_status():
    """API status endpoint"""
    return {
        "api": "AI Avatar Browser Extension Backend",
        "status": "operational",
        "endpoints": [
            "/",
            "/health", 
            "/api/status",
            "/docs"  # FastAPI auto-generated docs
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
