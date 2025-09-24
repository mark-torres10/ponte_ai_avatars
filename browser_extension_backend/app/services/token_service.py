"""
Token generation service with business logic and error handling
"""

from typing import Dict, Any, Optional
from datetime import datetime
import time
import structlog
from app.models.token import TokenRequest, TokenResponse
from app.models.errors import ErrorCode
from app.services.openai_client import OpenAIClient
from app.services.cache import InMemoryCache
from app.services.voice_config import VoiceConfigService
from app.services.voice_monitoring import VoiceMonitoringService
from app.config.settings import settings

logger = structlog.get_logger(__name__)


class TokenService:
    """Service for generating OpenAI Realtime tokens with advanced voice configuration"""
    
    def __init__(
        self, 
        openai_client: OpenAIClient, 
        cache: InMemoryCache,
        voice_config: VoiceConfigService,
        voice_monitoring: VoiceMonitoringService
    ):
        self.openai_client = openai_client
        self.cache = cache
        self.voice_config = voice_config
        self.voice_monitoring = voice_monitoring
    
    def _prepare_instructions(self, token_request: TokenRequest) -> str:
        """Prepare comprehensive instructions using voice configuration service"""
        # Use voice config service to generate instructions
        instructions = self.voice_config.generate_instructions(
            voice=token_request.voice,
            difficulty=token_request.difficulty,
            sports_context=token_request.sports_context,
            custom_instructions=token_request.instructions
        )
        
        # Add response length modifications
        if token_request.response_length == "short":
            instructions += " Keep responses concise and to the point."
        elif token_request.response_length == "long":
            instructions += " Provide detailed explanations and comprehensive analysis."
        
        # Add interruption handling
        if token_request.enable_interruptions:
            instructions += " Allow users to interrupt you naturally during responses."
        
        return instructions
    
    def _prepare_session_data(self, token_request: TokenRequest) -> Dict[str, Any]:
        """Prepare OpenAI session data with advanced voice configuration"""
        instructions = self._prepare_instructions(token_request)
        
        # Configure audio format based on request
        audio_format = "pcm16"
        if token_request.audio_format.value == "mp3":
            audio_format = "mp3"
        elif token_request.audio_format.value == "wav":
            audio_format = "wav"
        
        # Configure turn detection based on interruption settings
        turn_detection = {
            "type": "server_vad",
            "threshold": 0.5,
            "prefix_padding_ms": 300,
            "silence_duration_ms": 500
        }
        
        if not token_request.enable_interruptions:
            # Make it harder to interrupt
            turn_detection["threshold"] = 0.7
            turn_detection["silence_duration_ms"] = 1000
        
        return {
            "model": token_request.model.value,
            "voice": token_request.voice.value,
            "modalities": ["audio", "text"],
            "instructions": instructions,
            "input_audio_format": audio_format,
            "output_audio_format": audio_format,
            "input_audio_transcription": {
                "model": "whisper-1"
            },
            "turn_detection": turn_detection,
            "tools": [],
            "tool_choice": "auto",
            "temperature": settings.default_temperature,
            "max_response_output_tokens": settings.default_max_tokens,
            "speed": settings.default_speed
        }
    
    def _generate_cache_key(self, token_request: TokenRequest) -> str:
        """Generate cache key for token request with all voice configuration parameters"""
        # Create a deterministic key from all request parameters
        key_data = {
            "model": token_request.model.value,
            "voice": token_request.voice.value,
            "difficulty": token_request.difficulty.value,
            "voice_quality": token_request.voice_quality.value,
            "audio_format": token_request.audio_format.value,
            "enable_interruptions": token_request.enable_interruptions,
            "response_length": token_request.response_length,
            "sports_context": token_request.sports_context,
            "instructions": token_request.instructions or settings.default_instructions
        }
        
        # Sort keys for consistent hashing
        sorted_data = sorted(key_data.items())
        key_string = str(sorted_data)
        return f"token_request:{hash(key_string)}"
    
    async def generate_token(self, token_request: TokenRequest, request_id: str) -> TokenResponse:
        """Generate OpenAI Realtime token with comprehensive error handling, caching, and monitoring"""
        try:
            # Start voice monitoring session
            self.voice_monitoring.start_session(
                request_id=request_id,
                voice_type=token_request.voice.value,
                difficulty=token_request.difficulty.value
            )
            
            # Check cache first
            cache_key = self._generate_cache_key(token_request)
            cached_response = self.cache.get(cache_key)
            if cached_response:
                logger.info("Using cached token response", 
                           request_id=request_id, 
                           cache_key=cache_key)
                
                # End monitoring session for cached response
                self.voice_monitoring.end_session(request_id=request_id)
                
                return TokenResponse(**cached_response)
            
            logger.info("Generating token", 
                       request_id=request_id,
                       model=token_request.model.value,
                       voice=token_request.voice.value,
                       difficulty=token_request.difficulty.value,
                       voice_quality=token_request.voice_quality.value,
                       audio_format=token_request.audio_format.value,
                       sports_context=token_request.sports_context)
            
            # Validate voice configuration
            validation = self.voice_config.validate_voice_configuration(
                voice=token_request.voice,
                difficulty=token_request.difficulty,
                voice_quality=token_request.voice_quality,
                audio_format=token_request.audio_format
            )
            
            if not validation["compatible"]:
                logger.warning("Voice configuration compatibility warning", 
                             request_id=request_id,
                             validation=validation)
            
            # Prepare session data
            session_data = self._prepare_session_data(token_request)
            
            # Create OpenAI session
            session_response = await self.openai_client.create_realtime_session(session_data)
            
            # Validate response - handle new API format
            client_secret = session_response.get("client_secret")
            if isinstance(client_secret, dict):
                client_secret = client_secret.get("value")
            
            if not client_secret:
                logger.error("Invalid OpenAI response - missing client_secret", 
                           request_id=request_id)
                self.voice_monitoring.end_session(request_id=request_id, error="Invalid OpenAI response")
                raise ValueError("Invalid OpenAI API response")
            
            # Handle expires_at format
            expires_at = session_response.get("expires_at")
            if isinstance(expires_at, dict):
                expires_at = expires_at.get("expires_at")
            
            # Create token response with all voice configuration details
            token_response = TokenResponse(
                client_secret=client_secret,
                expires_at=expires_at,
                session_id=session_response["id"],
                model=session_response["model"],
                voice=session_response["voice"],
                instructions=session_response["instructions"],
                web_rtc_url="wss://api.openai.com/v1/realtime",
                voice_quality=token_request.voice_quality.value,
                audio_format=token_request.audio_format.value,
                difficulty=token_request.difficulty.value,
                enable_interruptions=token_request.enable_interruptions,
                response_length=token_request.response_length,
                sports_context=token_request.sports_context
            )
            
            # Cache the response
            self.cache.set(cache_key, token_response.model_dump(), ttl=settings.token_ttl_seconds)
            
            # End monitoring session successfully
            self.voice_monitoring.end_session(request_id=request_id)
            
            logger.info("Token generated successfully", 
                       request_id=request_id,
                       session_id=session_response["id"],
                       expires_at=session_response["expires_at"],
                       cache_key=cache_key,
                       voice_config={
                           "voice": token_request.voice.value,
                           "quality": token_request.voice_quality.value,
                           "format": token_request.audio_format.value,
                           "difficulty": token_request.difficulty.value
                       })
            
            return token_response
            
        except Exception as e:
            logger.error("Token generation failed", 
                       request_id=request_id,
                       error=str(e),
                       error_type=type(e).__name__)
            
            # End monitoring session with error
            self.voice_monitoring.end_session(request_id=request_id, error=str(e))
            raise
    
    async def test_openai_connectivity(self) -> bool:
        """Test OpenAI API connectivity"""
        try:
            return await self.openai_client.test_connectivity()
        except Exception as e:
            logger.error("OpenAI connectivity test failed", error=str(e))
            return False
    
    def get_voice_configuration_info(self) -> Dict[str, Any]:
        """Get comprehensive voice configuration information"""
        return {
            "available_voices": self.voice_config.get_available_voices(),
            "available_difficulties": self.voice_config.get_available_difficulties(),
            "voice_performance_stats": self.voice_monitoring.get_performance_stats(),
            "voice_performance_by_type": self.voice_monitoring.get_voice_performance_by_type(),
            "monitoring_health": self.voice_monitoring.get_health_status()
        }
    
    def get_voice_testing_endpoints(self) -> Dict[str, str]:
        """Get voice testing endpoint information"""
        return {
            "verse_voice_test": "/v1/realtime/token - voice: verse, difficulty: easy",
            "cedar_voice_test": "/v1/realtime/token - voice: cedar, difficulty: savage", 
            "marin_voice_test": "/v1/realtime/token - voice: marin, difficulty: expert",
            "basketball_context": "/v1/realtime/token - sports_context: basketball",
            "football_context": "/v1/realtime/token - sports_context: football",
            "soccer_context": "/v1/realtime/token - sports_context: soccer",
            "performance_monitoring": "/health - includes voice performance metrics"
        }
    
    async def test_voice_quality(self, voice_type: str, test_phrase: str = "Hello, this is Parker testing voice quality") -> Dict[str, Any]:
        """Test voice quality for a specific voice type"""
        try:
            from app.models.token import VoiceType, DifficultyLevel, VoiceQuality, AudioFormat, ModelType
            
            # Create test request
            test_request = TokenRequest(
                model=ModelType.GPT_REALTIME,
                voice=VoiceType(voice_type),
                difficulty=DifficultyLevel.EASY,
                voice_quality=VoiceQuality.STANDARD,
                audio_format=AudioFormat.PCM,
                instructions=f"Say this exact phrase: {test_phrase}",
                response_length="short"
            )
            
            # Generate token for testing
            request_id = f"voice_test_{voice_type}_{int(time.time())}"
            token_response = await self.generate_token(test_request, request_id)
            
            return {
                "voice_type": voice_type,
                "test_phrase": test_phrase,
                "token_generated": True,
                "session_id": token_response.session_id,
                "web_rtc_url": token_response.web_rtc_url,
                "client_secret": token_response.client_secret[:20] + "...",  # Truncated for security
                "voice_config": {
                    "voice": token_response.voice,
                    "quality": token_response.voice_quality,
                    "format": token_response.audio_format,
                    "difficulty": token_response.difficulty
                }
            }
            
        except Exception as e:
            logger.error("Voice quality test failed", voice_type=voice_type, error=str(e))
            return {
                "voice_type": voice_type,
                "test_phrase": test_phrase,
                "token_generated": False,
                "error": str(e)
            }
