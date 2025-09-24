"""
Environment configuration and settings management
"""

import os
import json
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import Field, field_validator


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # OpenAI Configuration
    openai_api_key: str = Field(..., env="OPENAI_API_KEY")
    realtime_model: str = Field(default="gpt-realtime", env="REALTIME_MODEL")
    realtime_voice: str = Field(default="verse", env="REALTIME_VOICE")
    token_ttl_seconds: int = Field(default=600, env="TOKEN_TTL_SECONDS")
    
    # Security Configuration
    allowed_origins: List[str] = Field(
        default=["https://www.espn.com", "chrome-extension://abc123"],
        env="ALLOWED_ORIGINS"
    )
    cors_origins: List[str] = Field(
        default=["https://www.espn.com", "chrome-extension://abc123"],
        env="CORS_ORIGINS"
    )
    
    # Rate Limiting
    rate_limit_per_minute: int = Field(default=10, env="RATE_LIMIT_PER_MINUTE")
    rate_limit_burst: int = Field(default=5, env="RATE_LIMIT_BURST")
    
    # Logging
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    log_format: str = Field(default="json", env="LOG_FORMAT")
    
    # Advanced Settings
    default_instructions: str = Field(
        default="You are Parker, an enthusiastic sports commentator. Respond with passion and energy, matching the user's intensity level.",
        env="DEFAULT_INSTRUCTIONS"
    )
    default_temperature: float = Field(default=0.8, env="DEFAULT_TEMPERATURE")
    default_max_tokens: int = Field(default=4096, env="DEFAULT_MAX_TOKENS")
    default_speed: float = Field(default=1.0, env="DEFAULT_SPEED")
    
    # Voice Configuration
    default_voice_quality: str = Field(default="standard", env="DEFAULT_VOICE_QUALITY")
    default_audio_format: str = Field(default="pcm", env="DEFAULT_AUDIO_FORMAT")
    default_difficulty: str = Field(default="easy", env="DEFAULT_DIFFICULTY")
    enable_interruptions: bool = Field(default=True, env="ENABLE_INTERRUPTIONS")
    default_response_length: str = Field(default="medium", env="DEFAULT_RESPONSE_LENGTH")
    
    # Audio Settings
    audio_sample_rate: int = Field(default=24000, env="AUDIO_SAMPLE_RATE")
    audio_channels: int = Field(default=1, env="AUDIO_CHANNELS")
    audio_bit_depth: int = Field(default=16, env="AUDIO_BIT_DEPTH")
    max_audio_duration: int = Field(default=30, env="MAX_AUDIO_DURATION")
    
    # Voice Performance
    voice_generation_timeout: int = Field(default=10, env="VOICE_GENERATION_TIMEOUT")
    voice_streaming_buffer_size: int = Field(default=4096, env="VOICE_STREAMING_BUFFER_SIZE")
    voice_quality_threshold: float = Field(default=0.8, env="VOICE_QUALITY_THRESHOLD")
    
    # Monitoring
    health_check_interval: int = Field(default=30, env="HEALTH_CHECK_INTERVAL")
    metrics_enabled: bool = Field(default=True, env="METRICS_ENABLED")
    
    # Application
    app_name: str = Field(default="Parker Realtime Token Service")
    app_version: str = Field(default="1.0.0")
    debug: bool = Field(default=False, env="DEBUG")
    
    @field_validator('allowed_origins', 'cors_origins', mode='before')
    @classmethod
    def parse_list_from_env(cls, v):
        if isinstance(v, str):
            # Handle comma-separated values
            if ',' in v:
                return [item.strip() for item in v.split(',') if item.strip()]
            # Handle single value
            elif v.strip():
                return [v.strip()]
            else:
                return []
        return v

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


# Global settings instance
settings = Settings()
