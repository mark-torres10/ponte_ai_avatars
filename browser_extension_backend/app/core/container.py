"""
Dependency injection container for managing service instances
"""

from typing import Optional
import structlog
from app.services.openai_client import OpenAIClient
from app.services.token_service import TokenService
from app.services.cache import InMemoryCache
from app.services.voice_config import VoiceConfigService
from app.services.voice_monitoring import VoiceMonitoringService
from app.config.settings import settings

logger = structlog.get_logger(__name__)


class ServiceContainer:
    """Dependency injection container for service management"""
    
    def __init__(self):
        self._openai_client: Optional[OpenAIClient] = None
        self._token_service: Optional[TokenService] = None
        self._cache: Optional[InMemoryCache] = None
        self._voice_config: Optional[VoiceConfigService] = None
        self._voice_monitoring: Optional[VoiceMonitoringService] = None
        self._initialized = False
    
    async def initialize(self) -> None:
        """Initialize all services"""
        if self._initialized:
            return
        
        logger.info("Initializing service container")
        
        # Initialize cache first
        self._cache = InMemoryCache(default_ttl=settings.token_ttl_seconds)
        
        # Initialize voice configuration service
        self._voice_config = VoiceConfigService()
        
        # Initialize voice monitoring service
        self._voice_monitoring = VoiceMonitoringService()
        
        # Initialize OpenAI client
        self._openai_client = OpenAIClient(settings.openai_api_key)
        
        # Initialize token service with all dependencies
        self._token_service = TokenService(
            self._openai_client, 
            self._cache, 
            self._voice_config, 
            self._voice_monitoring
        )
        
        self._initialized = True
        logger.info("Service container initialized successfully")
    
    async def cleanup(self) -> None:
        """Cleanup all services"""
        logger.info("Cleaning up service container")
        
        if self._openai_client:
            await self._openai_client.close()
            self._openai_client = None
        
        if self._cache:
            self._cache.clear()
            self._cache = None
        
        if self._voice_monitoring:
            self._voice_monitoring.reset_metrics()
            self._voice_monitoring = None
        
        self._voice_config = None
        self._token_service = None
        self._initialized = False
        logger.info("Service container cleanup complete")
    
    @property
    def token_service(self) -> TokenService:
        """Get token service instance"""
        if not self._initialized or not self._token_service:
            raise RuntimeError("Service container not initialized")
        return self._token_service
    
    @property
    def cache(self) -> InMemoryCache:
        """Get cache instance"""
        if not self._initialized or not self._cache:
            raise RuntimeError("Service container not initialized")
        return self._cache
    
    @property
    def openai_client(self) -> OpenAIClient:
        """Get OpenAI client instance"""
        if not self._initialized or not self._openai_client:
            raise RuntimeError("Service container not initialized")
        return self._openai_client
    
    @property
    def voice_config(self) -> VoiceConfigService:
        """Get voice configuration service instance"""
        if not self._initialized or not self._voice_config:
            raise RuntimeError("Service container not initialized")
        return self._voice_config
    
    @property
    def voice_monitoring(self) -> VoiceMonitoringService:
        """Get voice monitoring service instance"""
        if not self._initialized or not self._voice_monitoring:
            raise RuntimeError("Service container not initialized")
        return self._voice_monitoring


# Global service container instance
container = ServiceContainer()
