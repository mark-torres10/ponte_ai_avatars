"""
Voice configuration and personality management service
"""

import structlog
from typing import Any, Dict, List, Optional
from app.models.token import VoiceType, DifficultyLevel, VoiceQuality, AudioFormat
from app.utils.yaml_loader import yaml_loader

logger = structlog.get_logger(__name__)


class VoiceConfigService:
    """Service for managing voice configuration and personality settings"""
    
    def __init__(self):
        self.voice_personalities = self._load_voice_personalities()
        self.difficulty_instructions = self._load_difficulty_instructions()
        self.sports_contexts = self._load_sports_contexts()
    
    def _load_voice_personalities(self) -> Dict[str, Dict[str, str]]:
        """Load voice personality configurations from YAML"""
        try:
            voices_config = yaml_loader.get_voices()
            # Convert string keys to VoiceType enum values
            return {
                VoiceType.VERSE: voices_config.get('verse', {}),
                VoiceType.CEDAR: voices_config.get('cedar', {}),
                VoiceType.MARIN: voices_config.get('marin', {})
            }
        except Exception as e:
            logger.error("Failed to load voice personalities from YAML, using fallback", error=str(e))
            # Fallback configuration
            return {
                VoiceType.VERSE: {
                    "openai_voice": "verse",
                    "display_name": "Don Jones",
                    "description": "The balanced veteran - warm, conversational, and always approachable",
                    "tone": "approachable and encouraging",
                    "energy": "moderate",
                    "style": "conversational",
                    "personality": "Like your favorite local sports radio host who makes everyone feel welcome"
                },
                VoiceType.CEDAR: {
                    "openai_voice": "cedar",
                    "display_name": "Mike Smith",
                    "description": "The authoritative analyst - deep, professional, and commanding respect",
                    "tone": "confident and knowledgeable",
                    "energy": "calm",
                    "style": "professional",
                    "personality": "Think legendary coach breaking down plays with decades of wisdom"
                },
                VoiceType.MARIN: {
                    "openai_voice": "marin",
                    "display_name": "Rocket Jones",
                    "description": "The high-energy play-by-play - enthusiastic, dynamic, and electrifying",
                    "tone": "exciting and passionate",
                    "energy": "high",
                    "style": "dynamic",
                    "personality": "Pure energy and excitement - like the best play-by-play announcer at peak moments"
                }
            }
    
    def _load_difficulty_instructions(self) -> Dict[str, str]:
        """Load difficulty-based instruction templates from YAML"""
        try:
            difficulty_config = yaml_loader.get_difficulty_levels()
            return {
                DifficultyLevel.EASY: difficulty_config.get('easy', {}).get('instructions', ''),
                DifficultyLevel.SAVAGE: difficulty_config.get('savage', {}).get('instructions', ''),
                DifficultyLevel.EXPERT: difficulty_config.get('expert', {}).get('instructions', '')
            }
        except Exception as e:
            logger.error("Failed to load difficulty instructions from YAML, using fallback", error=str(e))
            # Fallback configuration
            return {
                DifficultyLevel.EASY: (
                    "You are Parker, an encouraging and supportive sports commentator. "
                    "Respond with patience and educational explanations. Use simple language "
                    "and provide helpful context. Be welcoming to newcomers and explain "
                    "sports concepts clearly. Match the user's enthusiasm while being "
                    "inclusive and encouraging."
                ),
                DifficultyLevel.SAVAGE: (
                    "You are Parker, a brutally honest and no-nonsense sports commentator. "
                    "Cut straight to the point - no pleasantries, no fluff, no sugar-coating. "
                    "Challenge everything the user says with sharp, direct responses. "
                    "Use aggressive sports terminology and expect them to keep up. "
                    "Be ruthless in your analysis and don't hold back. "
                    "If they're wrong, tell them exactly why and how badly they messed up."
                ),
                DifficultyLevel.EXPERT: (
                    "You are Parker, a technical and analytical sports commentator. "
                    "Respond with detailed analysis and deep sports knowledge. Use "
                    "advanced terminology and provide comprehensive insights. Be "
                    "methodical and data-driven while maintaining engagement. "
                    "Expect expert-level understanding and provide nuanced analysis."
                )
            }
    
    def _load_sports_contexts(self) -> Dict[str, Dict[str, Any]]:
        """Load sports-specific context configurations from YAML"""
        try:
            return yaml_loader.get_sports_contexts()
        except Exception as e:
            logger.error("Failed to load sports contexts from YAML, using fallback", error=str(e))
            # Fallback configuration
            return {
                "basketball": {
                    "terminology": ["dribble", "shooting percentage", "rebound", "assist", "steal", "block"],
                    "personality": "fast-paced and energetic",
                    "focus": "offensive and defensive strategies"
                },
                "football": {
                    "terminology": ["touchdown", "interception", "sack", "field goal", "punt", "fumble"],
                    "personality": "strategic and analytical",
                    "focus": "play calling and execution"
                },
                "soccer": {
                    "terminology": ["goal", "assist", "tackle", "corner kick", "penalty", "offside"],
                    "personality": "passionate and tactical",
                    "focus": "team coordination and individual skill"
                },
                "baseball": {
                    "terminology": ["home run", "strikeout", "walk", "steal", "double play", "sacrifice"],
                    "personality": "methodical and statistical",
                    "focus": "pitching and batting strategies"
                },
                "hockey": {
                    "terminology": ["goal", "assist", "power play", "penalty kill", "faceoff", "check"],
                    "personality": "intense and fast-paced",
                    "focus": "speed and physical play"
                }
            }
    
    def generate_instructions(
        self,
        voice: VoiceType,
        difficulty: DifficultyLevel,
        sports_context: Optional[str] = None,
        custom_instructions: Optional[str] = None
    ) -> str:
        """Generate comprehensive instructions based on voice, difficulty, and context"""
        
        # Start with base difficulty instructions
        base_instructions = self.difficulty_instructions.get(difficulty, self.difficulty_instructions[DifficultyLevel.EASY])
        
        # Get voice personality
        voice_personality = self.voice_personalities.get(voice, self.voice_personalities[VoiceType.VERSE])
        
        # Add voice-specific modifications
        voice_modification = f" Your voice has a {voice_personality['tone']} tone with {voice_personality['energy']} energy. "
        
        # Add sports context if specified
        sports_modification = ""
        if sports_context and sports_context.lower() in self.sports_contexts:
            context = self.sports_contexts[sports_context.lower()]
            sports_modification = (
                f" Focus on {sports_context} with {context['personality']} commentary. "
                f"Emphasize {context['focus']} and use appropriate terminology like "
                f"{', '.join(context['terminology'][:3])} and more."
            )
        
        # Combine all instructions
        full_instructions = base_instructions + voice_modification + sports_modification
        
        # Add custom instructions if provided
        if custom_instructions:
            full_instructions += f" Additional context: {custom_instructions}"
        
        logger.info(
            "Generated voice instructions",
            voice=voice,
            difficulty=difficulty,
            sports_context=sports_context,
            instruction_length=len(full_instructions)
        )
        
        return full_instructions
    
    def get_voice_configuration(self, voice: VoiceType) -> Dict[str, str]:
        """Get voice configuration details"""
        return self.voice_personalities.get(voice, self.voice_personalities[VoiceType.VERSE])
    
    def get_available_voices(self) -> List[Dict[str, str]]:
        """Get list of available voices with descriptions"""
        return [
            {
                "voice": voice,
                "name": config["name"],
                "description": config["description"],
                "personality": config["personality"],
                "tone": config["tone"],
                "energy": config["energy"],
                "style": config["style"]
            }
            for voice, config in self.voice_personalities.items()
        ]
    
    def get_available_difficulties(self) -> List[Dict[str, str]]:
        """Get list of available difficulty levels with descriptions"""
        return [
            {
                "difficulty": difficulty,
                "description": self._get_difficulty_description(difficulty)
            }
            for difficulty in DifficultyLevel
        ]
    
    def _get_difficulty_description(self, difficulty: DifficultyLevel) -> str:
        """Get description for difficulty level"""
        descriptions = {
            DifficultyLevel.EASY: "Encouraging, supportive, educational approach",
            DifficultyLevel.SAVAGE: "Competitive, intense, challenging approach",
            DifficultyLevel.EXPERT: "Technical, analytical, detailed approach"
        }
        return descriptions.get(difficulty, "Standard approach")
    
    def validate_voice_configuration(
        self,
        voice: VoiceType,
        difficulty: DifficultyLevel,
        voice_quality: VoiceQuality,
        audio_format: AudioFormat
    ) -> Dict[str, bool]:
        """Validate voice configuration compatibility"""
        validation_results = {
            "voice_valid": voice in VoiceType,
            "difficulty_valid": difficulty in DifficultyLevel,
            "quality_valid": voice_quality in VoiceQuality,
            "format_valid": audio_format in AudioFormat,
            "compatible": True
        }
        
        # Add compatibility checks
        if voice_quality == VoiceQuality.ULTRA and audio_format == AudioFormat.MP3:
            validation_results["compatible"] = False
            validation_results["warning"] = "Ultra quality with MP3 compression may reduce quality"
        
        return validation_results
