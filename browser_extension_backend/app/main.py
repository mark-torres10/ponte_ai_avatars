"""
FastAPI application for OpenAI Realtime Token Service
"""

from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import os
from datetime import datetime
import structlog
import asyncio

from app.config.settings import settings
from app.models.token import TokenRequest, TokenResponse
from app.models.health import HealthResponse
from app.models.errors import ErrorResponse, ErrorCode
from app.middleware.security import SecurityMiddleware
from app.core.container import container

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True
)

logger = structlog.get_logger(__name__)

# Create FastAPI app instance
app = FastAPI(
    title=settings.app_name,
    description="Backend service for minting ephemeral OpenAI Realtime API tokens",
    version=settings.app_version,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Rate limiting setup
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Global exception handler for HTTPException
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTPException globally"""
    request_id = getattr(request.state, 'request_id', 'unknown')
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.status_code,
                "message": exc.detail,
                "details": {}
            },
            "request_id": request_id,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        },
        headers={"X-Request-ID": request_id}
    )

# CORS configuration (must be first to handle Chrome extensions properly)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=r"chrome-extension://.*",  # Allow any Chrome extension
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Add security middleware (after CORS for request tracking only)
app.add_middleware(SecurityMiddleware, allowed_origins=settings.allowed_origins)

# Services are now managed by the dependency injection container


@app.post("/v1/realtime/token", response_model=TokenResponse)
@limiter.limit("10/minute")
async def create_realtime_token(
    request: Request,
    token_request: TokenRequest
):
    """Generate ephemeral OpenAI Realtime API token"""
    request_id = getattr(request.state, 'request_id', 'unknown')
    
    try:
        # Generate token using service from container
        token_response = await container.token_service.generate_token(token_request, request_id)
        
        return token_response
        
    except ValueError as e:
        logger.error("Invalid request", request_id=request_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": {
                    "code": ErrorCode.INVALID_REQUEST.value,
                    "message": str(e),
                    "details": {}
                },
                "request_id": request_id,
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        )
    except Exception as e:
        logger.error("Token generation failed", request_id=request_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": {
                    "code": ErrorCode.INTERNAL_ERROR.value,
                    "message": "Internal server error",
                    "details": {}
                },
                "request_id": request_id,
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        )


@app.get("/healthz", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    try:
        # Test OpenAI API connectivity
        openai_connected = await container.token_service.test_openai_connectivity()
        openai_status = "connected" if openai_connected else "disconnected"
        
        # Clean up expired cache entries
        container.cache.cleanup_expired()
        
    except Exception as e:
        logger.warning("Health check failed", error=str(e))
        openai_status = "disconnected"
    
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow().isoformat() + "Z",
        version=settings.app_version,
        openai_status=openai_status
    )


@app.get("/")
async def root():
    """Root endpoint with service information"""
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "status": "operational",
        "endpoints": {
            "token_generation": "/v1/realtime/token",
            "health_check": "/healthz",
            "voice_config": "/v1/voice/config",
            "voice_testing": "/v1/voice/test",
            "voice_monitoring": "/v1/voice/monitoring",
            "documentation": "/docs"
        },
        "cache_stats": container.cache.get_stats()
    }


@app.get("/v1/voice/config")
async def get_voice_configuration():
    """Get comprehensive voice configuration information"""
    try:
        voice_info = container.token_service.get_voice_configuration_info()
        return {
            "status": "success",
            "voice_configuration": voice_info,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
    except Exception as e:
        logger.error("Failed to get voice configuration", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": {
                    "code": ErrorCode.INTERNAL_ERROR.value,
                    "message": "Failed to get voice configuration",
                    "details": {"error": str(e)}
                },
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        )


@app.get("/v1/voice/test")
async def get_voice_testing_info():
    """Get voice testing endpoint information"""
    try:
        testing_info = container.token_service.get_voice_testing_endpoints()
        return {
            "status": "success",
            "voice_testing_endpoints": testing_info,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
    except Exception as e:
        logger.error("Failed to get voice testing info", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": {
                    "code": ErrorCode.INTERNAL_ERROR.value,
                    "message": "Failed to get voice testing info",
                    "details": {"error": str(e)}
                },
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        )


@app.post("/v1/voice/test/{voice_type}")
async def test_voice_quality(request: Request, voice_type: str):
    """Test voice quality for a specific voice type"""
    request_id = getattr(request.state, 'request_id', 'unknown')
    
    try:
        # Validate voice type
        valid_voices = ["verse", "cedar", "marin"]
        if voice_type not in valid_voices:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "error": {
                        "code": ErrorCode.INVALID_REQUEST.value,
                        "message": f"Invalid voice type. Must be one of: {valid_voices}",
                        "details": {"voice_type": voice_type}
                    },
                    "request_id": request_id,
                    "timestamp": datetime.utcnow().isoformat() + "Z"
                }
            )
        
        # Test voice quality
        test_result = await container.token_service.test_voice_quality(voice_type)
        
        return {
            "status": "success",
            "voice_test_result": test_result,
            "request_id": request_id,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Voice quality test failed", request_id=request_id, voice_type=voice_type, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": {
                    "code": ErrorCode.INTERNAL_ERROR.value,
                    "message": "Voice quality test failed",
                    "details": {"error": str(e)}
                },
                "request_id": request_id,
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        )


@app.get("/v1/voice/monitoring")
async def get_voice_monitoring():
    """Get voice monitoring and performance metrics"""
    try:
        monitoring_data = {
            "performance_stats": container.voice_monitoring.get_performance_stats(),
            "voice_performance_by_type": container.voice_monitoring.get_voice_performance_by_type(),
            "health_status": container.voice_monitoring.get_health_status(),
            "recent_metrics": container.voice_monitoring.get_recent_metrics(limit=50)
        }
        
        return {
            "status": "success",
            "voice_monitoring": monitoring_data,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
    except Exception as e:
        logger.error("Failed to get voice monitoring data", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": {
                    "code": ErrorCode.INTERNAL_ERROR.value,
                    "message": "Failed to get voice monitoring data",
                    "details": {"error": str(e)}
                },
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        )


@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("Starting Parker Realtime Token Service", version=settings.app_version)
    
    # Initialize service container
    await container.initialize()
    
    logger.info("Services initialized successfully")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down Parker Realtime Token Service")
    
    # Cleanup service container
    await container.cleanup()
    
    logger.info("Shutdown complete")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=settings.debug
    )
