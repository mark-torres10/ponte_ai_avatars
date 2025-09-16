"""
Enhanced error response models with detailed error handling
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from enum import Enum


class ErrorCode(str, Enum):
    """Standardized error codes"""
    # Authentication & Authorization
    INVALID_API_KEY = "invalid_api_key"
    UNAUTHORIZED_ORIGIN = "unauthorized_origin"
    RATE_LIMIT_EXCEEDED = "rate_limit_exceeded"
    
    # OpenAI API Errors
    OPENAI_API_ERROR = "openai_api_error"
    OPENAI_RATE_LIMIT = "openai_rate_limit"
    OPENAI_SERVER_ERROR = "openai_server_error"
    OPENAI_TIMEOUT = "openai_timeout"
    
    # Validation Errors
    INVALID_REQUEST = "invalid_request"
    MISSING_FIELD = "missing_field"
    INVALID_FIELD_VALUE = "invalid_field_value"
    
    # System Errors
    INTERNAL_ERROR = "internal_error"
    SERVICE_UNAVAILABLE = "service_unavailable"
    TIMEOUT = "timeout"


class ErrorResponse(BaseModel):
    """Enhanced error response model"""
    error: Dict[str, Any] = Field(..., description="Error details")
    request_id: Optional[str] = Field(None, description="Request ID for tracking")
    timestamp: str = Field(..., description="Error timestamp")
    
    class Config:
        json_schema_extra = {
            "example": {
                "error": {
                    "code": "rate_limit_exceeded",
                    "message": "Rate limit exceeded. Please try again later.",
                    "details": {
                        "limit": 10,
                        "remaining": 0,
                        "reset_time": "2024-12-21T10:35:00Z"
                    }
                },
                "request_id": "req_123456789",
                "timestamp": "2024-12-21T10:30:00Z"
            }
        }


class ValidationErrorDetail(BaseModel):
    """Detailed validation error information"""
    field: str = Field(..., description="Field name that failed validation")
    message: str = Field(..., description="Validation error message")
    value: Any = Field(None, description="Value that failed validation")


class ValidationErrorResponse(BaseModel):
    """Validation error response model"""
    error: Dict[str, Any] = Field(..., description="Validation error details")
    request_id: Optional[str] = Field(None, description="Request ID for tracking")
    timestamp: str = Field(..., description="Error timestamp")
    
    class Config:
        json_schema_extra = {
            "example": {
                "error": {
                    "code": "invalid_request",
                    "message": "Request validation failed",
                    "details": {
                        "validation_errors": [
                            {
                                "field": "model",
                                "message": "Invalid model type",
                                "value": "invalid-model"
                            }
                        ]
                    }
                },
                "request_id": "req_123456789",
                "timestamp": "2024-12-21T10:30:00Z"
            }
        }
