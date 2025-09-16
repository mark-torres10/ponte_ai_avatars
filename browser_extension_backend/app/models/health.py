"""
Pydantic models for health check responses
"""

from pydantic import BaseModel, Field
from datetime import datetime


class HealthResponse(BaseModel):
    """Health check response model"""
    status: str = Field(..., description="Service status")
    timestamp: str = Field(..., description="Current timestamp")
    version: str = Field(..., description="Service version")
    openai_status: str = Field(..., description="OpenAI API status")

    class Config:
        json_schema_extra = {
            "example": {
                "status": "healthy",
                "timestamp": "2024-12-21T10:30:00Z",
                "version": "1.0.0",
                "openai_status": "connected"
            }
        }
