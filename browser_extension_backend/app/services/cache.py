"""
In-memory cache service for OpenAI API responses
"""

import time
from typing import Dict, Any, Optional
from dataclasses import dataclass
import structlog

logger = structlog.get_logger(__name__)


@dataclass
class CacheEntry:
    """Cache entry with expiration"""
    value: Any
    expires_at: float
    created_at: float


class InMemoryCache:
    """Thread-safe in-memory cache with TTL support"""
    
    def __init__(self, default_ttl: int = 300):  # 5 minutes default
        self._cache: Dict[str, CacheEntry] = {}
        self.default_ttl = default_ttl
        self._lock = None  # Will be set to threading.Lock() if needed
    
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache if not expired"""
        if key not in self._cache:
            return None
        
        entry = self._cache[key]
        
        # Check if expired
        if time.time() > entry.expires_at:
            del self._cache[key]
            logger.debug("Cache entry expired", key=key)
            return None
        
        logger.debug("Cache hit", key=key)
        return entry.value
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Set value in cache with TTL"""
        ttl = ttl or self.default_ttl
        expires_at = time.time() + ttl
        
        self._cache[key] = CacheEntry(
            value=value,
            expires_at=expires_at,
            created_at=time.time()
        )
        
        logger.debug("Cache entry set", key=key, ttl=ttl)
    
    def delete(self, key: str) -> None:
        """Delete cache entry"""
        if key in self._cache:
            del self._cache[key]
            logger.debug("Cache entry deleted", key=key)
    
    def clear(self) -> None:
        """Clear all cache entries"""
        self._cache.clear()
        logger.info("Cache cleared")
    
    def cleanup_expired(self) -> int:
        """Remove expired entries and return count of removed entries"""
        current_time = time.time()
        expired_keys = [
            key for key, entry in self._cache.items()
            if current_time > entry.expires_at
        ]
        
        for key in expired_keys:
            del self._cache[key]
        
        if expired_keys:
            logger.debug("Cleaned up expired cache entries", count=len(expired_keys))
        
        return len(expired_keys)
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        current_time = time.time()
        total_entries = len(self._cache)
        expired_entries = sum(
            1 for entry in self._cache.values()
            if current_time > entry.expires_at
        )
        
        return {
            "total_entries": total_entries,
            "active_entries": total_entries - expired_entries,
            "expired_entries": expired_entries,
            "default_ttl": self.default_ttl
        }


# Global cache instance
cache = InMemoryCache(default_ttl=300)  # 5 minutes TTL
