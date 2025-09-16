"""
Security middleware for origin validation and request tracking
"""

import uuid
import re
from typing import List, Optional
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import structlog

logger = structlog.get_logger(__name__)


class SecurityMiddleware(BaseHTTPMiddleware):
    """Enhanced security middleware with origin validation and request tracking"""
    
    def __init__(self, app, allowed_origins: List[str]):
        super().__init__(app)
        self.allowed_origins = allowed_origins
        self._compile_origin_patterns()
    
    def _compile_origin_patterns(self):
        """Compile origin patterns for validation"""
        self.compiled_patterns = []
        for origin in self.allowed_origins:
            if origin.startswith("chrome-extension://"):
                # Extract extension ID and create pattern
                ext_id = origin.split("://")[1]
                pattern = f"chrome-extension://{ext_id}"
                self.compiled_patterns.append(re.compile(re.escape(pattern)))
            elif origin.startswith("https://"):
                # For HTTPS origins, validate exact match or subdomain
                domain = origin.replace("https://", "")
                pattern = f"https://(.*\\.)?{re.escape(domain)}"
                self.compiled_patterns.append(re.compile(pattern))
            else:
                # Exact match for other origins
                self.compiled_patterns.append(re.compile(re.escape(origin)))
    
    def _validate_origin(self, request: Request) -> bool:
        """Enhanced origin validation"""
        origin = request.headers.get("origin")
        referer = request.headers.get("referer")
        
        # Check origin header
        if origin:
            for pattern in self.compiled_patterns:
                if pattern.match(origin):
                    return True
        
        # Fallback to referer header for same-origin requests
        if referer:
            for pattern in self.compiled_patterns:
                if pattern.match(referer):
                    return True
        
        # Allow requests without origin/referer (e.g., direct API calls, Postman)
        # This is a tradeoff between security and usability
        if not origin and not referer:
            logger.warning("Request without origin or referer headers", 
                         path=request.url.path, 
                         method=request.method)
            return True
        
        return False
    
    async def dispatch(self, request: Request, call_next):
        """Process request with security validation and tracking"""
        # Generate request ID
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        
        # Add request ID to request state for downstream services
        # Note: We don't modify headers directly as it's fragile
        # Instead, we rely on request.state for internal tracking
        
        # Validate origin for POST requests (token generation)
        if request.method == "POST" and request.url.path == "/v1/realtime/token":
            if not self._validate_origin(request):
                logger.warning("Origin validation failed", 
                             request_id=request_id,
                             origin=request.headers.get("origin"),
                             referer=request.headers.get("referer"),
                             path=request.url.path)
                
                # Return a proper JSON response instead of raising HTTPException
                from fastapi.responses import JSONResponse
                from datetime import datetime
                
                return JSONResponse(
                    status_code=403,
                    content={
                        "error": {
                            "code": 403,
                            "message": "Origin not allowed",
                            "details": {
                                "origin": request.headers.get("origin"),
                                "referer": request.headers.get("referer")
                            }
                        },
                        "request_id": request_id,
                        "timestamp": datetime.utcnow().isoformat() + "Z"
                    },
                    headers={"X-Request-ID": request_id}
                )
        
        # Log request
        logger.info("Request started",
                   request_id=request_id,
                   method=request.method,
                   path=request.url.path,
                   origin=request.headers.get("origin"),
                   user_agent=request.headers.get("user-agent"))
        
        try:
            response = await call_next(request)
            
            # Add request ID to response headers
            response.headers["X-Request-ID"] = request_id
            
            logger.info("Request completed",
                       request_id=request_id,
                       status_code=response.status_code)
            
            return response
            
        except Exception as e:
            logger.error("Request failed",
                        request_id=request_id,
                        error=str(e),
                        error_type=type(e).__name__)
            raise
