"""
Pydantic models for token request/response validation
"""

from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class ModelType(str, Enum):
    """Available OpenAI Realtime models"""
    GPT_REALTIME = "gpt-realtime"
    GPT_4O_REALTIME_PREVIEW = "gpt-4o-realtime-preview-2024-12-17"
    GPT_4O_MINI_REALTIME_PREVIEW = "gpt-4o-mini-realtime-preview-2024-12-17"


class VoiceType(str, Enum):
    """Available voice types with personality descriptions"""
    VERSE = "verse"  # Warm, conversational, friendly
    CEDAR = "cedar"  # Deep, authoritative, professional
    MARIN = "marin"  # Energetic, enthusiastic, dynamic


class DifficultyLevel(str, Enum):
    """Difficulty levels for Parker's responses with personality modifications"""
    EASY = "easy"      # Encouraging, supportive, educational
    SAVAGE = "savage"  # Competitive, intense, challenging
    EXPERT = "expert"  # Technical, analytical, detailed


class VoiceQuality(str, Enum):
    """Voice quality settings for audio output"""
    STANDARD = "standard"  # Balanced quality and speed
    HIGH = "high"          # Higher quality, slower generation
    ULTRA = "ultra"        # Maximum quality, slowest generation


class AudioFormat(str, Enum):
    """Audio output formats"""
    PCM = "pcm"        # Raw PCM audio
    MP3 = "mp3"        # Compressed MP3
    WAV = "wav"        # Uncompressed WAV


class TokenRequest(BaseModel):
    """Request model for token generation with advanced voice configuration"""
    model: ModelType = Field(default=ModelType.GPT_REALTIME, description="OpenAI Realtime model")
    voice: VoiceType = Field(default=VoiceType.VERSE, description="Voice type for responses")
    instructions: Optional[str] = Field(default=None, description="Custom system instructions")
    difficulty: DifficultyLevel = Field(default=DifficultyLevel.EASY, description="Response difficulty level")
    voice_quality: VoiceQuality = Field(default=VoiceQuality.STANDARD, description="Voice quality setting")
    audio_format: AudioFormat = Field(default=AudioFormat.PCM, description="Audio output format")
    enable_interruptions: bool = Field(default=True, description="Allow user to interrupt responses")
    response_length: Optional[str] = Field(default="medium", description="Response length: short, medium, long")
    sports_context: Optional[str] = Field(default=None, description="Specific sports context for commentary")

    class Config:
        json_schema_extra = {
            "example": {
                "model": "gpt-realtime",
                "voice": "verse",
                "instructions": "You are Parker, an enthusiastic sports commentator. Respond with passion and energy, matching the user's intensity level.",
                "difficulty": "easy",
                "voice_quality": "standard",
                "audio_format": "pcm",
                "enable_interruptions": True,
                "response_length": "medium",
                "sports_context": "basketball"
            }
        }


class TokenResponse(BaseModel):
    """Response model for token generation with voice configuration details"""
    client_secret: str = Field(..., description="Ephemeral token for Realtime API")
    expires_at: int = Field(..., description="Unix timestamp when token expires")
    session_id: str = Field(..., description="OpenAI session ID")
    model: str = Field(..., description="Model used for the session")
    voice: str = Field(..., description="Voice used for the session")
    instructions: str = Field(..., description="System instructions")
    web_rtc_url: str = Field(..., description="WebRTC connection URL")
    voice_quality: str = Field(..., description="Voice quality setting applied")
    audio_format: str = Field(..., description="Audio format configured")
    difficulty: str = Field(..., description="Difficulty level configured")
    enable_interruptions: bool = Field(..., description="Interruption setting")
    response_length: str = Field(..., description="Response length setting")
    sports_context: Optional[str] = Field(default=None, description="Sports context if specified")

    class Config:
        json_schema_extra = {
            "example": {
                "client_secret": "rt_ephemeral_token_string",
                "expires_at": 1703124056,
                "session_id": "realtime_session_abc123",
                "model": "gpt-realtime",
                "voice": "verse",
                "instructions": "You are Parker, an enthusiastic sports commentator...",
                "web_rtc_url": "wss://api.openai.com/v1/realtime",
                "voice_quality": "standard",
                "audio_format": "pcm",
                "difficulty": "easy",
                "enable_interruptions": True,
                "response_length": "medium",
                "sports_context": "basketball"
            }
        }


class ErrorResponse(BaseModel):
    """Error response model"""
    error: dict = Field(..., description="Error details")

    class Config:
        json_schema_extra = {
            "example": {
                "error": {
                    "code": 429,
                    "message": "Rate limit exceeded. Please try again later.",
                    "retry_after": 60,
                    "details": {
                        "limit": 10,
                        "remaining": 0,
                        "reset_time": "2024-12-21T10:35:00Z"
                    }
                }
            }
        }
