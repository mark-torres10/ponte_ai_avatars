"""
OpenAI API client with retry logic, connection pooling, and caching
"""

import httpx
import asyncio
from typing import Dict, Any, Optional
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
    before_sleep_log
)
import structlog

logger = structlog.get_logger(__name__)


class OpenAIClient:
    """Enhanced OpenAI client with retry logic and caching"""
    
    def __init__(self, api_key: str, base_url: str = "https://api.openai.com/v1"):
        self.api_key = api_key
        self.base_url = base_url
        
        # Configure HTTP client with connection pooling
        self.client = httpx.AsyncClient(
            base_url=base_url,
            headers={
                "Authorization": f"Bearer {api_key}",
                "OpenAI-Beta": "realtime=v1",
                "User-Agent": "Parker-Token-Service/1.0.0"
            },
            timeout=httpx.Timeout(30.0),  # 30 second timeout
            limits=httpx.Limits(
                max_keepalive_connections=20,
                max_connections=100,
                keepalive_expiry=30.0
            ),
            http2=False  # Disable HTTP/2 to avoid h2 dependency
        )
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10),
        retry=retry_if_exception_type((httpx.HTTPError, httpx.TimeoutException)),
        before_sleep=before_sleep_log(logger, "WARNING")
    )
    async def create_realtime_session(self, session_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create OpenAI Realtime session with retry logic"""
        
        try:
            logger.info("Creating OpenAI session", 
                       model=session_data.get("model"),
                       voice=session_data.get("voice"))
            
            response = await self.client.post(
                "/realtime/sessions",
                json=session_data
            )
            
            # Handle different status codes
            if response.status_code == 200:
                session_response = response.json()
                
                logger.info("OpenAI session created successfully", 
                           session_id=session_response.get("id"))
                return session_response
            
            elif response.status_code == 401:
                logger.error("OpenAI API authentication failed")
                raise httpx.HTTPStatusError(
                    "Authentication failed", 
                    request=response.request, 
                    response=response
                )
            
            elif response.status_code == 429:
                logger.warning("OpenAI API rate limit exceeded")
                raise httpx.HTTPStatusError(
                    "Rate limit exceeded", 
                    request=response.request, 
                    response=response
                )
            
            elif response.status_code >= 500:
                logger.error("OpenAI API server error", 
                           status_code=response.status_code)
                raise httpx.HTTPStatusError(
                    "Server error", 
                    request=response.request, 
                    response=response
                )
            
            else:
                logger.error("OpenAI API unexpected error", 
                           status_code=response.status_code,
                           response_text=response.text)
                raise httpx.HTTPStatusError(
                    f"Unexpected error: {response.status_code}", 
                    request=response.request, 
                    response=response
                )
        
        except httpx.HTTPError as e:
            logger.error("OpenAI API HTTP error", error=str(e))
            raise
        except Exception as e:
            logger.error("Unexpected error creating OpenAI session", error=str(e))
            raise
    
    async def test_connectivity(self) -> bool:
        """Test OpenAI API connectivity"""
        try:
            response = await self.client.get("/models", timeout=10.0)
            return response.status_code == 200
        except Exception as e:
            logger.warning("OpenAI connectivity test failed", error=str(e))
            return False
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()
        logger.info("OpenAI client closed")


# Global client instance (will be initialized in main.py)
openai_client: Optional[OpenAIClient] = None


async def get_openai_client(api_key: str) -> OpenAIClient:
    """Get or create OpenAI client instance"""
    global openai_client
    if openai_client is None:
        openai_client = OpenAIClient(api_key)
    return openai_client


async def close_openai_client():
    """Close the global OpenAI client"""
    global openai_client
    if openai_client:
        await openai_client.close()
        openai_client = None
